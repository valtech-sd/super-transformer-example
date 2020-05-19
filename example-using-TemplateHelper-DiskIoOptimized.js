// Include the library
const TemplateHelper = require('super-transformer').TemplateHelper;

// Create a data object to suit your needs
const contextData = {
  customer: {
    name: 'John',
  },
};

// Load template body from file
let templateBody = TemplateHelper.loadTemplate(
  './templates/simple-example.json'
);

// Apply a template to on your data. In addition applyTemplate does
// cache your compiled template. If you happen to call the applyTemplate multiple times with the
// same template, it will used the cached version to save cpu time.
const templateOutput = TemplateHelper.applyTemplate(templateBody, contextData);

// Do whatever you want with the templateOutput
console.log(templateOutput);

// Outputs
// {  "customerName": "John"}
