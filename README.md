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
$  node ./node_modules/super-transformer/transformJSON.js -t './templates/simple-example.json' -i '{"customer": {"name": "John"}}'
```

Be sure to pass a valid JSON string in the **-i** argument, otherwise, the script will end with an error!

****transformDelimited.js****

The script **transformDelimited.js** will take a CSV string as input, a column layout and then apply a template to that input data to produce a string output.

You can use it like this:

```bash
$   node ./node_modules/super-transformer/transformDelimited.js -t './templates/simple-example-flat.json' -i '"john", "smith", "Davenport, FL", 2017' -d ',' -c 'first_name, last_name, customer_city, hire_year'
```

Be sure to pass a comma delimited string, properly quoted, and with the same column count as the **-c** argument. Also, the string should not contain any newline characters (\n) since those will cause the parser to fetch multiple rows. **transformDelimited.js** will ignore all but the first line in a multi-line CSV string.

If you want to parse out multi-line strings, see below for how to use the **XSVHelper** class directly in your own project.

The script **transformDelimited.js** can also accept column names embedded in the CSV string as input. In this case, the "-n" argument must be passed but not the "-c" argument. The script then applies a template to that input data to produce a string output.

You can use it like this:

```bash
$   node ./node_modules/super-transformer/transformDelimited.js -t './templates/simple-example-flat.json' -i 'first_name, last_name, customer_city, hire_year\n"john", "smith", "Davenport, FL", 2017' -d ',' -n
```

Be sure to pass a comma delimited string, properly quoted, with the first row representing column names. Also, the string must only contain one newline characters (\n) between row 1 (the column names) and row 2 (the data row) since those will cause the parser to fetch multiple rows. Beyond the two rows, in this mode of inferring column names **transformDelimited.js** will ignore additional lines a multi-line CSV string.

### Use the the package classes directly in your own code

You may also use the helper classes directly in your project as demonstrated below.

****TemplateHelper****

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
  './templates/simple-example.json',
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
```

See the example file provided to try out this example: **example-using-TemplateHelper-DiskIoOptimized.js**.

****XSVHelper with explicit column names****

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

****XSVHelper with inferred column names****

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

