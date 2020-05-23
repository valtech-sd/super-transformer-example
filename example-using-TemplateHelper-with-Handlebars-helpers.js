// Include the library
const TemplateHelper = require('super-transformer').TemplateHelper;
// Dependencies
const path = require('path');

// Create a data object to suit your needs
const contextData = {
  customer: {
    name: 'John',
  },
};

// Wire-in the custom Handlebars helpers (be sure to RESOLVE the path, otherwise the file will likely not be found!)
TemplateHelper.loadHandlebarsHelpers(path.resolve('./templates/example-handlebars-helpers.js'));

// Load template body from file
let templateBody = TemplateHelper.loadTemplate(
  './templates/simple-example.hbs'
);

// Apply a template to your data
const templateOutput = TemplateHelper.applyTemplate(templateBody, contextData);

// Do whatever you want with the templateOutput
console.log(templateOutput);

// Outputs
// {  "customerName": "JOHN"}
