//BROWERSIFY IMPORTS
const _ = require('underscore');
const Backbone = require('backbone');
const $ = require('jquery');
//LOCAL IMPORTS
import {Database} from '../database';
import {Front} from '../frontend';

export const Meeting = Backbone.Model.extend({
    urlRoot: '/api/meetings',
    idAttribute: 'mid',
  
    defaults: {
        mid: '',
        creator: '', // user
        name: '',
        message: 'The organizer has not left a message for this meeting.',
        users: [], // users
        timeOptions: [], // TimeOptions
        responders: [] // Responders (users and their timeslots)
    },
  
    initialize: function () {
        var model = this;
        var promise = this.getResponders(true);
            promise.then(function(responders){
                model.set('responders', responders);
            });
    },
  
    getAttributes: function () {
        return _.extend(_.clone(this.attributes), { dates: this.getDateList() });
    },

    addUser: function (user) {
        this.get('users').push(user);
        this.save();
    },
  
    getResponders: function (init) {
        if(!init){
            console.error("ASYNC getResponders() call.");
        }
        // var mid = this.get('mid');
        // var users = this.get('users')
        // var promise = null;
        // //if(mid.length > 0 && users.length > 0){
        //     promise = Database.getMeetingTimeSlots(mid, users);    
        // //}
        // return promise;
        if (!this.get('mid')) return Promise.resolve([]);
        return new Promise((resolve, reject) => {
            $.getJSON(this.url() + '/responders')
                .done(function (responders) {
                    resolve(responders);
                })
                .fail(function (err) {
                    reject(err);
                });
        });
    },
  
    getDateList: function () {
        var allDates = [];
        this.get('timeOptions').forEach(option => {
            allDates.push.apply(allDates, option.dates);
        });
        var dateList = allDates.filter((value, index, self) => self.indexOf(value) === index);
        dateList.sort();
        return dateList;
    },

    saveMeeting: function(quiet = false){
        if(this.get('timeOptions').length > 0 && this.getDateList().length > 0){
            this.save({
                success: function(model, response){
                    if(!quiet){
                        Front.displayUserError(response.responseText);
                    }
                },
                error: function (model, response) {
                    Front.displayUserError(response.responseText);
                }
            });
        }
        else{
            Front.displayUserError("Your meeting cannot be saved without any date or time options.");
        }
    }
});
