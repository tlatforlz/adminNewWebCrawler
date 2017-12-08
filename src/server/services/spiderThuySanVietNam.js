var request = require("request");
var cheerio = require("cheerio");
var Spider = require('../dao/spider.dao');
var newsDao = require('../dao/news.dao');
var News = require('./../model/news.model');
var Url = require('./../model/url.model');
var SpiderModel = require('./../model/spider.model');
var async = require('async');
var restrictDao = require('./../dao/restrict.dao');

module.exports = {
  spiderCountUpdateAll: spiderCountUpdateAll,

  spiderThuySanVietNam: spiderThuySanVietNam,
  spiderThuySanVietNamUpdateAll: spiderThuySanVietNamUpdateAll,
  spiderThuySanVietNamPath: spiderThuySanVietNamPath,
  spiderThuySanVietNamUpdatePath: spiderThuySanVietNamUpdatePath,
  spiderThuySanVietNamUrl: spiderThuySanVietNamUrl,
  spiderThuySanVietNamUpdateUrl: spiderThuySanVietNamUpdateUrl,
  spiderThuySanVietNamUpdateUrlVersion2: spiderThuySanVietNamUpdateUrlVersion2,
  getPathThuySanVietNam: getPathThuySanVietNam,
  getPathUpdateThuySanVietNam: getPathUpdateThuySanVietNam,

  checkRestrictedKey: checkRestrictedKey
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

//spiderThuySanVietNam
function spiderThuySanVietNam(urlId, spiderId) {
  return new Promise(function (resolve, reject) {
    var page = 0;

    async.whilst(function () {
        return page < urlId.path.length;
      },
      function (next) {
        var disUrl = urlId.hostname + urlId.path[page].namePath;
        console.log(disUrl);
        console.log(urlId.path[page]);
        getPathThuySanVietNam(disUrl, spiderId, urlId.path[page].catelogyId).then(function (res) {
          page++;
          console.log(page);
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

//getPathThuySanVietNam
function getPathThuySanVietNam(path, spiderId, catelogyId) {
  return new Promise(function (resolve, reject) {
    if (path === undefined) {
      return resolve(true);
    }
    var total = 0;
    var arrayNews = [];
    var orgi = path;
    SpiderModel.findById({
      _id: spiderId
    }).then(spider => {
      console.log(spider);
      Url.findById({
        _id: spider.urlId
      }).then(urlHost => {
        console.log(urlHost);
        async.whilst(function () {
            return path !== undefined
          }, function (next) {
            async.series({
                gotoPage: function (callback) {
                  request(path, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                      var $ = cheerio.load(body);
                      let i = 1;
                      var length = $('.main-cat-contentleft li').length
                      if (length === 0) {
                        resolve(true);
                      }
                      var temp = new Promise(function (resolve, reject) {
                        $('.main-cat-contentleft li').each(function () {
                          if (length == 0 || length == undefined) {
                            resolve(true);
                          }
                          url = urlHost.hostname + $('#main-box-content > div.main-cat-contentleft > div.main-social > div > div > div > ul > li:nth-child(' + i + ') > a.title.video').attr('href');
                          image = $('#main-box-content > div.main-cat-contentleft > div.main-social > div > div > div > ul > li:nth-child(' + i + ') > a > img').attr('src');
                          des = $('#main-box-content > div.main-cat-contentleft > div.main-social > div > div > div > ul > li:nth-child(' + i + ') > p').text();
                          if (image === undefined) {
                            image = null;
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
                              if (news.originalLink === undefined || news.originalLink === '') {
                                resolve(true);
                              }
                              total++;
                              if (total === 500) {
                                resolve(true);
                              }
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
                        var page = $('#main-box-content > div.main-cat-contentleft > div.view-all > a');
                        var gotoPage = urlHost.hostname + $('#main-box-content > div.main-cat-contentleft > div.view-all > a').attr('href');
                        if (page.length != 1) {
                          gotoPage = urlHost.hostname + $('#main-box-content > div.main-cat-contentleft > div.view-all > a:nth-child(2)').attr('href');
                        }
                        console.log('fucking ' + gotoPage);
                        if (gotoPage === undefined) {
                          return resolve({
                            'total': total,
                            'listNewsId': arrayNews,
                            'status': true
                          });
                        }
                        if (total >= 500) {
                          return resolve({
                            'total': total,
                            'listNewsId': arrayNews,
                            'status': true
                          });
                        }
                        callback(null, gotoPage);
                      })
                    } else {
                      return resolve({
                        'total': total,
                        'listNewsId': arrayNews,
                        'status': true
                      });
                    }
                  });
                }
              },
              function (err, result) {
                path = result.gotoPage;
                next();
              });
          },
          function (err) {
            return resolve(true);
          })
      })
    })
  });
}

//spiderNongNghiepPath
function spiderThuySanVietNamPath(urlId, spiderId, catelogyId) {
  urlId.path.forEach(url => {
    if (url.catelogyId.equals(catelogyId)) {
      var disUrl = urlId.hostname + url.namePath;
      getPathThuySanVietNam(disUrl, spiderId, url.catelogyId);
    }
  });
}

//spiderThuySanVietNamUrl
function spiderThuySanVietNamUrl(urlId, spiderId, url) {
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

//spiderThuySanVietNamUpdateAll
function spiderThuySanVietNamUpdateAll() {
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
                    news[page].title = $('.ct-entry h1').text();
                    callback(null, news[page].title);
                  },
                  content: function (callback) {
                    //#the-post > div
                    let content = $('.ct-entry').html();
                    //#post-ratings-2150
                    callback(null, content);
                  },
                  author: function (callback) {
                    let author = "Báo Thủy Sản Việt Nam";
                    news[page].author = author;
                    callback(null, news[page].author);
                  },
                  createDate: function (callback) {
                    var date = Date.now();
                    callback(null, date);
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

//spiderThuySanVietNamUpdatePath
function spiderThuySanVietNamUpdatePath(categoryId) {
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
                    news[page].title = $('.ct-entry h1').text();
                    callback(null, news[page].title);
                  },
                  content: function (callback) {
                    let content = $('.ct-entry').html();
                    callback(null, content);
                  },
                  author: function (callback) {
                    let author = "Báo Thủy Sản Việt Nam";
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
                  console.log(news[page].createDate);
                  news[page].save(function (err) {
                    if (err) {
                      console.log('error');
                    }
                  });
                });
            } else {
              console.log('log die');
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

//spiderThuySanVietNamUpdateUrl
function spiderThuySanVietNamUpdateUrl(url) {
  News.findById({
    _id: url
  }, function (err, news) {
    if (news !== null) {
      request(news.originalLink, function (err, res, body) {
        if (!err && res.statusCode === 200) {
          var $ = cheerio.load(body);
          async.series({
              title: function (callback) {
                news.title = $('.ct-entry h1').text();
                callback(null, news.title);
              },
              content: function (callback) {
                let content = $('.ct-entry').html().split($('.ct-time-public').html()).join('').split('.comments-section').join('').split('.ct-other').join('').split('.ct-other').join('');
                //#the-post > div > div.entry > div
                // let remove_review_overview = $('#main-content > div.content > article > div > div.entry > div.review-box.review-top.review-stars').html();
                callback(null, content);
              },
              contentText: function (callback) {
                let content = $('.ct-entry').text();
                callback(null, content);
              },
              author: function (callback) {
                let author = "Báo Thủy Sản Việt Nam";
                news.author = author;
                callback(null, news.author);
              },
              createDate: function (callback) {
                callback(null, Date.now());
              },
              updateDate: function (callback) {
                callback(null, Date.now());
              }
            },
            function (err, result) {
              news.title = result.title;
              news.content = result.content;
              news.author = result.author;
              news.createDate = Date.now();
              news.updateDate = result.updateDate;
              console.log(news.originalLink);
              checkRestrictedKey(url, result.contentText).then(res => {
                news.save(function (err) {
                  if (err) {
                    console.log('error');
                  }
                });
              });
            });
        } else {}
      });
    }
  });
}

function spiderThuySanVietNamUpdateUrlVersion2(url) {
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
                  upNews.title = $('.ct-entry h1').text();
                  callback(null, upNews.title);
                },
                content: function (callback) {
                  let content = $('.ct-entry').html().split($('.ct-time-public').html()).join('').split('.comments-section').join('').split('.ct-other').join('').split('.ct-other').join('');
                  callback(null, content);
                },
                contentText: function (callback) {
                  let content = $('.ct-entry').text();
                  callback(null, content);
                },
                author: function (callback) {
                  upNews.author = "Báo Thủy Sản Việt Nam";
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

function getPathUpdateThuySanVietNam(path, spiderId, catelogyId) {
  return new Promise(function (resolve, reject) {
    if (path === undefined) {
      return resolve(true);
    }
    var total = 0;
    var arrayNews = [];
    var orgi = path;
    async.whilst(function () {
        return path !== undefined
      }, function (next) {
        async.series({
            gotoPage: function (callback) {
              request(path, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                  var $ = cheerio.load(body);
                  let i = 1;
                  var length = $('.main-cat-contentleft li').length;
                  if (length === 0) {
                    resolve(true);
                  }
                  var temp = new Promise(function (resolve, reject) {
                    $('.main-cat-contentleft li').each(function () {
                      if (length == 0 || length == undefined) {
                        resolve(true);
                      }
                      url = urlHost.hostname + $('#main-box-content > div.main-cat-contentleft > div.main-social > div > div > div > ul > li:nth-child(' + i + ') > a.title.video').attr('href');
                      image = $('#main-box-content > div.main-cat-contentleft > div.main-social > div > div > div > ul > li:nth-child(' + i + ') > a > img').attr('src');
                      des = $('#main-box-content > div.main-cat-contentleft > div.main-social > div > div > div > ul > li:nth-child(' + i + ') > p').text();
                      if (image === undefined) {
                        image = null;
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
                          arrayNews.push(news._id);
                          news.save();
                        } else {
                          New.updateDate = Date.now();
                          arrayNews.push(New._id);
                          New.save();
                        }
                        total++;
                        if (total === 500) {
                          resolve(true);
                        }
                      });
                      i++;
                      if (i == length) {
                        resolve(true);
                      }
                    });
                  });
                  temp.then(function (res) {
                    var page = $('#main-box-content > div.main-cat-contentleft > div.view-all > a');
                    var gotoPage = urlHost.hostname + $('#main-box-content > div.main-cat-contentleft > div.view-all > a').attr('href');
                    if (page.length != 1) {
                      gotoPage = urlHost.hostname + $('#main-box-content > div.main-cat-contentleft > div.view-all > a:nth-child(2)').attr('href');
                    }
                    if (gotoPage === undefined) {
                      return resolve({
                        'total': total,
                        'listNewsId': arrayNews,
                        'status': true
                      });
                    }
                    if (total >= 500) {
                      return resolve({
                        'total': total,
                        'listNewsId': arrayNews,
                        'status': true
                      });
                    }
                    callback(null, gotoPage);
                  })
                } else {
                  return resolve({
                    'total': total,
                    'listNewsId': arrayNews,
                    'status': true
                  });
                }
              });
            }
          },
          function (err, result) {
            path = result.gotoPage;
            next();
          });
      },
      function (err) {
        return resolve(true);
      })
  });
}
