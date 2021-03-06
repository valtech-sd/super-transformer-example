// Include the library
const XSVHelper = require('super-transformer').XSVHelper;

// Create inputs to suit our needs, notice the \n is actually causing the string to contain TWO csv lines!
const inputCSVString = 'first_name, last_name, customer_city, hire_year\n"john", "smith", "Davenport, FL", 2017\n"mary", "jones", "Orlando, FL", 2018';
// Delimit with a comma
const delimiter = ',';

// Parse out the CSV into an object
const parsedJsonObject = XSVHelper.parseXsvAndInferColumns(inputCSVString, delimiter);

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
