window.Breakout = React.createClass({
	mixins: [ReactFireMixin],
	getInitialState: function(){
		return {
			id: this.props.data.id || '',
			name: this.props.data.name || 'Breakout Session',
			type: this.props.data.type || 'learning',
			facilitator: this.props.data.facilitator || 'Facilitator',
			description: this.props.data.description || 'Come join us!',
			responders: this.props.data.responders.length || 0,
			chosen: false
		}
	},
	componentWillMount: function(){
		var fb_url = 'http://firedates.firebaseio.com/chihacknight/breakouts/' + this.state.id;
		this.firebaseRef =  new Firebase(fb_url);
		var _this = this;
		this.firebaseRef.on('value', function(snapshot){
			var data = snapshot.val();
			var counter = 0;
			var chosen = false;
			try{
				for(var i in data.responders){
					if(i === window.userKey){
						chosen = true;
					}
					counter++;
				}
			}
			catch(e){

			}
			_this.setState({
				name: data.name,
				type: data.type,
				facilitator: data.facilitator,
				description: data.description,
				responders: counter,
				chosen: chosen
			});
		}).bind(this);
	},
	componentDidMount: function(){
		
	},
	componentWillUnmount: function(){
		this.firebaseRef.off();
	},
	toggleResponse: function(){
		this.state.chosen ? this.state.chosen = false : this.state.chosen = true;
		window.selectBreakout(this.state.id);
	},
	render: function(){
		return (
			<div className={this.state.chosen ? 'breakout chosen' : 'breakout'} onClick={this.toggleResponse}>
				<h2>{this.state.name}</h2>
				<p>{this.state.responders} {this.state.responders === 1 ? 'person is' : 'people are'} going</p>
				<ul>
					<li><b>Type:</b> {this.state.type}</li>
					<li><b>Facilitator:</b> {this.state.facilitator}</li>
					<li><b>Description:</b> {this.state.description}</li>
				</ul>
			</div>
		);
	}
});

window.BreakoutsContainer = React.createClass({
	mixins: [ReactFireMixin],
	getInitialState: function(){
		return {
			breakouts: []
		}
	},
	componentWillMount: function(){
		var fb_url = 'http://firedates.firebaseio.com/chihacknight/breakouts/';
		this.firebaseRef =  new Firebase(fb_url);
		var _this = this;
		this.firebaseRef.on('value', function(snapshot){
			var data = snapshot.val();
			var breakoutsList = [];
			for(var i in data){
				var breakout = data[i];
				breakout.id = i;
				if(!breakout.responders){
					breakout.responders = [];
				}
				breakoutsList.push(breakout);
			}
			_this.setState({
				breakouts: breakoutsList
			});
		}).bind(this);
	},
	componentDidMount: function(){
		
	},
	componentWillUnmount: function(){
		this.firebaseRef.off();
	},
	render: function(){
		var breakoutNodes = this.state.breakouts.map(function(breakout, index){
			return (
				<Breakout
					data={breakout}
					key={index}>
				</Breakout>
			);
		});
		return (
			<div className="breakouts-container">
				{breakoutNodes}
			</div>
		);
	}
});

window.renderFeatureModule = function(){
	ReactDOM.render(
		<BreakoutsContainer />,
		document.getElementById('breakouts-container-target')
	);
}

renderFeatureModule();