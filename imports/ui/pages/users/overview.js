//import { Links } from '/imports/api/users/users.js';
import { Meteor } from 'meteor/meteor';

import './overview.html';

Template.Users_overview.onCreated(function () {
  Meteor.subscribe('users.all');
});

Template.Users_overview.helpers({
  users() {
    return Meteor.users.find();
  },
});

