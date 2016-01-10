import {Meeting} from './meeting';
import {Database} from '../database';
import {Front} from '../frontend';

export var RSVPModel = Meeting.extend({
    defaults: {
        responder: '', //user id of user RSVPing
        slots: [] //timeslots the user has RSVPed with
    },
    initialize: function () {
        var userID = Front.getUID();
        var model = this;
        var timeslotsPromise = me.getTimeslotsByMeetingId(this.get('mid'));
        timeslotsPromise.then(function(data){
            var slots = []
            if(data && Array.isArray(data)){
                slots = data;
            }
            model.set('slots', slots);
            model.set('responder', userID);
        });
    },
    saveResponses: function(){
        // Database.postUserResponses(
        //     this.get("responder"),
        //     this.get("mid"),
        //     this.get("slots")
        // );
    }
});
