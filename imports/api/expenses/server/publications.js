import { Meteor } from 'meteor/meteor';
import { Expenses } from '../expenses.js';

Meteor.publish('expenses.all', function () {
  return Expenses.find();
});
