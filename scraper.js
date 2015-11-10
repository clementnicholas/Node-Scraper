var fs = require('fs');
var http = require('http');
var request = require('request');
var cheerio = require('cheerio');

request.get('http://substack.net/images/').on('response', function(response) {
  console.log(response);
});