import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/users/overview.js';
import '../../ui/pages/users/show-user.js';
import '../../ui/pages/expenses/overview.js';
import '../../ui/pages/expenses/ledger.js';
import '../../ui/pages/expenses/edit.js';
import '../../ui/pages/expenses/add.js';
import '../../ui/pages/not-found/not-found.js';

// Set up all routes in the app
FlowRouter.route('/users', {
  name: 'Users.overview',
  action() {
    BlazeLayout.render('App_body', { main: 'Users_overview' });
  },
});

FlowRouter.route('/users/:username', {
  name: 'Users.show',
  action() {
    BlazeLayout.render('App_body', { main: 'Users_showUser' });
  },
});

FlowRouter.route('/expenses', {
  name: 'Expenses.overview',
  action() {
    BlazeLayout.render('App_body', { main: 'Expenses_overview' });
  },
});

FlowRouter.route('/expenses/ledger', {
  name: 'Expenses.ledger',
  action() {
    BlazeLayout.render('App_body', { main: 'Expenses_ledger' });
  },
});

FlowRouter.route('/expenses/edit/:expense', {
  name: 'Expenses.edit',
  action() {
    BlazeLayout.render('App_body', { main: 'Expenses_edit' });
  },
});

FlowRouter.route('/expenses/add', {
  name: 'Expenses.add',
  action() {
    BlazeLayout.render('App_body', { main: 'Expenses_add' });
  },
});


FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', { main: 'Pag_home' });
  },
});


FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};
