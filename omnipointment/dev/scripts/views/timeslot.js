//BROWERSIFY IMPORTS
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var _ = require('underscore');

export var TimeSlotView = Backbone.View.extend({
	template: function(attributes){
		var html = this.renderSlot(attributes);
		var templateFunction = _.template(html);
		return templateFunction(attributes);
	},
	events: {
		'click': 'toggleFree'
	},
	initialize: function(){
		this.listenTo(this.model, "change", this.render);
		this.render();
	},
	render: function(){
		this.$el.html(this.template(_.extend(this.model.getAttributes())));
		return this;
	},
	renderSlot: function(attributes){
		var html = '';
			var classList = "toggle-time-slot" + (attributes.free === 2 ? " free-slot" : " busy-slot");
			html += `<button id="toggle-${attributes.time}" class="${classList}">`;
			html += `${attributes.free === 2 ? "&#10004;" : "X"}`;
			html += `</button>`;
		return html;
	},
	toggleFree: function(){
		this.model.set({
			free: this.model.get('free') === 2 ? 0 : 2
		});
		this.model.saveResponse();
	},
	forceToggleFree: function(forceFree){
		this.model.set({
			free: forceFree
		});
		this.model.saveResponse();
	}
});