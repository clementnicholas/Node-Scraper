var fs = require('fs');
var http = require('http');
var request = require('request');
var cheerio = require('cheerio');
var csvWriter = require('csv-write-stream');

request.get('http://substack.net/images/', function(error, response) {
  if (error) {
    return console.error('failed: ' + error);
  }
  generateContentArray(response.body, writeToFile);
});

function generateContentArray(body, callback) {
  $ = cheerio.load(body);
  var permissions = [], absoluteUrls = [], fileTypes = [], populatedArr = [];

  $('body').find('tr').each(function(i, el) {
    permissions.push($(this).find('td code').html());
    fileTypes.push($(this).find('a').html().split('.')[1]);
    absoluteUrls.push('http://substack.net' + $(this).find('a').attr('href'));
  });

  for (var i = 0; i < permissions.length; i++) {
    if (fileTypes[i]) {
      populatedArr.push([permissions[i], '.' + fileTypes[i], absoluteUrls[i]]);
    }
  }

  callback('./images.csv', populatedArr, fileWritten);
}

function writeToFile(filepath, data, callback) {
  var writer = csvWriter({ headers: ['permission', 'file type', 'url']});
  writer.pipe(fs.createWriteStream(filepath));
  for (i = 0; i < data.length; i++) {
    writer.write(data[i]);
  }
  writer.end();
  callback();
}

function fileWritten(err, data) {
  if (err) {
    console.error(err);
  }
  console.log('File Written!');
}













