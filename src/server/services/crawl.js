var request = require('request');
var cheerio = require("cheerio");
var Spider = require('../dao/spider.dao');
var newsDao = require('../dao/news.dao');
var NewsModel = require('./../model/news.model');
var SpiderModel = require('./../model/spider.model');
var async = require('async');
var restrictDao = require('./../dao/restrict.dao');

module.exports = {
  spiderCallUrlForTest: spiderCallUrlForTest
}

function spiderCallUrlForTest(spiderId, Url) {
  console.log(Url);
  return new Promise(function (resolve, reject) {
    return SpiderModel.findById({
      _id: spiderId
    }).exec().then(spider => {
      if (spider !== null) {
        console.log(spider);
        request(Url, function (err, res, body) {
          if (!err && res.statusCode == 200) {
            var $ = cheerio.load(body)
            async.series({
                title: function (callback) {
                  let title = $(spider.spiderInformation.title.selector).text();
                  if (title !== undefined) {
                    spider.spiderInformation.title.remove.forEach(item => {
                      var rv = $(item).text();
                      title.split(rv).join('');
                    })
                  }
                  callback(null, title);
                },
                content: function (callback) {
                  let content = $(spider.spiderInformation.content.selector).html();
                  if (content !== undefined) {
                    spider.spiderInformation.content.remove.forEach(item => {
                      var rv = $(item).text();
                      content.split(rv).join('');
                    })
                  }
                  callback(null, content);
                },
                author: function (callback) {
                  let author = $(spider.spiderInformation.author.selector).text();
                  if (author !== undefined) {
                    spider.spiderInformation.author.remove.forEach(item => {
                      var rv = $(item).text();
                      author.split(rv).join('');
                    })
                  }
                  callback(null, author);
                },
                createDate: function (callback) {
                  if (spider.spiderInformation.createDate.selector === undefined || spider.spiderInformation.createDate.selector == "") {
                    callback(null, Date.now());
                  } else {
                    callback(null, Date.now());
                  }
                }
              },
              function (err, result) {
                var upNews = new NewsModel();
                upNews.title = result.title;
                upNews.content = result.content;
                upNews.author = result.author;
                upNews.createDate = result.createDate;
                console.log(upNews.title);
                resolve(upNews);
              });
          }
        })
      } else {
        reject(false);
      }
    })
  })

}
