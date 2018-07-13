import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Expenses } from './expenses.js';

/*Meteor.methods({
  'expenses.add'(price, date, description, type, priceDistribution) {
    check(text, String);
 
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    Expenses.insert({
      price,
      date,
      description,
      type,
      priceDistribution,
      createdAt: new Date(),
      owner: Meteor.userId(),
    });
  },
});*/