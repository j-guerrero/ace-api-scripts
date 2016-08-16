/*
Joshua Guerrero
July 26, 2016
Importing Datasets and Resources to CKAN through Node.js
*/

/*

MODULES:    Request (https://github.com/request/request#streaming)
            Form-Data (https://github.com/form-data/form-data)

NOTES:      Must use CKAN API key to authenticate with database. Found on user
            profile page.

            Each API function has specific url for create, update, and delete

            Server returns JSON with 'success : true/false' attribute.
            --- Dataset attributes ---
                state = 'deleted' / 'active'      -- flags if dataset shows up

            * Resources
                -- Can create multiple resources of same name; unique ID is created for each


PROBLEMS: * Unable to delete dataset but can create and update.
            { help: 'http://demo.ckan.org/api/3/action/help_show?name=package_delete',
              success: false,
              error: { __type: 'Validation Error', id: [ 'Missing value' ] } }

          *  When deleted manually through website, unable to create dataset with same name.
             Doesn't fully remove.
              --- Can bring back from deleted status by updating 'state' attribute to 'active' vs 'deleted'

          * Can't update or delete resource by name. Must have ID# associated with it
              -- ID can just be package name

MILESTONES:   * HTTP requests
                -- Authentication
                -- Create package
                -- Update package
              * Resources
                -- Can create new resource with URL
                -- Can create and upload new resource from file

NEXT STEPS:   * easily deleting resources
              * Return ID only when package is created
              * Pulling ID of package easily
              * Listing out package
*/

/*  --- INITIALIZATION --- */
  var request = require('request'); // For HTTP requests
  var formData = require('form-data');  // For submitting resources
  var fs = require('fs'); // Resource file for attaching to package dataset

  /* CKAN Package API URLs */
  var pkg_api_create = 'http://demo.ckan.org/api/action/package_create';  // works
  var pkg_api_update = 'http://demo.ckan.org/api/action/package_update';  // works
  var pkg_api_delete = 'http://demo.ckan.org/api/action/package_delete';  // not working

  /* CKAN Resource API URLs */
  var rsrc_api_create = 'http://demo.ckan.org/api/3/action/resource_create';  // working with files
  var rsrc_api_update = 'http://demo.ckan.org/api/3/action/resource_update';  // not working

  /* CKAN Account Authorization */
  var api_key = '2d5be043-0f44-4bc5-96c5-a28aff57fd07';   // From 'demo.ckan.org' user page
  var auth_header = { 'Authorization' : api_key };

  // DEFAULT JSON ATTRIBUTES
  var pkg_name = "wakaflakaflame";
  var file = './saved_geojson.geojson';

  // PACKAGE: Details of package to create or modify
  // List of parameters found in link below
    // http://docs.ckan.org/en/latest/api/#ckan.logic.action.create.package_create
  var pkg_details = {
    name: pkg_name,
    notes : "PULLING FROM SET",
    state : "active"
  }

  // RESOURCE: CREATION header
    // http://docs.ckan.org/en/latest/api/#ckan.logic.action.create.resource_create
  var rsrc_data_create = {
    name: "JPEG test",
    description : 'This is an updated text',
    package_id: pkg_name,                         // Package name or unique ID #
    url : 'http://this.url.gets.ignored',             // (string) USE DUMMY URL WHEN UPLOADING
    /* ^ URL NOT OPTIONAL ^ */
    format : 'geojson',                                   // File extension
    upload: fs.createReadStream(file)                 // Attached file
  }

  // RESOURCE: UPDATE header
    // http://docs.ckan.org/en/latest/api/#ckan.logic.action.update.resource_update
  // Requires unique ID to resource
  var rsrc_data_update = {
    id : pkg_name
  }

/* --- HTTP PACKAGE OPTIONS --- !!! WORKING !!! --- */
  // Takes in parameters needed for HTTP package requests
  var package_options = {
    url : pkg_api_update,     // URL = Package API function (create, update, delete)
    headers:  auth_header,    // Uses api key to indicate account
    method: 'POST',           // Using POST request method
    json: pkg_details         // The information being uploaded
  };

/* --- HTTP RESOURCE OPTIONS --- !!! WORKING !!! --- */
  // from API documentation: "... requires a multipart/form-data request ... "
    // http://docs.ckan.org/en/latest/api/#uploading-a-new-version-of-a-resource-file
  var resource_options = {
    url : rsrc_api_create,        // URL = Resource API function (create, update)
    headers:  auth_header,        // Uses key to direct data
    method: 'POST',               // Indicates data submission
    formData : rsrc_data_create   // Data set to upload
  };


/* TESTING */
// Creates header options with given parameters for uploading file to CKAN
function resource_creation_options(name, description, format, filePath)
{
  /* !!! DEBUGGING !!! */
  console.log("IN FUNCTION");
  /* !!! DEBUGGING !!! */

  var filledHeader = {
      url : rsrc_api_create,        // URL = Resource API function (create, update)
      headers:  auth_header,        // Uses key to direct data
      method: 'POST',               // Indicates data submission
      formData : {
        name: name,
        description : description,
        package_id: pkg_name,                         // Package name or unique ID #
        url : 'http://this.url.gets.ignored',             // (string) USE DUMMY URL WHEN UPLOADING
        /* ^ URL NOT OPTIONAL ^ */
        format : format,                                   // File extension
        upload: fs.createReadStream(filePath)                 // Attached file
      }
    };

    return filledHeader;
}


// /* --- HTTP REQUEST --- */
//   // Send HTTP request with attributes attached via 'options', then handle responses
//   // Takes JSON with set parameters, ('package_options' or 'resource_options').
//   request(resource_options, function(error, response, body){
//     if(error){  return console.error('Request Failed:', error);  }
//     console.log(body);
//   });

var http_rsrc_create = module.exports = function(fileName, fileDesc,fileFormat,filePath)
{
  /* !!! DEBUGGING !!! */
  // console.log("CREATING HEADER");
  //
  // console.log(fileName);
  // console.log(fileDesc);
  // console.log(fileFormat);
  // console.log(filePath);
  /* !!! DEBUGGING !!! */

  var header = resource_creation_options(fileName, fileDec, fileFormat, filePath);  // NOT ACCESSING RIGHT

  /* !!! DEBUGGING !!! */
  console.log("CREATING RESOURCE");
  /* !!! DEBUGGING !!! */

  request(header, function(error, response, body){
    if(error){  return console.error('Request Failed:', error);  }
    console.log(body);
  });
}
