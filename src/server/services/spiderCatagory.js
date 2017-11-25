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

  searchByKey: searchByKey,


  searchByKeyTinNongNghiep: searchByKeyTinNongNghiep
}

function searchByKeyTinNongNghiep(path, spiderId, categoryId, searchKey) {
  return new Promise(function (resolve, reject) {
    if (path === undefined) {
      return reject(false);
    }
    var total = 0;
    var arrayNews = [];
    async.whilst(function () {
      return path !== undefined
    }, function (next) {
      async.series({
        gotoPage: function (callback) {
          request(path, function (error, response, body) {
            if (!error && response.statusCode === 200) {
              var $ = cheerio.load(body);
              var i = 1;
              var length = $('.post-listing .post-box-title a').length;
              var temp = new Promise(function (resolve, reject) {
                $('.post-listing .post-box-title a').each(function () {
                  if (length == 0 || length == undefined) {
                    resolve(true);
                  }
                  url = ($(this).attr('href'));
                  image = $('#main-content > div.content > div.post-listing > article:nth-child(' + i + ') > div.post-thumbnail > a > img').attr('src');
                  des = $('#main-content > div.content > div.post-listing > article:nth-child(' + i + ') > div.entry > p').text();
                  title = $('#main-content > div.content > div.post-listing > article:nth-child(' + i + ') > h2 > a').text().toLowerCase();
                  if (image === undefined) {
                    image = null;
                  } else {
                    image = image.split('-150x150').join('');
                  }
                  var news = new News({
                    originalLink: url,
                    spiderId: spiderId,
                    categoryId: categoryId,
                    image: image,
                    description: des,
                    active: false,
                    updateDate: Date.now()
                  });

                  if (title.indexOf(searchKey.toLowerCase()) > -1) {
                    console.log(title);
                    News.findOne({
                      originalLink: news.originalLink
                    }, function (err, New) {
                      if (New === null) {
                        total++;
                        arrayNews.push(news._id);
                        news.save().then(function () {
                          resolve(true);
                        });
                      } else {
                        total++;
                        New.updateDate = Date.now();
                        New.active = false;
                        New.save();
                        arrayNews.push(New._id);
                        resolve(true);
                      }
                    });
                  }
                  i++;
                  if (i == length) {
                    resolve(true);
                  }
                });
              });
              temp.then(function (res) {
                gotoPage = $('#tie-next-page a').attr('href');
                if (gotoPage === undefined) {
                  return resolve({
                    'total': total,
                    'listNewsId': arrayNews,
                    'status': true
                  });
                }
                callback(null, gotoPage);
              })
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

function searchByKey(crawlingName, searchKey) {
  return new Promise(function (resolve, reject) {
    return SpiderModel.findOne({
        crawlingName: crawlingName
      })
      .exec()
      .then(res => {
        if (crawlingName === 'spiderTinNongNghiep') {
          return UrlModel.findById({
            _id: res.urlId
          }).then(url => {
            var total = 0;
            var index = 1;
            var listNewsId = [];
            var t = new Promise(function (resolve, reject) {
              url.path.forEach(element => {
                var host = url.hostname + element.namePath;
                searchByKeyTinNongNghiep(host, res._id, element.catelogyId, searchKey).then(res => {
                  var y = 0;
                  res.listNewsId.forEach(news => {
                    listNewsId.push(news);
                  });
                  total += res.total;
                  index++;
                  if (index === url.path.length - 1) {
                    resolve(true);
                  }
                })
              });
            });
            t.then(s => {
              return resolve({
                total: total,
                listNewsId: listNewsId
              });
            }).catch(s => {
              console.log('err ' + s);
            })
          });
        }
      });
  });
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
