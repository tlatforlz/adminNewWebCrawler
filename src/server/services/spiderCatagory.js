var request = require("request");
var cheerio = require("cheerio");
var Spider = require('../dao/spider.dao');
var newsDao = require('../dao/news.dao');
var News = require('./../model/news.model');
var SpiderModel = require('./../model/spider.model');
var async = require('async');
var UrlModel = require('./../model/url.model');
var SpiderService = require('./spider');
var SpiderServiceNongNghiepVietNam = require('./spiderNongNghiepVietNam');
var SpiderServiceBaoDanSinh = require('./spiderBaoDanSinh');
var SpiderServiceKhoaHocTv = require('./spiderKhoaHocTv');
var SpiderServiceKhuyenNong = require('./spiderKhuyenNong');
var SpiderServiceKyThuatNuoiTrong = require('./spiderKyThuatNuoiTrong');
var SpiderServiceThuySanVietNam = require('./spiderThuySanVietNam');

module.exports = {
  spiderCatagoryGetByUrl: spiderCatagoryGetByUrl,
  callSpiderByPath: callSpiderByPath,
  callSpiderByPathUpdate: callSpiderByPathUpdate,

  searchByKey: searchByKey,


  searchByKeyTinNongNghiep: searchByKeyTinNongNghiep,
  searchByKeyNongNghiepVietNam: searchByKeyNongNghiepVietNam,
  searchByKeyBaoDanSinh: searchByKeyBaoDanSinh,
  searchByKeyKhoaHocTv: searchByKeyKhoaHocTv,
  searchByKeyKhuyenNong: searchByKeyKhuyenNong,
  searchByKeyKyThuatNuoiTrong: searchByKeyKyThuatNuoiTrong,
  searchByKeyThuySanVietNam: searchByKeyThuySanVietNam
}

// http://baodansinh.vn/tin-tuc-su-kien-d1/ 
// http://www.thuysanvietnam.com.vn/ky-thuat-c16-5.tsvn
// https://kythuatnuoitrong.edu.vn/trong-trot
// http://www.khuyennongvn.gov.vn/ky-thuat-trong-trot_t113c105
// http://khoahoc.tv/s/k%E1%BB%B9+thu%E1%BA%ADt+tr%E1%BB%93ng+tr%E1%BB%8Dt?p=2

function searchByKeyThuySanVietNam(path, spiderId, categoryId, searchKey) {
  console.log(path);
  return new Promise(function (resolve, reject) {
    if (path === undefined) {
      return reject(false);
    }
    var total = 0;
    var arrayNews = [];
    var orgi = path;
    SpiderModel.findById({
      _id: spiderId
    }).then(spider => {
      console.log(spider);
      UrlModel.findById({
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
                      var i = 1;
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
                          title = $('#main-box-content > div.main-cat-contentleft > div.main-social > div > div > div > ul > li:nth-child(' + i + ') > a.title.video').text();
                          console.log(title);
                          if (image === undefined) {
                            image = null;
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
                        console.log(total);
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
                        if (total >= 50) {
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
    });
  });
}
//chua fix
function searchByKeyKyThuatNuoiTrong(path, spiderId, categoryId, searchKey) {
  return new Promise(function (resolve, reject) {
    if (path === undefined) {
      return reject(false);
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
                  var i = 1;
                  var length = $('.list_news_cate li').length;
                  var temp = new Promise(function (resolve, reject) {
                    $('.list_news_cate li').each(function () {
                      if (length == 0 || length == undefined) {
                        resolve(true);
                      }
                      url = ($('body > div.wrapper > div.grid980 > div.content_main > div.content_bottom.clearfix > div.grid640.fl > div.col440.col440_cate.fl > ul > li:nth-child(' + i + ') > h2 > a').attr('href'));
                      image = $('body > div.wrapper > div.grid980 > div.content_main > div.content_bottom.clearfix > div.grid640.fl > div.col440.col440_cate.fl > ul > li:nth-child(' + i + ') > a > img').attr('src');
                      des = $('body > div.wrapper > div.grid980 > div.content_main > div.content_bottom.clearfix > div.grid640.fl > div.col440.col440_cate.fl > ul > li:nth-child(' + i + ') > div > div.sapo').text();
                      title = $('body > div.wrapper > div.grid980 > div.content_main > div.content_bottom.clearfix > div.grid640.fl > div.col440.col440_cate.fl > ul > li:nth-child(' + i + ') > h2 > a').text();
                      console.log(title);
                      if (image === undefined) {
                        image = null;
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
                    var x = $('.paging a').length;
                    var gotoPage = $('.paging a:nth-child(' + x + ')').attr('href');
                    if (gotoPage === undefined) {
                      return resolve({
                        'total': total,
                        'listNewsId': arrayNews,
                        'status': true
                      });
                    }
                    if (total >= 200) {
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
          },
          function (err, result) {
            path = orgi + result.gotoPage;
            next();
          });
      },
      function (err) {
        return resolve(true);
      })
  });
}
//chua fix
function searchByKeyKhuyenNong(path, spiderId, categoryId, searchKey) {
  return new Promise(function (resolve, reject) {
    if (path === undefined) {
      return reject(false);
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
                  var i = 1;
                  var length = $('.list_news_cate li').length;
                  var temp = new Promise(function (resolve, reject) {
                    $('.list_news_cate li').each(function () {
                      if (length == 0 || length == undefined) {
                        resolve(true);
                      }
                      url = ($('body > div.wrapper > div.grid980 > div.content_main > div.content_bottom.clearfix > div.grid640.fl > div.col440.col440_cate.fl > ul > li:nth-child(' + i + ') > h2 > a').attr('href'));
                      image = $('body > div.wrapper > div.grid980 > div.content_main > div.content_bottom.clearfix > div.grid640.fl > div.col440.col440_cate.fl > ul > li:nth-child(' + i + ') > a > img').attr('src');
                      des = $('body > div.wrapper > div.grid980 > div.content_main > div.content_bottom.clearfix > div.grid640.fl > div.col440.col440_cate.fl > ul > li:nth-child(' + i + ') > div > div.sapo').text();
                      title = $('body > div.wrapper > div.grid980 > div.content_main > div.content_bottom.clearfix > div.grid640.fl > div.col440.col440_cate.fl > ul > li:nth-child(' + i + ') > h2 > a').text();
                      console.log(title);
                      if (image === undefined) {
                        image = null;
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
                    var x = $('.paging a').length;
                    var gotoPage = $('.paging a:nth-child(' + x + ')').attr('href');
                    if (gotoPage === undefined) {
                      return resolve({
                        'total': total,
                        'listNewsId': arrayNews,
                        'status': true
                      });
                    }
                    if (total >= 200) {
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
          },
          function (err, result) {
            path = orgi + result.gotoPage;
            next();
          });
      },
      function (err) {
        return resolve(true);
      })
  });
}
//chua fix
function searchByKeyKhoaHocTv(path, spiderId, categoryId, searchKey) {
  return new Promise(function (resolve, reject) {
    if (path === undefined) {
      return reject(false);
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
                  var i = 1;
                  var length = $('.list_news_cate li').length;
                  var temp = new Promise(function (resolve, reject) {
                    $('.list_news_cate li').each(function () {
                      if (length == 0 || length == undefined) {
                        resolve(true);
                      }
                      url = ($('body > div.wrapper > div.grid980 > div.content_main > div.content_bottom.clearfix > div.grid640.fl > div.col440.col440_cate.fl > ul > li:nth-child(' + i + ') > h2 > a').attr('href'));
                      image = $('body > div.wrapper > div.grid980 > div.content_main > div.content_bottom.clearfix > div.grid640.fl > div.col440.col440_cate.fl > ul > li:nth-child(' + i + ') > a > img').attr('src');
                      des = $('body > div.wrapper > div.grid980 > div.content_main > div.content_bottom.clearfix > div.grid640.fl > div.col440.col440_cate.fl > ul > li:nth-child(' + i + ') > div > div.sapo').text();
                      title = $('body > div.wrapper > div.grid980 > div.content_main > div.content_bottom.clearfix > div.grid640.fl > div.col440.col440_cate.fl > ul > li:nth-child(' + i + ') > h2 > a').text();
                      console.log(title);
                      if (image === undefined) {
                        image = null;
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
                    var x = $('.paging a').length;
                    var gotoPage = $('.paging a:nth-child(' + x + ')').attr('href');
                    if (gotoPage === undefined) {
                      return resolve({
                        'total': total,
                        'listNewsId': arrayNews,
                        'status': true
                      });
                    }
                    if (total >= 200) {
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
          },
          function (err, result) {
            path = orgi + result.gotoPage;
            next();
          });
      },
      function (err) {
        return resolve(true);
      })
  });
}

function searchByKeyBaoDanSinh(path, spiderId, categoryId, searchKey) {
  return new Promise(function (resolve, reject) {
    if (path === undefined) {
      return reject(false);
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
                  var i = 1;
                  var length = $('.list_news_cate li').length;
                  var temp = new Promise(function (resolve, reject) {
                    $('.list_news_cate li').each(function () {
                      if (length == 0 || length == undefined) {
                        resolve(true);
                      }
                      url = ($('body > div.wrapper > div.grid980 > div.content_main > div.content_bottom.clearfix > div.grid640.fl > div.col440.col440_cate.fl > ul > li:nth-child(' + i + ') > h2 > a').attr('href'));
                      image = $('body > div.wrapper > div.grid980 > div.content_main > div.content_bottom.clearfix > div.grid640.fl > div.col440.col440_cate.fl > ul > li:nth-child(' + i + ') > a > img').attr('src');
                      des = $('body > div.wrapper > div.grid980 > div.content_main > div.content_bottom.clearfix > div.grid640.fl > div.col440.col440_cate.fl > ul > li:nth-child(' + i + ') > div > div.sapo').text();
                      title = $('body > div.wrapper > div.grid980 > div.content_main > div.content_bottom.clearfix > div.grid640.fl > div.col440.col440_cate.fl > ul > li:nth-child(' + i + ') > h2 > a').text();
                      console.log(title);
                      if (image === undefined) {
                        image = null;
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
                    var x = $('.paging a').length;
                    var gotoPage = $('.paging a:nth-child(' + x + ')').attr('href');
                    if (gotoPage === undefined) {
                      return resolve({
                        'total': total,
                        'listNewsId': arrayNews,
                        'status': true
                      });
                    }
                    if (total >= 200) {
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
          },
          function (err, result) {
            path = orgi + result.gotoPage;
            next();
          });
      },
      function (err) {
        return resolve(true);
      })
  });
}

function searchByKeyNongNghiepVietNam(path, spiderId, categoryId, searchKey) {
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
                      url = ($('#wrapper > div > div.content > div.post-listing.archive-box > article:nth-child(' + i + ') > h2 > a').attr('href'));
                      image = $('#wrapper > div > div.content > div.post-listing.archive-box > article:nth-child(' + i + ') > div.post-thumbnail > a > img').attr('src');
                      des = $('#wrapper > div > div.content > div.post-listing.archive-box > article:nth-child(' + i + ') > div.entry > p').text();
                      title = $('#wrapper > div > div.content > div.post-listing.archive-box > article:nth-child(' + i + ') > h2 > a').text().toLowerCase();

                      if (image === undefined) {
                        image = null;
                      } else {
                        image = image.split('-310x165').join('');
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
        console.log(crawlingName);
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
        if (crawlingName === 'spiderTinNongNghiepVietNam') {
          return UrlModel.findById({
            _id: res.urlId
          }).then(url => {
            var total = 0;
            var index = 1;
            var listNewsId = [];
            var t = new Promise(function (resolve, reject) {
              url.path.forEach(element => {
                var host = url.hostname + element.namePath;
                searchByKeyNongNghiepVietNam(host, res._id, element.catelogyId, searchKey).then(res => {
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
        if (crawlingName === 'spiderBaoDanSinh') {
          return UrlModel.findById({
            _id: res.urlId
          }).then(url => {
            var total = 0;
            var index = 1;
            var listNewsId = [];
            var t = new Promise(function (resolve, reject) {
              url.path.forEach(element => {
                var host = url.hostname + element.namePath;
                searchByKeyBaoDanSinh(host, res._id, element.catelogyId, searchKey).then(res => {
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
        if (crawlingName === 'spiderKhoaHocTv') {
          return UrlModel.findById({
            _id: res.urlId
          }).then(url => {
            var total = 0;
            var index = 1;
            var listNewsId = [];
            var t = new Promise(function (resolve, reject) {
              url.path.forEach(element => {
                var host = url.hostname + element.namePath;
                searchByKeyKhoaHocTv(host, res._id, element.catelogyId, searchKey).then(res => {
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
        if (crawlingName === 'spiderKhuyenNong') {
          return UrlModel.findById({
            _id: res.urlId
          }).then(url => {
            var total = 0;
            var index = 1;
            var listNewsId = [];
            var t = new Promise(function (resolve, reject) {
              url.path.forEach(element => {
                var host = url.hostname + element.namePath;
                searchByKeyKhuyenNong(host, res._id, element.catelogyId, searchKey).then(res => {
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
        if (crawlingName === 'spiderKyThuatNuoiTrong') {
          return UrlModel.findById({
            _id: res.urlId
          }).then(url => {
            var total = 0;
            var index = 1;
            var listNewsId = [];
            var t = new Promise(function (resolve, reject) {
              url.path.forEach(element => {
                var host = url.hostname + element.namePath;
                searchByKeyKyThuatNuoiTrong(host, res._id, element.catelogyId, searchKey).then(res => {
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
        if (crawlingName === 'spiderThuySanVietNam') {
          return UrlModel.findById({
            _id: res.urlId
          }).then(url => {
            var total = 0;
            var index = 1;
            var listNewsId = [];
            var t = new Promise(function (resolve, reject) {
              url.path.forEach(element => {
                var host = url.hostname + element.namePath;
                searchByKeyThuySanVietNam(host, res._id, element.catelogyId, searchKey).then(res => {
                  var y = 0;
                  res.listNewsId.forEach(news => {
                    listNewsId.push(news);
                  });
                  total += res.total;
                  if (total >= 50) {
                    console.log(listNewsId.length);
                    resolve(true);
                  }
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
            return SpiderService.getPathUpdateSpiderTinNongNghiep(host, res._id, catelogyId).then(function (res) {
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
            return SpiderServiceNongNghiepVietNam.getPathUpdateNongNghiepVietNam(host, res._id, catelogyId).then(function (res) {
                return resolve(res);
              })
              .catch(function (err) {
                console.log(err);
              });
          })
        }
        if (crawlingName === 'spiderBaoDanSinh') {
          return UrlModel.findById({
            _id: res.urlId
          }).then(url => {
            var host = url.hostname + namePath;
            return SpiderServiceKhoaHocTv.getPathUpdateKhoaHocTv(host, res._id, catelogyId).then(function (res) {
                return resolve(res);
              })
              .catch(function (err) {
                console.log(err);
              });
          })
        }
        if (crawlingName === 'spiderKhoaHocTv') {
          return UrlModel.findById({
            _id: res.urlId
          }).then(url => {
            var host = url.hostname + namePath;
            return SpiderServiceKhoaHocTv.getPathUpdateKhoaHocTv(host, res._id, catelogyId).then(function (res) {
                return resolve(res);
              })
              .catch(function (err) {
                console.log(err);
              });
          })
        }
        if (crawlingName === 'spiderKhuyenNong') {
          return UrlModel.findById({
            _id: res.urlId
          }).then(url => {
            var host = url.hostname + namePath;
            return SpiderServiceKhuyenNong.getPathUpdateKhuyenNong(host, res._id, catelogyId).then(function (res) {
                return resolve(res);
              })
              .catch(function (err) {
                console.log(err);
              });
          })
        }
        if (crawlingName === 'spiderKyThuatNuoiTrong') {
          return UrlModel.findById({
            _id: res.urlId
          }).then(url => {
            var host = url.hostname + namePath;
            return SpiderServiceKyThuatNuoiTrong.getPathUpdateKyThuatNuoiTrong(host, res._id, catelogyId).then(function (res) {
                return resolve(res);
              })
              .catch(function (err) {
                console.log(err);
              });
          })
        }
        if (crawlingName === 'spiderThuySanVietNam') {
          return UrlModel.findById({
            _id: res.urlId
          }).then(url => {
            var host = url.hostname + namePath;
            return SpiderServiceThuySanVietNam.getPathUpdateThuySanVietNam(host, res._id, catelogyId).then(function (res) {
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
            return SpiderService.getPathspiderTinNongNghiep(host, res._id, catelogyId).then(function (res) {
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
            return SpiderServiceNongNghiepVietNam.getPathNongNghiepVietNam(host, res._id, catelogyId).then(function (res) {
                return resolve(res);
              })
              .catch(function (err) {
                console.log(err);
              });
          })
        }
        if (crawlingName === 'spiderBaoDanSinh') {
          return UrlModel.findById({
            _id: res.urlId
          }).then(url => {
            var host = url.hostname + namePath;
            return SpiderServiceBaoDanSinh.getPathBaoDanSinh(host, res._id, catelogyId).then(function (res) {
                return resolve(res);
              })
              .catch(function (err) {
                console.log(err);
              });
          })
        }
        if (crawlingName === 'spiderKhoaHocTv') {
          return UrlModel.findById({
            _id: res.urlId
          }).then(url => {
            var host = url.hostname + namePath;
            return SpiderServiceKhoaHocTv.getPathKhoaHocTv(host, res._id, catelogyId).then(function (res) {
                return resolve(res);
              })
              .catch(function (err) {
                console.log(err);
              });
          })
        }
        if (crawlingName === 'spiderKhuyenNong') {
          return UrlModel.findById({
            _id: res.urlId
          }).then(url => {
            var host = url.hostname + namePath;
            return SpiderServiceKhuyenNong.getPathKhuyenNong(host, res._id, catelogyId).then(function (res) {
                return resolve(res);
              })
              .catch(function (err) {
                console.log(err);
              });
          })
        }
        if (crawlingName === 'spiderKyThuatNuoiTrong') {
          return UrlModel.findById({
            _id: res.urlId
          }).then(url => {
            var host = url.hostname + namePath;
            return SpiderServiceKyThuatNuoiTrong.getPathKyThuatNuoiTrong(host, res._id, catelogyId).then(function (res) {
                return resolve(res);
              })
              .catch(function (err) {
                console.log(err);
              });
          })
        }
        if (crawlingName === 'spiderThuySanVietNam') {
          return UrlModel.findById({
            _id: res.urlId
          }).then(url => {
            var host = url.hostname + namePath;
            return SpiderServiceThuySanVietNam.getPathThuySanVietNam(host, res._id, catelogyId).then(function (res) {
                console.log('hihih ' + res);
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
            console.log(Url.hostname);
            var lengthHeader = $('header, nav, .mainMenu, .header, .nav, #nav').find('a').length;
            var FirstPromise = new Promise(function (resolve, reject) {
              $('header, nav, .mainMenu, .header, .nav, #nav').find('a').each(function () {
                var url = $(this).attr('href');
                console.log(url);
                if (url.indexOf(Url.hostname) !== -1 && url.split(Url.hostname)[1] !== '/') {
                  if (url.trim() !== "http://www.thuysanvietnam.com.vn") {
                    arrayPath.push(url);
                  }
                }
                if (url.indexOf(url.hostname) === -1 && url.trim() !== "http://www.thuysanvietnam.com.vn") {
                  arrayPath.push(Url.hostname + url);
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
