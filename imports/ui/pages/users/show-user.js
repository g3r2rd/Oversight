import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './show-user.html';

Template.Users_showUser.onCreated(function usersShowUserOnCreated() {
  this.subscribe('users.all', { username: FlowRouter.getParam('username') });
});

Template.Users_showUser.helpers({
  user() {
    return Meteor.users.find();
  },
});
