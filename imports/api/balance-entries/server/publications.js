import { Meteor } from 'meteor/meteor';
import { BalanceEntries } from '../balance-entries.js';

Meteor.publish('balanceentries.all', function () {
  return BalanceEntries.find();
});
