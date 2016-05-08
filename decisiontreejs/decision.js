function Node(type, value, contents, children){
	return {
		type: type, //string
		value: value, //string
		contents: contents || [], //list of nodes
		children: children || [] //list of nodes
	}
}

function DecisionTree(config){
	return {
		title: config.title || "Decision Tree",
		outcomeKey: config.outcomeKey, 
		emptySet: config.emptySet,
		root: null,

		train: function(dataSet){
			this.root = Node('root', {}, dataSet);
			this.root = this.trainNode(this.root);
		},

		trainNode: function(node){
			var split = Entropy.chooseSplitPoint(node.contents, this.outcomeKey, this.emptySet);
			if(split.attr !== 'NONE_DEFAULT'){
				node.value.result = split.attr;
			}
			var branches = this.splitBranches(node.contents, split);
			node.contents = branches;
			var children = this.getChildren(branches, split);
			for(var n in children){
				if(children[n] && children[n].type === 'split'){
					var decisionNode = this.trainNode(children[n]);
					node.children.push(decisionNode);
				}
				else if(children[n]){
					node.children.push(children[n]);
				}
			}
			return node;
		},

		splitBranches: function(nodeDataSet, split){
			var branches = {};
			for(var d in nodeDataSet){
				if(nodeDataSet[d]){
					var item = nodeDataSet[d];
					var branchKey = item[split.attr];
					if(branches[branchKey]){
						branches[branchKey].push(item);
					}
					else{
						branches[branchKey] = [item];
					}
				}
			}
			return branches;
		},

		getChildren: function(branches, split){
			var children = [];
			if(split.attr !== 'NONE_DEFAULT'){
				for(var b in branches){
					if(branches[b]){
						var newNode = null;
						var branch = branches[b];
						var smolMatrix = Entropy.getMatrixFromDataSet(branch, this.outcomeKey, this.emptySet);
						try{
							var infoMatrix = smolMatrix[split.attr][b]
						}
						catch(e){
							console.warn(e);
							console.log(smolMatrix)
						}
						var entropy = Entropy.entropyOneAttr(infoMatrix);
						var result = resultFromFrequency(infoMatrix, this.outcomeKey);
						var value = {
							result: result.name,
							attr: split.attr,
							branch: b,
							confidence: result.confidence
						}
						var type = 'split'
						if(entropy > 0){
							var hasSplit = Entropy.chooseSplitPoint(branch, this.outcomeKey, this.emptySet);
							if(hasSplit.attr === 'NONE_DEFAULT'){
								type = 'terminal'
							}
						}
						else{
							type = 'terminal'
						}
						newNode = Node(type, value, branch);
						children.push(newNode);
					}
				}
			}
			return children;
		},

		traverseRules: function(){

			function traverseNode(node, ruleStub){
				var rules = [];
				var rulePath = '';
				var rule = ruleStub || '';
				var nodeRuleContent = '';
				if(node.value.attr && node.value.branch){
					nodeRuleContent = node.value.attr + ': ' + node.value.branch;
				}
				if(rule.length > 0){
					rulePath = rule + ' &rarr; ' + nodeRuleContent;	
				}
				else{
					rulePath = nodeRuleContent;
				}
				if(node.children.length > 0){
					for(var n in node.children){
						if(node.children[n]){
							var childRules = traverseNode(node.children[n], rulePath);
							rules.push.apply(rules, childRules);
						}
					}
				}
				else{
					rulePath += ' &rarr; ' + node.value.result;
					rules.push({
						rule: rulePath,
						size: node.contents.length,
						confidence: node.value.confidence
					});
				}
				return rules;
			}

			var rules = traverseNode(this.root, '');
			return rules;

		},

		renderTooltip: function(node){
			return node + '';
		},

		renderNode: function(node){
			var results = '';
			var nList = node.children;
			for(var n = 0; n < nList.length; n++){
				var resultName = nList[n].type.charAt(0).toUpperCase();
				var tooltip = this.renderTooltip(nList[n]);
				if(nList[n].children.length > 0){
					var output = this.renderNode(nList[n]);
					results += '<td class="node-terminal"><div class="branch">|</div><div class="node-split">' + nList[n].value.branch + '</div>' + output + '</td>';	
				}
				else{
					var notes = null;
					var num = nList[n].contents.length;
					var confidence = nList[n].value.confidence.toFixed(4);
					if(num > 0){
						notes = nList[n].value.result + ' (' + num + ')';
					}
					else{
						notes = '...';
					}
					results += '<td class="node-terminal"><div class="branch">|</div><div class="node-split">' + nList[n].value.branch + '</div><div class="node-leaf" style="opacity: ' + confidence + '">' + notes + '</div><div class="node-tooltip">' + tooltip + '</div></td>';
				}
			}
			var html = '<table>';
			html += '<tr><td colspan="' + nList.length + '" class="node-value">' + node.value.result + '</td></tr>';
			html += '<tr>' + results + '</tr>';
			html += '</table>';
			return html;
		},

		render: function(targetID){
			var target = document.getElementById(targetID);
			var html = ''
				html += '<h1>' + this.title + '</h1>';
				html += this.renderNode(this.root);
				html += '<h2>Decision Rules</h2>';
				html += '<ul>';
				var rules = this.traverseRules();
				rules = rules.sort(function(a, b){
					var aConf = a.confidence * a.size;
					var bConf = b.confidence * b.size;
					return bConf - aConf;
				});
				for(var r in rules){
					if(rules[r]){
						content = rules[r].rule;
						stats = ' (n: ' + rules[r].size + ', p: ' + (1.0 - rules[r].confidence).toFixed(4) + ')';
						if(rules[r].confidence < 0.95){
							content += stats;
						}
						else{
							content += '<span class="confident">' + stats + '</span>';
						}
						html += '<li style="opacity: ' + rules[r].confidence + '">' + content + '</li>';
					}
				}
				html += '</ul>'
			if(target){
				target.innerHTML = html;
			}
			else{
				var div = document.createElement('div');
				div.innerHTML = html;
				document.body.appendChild(div);
			}
		}

	}

}

function resultFromFrequency(freq, outcomeKey){
	var max = {
		name: 'NONE_DEFAULT',
		value: 0
	}
	for(var i in freq){
		if(freq[i] && i !== outcomeKey){
			if(freq[i] > max.value){
				max.name = i;
				max.value = freq[i];
			}
		}
	}
	max.confidence = Entropy.getFrequency(freq, max.name);
	return max;
}