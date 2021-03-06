var request = require('request');
var cheerio = require("cheerio");
var Spider = require('../dao/spider.dao');
var newsDao = require('../dao/news.dao');
var NewsModel = require('./../model/news.model');
var UrlModel = require('./../model/url.model');
var SpiderModel = require('./../model/spider.model');
var async = require('async');
var restrictDao = require('./../dao/restrict.dao');

module.exports = {
  spiderCallUrlForTest: spiderCallUrlForTest,
  spiderCallPathForTest: spiderCallPathForTest,
  spiderCallPageForTest: spiderCallPageForTest
}

function spiderCallPageForTest(spiderId, Url) {
  return new Promise(function (resolve, reject) {
    return SpiderModel.findById({
      _id: spiderId
    }).exec().then(spider => {
      return UrlModel.findById({
        _id: spider.urlId
      }).exec().then(host => {
        if (spider != null) {
          var total = 0;
          var arrayPage = [];
          async.whilst(function () {
            return Url !== undefined
          }, function (next) {
            async.series({
                Url: function (callback) {
                  request(Url, function (err, res, body) {
                    if (!err && res.statusCode == 200) {
                      var $ = cheerio.load(body);
                      var temp = new Promise(function (resolve, reject) {
                        var index = 0;
                        if (arrayPage.length == 0) {
                          resolve();
                        }
                        arrayPage.forEach(item => {
                          if (item == Url) {
                            reject();
                          }
                          index++;
                          if (index == arrayPage.length) {
                            resolve();
                          }
                        })
                      })
                      temp.then(w => {
                        arrayPage.push(Url);
                        total++;
                        var rawUrl = $(spider.spiderInformation.nextPage.selector).attr('href');
                        if (rawUrl.includes("http") == false && rawUrl.includes("https") == false) {
                          rawUrl = host.hostname + rawUrl;
                        }
                        console.log(rawUrl);
                        if (rawUrl == undefined) {
                          resolve({
                            listPage: arrayPage,
                            total: total
                          })
                        }
                        callback(null, rawUrl)
                      }).catch(err => {
                        resolve({
                          listPage: arrayPage,
                          total: total
                        })
                      })

                    } else {
                      resolve({
                        listPage: arrayPage,
                        total: total
                      })
                    }
                  })
                }
              },
              function (err, result) {
                Url = result.Url;
                next();
              })
          })
        } else {
          reject(false);
        }
      });
    })
  })
}

function spiderCallPathForTest(spiderId, Url) {
  return new Promise(function (resolve, reject) {
    return SpiderModel.findById({
      _id: spiderId
    }).exec().then(spider => {
      if (spider !== null) {
        return UrlModel.findById({
          _id: spider.urlId
        }).exec().then(host => {
          var total = 0;
          var arrayNews = [];
          async.series({
            gotoPage: function (callback) {
              request(Url, function (err, response, body) {
                if (!err && response.statusCode === 200) {
                  var $ = cheerio.load(body);
                  var i = 1;
                  var length = $(spider.spiderInformation.listnews.selector).length;
                  if (length === 0 || length === undefined) {
                    resolve({
                      status: false,
                      message: "No find news. Please check ListNews Selector"
                    });
                  }
                  var temp = new Promise(function (resolve, reject) {
                    $(spider.spiderInformation.listnews.selector).each(function () {
                      var news = new NewsModel();
                      let selectorUrl = spider.spiderInformation.urlPath.selector.split('@value@')[0] + i + spider.spiderInformation.urlPath.selector.split('@value@')[1];
                      let selectorTitle = spider.spiderInformation.titlePath.selector.split('@value@')[0] + i + spider.spiderInformation.titlePath.selector.split('@value@')[1];
                      let selectorImage = spider.spiderInformation.image.selector.split('@value@')[0] + i + spider.spiderInformation.image.selector.split('@value@')[1];
                      let selectorDescription = spider.spiderInformation.description.selector.split('@value@')[0] + i + spider.spiderInformation.description.selector.split('@value@')[1];
                      var rawUrl = $(selectorUrl).attr('href');
                      if (rawUrl.includes("http") == false && rawUrl.includes("https") == false) {
                        rawUrl = host.hostname + rawUrl;
                      }
                      news.originalLink = rawUrl
                      console.log(news.originalLink);
                      news.title = $(selectorTitle).text();
                      console.log(news.title);

                      var rawImage = $(selectorImage).attr('src');
                      if (rawImage.includes("http") == false && rawImage.includes("https") == false) {
                        rawImage = host.hostname + rawImage;
                      }
                      console.log(rawImage);
                      news.image = rawImage
                      news.description = $(selectorDescription).text();
                      arrayNews.push(news);
                      total++;
                      if (i === length) {
                        resolve({
                          total: total,
                          listNews: arrayNews
                        })
                      }
                      i++;
                    })
                  })
                  temp.then(res => {
                    resolve(res);
                  })
                }
              })
            }
          })
        });
      } else {
        reject(false);
      }
    })
  })
}

function spiderCallUrlForTest(spiderId, Url) {
  return new Promise(function (resolve, reject) {
    return SpiderModel.findById({
      _id: spiderId
    }).exec().then(spider => {
      if (spider !== null) {
        return UrlModel.findById({
          _id: spider.urlId
        }).exec().then(host => {
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
        })
      } else {
        reject(false);
      }
    })
  })

}
