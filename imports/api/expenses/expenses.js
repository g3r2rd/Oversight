import SimpleSchema from 'simpl-schema';

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Tracker } from 'meteor/tracker';

SimpleSchema.debug = true;

export const Expenses = new Mongo.Collection('expenses');
export const expenseTypes = [
  {label: 'House', value: 'house'},
  {label: 'Meal', value: 'meal'},
  {label: 'Other', value: 'other'},
  {label: 'Balance', value: 'balance'}
];

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
    /*autoform: {
      afFieldInput: {
        type: "currency",
      },
    }*/
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
    allowedValues: expenseTypes.map(a => a.value),
  }, 
  priceDistribution: {
    type: Array,
    label: 'Price distribution',
    minCount: 2,
    /*defaultValue: function () {

      Users = Meteor.users.find({}, { fields: { _id: 1 }, sort: { username: 1 } }).fetch();
      
      console.log(Users);
      Users.forEach(user => {
        
      });
      return [{userId: 'aaaa', amount: 0}, {userId: 'aaab', amount: 0}];
    },*/
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
  pricePerPerson: { // THIS VALUE IS ONLY USED FOR THE UI
    type: Number,
    optional: true,
    autoValue: function() {
      var priceDistribution = this.field('priceDistribution');
      var price             = this.field('price');

      // Only update the price per person if the price or the distribution has changed
      if (priceDistribution.isSet || price.isSet) {
        // Compute the number of people
        var numberOfPeople = 0;
        priceDistribution.value.forEach(entry => {
          numberOfPeople += entry.amount;
        });

        if (this.isInsert) {
          return Math.round((price.value / numberOfPeople) * 100) / 100; // Round the values to two digits.
        } else if (this.isUpsert) {
          return { $setOnInsert: Math.round((price.value / numberOfPeople) * 100) / 100 };
        } else if (this.isUpdate) {
          return { $set: Math.round((price.value / numberOfPeople) * 100) / 100 };
        }
      }

      this.unset();
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

Expenses.after.insert(function (userId, doc) {
  
  Meteor.call('balance-entries.add', {
    expenseId: doc._id, 
    priceDistribution: doc.priceDistribution, 
    totalPrice: doc.price, 
    ownerId: doc.ownerId,
    date: doc.date,
    description: doc.description
  });

});

Expenses.after.update(function (userId, doc, fieldNames, modifier, options) {

  Meteor.call('balance-entries.remove', { 
    expenseId: doc._id
  });

  Meteor.call('balance-entries.add', {
    expenseId: doc._id, 
    priceDistribution: doc.priceDistribution, 
    totalPrice: doc.price, 
    ownerId: doc.ownerId,
    date: doc.date,
    description: doc.description
  });

}, { fetchPrevious: false }); // Don't fetch the previous doc

Expenses.before.remove(function (userId, doc) {

  Meteor.call('balance-entries.remove', { 
    expenseId: doc._id
  });

});