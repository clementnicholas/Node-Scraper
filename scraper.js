var fs = require('fs');
var http = require('http');
var request = require('request');
var cheerio = require('cheerio');
var csvWriter = require('csv-write-stream');

// GET REQUEST TO 
request('http://substack.net/images/', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    generateContent(body, writeToFile);
  }
});

function generateContent(body, callback) {
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
  console.log(populatedArr);
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













