import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';

AutoForm.addHooks(['insertExpenseForm', 'updateExpenseForm'], {
  // Called when any submit operation succeeds
  onSuccess: function(formType, result) {
    FlowRouter.go('Expenses.overview');
  },
});

AutoForm.addInputType("currency", {
  template: "afInputNumber",
  valueOut: function () {
    console.log('stop');
    return this.val().replace(/,/g, '.');
  },
  contextAdjust: function (context) {
    
  }
});