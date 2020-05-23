// Include the library
const TemplateHelper = require('super-transformer').TemplateHelper;

// Create a data object to suit your needs
const contextData = {
  customer: {
    name: 'John',
  },
};

// Apply a template to your data
const templateOutput = TemplateHelper.applyTemplateWithFilePath(
  './templates/simple-example.hbs',
  contextData
);

// Do whatever you want with the templateOutput
console.log(templateOutput);

// Outputs
// {  "customerName": "John"}
