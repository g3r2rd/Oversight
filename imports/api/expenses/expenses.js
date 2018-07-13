import SimpleSchema from 'simpl-schema';

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Tracker } from 'meteor/tracker';

SimpleSchema.debug = true;

export const Expenses = new Mongo.Collection('expenses');
export const expenseTypes = ['house', 'meal', 'other', 'balance'];

SimpleSchema.extendOptions(['autoform']);

Expenses.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  }
});

Expenses.Schema = new SimpleSchema({
  price: {
    type: Number,
    label: 'Price',
    min: 0,
  },
  date: {
    type: Date,
    label: 'Date',
    defaultValue: new Date(),
  },
  description: {
    type: String,
    label: 'Description',
    max: 200,
  }, 
  type: {
    type: String,
    label: 'Type',
    allowedValues: expenseTypes,
  }, 
  priceDistribution: {
    type: Array,
    label: 'Price distribution',
    minCount: 2,
  },
  'priceDistribution.$': {
    type: Object,
    label: null,
  },
  'priceDistribution.$.userId': {
    type: String,
    label: 'User',
    autoform: {
      options: function () {
        var list = [];
        Meteor.users.find().forEach(function (user) {
          list.push({
            label: user.username, value: user._id
          })
        });
        return list;
      },
    },
  },
  'priceDistribution.$.amount': {
    type: Number,
  },
  pricePerPerson: {
    type: Number,
    autoValue: function() {
      var priceDistribution = this.field('priceDistribution');
      var price = this.field('price');

      if(priceDistribution.isSet && price.isSet) {
        // Collect the number of participants.
        var numberOfPeople = 0;
        priceDistribution.value.forEach(entry => {
          numberOfPeople += entry.amount;
        });

        // Round the values to two digits. 
        return Math.round((price.value / numberOfPeople) * 100) / 100;
      } else {
        this.unset();
      }
    },
    autoform: {
			type: 'hidden',
		},
  },
  createdAt: {
		type: Date,
		label: 'Created at',
		autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
		},
		autoform: {
			type: 'hidden',
		},
	},
  ownerId: {
		type: String,
		label: 'Owner id',
		autoValue: function () {
			return this.userId;
		},
		autoform: {
			type: 'hidden',
		},
	},
}, { tracker: Tracker });

Expenses.attachSchema(Expenses.Schema);
