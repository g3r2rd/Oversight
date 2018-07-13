import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './overview.html';

import { Expenses } from '/imports/api/expenses/expenses.js';

Template.Expenses_overview.onCreated(function () {
  Meteor.subscribe('users.onlyNames');
  Meteor.subscribe('expenses.all');
});

Template.Expenses_overview.helpers({
  'formatDate'(date) {
    return moment(date).format('dd DD MMM');
  },
  'formatPrice'(price) {
    return numeral(price).format('$0.00');
  },
  'correspondingValue'(userId, distribution) {
    amount = '';

    distribution.forEach(entry => {
      if(entry.userId === userId) {
        amount = entry.amount;
      }
    });
    return amount;
  },
  'isSelf'(userId) {
    if(userId === Meteor.userId()) {
      return 'table-active';
    }
    return '';
  },
  'isOwner'(userId, ownerId) {
    if(userId === ownerId) {
      return 'table-primary';
    }
    return '';
  },
  expenses() {
    return Expenses.find();
  },
  users() {
    return Meteor.users.find({}, { sort: { username: 1 } });
  },
});
