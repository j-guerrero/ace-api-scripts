/*
  Joshua Guerrero
  August 2, 2016
*/

/* Converting data pulled from LoopBack into a file */

// Filestream module from Node.js
var fs = require('fs');

// Takes data pulled from LoopBack (results) and saves to given file path (fileName)
var saveTo = module.exports = function(results, fileName){

  // Turns results into string to be saved
  var fileString = JSON.stringify(results);

  try{
    fs.writeFileSync(fileName, fileString)
  }

  catch(err){
    console.log("Error: File could not be written");
  }

  console.log("Success: File was saved to: " + fileName);
};
