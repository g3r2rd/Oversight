import { Meteor } from 'meteor/meteor';

Meteor.publish('users.all', function () {
  return Meteor.users.find();
});

Meteor.publish('users.onlyNames', function () {
  return Meteor.users.find({}, {
    fields: {
      username: 1,
    }
  });
});

