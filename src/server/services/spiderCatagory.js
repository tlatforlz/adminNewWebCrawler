var request = require("request");
var cheerio = require("cheerio");
var Spider = require('../dao/spider.dao');
var newsDao = require('../dao/news.dao');
var News = require('./../model/news.model');
var SpiderModel = require('./../model/spider.model');
var async = require('async');
var UrlModel = require('./../model/url.model');
var SpiderService = require('./spider');
module.exports = {
  spiderCatagoryGetAll: spiderCatagoryGetAll,
  spiderCatagoryGetByUrl: spiderCatagoryGetByUrl,
  callSpiderByPath: callSpiderByPath,
  callSpiderByPathUpdate: callSpiderByPathUpdate,

  searchByKey: searchByKey
}

function searchByKey(crawlingName, searchKey) {
  console.log(crawlingName + " " + searchKey);

}



function callSpiderByPathUpdate(crawlingName, namePath, catelogyId) {
  return new Promise(function (resolve, reject) {
    if (namePath === '' || namePath === undefined) {
      return reject(false);
    }
    return SpiderModel.findOne({
        crawlingName: crawlingName
      }).exec()
      .then(res => {
        if (crawlingName === 'spiderTinNongNghiep') {
          return UrlModel.findById({
            _id: res.urlId
          }).then(url => {
            var host = url.hostname + namePath;
            return SpiderService.getPathUpdate_spiderTinNongNghiep(host, res._id, catelogyId).then(function (res) {
                return resolve(res);
              })
              .catch(function (err) {
                console.log(err);
              });
          })
        }
        if (crawlingName === 'spiderTinNongNghiepVietNam') {
          return UrlModel.findById({
            _id: res.urlId
          }).then(url => {
            var host = url.hostname + namePath;
            return SpiderService.getPathUpdate_spiderTinNongNghiep(host, res._id, catelogyId).then(function (res) {
                return resolve(res);
              })
              .catch(function (err) {
                console.log(err);
              });
          })
        }
      })
  })
}

function callSpiderByPath(crawlingName, namePath, catelogyId) {
  return new Promise(function (resolve, reject) {
    if (namePath === '' || namePath === undefined) {
      return reject(false);
    }
    return SpiderModel.findOne({
        crawlingName: crawlingName
      }).exec()
      .then(res => {
        if (crawlingName === 'spiderTinNongNghiep') {
          return UrlModel.findById({
            _id: res.urlId
          }).then(url => {
            var host = url.hostname + namePath;
            return SpiderService.getPath_spiderTinNongNghiep(host, res._id, catelogyId).then(function (res) {
                return resolve(res);
              })
              .catch(function (err) {
                console.log(err);
              });
          })
        }
        if (crawlingName === 'spiderTinNongNghiepVietNam') {
          return UrlModel.findById({
            _id: res.urlId
          }).then(url => {
            var host = url.hostname + namePath;
            return SpiderService.getPath_spiderNongNghiepVietNam(host, res._id, catelogyId).then(function (res) {
                return resolve(res);
              })
              .catch(function (err) {
                console.log(err);
              });
          })
        }
      })
  })
}

function getPath_spiderTinNongNghiep(path, spiderId, catelogyId) {
  return new Promise(function (resolve, reject) {
    if (path === undefined) {
      return reject(false);
    }
    async.whilst(function () {
      return path !== undefined
    }, function (next) {
      async.series({
        gotoPage: function (callback) {
          request(path, function (error, response, body) {
            if (!error && response.statusCode === 200) {
              var $ = cheerio.load(body);
              var i = 1;
              $('.post-listing .post-box-title a').each(function () {
                //#main-content > div.content > div.post-listing > article:nth-child(1)
                url = ($(this).attr('href'));
                console.log(url);
                image = $('#main-content > div.content > div.post-listing > article:nth-child(' + i + ') > div.post-thumbnail > a > img').attr('src');
                des = $('#main-content > div.content > div.post-listing > article:nth-child(' + i + ') > div.entry > p').text();
                if (image === undefined) {
                  image = null;
                } else {
                  image = image.split('-150x150').join('');
                }
                var news = new News({
                  originalLink: url,
                  spiderId: spiderId,
                  categoryId: catelogyId,
                  image: image,
                  description: des,
                  active: false
                });
                News.findOne({
                  originalLink: news.originalLink
                }, function (err, New) {
                  if (New === null) {
                    news.save();
                  }
                });
                i++;
              });
              gotoPage = $('#tie-next-page a').attr('href');
              if (gotoPage === undefined) {
                return resolve(true);
              }
              callback(null, gotoPage);
            } else {
              return reject(false);
            }
          });
        }
      }, function (err, result) {
        path = result.gotoPage;
        next();
      });
    }, function (err) {
      return resolve(true);
    })
  });
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
                if (url.indexOf(Url.hostname) !== -1 && url.split(Url.hostname)[1] !== '/') {
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
