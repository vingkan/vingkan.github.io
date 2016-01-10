//BROWERSIFY IMPORTS
const _ = require('underscore');
const Backbone = require('backbone');
const $ = require('jquery');
//LOCAL IMPORTS
// import {Database} from '../database';
// import {Front} from '../frontend';

export const User = Backbone.Model.extend({
    urlRoot: '/api/users',
    idAttribute: 'id',
  
    defaults: {
        id: '',
        providerType: '',
        providerId: '',
        name: '',
        picture: '',
        timeslots: []
    },
  
    initialize: function () {
        return this;
    },
  
    getAttributes: function () {
        return _.clone(this.attributes);
    },

    getMeetings: function () {
        if (!this.get('id')) return Promise.resolve([]);
        return new Promise((resolve, reject) => {
            $.getJSON(this.url() + '/meetings')
                .done(function (meetings) {
                    resolve(meetings);
                })
                .fail(function (err) {
                    reject(err);
                });
        });
    },

    getTimeslotsByMeetingId: function (mid) {
        // if (!this.get('timeslots').length) return Promise.resolve([]);
        return new Promise((resolve, reject) => {
            $.getJSON(this.url() + '/timeslots?mid=' + mid)
                .done(function (timeslots) {
                    resolve(timeslots);
                })
                .fail(function (err) {
                    reject(err);
                });
        });
    },

    addTimeslots: function (timeslots) {
        return new Promise((resolve, reject) => {
            $.post(this.url() + '/timeslots', timeslots)
                .done(function () {
                    resolve();
                })
                .fail(function (err) {
                    reject(err);
                });
        });
    }
  
});
