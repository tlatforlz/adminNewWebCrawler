var request = require("request");
var cheerio = require("cheerio");
var Spider = require('../dao/spider.dao');
var newsDao = require('../dao/news.dao');
var News = require('./../model/news.model');
var SpiderModel = require('./../model/spider.model');
var async = require('async');
var restrictDao = require('./../dao/restrict.dao');

module.exports = {
  spiderCountUpdateAll: spiderCountUpdateAll,

  spiderTinNongNghiep: spiderTinNongNghiep,
  spiderTinNongNghiepUpdateAll: spiderTinNongNghiepUpdateAll,
  spiderTinNongNghiepPath: spiderTinNongNghiepPath,
  spiderTinNongNghiepUpdatePath: spiderTinNongNghiepUpdatePath,
  spiderTinNongNghiepUrl: spiderTinNongNghiepUrl,
  spiderTinNongNghiepUpdateUrl: spiderTinNongNghiepUpdateUrl,
  spiderTinNongNghiepUpdateUrlVersion2: spiderTinNongNghiepUpdateUrlVersion2,
  getPathspiderTinNongNghiep: getPathspiderTinNongNghiep,
  getPathUpdateSpiderTinNongNghiep: getPathUpdateSpiderTinNongNghiep,

  checkRestrictedKey: checkRestrictedKey
}

function checkRestrictedKey(id, value) {
  return new Promise(function (resolve, reject) {
    return News.findById({
      _id: id
    }).exec().then(news => {
      return restrictDao.getAllRestrict().then(list => {
        var index = 0;
        news.restrictedKey = [];
        news.save().then(x => {
          list.forEach(item => {
            var temp = value;
            var count = 0;
            var t = new Promise(function (resolve, reject) {
              while (true) {
                if (temp.toLowerCase().indexOf(item.name.toLowerCase()) === -1) {
                  resolve(count);
                  break;
                } else {
                  count++;
                  temp = temp.substring(temp.toLowerCase().indexOf(item.name.toLowerCase()) + item.name.length);
                }
              }
            });
            t.then(res => {
              console.log(item.name + " " + res);
              var p = new Promise(function (resolve, reject) {
                var j = 0;
                news.restrictedKey.forEach(x => {
                  console.log(x);
                  if (x.name == item.name) {
                    resolve(true);
                  }
                  j++;
                  if (j == news.restrictedKey.length - 1) {
                    resolve(false);
                  }
                });
                if (news.restrictedKey.length === 0) {
                  resolve(false);
                }
              });
              p.then(check => {
                if (check == false) {
                  if (res !== 0) {
                    temp = value;
                    var request = {
                      id: news._id,
                      name: item.name,
                      count: res
                    };
                    News.findById({
                      _id: request.id
                    }).exec().then(news => {
                      news.restrictedKey.push({
                        restrict: request.name,
                        duplicate: request.count
                      });
                      news.save();
                    })
                  }
                }
                index++;
                if (index === list.length) {
                  return resolve(true);
                }
              })
            });
          });
        });
      });
    });
  });
}

function spiderCountUpdateAll(crawlingName) {
  return SpiderModel.findOne({
      crawlingName: crawlingName
    })
    .populate('urlId')
    .exec()
    .then(function (spiderN) {
      if (spiderN === null) {
        message: failMessage.spider.notFound
      }
      var count = 0;
      var list_length = spiderN.urlId.path.length;
      var list_news = [];
      return new Promise(function (resolve, reject) {
        async.series({
          list_news: function (callback) {
            async.whilst(function () {
              return count < list_length
            }, function (next) {
              return News.find({
                  categoryId: spiderN.urlId.path[count].catelogyId,
                  active: false,
                  $or: [{
                    title: undefined
                  }, {
                    title: ""
                  }, {
                    content: undefined
                  }, {
                    author: undefined
                  }, {
                    author: ""
                  }, {
                    createDate: undefined
                  }, {
                    createDate: ""
                  }]
                })
                .exec().then(function (upNews) {
                  var index = 0;
                  async.whilst(function () {
                    return index < upNews.length
                  }, function (callback2) {
                    var check = list_news.find(o => o.originalLink === upNews[index].originalLink);
                    if (check === undefined) {
                      list_news.push(upNews[index]);
                    }
                    index++;
                    callback2();
                  }, function (err) {
                    count++;
                    next();
                  });
                });
            }, function (err) {
              callback(null, list_news);
            });
          }
        }, function (err, result) {
          return resolve({
            length: list_news.length,
            list: list_news
          });
        })
      });
    });
}

// --------------------Tin Nong Nghiep
//spiderTinNongNghiep
function spiderTinNongNghiep(urlId, spiderId) {
  return new Promise(function (resolve, reject) {
    var page = 0;
    async.whilst(function () {
        return page < urlId.path.length;
      },
      function (next) {
        var disUrl = urlId.hostname + urlId.path[page].namePath;
        getPathspiderTinNongNghiep(disUrl, spiderId, urlId.path[page].catelogyId).then(function (res) {
          page++;
          next();
        }).catch(function (err) {
          console.log(err);
        });
      },
      function (err) {
        return resolve("CALL_SUCCESS");
      });
  });
}

//getPathUpdateSpiderTinNongNghiep
function getPathUpdateSpiderTinNongNghiep(path, spiderId, catelogyId) {
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
                  if (length == 0) {
                    resolve(true);
                  }
                  //#main-content > div.content > div.post-listing > article:nth-child(1)
                  url = ($(this).attr('href'));
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
                    active: false,
                    updateDate: Date.now()
                  });
                  News.findOne({
                    originalLink: news.originalLink
                  }, function (err, New) {
                    if (New === null) {
                      total++;
                      arrayNews.push(news._id);
                      news.save();
                    } else {
                      New.updateDate = Date.now();
                      total++;
                      arrayNews.push(New._id);
                      New.save();
                    }
                  });
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

//getPathspiderTinNongNghiep
function getPathspiderTinNongNghiep(path, spiderId, catelogyId) {
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
                    active: false,
                    updateDate: Date.now()
                  });
                  News.findOne({
                    originalLink: news.originalLink
                  }, function (err, New) {
                    if (New === null) {
                      console.log(news.originalLink + " " + total);
                      total++;
                      arrayNews.push(news._id);
                      news.save().then(function () {
                        resolve(true);
                      })
                    }
                  });
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

//spiderTinNongNghiep_path
function spiderTinNongNghiepPath(urlId, spiderId, catelogyId) {
  urlId.path.forEach(url => {
    if (url.catelogyId.equals(catelogyId)) {
      var disUrl = urlId.hostname + url.namePath;
      getPathspiderTinNongNghiep(disUrl, spiderId, url.catelogyId);
    }
  });
}

//spiderTinNongNghiepUrl
function spiderTinNongNghiepUrl(urlId, spiderId, url) {
  News.findOne({
    originalLink: url
  }, function (err, tNews) {
    if (tNews !== null) {
      return false;
    }
    var upNews = new News({
      originalLink: url,
      spiderId: spiderId,
    });
    upNews.save();
    return true;
  });
}

//spiderTinNongNghiepUpdateAll
function spiderTinNongNghiepUpdateAll() {
  News.find({
    $or: [{
      title: undefined
    }, {
      title: ""
    }, {
      content: undefined
    }, {
      author: undefined
    }, {
      author: ""
    }, {
      createDate: undefined
    }, {
      createDate: ""
    }]
  }, function (err, news) {
    var page = 0;
    var lastPage = news.length;
    async.whilst(function () {
        return page < lastPage;
      },
      function (next) {
        if (news[page].title === undefined || news[page].title === "") {
          request(news[page].originalLink, function (err, res, body) {
            if (!err && res.statusCode === 200) {
              var $ = cheerio.load(body);
              async.series({
                  title: function (callback) {
                    news[page].title = $('#main-content > div.content > article > div > h1 > span').text();
                    console.log(news[page].title);
                    callback(null, news[page].title);
                  },
                  content: function (callback) {
                    let content = $('#main-content > div.content > article > div').html();
                    //console.log('log content + ' + content);
                    //#main-content > div.content > article > div
                    let remove = $('#main-content > div.content > article > div > p').html();
                    //#main-content > div.content > article > div > p
                    let remove_review_overview = $('#main-content > div.content > article > div > div.entry > div.share-post').html();
                    //#main-content > div.content > article > div > div.entry > div.share-post
                    callback(null, content.split(remove).join('').split(remove_review_overview).join(''));
                  },
                  author: function (callback) {
                    let author = $('#main-content > div.content > article > div > p > span:nth-child(1) > a').text();
                    news[page].author = author;
                    callback(null, news[page].author);
                  },
                  createDate: function (callback) {
                    callback(null, Date.now());
                  },
                  updateDate: function (callback) {
                    callback(null, Date.now());
                  }
                },
                function (err, result) {
                  news[page].title = result.title;
                  news[page].content = result.content;
                  news[page].author = result.author;
                  news[page].createDate = result.createDate;
                  news[page].updateDate = result.updateDate;
                  console.log(news[page].title);
                  news[page].save(function (err) {
                    if (err) {}
                  });
                });
            } else {}
            page++;
            next();
          });
        } else {
          page++;
          next();
        }
      },
      function (err) {});
  });
}

//spiderTinNongNghiep_updatePath
function spiderTinNongNghiepUpdatePath(categoryId) {
  News.find({
    categoryId: categoryId
  }, function (err, news) {
    var page = 0;
    var lastPage = news.length;
    async.whilst(function () {
        return page < lastPage;
      },
      function (next) {
        if (news[page].title === undefined || news[page].title === "") {
          request(news[page].originalLink, function (err, res, body) {
            if (!err && res.statusCode === 200) {
              var $ = cheerio.load(body);
              async.series({
                  title: function (callback) {
                    news[page].title = $('#main-content > div.content > article > div > h1 > span').text();
                    callback(null, news[page].title);
                  },
                  content: function (callback) {
                    let content = $('#main-content > div.content > article > div > div.entry').html();
                    let remove = $('#main-content > div.content > article > div > div.entry > div.share-post').html();
                    callback(null, content.split(remove).join(''));
                  },
                  author: function (callback) {
                    news[page].author = $('#main-content > div.content > article > div > p > span:nth-child(1) > a').text();
                    callback(null, news[page].author);
                  },
                  createDate: function (callback) {
                    callback(null, Date.now());
                  },
                  updateDate: function (callback) {
                    callback(null, Date.now());
                  }
                },
                function (err, result) {
                  news[page].title = result.title;
                  news[page].content = result.content;
                  news[page].author = result.author;
                  news[page].createDate = result.createDate;
                  news[page].updateDate = result.updateDate;
                  checkRestrictedKey(news[page]._id, result.content);
                  news[page].save(function (err) {
                    if (err) {}
                  });
                });
            } else {
              s
            }
            page++;
            next();
          });
        } else {
          page++;
          next();
        }
      },
      function (err) {});
  });
}

//spiderTinNongNghiepUpdateUrlVersion2
function spiderTinNongNghiepUpdateUrlVersion2(url) {
  return new Promise(function (resolve, reject) {
    return News.findById({
      _id: url
    }, function (err, upNews) {
      if (upNews !== null) {
        request(upNews.originalLink, function (err, res, body) {
          if (!err && res.statusCode === 200) {
            var $ = cheerio.load(body);
            async.series({
                title: function (callback) {
                  upNews.title = $('#main-content > div.content > article > div > h1 > span').text();
                  callback(null, upNews.title);
                },
                content: function (callback) {
                  let content = $('#main-content > div.content > article > div > div.entry').html();
                  let remove = $('#main-content > div.content > article > div > div.entry > div.share-post').html();
                  callback(null, content.split(remove).join(''));
                },
                contentText: function (callback) {
                  let content = $('#main-content > div.content > article > div > div.entry').text();
                  callback(null, content);
                },
                author: function (callback) {
                  upNews.author = $('#main-content > div.content > article > div > p > span:nth-child(1) > a').text();
                  callback(null, upNews.author);
                },
                createDate: function (callback) {
                  callback(null, Date.now());
                },
                updateDate: function (callback) {
                  callback(null, Date.now());
                }
              },
              function (err, result) {
                upNews.title = result.title;
                upNews.content = result.content;
                upNews.author = result.author;
                upNews.createDate = result.createDate;
                upNews.updateDate = result.updateDate;
                upNews.contentText = result.contentText;
                console.log(upNews.originalLink);
                checkRestrictedKey(url, result.contentText).then(res => {
                  return upNews.save(function (err) {
                    if (err) {
                      return reject({
                        'message': false
                      });
                    }
                    return resolve({
                      'message': true
                    });
                  });
                });
              });
          } else {
            return reject({
              'message': false
            });
          }
        });
      }
    });
  })
}

//spiderTinNongNghiepUpdateUrl
function spiderTinNongNghiepUpdateUrl(url) {
  News.findById({
    _id: url
  }, function (err, upNews) {
    if (upNews !== null) {
      request(upNews.originalLink, function (err, res, body) {
        if (!err && res.statusCode === 200) {
          var $ = cheerio.load(body);
          async.series({
              title: function (callback) {
                upNews.title = $('#main-content > div.content > article > div > h1 > span').text();
                callback(null, upNews.title);
              },
              content: function (callback) {
                let content = $('#main-content > div.content > article > div > div.entry').html();
                let remove = $('#main-content > div.content > article > div > div.entry > div.share-post').html();
                callback(null, content.split(remove).join(''));
              },
              contentText: function (callback) {
                let content = $('#main-content > div.content > article > div > div.entry').text();
                callback(null, content);
              },
              author: function (callback) {
                upNews.author = $('#main-content > div.content > article > div > p > span:nth-child(1) > a').text();
                callback(null, upNews.author);
              },
              createDate: function (callback) {
                callback(null, Date.now());
              },
              updateDate: function (callback) {
                callback(null, Date.now());
              }
            },
            function (err, result) {
              upNews.title = result.title;
              upNews.content = result.content;
              upNews.author = result.author;
              upNews.createDate = result.createDate;
              upNews.updateDate = result.updateDate;
              console.log(upNews.originalLink);
              checkRestrictedKey(url, result.contentText).then(res => {
                upNews.save(function (err) {
                  if (err) {
                    console.log('error');
                  }
                });
              });
            });
        } else {
          console.log('log die');
        }
      });
    }
  });
}
