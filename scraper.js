var fs = require('fs');
var http = require('http');
var request = require('request');
var cheerio = require('cheerio');


request.get('http://substack.net/images/', function(error, response) {
  if (error) {
    return console.error('failed: ' + error);
  }
  generateContentArray(response.body, writeToFile);
});

function generateContentArray(body, callback) {
  $ = cheerio.load(body);
  var permissions = [];
  var absoluteUrls = [];
  var fileTypes = [];

  $('body').find('tr').each(function(i, el) {
    permissions.push($(this).find('td code').html());
    fileTypes.push($(this).find('a').html().split('.')[1]);
    absoluteUrls.push('http://substack.net' + $(this).find('a').attr('href'));
  });

  var populatedArr = [];

  for (var i = 0; i < permissions.length; i++) {
    if (fileTypes[i]) {
      populatedArr.push([permissions[i], '.' + fileTypes[i], absoluteUrls[i]]);
    }
  }

  callback('./images.csv', populatedArr, fileWritten);
}

function writeToFile(filepath, data, callback) {
  fs.writeFile(filepath, data, callback);
}

function fileWritten(err, written, string) {
  if (err) {
    console.error(err);
  }
  console.log('It took ' + written + 'bytes to write' + string + 'to the file.');
}













