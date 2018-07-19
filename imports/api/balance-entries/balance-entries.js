import SimpleSchema from 'simpl-schema';

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Tracker } from 'meteor/tracker';

import { Expenses } from '/imports/api/expenses/expenses.js';


SimpleSchema.debug = true;

export const BalanceEntries = new Mongo.Collection('balanceentries');

SimpleSchema.extendOptions(['autoform']);

// Methods will be used to update the balance entries.
BalanceEntries.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

BalanceEntries.Schema = new SimpleSchema({
  expenseId: {
    type: String,
  },
  userId: {
    type: String,
  },
  modification: {
    type: Number,
  },
  date: {
    type: Date,
  },
  description: {
    type: String,
  },
}, { tracker: Tracker });

BalanceEntries.attachSchema(BalanceEntries.Schema);

// HERE WE SHOULD DEFINE SOMETHING TO COMPUTE THE BALANCES
BalanceEntries.helpers({
  expense() {
    return Expenses.findOne(this.expenseId);
  },
  balance(Users) {
    balance = [];
    Users.forEach(User => {
      entries = BalanceEntries.find({ userId: User._id }, { fields: { modification: 1 } });
      log(entries);
    });
  }
});
