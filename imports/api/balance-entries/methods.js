import { Meteor } from 'meteor/meteor';
import { BalanceEntries } from './balance-entries.js';

Meteor.methods({
  'balance-entries.remove'({ expenseId }) {
    // 1. Search for any record linking to this expense and delete it.
    BalanceEntries.remove({ expenseId: expenseId });

    console.log('Balance entry removed.');
  },
  'balance-entries.add'({ expenseId, priceDistribution, totalPrice, ownerId, date, description }) {
    // Compute the number of people who should pay.
    var numberOfPeople = 0;
    priceDistribution.forEach(entry => {
      numberOfPeople += entry.amount;
    });

    // Re-compute of price per person, and residual value.
    var pricePerPerson = Math.round((totalPrice / numberOfPeople) * 100) / 100;
    var residual = totalPrice - ( numberOfPeople * pricePerPerson );

    // Add a record for each user that pays.
    var residualSettled = false;
    priceDistribution.forEach(entry => {
      userId = entry.userId;
      amount = entry.amount;
      
      if(userId === ownerId) {
        // Owner gains money. However; he has to deal with the residual.
        BalanceEntries.insert({ 
          expenseId: expenseId, 
          userId: userId, 
          modification: totalPrice - residual,
          date: date,
          description: description
        });

        residualSettled = true;
      }
      else {
        // Others always loose money.
        BalanceEntries.insert({ 
          expenseId: expenseId, 
          userId: userId, 
          modification: -pricePerPerson,
          date: date,
          description: description
        });
      }
    });

    // If the residual wasn't settled, settle it with a random person.
    if(!residualSettled) {
      var i = Math.floor(Math.random() * priceDistribution.length);

      BalanceEntries.insert({ 
        expenseId: expenseId, 
        userId: priceDistribution[i].userId, 
        modification: - residual,
        date: date,
        description: description
      });
    }

    console.log('Balance entry added.');
  },
});

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