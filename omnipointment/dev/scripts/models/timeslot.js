var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var _ = require('underscore');

import {Database} from '../database';
import {User} from './user';

export var TimeSlotModel = Backbone.Model.extend({
    defaults: {
        time: 0,
        duration: 15,
        uid: '',
        mid: '',
        free: 0,
        meeting: null
    },
    initialize: function(){

    },
    getAttributes: function(){
        return _.extend(this.attributes);
    },
    saveResponse: function(){
        var slotUID = this.get('uid');
        var meetingModel = this.get('meeting');
        var timeSlotData = _.clone(this.attributes);
            timeSlotData.meeting = null;
        // var promise = Database.postTimeSlot(
        //     this.get('uid'),
        //     this.get('mid'),
        //     timeSlotData
        // );
        return new User({ id: slotUID }).addTimeslots(timeSlotData);
    }
});
