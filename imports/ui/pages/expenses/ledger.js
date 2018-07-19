import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './ledger.html';

import { Expenses } from '/imports/api/expenses/expenses.js';
import { BalanceEntries } from '/imports/api/balance-entries/balance-entries.js';

Template.Expenses_ledger.onCreated(function () {
  Meteor.subscribe('users.all');
  Meteor.subscribe('expenses.all');
  Meteor.subscribe('balanceentries.all')

  //console.log(Meteor.users.find({}, { fields: { _id: 1 } }).fetch());
  //console.log(BalanceEntries.balance())
});

Template.Expenses_ledger.helpers({
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
  balanceEntries() {
    return BalanceEntries.find({ userId: Meteor.userId() }, { sort: { date: -1 } });
  }
});