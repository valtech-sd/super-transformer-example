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

### Command Line Scripts

This package includes several command line scripts that you can use directly.

****transformJSON.js****

The script **transformJSON.js** will take a JSON string as input and apply a template to that JSON to produce a string output.

You can use it like this:

```bash
$  node ./node_modules/super-transformer/transformJSON.js -t './templates/simple-example.hbs' -i '{"customer": {"name": "John"}}'
```

Be sure to pass a valid JSON string in the **-i** argument, otherwise, the script will end with an error!

****transformJSON-file.js****

The script **transformJSON.js** will take a file of JSON lines (a properly formed JSON object, one per line) as input and apply a template to each line in the file to produce string output, also line delimited.

You can use it like this:

```bash
$  node ./node_modules/super-transformer/transformJSON-file.js -t './templates/simple-example.hbs' -i './data/simple-json-01.txt'
```

Be sure to pass the correct path of a valid JSON line-ny-line file in the **-i** argument, otherwise, the script will end with an error! Also, each line of the file must contain a complete properly formed JSON object. The file must not contain an array of JSON objects, instead each line must be a complete JSON object.

****transformDelimited.js****

The script **transformDelimited.js** will take a CSV string as input, a column layout and then apply a template to that input data to produce a string output.

You can use it like this:

```bash
$   node ./node_modules/super-transformer/transformDelimited.js -t './templates/simple-example-flat.hbs' -i '"john", "smith", "Davenport, FL", 2017' -d ',' -c 'first_name, last_name, customer_city, hire_year'
```

Be sure to pass a comma delimited string, properly quoted, and with the same column count as the **-c** argument. Also, the string should not contain any newline characters (\n) since those will cause the parser to fetch multiple rows. **transformDelimited.js** will ignore all but the first line in a multi-line CSV string.

If you want to parse out multi-line strings, see below for how to use the **XSVHelper** class directly in your own project.

****transformDelimited-file.js****

The script **transformDelimited.js** will take a CSV file as input, a column layout and then apply a template to the input file to produce a string output, line by line.

You can use it like this:

```bash
$   node ./node_modules/super-transformer/transformDelimited-file.js -t './templates/simple-example-flat.hbs' -i './data/simple-csv-01.txt' -d ',' -n
```

Be sure to pass a valid file path to a comma delimited file, with the same column count as the **-c** argument (or if you have column names in row 1, you can pass **-n**).

### Use the the package classes directly in your own code

You may also use the helper classes directly in your project as demonstrated below.

#### TemplateHelper

**TemplateHelper** is a simple class (a very thin wrapper around HandlebarsJS) to transform a template given the passed context data.

```javascript
// Include the library
const TemplateHelper = require('super-transformer').TemplateHelper;

// Create a data object to suit your needs
const contextData = {
  customer: {
    name: 'John',
  },
};

// Apply a template to your data
// Note: This will perform a Disk Io operation on every call. If you are calling 
// muliple times in succession, you may have performance issues.
const templateOutput = TemplateHelper.applyTemplateWithFilePath(
  './templates/simple-example.hbs',
  contextData
);

// Do whatever you want with the templateOutput
console.log(templateOutput);

// Outputs
// {  "customerName": "John"}
```

> **Note:** The above example uses `TemplateHelper.applyTemplateWithFilePath()` which expects to receive the path to a template, reads it, then performs the transformation. However, the super-transformer package also provides a method `TemplateHelper.applyTemplate()` that takes in a template body directly as a string. This is useful when you don't need to read your template from file (for instance, if you're caching the templates or storing/fetching templates from a DB or some other string source.)

See the example file provided to try out this example: **example-using-TemplateHelper.js**.

**Alternative TemplateHelper Example** In some cases it is highly undesireable to load the template from a file for every record. An alternative method is to call `loadTemplate` and `applyTemplate`. You can make as many calls to `applyTemplate` as you want without worrying about high disk io usage.

```javascript
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
  './templates/simple-example.hbs'
);

// Apply a template to on your data. In addition applyTemplate does
// cache your compiled template. If you happen to call the applyTemplate multiple times with the
// same template, it will used the cached version to save cpu time.
const templateOutput = TemplateHelper.applyTemplate(templateBody, contextData);

// Do whatever you want with the templateOutput
console.log(templateOutput);

// Outputs
// {  "customerName": "John"}
```

See the example file provided to try out this example: **example-using-TemplateHelper-DiskIoOptimized.js**.

**TemplateHelper Example with Custom Handlebars Helpers**

The super-transformer package supports Handlebars custom helpers. The Handlebars custom helpers are defined in a special javascript file that has a certain structure:

You can define Handlebars helpers in a special JavaScript file. For example:

```javascript
function loadHandlebarsHelpers(Handlebars) {
  // As many Handlebars custom helper registrations as you want
}
module.exports.loadHandlebarsHelpers = loadHandlebarsHelpers;
```

In the above, you add as many `Handlebars.registerHelper(...)` as you want, using the standard Handlebars custom helpers syntax described here: https://handlebarsjs.com/guide/#custom-helpers.

For example, here is a complete file:

```javascript
function loadHandlebarsHelpers(Handlebars) {
  Handlebars.registerHelper('yell', (someString) => {
    return someString.toUpperCase();
  });
}
module.exports.loadHandlebarsHelpers = loadHandlebarsHelpers;
```

Once you define your helper file, you use it like this:

```javascript
// Dependencies
const path = require('path');
// Wire-in the custom Handlebars helpers (be sure to RESOLVE the path, otherwise the file will likely not be found!)
TemplateHelper.loadHandlebarsHelpers(path.resolve('./templates/example-handlebars-helpers.js'));
```

Here is a complete example:

```javascript
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
```

See the example file provided to try out this example: **example-using-TemplateHelper-with-Handlebars-helpers.js**.

#### XSVHelper with explicit column names

**XSVHelper** is a class (a very thin wrapper around csv-parse) that parses out a CSV string (and a column layout) into a JSON object. The returned object is always an array of objects, actually. Note that if the passed CSV string has newline characters (\n), the parser will add multiple items into the array as demonstrated in the example below.

```javascript
// Include the library
const XSVHelper = require('super-transformer').XSVHelper;

// Create inputs to suit our needs, notice the \n is actually causing the string to contain TWO csv lines!
const inputCSVString =
  '"john", "smith", "Davenport, FL", 2017\n"mary", "jones", "Orlando, FL", 2018';
// Delimit with a comma
const delimiter = ',';
// Define the column names that we want the object to have
const columnLayout = 'first_name, last_name, customer_city, hire_year';

// Parse out the CSV into an object
const parsedJsonObject = XSVHelper.parseXsv(
  inputCSVString,
  delimiter,
  columnLayout
);

// Do whatever you want with the parsedObject. It's really an object though the console.log will output as a string!
console.log(parsedJsonObject);

// Outputs
// [
//   {
//     first_name: 'john',
//     last_name: 'smith',
//     customer_city: 'Davenport, FL',
//     hire_year: '2017'
//   },
//   {
//     first_name: 'mary',
//     last_name: 'jones',
//     customer_city: 'Orlando, FL',
//     hire_year: '2018'
//   }
// ]
```

See the example file provided to try out this example: **example-using-XSVHelper.js**.

#### XSVHelper with inferred column names

**XSVHelper** is a class (a very thin wrapper around csv-parse) that parses out a CSV string (and a column layout) into a JSON object. The returned object is always an array of objects, actually. Note that if the passed CSV string has newline characters (\n) except between row 1 (column names) and row 2 (data row), the parser will add multiple items into the array as demonstrated in the example below.

```javascript
// Include the library
const XSVHelper = require('super-transformer').XSVHelper;

// Create inputs to suit our needs, notice the \n is actually causing the string to contain TWO csv lines!
const inputCSVString =
  'first_name, last_name, customer_city, hire_year\n"john", "smith", "Davenport, FL", 2017\n"mary", "jones", "Orlando, FL", 2018';
// Delimit with a comma
const delimiter = ',';

// Parse out the CSV into an object
const parsedJsonObject = XSVHelper.parseXsvAndInferColumns(
  inputCSVString,
  delimiter
);

// Do whatever you want with the parsedObject. It's really an object though the console.log will output as a string!
console.log(parsedJsonObject);

// Outputs
// [
//   {
//     first_name: 'john',
//     last_name: 'smith',
//     customer_city: 'Davenport, FL',
//     hire_year: '2017'
//   },
//   {
//     first_name: 'mary',
//     last_name: 'jones',
//     customer_city: 'Orlando, FL',
//     hire_year: '2018'
//   }
// ]
```

See the example file provided to try out this example: **example-using-XSVHelper-column-names-in-file.js**.

## Templates

This package uses HandlebarsJS under the hood. The templates supported are therefore Handlebars templates. Handlebars supports many rich template substitutions. To learn more about handlebars/mustache template transformations, see the [HandlebarsJS website](https://handlebarsjs.com/guide/).

