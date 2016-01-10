const Backbone = require('backbone');

var myRouter = Backbone.Router.extend({

    routes: {
        'about': 'showAbout',
        'menu': 'showMenu',
        'search': 'search',
        'me': 'showProfile',
        'me/meetings': 'showMyMeetings',
        'meeting/create':      'createMeeting', // Create
        'meeting/:mid':          'showMeeting', // Read
        'meeting/:mid/edit':     'editMeeting', // Update
        'meeting/:mid/delete': 'deleteMeeting', // Delete
        'meeting/:mid/rsvp':   'rsvpToMeeting'
    },

    initialize: function (options) {
        this.viewManager = options.viewManager;
    },

    // showProfile: function () {
    //     var profileView = new ProfileView();
    //     this.viewManager.showView(profileView);
    // },

    // showMyMeetings: function () {
    //     var myMeetingsView = new UserMeetingsView();
    //     this.viewManager.showView(myMeetingsView);
    // },

    // showAbout: function () {
    //     var aboutView = new AboutView();
    //     this.viewManager.showView(aboutView);
    // },

    // showMenu: function () {
    //     var menuView = new MenuView();
    //     this.viewManager.showView(menuView);
    // },

    // search: function () {
    //     var searchView = new SearchView();
    //     this.viewManager.showView(searchView);
    // },

    // createMeeting: function () {
    //     var createMeetingView = new CreateMeetingView();
    //     this.viewManager.showView(createMeetingView);
    // },

    showMeeting: function (mid) {
        // var meetingView = new MeetingView();
        // this.viewManager.showView(meetingView);
        console.log('showing meeting', mid);
    },

    // rsvpToMeeting: function (mid) {
    //     var rsvpView = new RSVPView();
    //     this.viewManager.showView(rsvpView);
    // },

    // editMeeting: function (mid) {
    //     console.log('at update meeting', mid);
    // },

    // deleteMeeting: function (mid) {
    //     console.log('at delete meeting', mid);
    // }
});

export default myRouter;
