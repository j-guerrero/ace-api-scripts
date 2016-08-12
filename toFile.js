/*
  Joshua Guerrero
  August 2, 2016
*/

/* Converting passed GeoJSON data into an actual file. */

/* Create a function module to export
    Takes in results data
    Converts into file
    Stores file locally
    Return filepath to give to CKAN
*/

// Filestream module from Node.js
var fs = require('fs');

var saveTo = module.exports = function(results, fileName){

  var fileString = JSON.stringify(results);

  try{
    fs.writeFileSync(fileName, fileString)
  }
  catch(err)
  {
    console.log("Error: File could not be written");
  }

  console.log("Success: File was saved to: " + fileName);
}

module.exports = saveTo;
