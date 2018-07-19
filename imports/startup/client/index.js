// Import client startup through a single index entry point

import { AutoForm } from 'meteor/aldeed:autoform';
import SimpleSchema from 'simpl-schema';

import './routes.js';
import './autoform-hooks.js';

SimpleSchema.debug = true;

AutoForm.setDefaultTemplate('bootstrap4');
AutoForm.debug();
