// Include the library
const TemplateHelper = require('super-transformer').TemplateHelper;

// Create a data object to suit your needs
const contextData = {
  customer: {
    name: 'John',
  },
};

// Apply a template to your data
const templateOutput = TemplateHelper.applyTemplate(
  './templates/simple-example.json',
  contextData
);

// Do whatever you want with the templateOutput
console.log(templateOutput);