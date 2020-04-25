# Super Transformer - Example

## Summary

This repository demonstrates how to use the super-transformer NPM package.

## Install

To install this package in your nodejs project:
```bash
$ npm i super-transformer --save
```

This will add it as a dependency to your package.json.

## Usage

Once installed, this package offers two methods of using.

**Command Line Script**

The script **transformJSON.js** will take a JSON string as input and apply a template to that JSON to produce a string output.

You can use it like this:

```bash
$  node ./node_modules/super-transformer/transformJSON.js -t './templates/simple-example.json' -i '{"customer": {"name": "John"}}'
```

Be sure to pass a valid JSON string in the **-i** argument, otherwise, the script will end with an error!

**Use the TemplateHelper Class directly in your own code**

For embedding into your own code, you may also use the **TemplateHelper** class directly in your code.

```javascript
// Include the library
const TemplateHelper = require('super-transformer').TemplateHelper;

// Create a data object to suit your needs. This should be a valid JSON object.
const contextData = {
        customer: {
          name: 'John',
        },
      };

// Apply a template to your data and save the result to a variable
const templateOutput = TemplateHelper.applyTemplate(
'./templates/simple-example.json',
contextData
);

// Do whatever you want with the templateOutput
console.log(templateOutput);
```

See the example file provided to try out this example: **example-use-in-your-code.js**.

**TemplateHelper** is a very thin wrapper around HandlebarsJS. 

## Templates

This package uses HandlebarsJS under the hood. The templates supported are therefore Handlebars templates. Handlebars supports many rich template substitutions. To learn more about handlebars/mustache template transformations, see the [HandlebarsJS website](https://handlebarsjs.com/guide/).