function Question(data) {
	this.id = data['id'];
	this.question = data['question'];
	this.answers = data['answers'];

}

Question.prototype.get = function(attribute) {
	return this[attribute];
}

Question.prototype.check_answer = function(submission) {
	var correct = this.get('answers')[0];
  return (submission.toLowerCase().replace(' ','') === correct.toLowerCase().replace(' ',''));
}

Question.prototype.toHTML = function(attribute) {
  var len = this.answers.length;
  var order = Array.apply(null, Array(len)).map(function (_, i) {return i;});
  order = shuffleArray(order);
  var html = "<div><ul>";
  for (var i = 0; i < len; i++){
    var ans = this.get('answers')[order[i]];
    var append = "<li id=\"answer_" + i + "\">";
    append += ans;
    append += "</li>";
    html += append;
  }
  html += "</ul></div>"
	return html;
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

var testQuestion = new Question({'id':'420691337','question':'Where is it 5 Oclock?','answers':['Somewhere','Here','Everywhere','Nowhere','node.js']});

console.log("Question.js Loaded");
