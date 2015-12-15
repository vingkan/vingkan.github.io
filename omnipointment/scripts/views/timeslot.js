/*
	TIME SLOT MODEL
*/
var TimeSlotModel = Backbone.Model.extend({
	
	defaults: function () {
		return {
			uid: USER_ID,
      mid: 'no-meeting',
			time: 0,
	  	duration: 15,
	  	free: 0,
	  	isPriority: false,
		};
	},

	initialize: function () {
		//console.log('created timeslotmodel');
	},
  
	getTimeText: function(){
    	return moment(this.get('time')).format('dd h:mm A') + ' (' + this.get('duration') + ')';
    },
  
  	getAllAttributes: function () {
        return _.extend(this.attributes, {
            timeText: this.getTimeText()
        });
    },

    getDataObject: function(){
        return TimeSlot({
          mid: this.attributes.mid,
          time: this.attributes.time,
          duration: this.attributes.duration,
          free: this.attributes.free
        });
    }
  
});

/*
	TIME SLOT VIEW
*/
var TimeSlotView = Backbone.View.extend({
  	template: function (attributes) {
      	var freeClass = attributes.free === 2 ? 'is-free'
      		: (attributes.free === 1 ? 'maybe-free' : 'not-free');
      	var priorityClass = attributes.isPriority ? 'priority' : '';
      	var popupClass = attributes.popup ? 'visible' : 'invisible';
      	var templateFn = _.template(`
          <div class="timeslot">
              <!--<div class="slot ${freeClass} ${priorityClass}"><%= timeText %></div>-->
              <div class="slot ${freeClass} ${priorityClass}">--</div>
              <div class="popup ${popupClass}">
				<div class="pointer"></div>
				<button class="available">Free</button>
				<button class="partial">Maybe</button>
				<button class="unavailable">Busy</button>
              </div>
          </div>
		`);
      	return templateFn(attributes);
    },
  
    initialize: function () {
    	//console.log('created timeslotview');
      	this.listenTo(this.model, "change", this.render);
    },
  	
  	events: {
      'click .slot': 'handleClick',
      'click .popup': 'setFree',
      /*'mouseover .slot': 'handleHover'
      'dragstart .slot': 'handleClick',
      'dragend .slot': 'handleClick'*/
    },
  
  	render: function () {
      	this.$el.html(this.template(_.extend(this.model.getAllAttributes(), { popup: this._popupVisible })));
   		return this;
    },

    setFree: function (e) {
    	if (e.target.className === 'available') {
    		this.model.set('free', 2);
    	} else if (e.target.className === 'partial') {
    		this.model.set('free', 1);
    	} else if (e.target.className === 'unavailable') {
    		this.model.set('free', 0);
    	} // don't handle any other case
    	this.togglePopup();
    },
  
    handleClick: function(){
        this.toggle();
        handleDrag(this);
    },

    handleHover: function(){
        handlePreviewDrag(this);
    },

  	toggle: function () {
      	if (this.model.get('isPriority')) {
        	this.togglePopup();
        } else {
         	this.toggleFree();
        }
        updateAvailability();
    },

    forceToggle: function(value){
      /*
       * Add handling later:
       * handling should set free = 2 if the passed value is 1
       * this accounts for dragging over different types of slots
      */
      this.model.set({ free: value });
    },

    previewToggle: function(value){
        console.log(this);
    },
  
  	toggleFree: function () {
      	this.model.set({ free: (this.model.get('free') === 0 ? 2 : 0) });
    },
  
  	togglePopup: function () {
  		this._popupVisible = !(this.$el.find('.popup.visible').length > 0);
  		this._closeAllVisibles();      	
      	this.render();
    },

    _popupVisible: false,

    _closeAllVisibles: function () {
		var visibles = document.getElementsByClassName('visible');
		var size = visibles.length;
		for(var v = 0; v < size; v++){
			visibles[v].classList.add('invisible');
			visibles[v].classList.remove('visible');
		}
	}
});

/*var myTimeSlot = new TimeSlotModel({
    time: 1448215200000,
	duration: 15
});

var myTimeSlotView = new TimeSlotView({
  	model: myTimeSlot,
  	el: document.getElementById('backbone-demo')
});

myTimeSlotView.render();*/

console.log("LOADED views/timeslot.js");