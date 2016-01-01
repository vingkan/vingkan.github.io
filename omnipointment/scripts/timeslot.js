var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var _ = require('underscore');

export var TimeSlotModel = Backbone.Model.extend({
	defaults: {
		time: 0,
		duration: 15,

	},
	initialize: function(){

	},
	getAttributes: function(){
		return _.extend(this.attributes);
	}
});

export var TimeSlotView = Backbone.View.extend({
	template: function(attributes){
		var templateFunction = _.template(
			`<div>Hello ${attributes.duration}</div>`
		);
		return templateFunction(attributes);
	},
	initialize: function(){
		this.listenTo(this.model, "change", this.render);
		this.render();
	},
	render: function(){
		this.$el.html(this.template(_.extend(this.model.getAttributes())));
		return this;
	}
});