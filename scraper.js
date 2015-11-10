var fs = require('fs');
var http = require('http');
var request = require('request');
var cheerio = require('cheerio');

request.get('http://substack.net/images/', function(error, response) {
  if (error) {
    return console.error('failed: ' + error);
  }
  console.log(response.body);
});