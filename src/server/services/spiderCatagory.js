var request = require("request");
var cheerio = require("cheerio");
var Spider = require('../dao/spider.dao');
var newsDao = require('../dao/news.dao');
var News = require('./../model/news.model');
var SpiderModel = require('./../model/spider.model');
var async = require('async');
var UrlModel = require('./../model/url.model');

module.exports = {
  spiderCatagoryGetAll: spiderCatagoryGetAll,
  spiderCatagoryGetByUrl: spiderCatagoryGetByUrl
}

function spiderCatagoryGetAll() {

}


function spiderCatagoryGetByUrl(urlId) {
  return UrlModel.findById({
      _id: urlId
    }).then(function (Url) {
      var arrayPath = [];
      var checkPushArray = false;
      return new Promise(function (resolve, reject) {
        request(Url.hostname, function (error, response, body) {
          if (!error && response.statusCode === 200) {
            var $ = cheerio.load(body);

            var lengthHeader = $('header').find('a').length;
            var FirstPromise = new Promise(function (resolve, reject) {
              $('header, nav, .mainMenu').find('a').each(function () {
                var url = $(this).attr('href');
                if (url.indexOf(Url.hostname) !== -1) {
                  arrayPath.push(url);
                }
                lengthHeader--;
              });
              if (lengthHeader === 0) {
                return resolve(true);
              }
            });
            FirstPromise.then(function (res) {
              return resolve({
                url: Url.hostname,
                arrayPath: arrayPath
              });
            });
          }
        });
      });
    })
    .catch(function (err) {
      console.log('err log ' + err);
    });

}
