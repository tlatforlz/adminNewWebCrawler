var Spider = require('./../model/spider.model');
var NewsDao = require('./news.dao.js');
var successMessage = require('./../services/successMessage');
var failMessage = require('./../services/failMessage');
var SpiderTinNongNghiep = require('./../services/spider');
var SpiderNongNghiepVietNam = require('./../services/spiderNongNghiepVietNam');
var SpiderBaoDanSinh = require('./../services/spiderBaoDanSinh');
var SpiderCatgory = require('./../services/spiderCatagory');
var SpiderKhoaHocTv = require('./../services/spiderKhoaHocTv');
var SpiderKhuyenNong = require('./../services/spiderKhuyenNong');
var SpiderKyThuatNuoiTrong = require('./../services/spiderKyThuatNuoiTrong');
var SpiderThuySanVietNam = require('./../services/spiderThuySanVietNam');


var News = require('./../model/news.model');
var async = require('async');

module.exports = {
  createSpider: createSpider,
  getAllSpider: getAllSpider,
  getSpiderById: getSpiderById,
  updateSpider: updateSpider,
  deleteSpider: deleteSpider,
  callSpider: callSpider,
  updateNewsSpider: updateNewsSpider,
  callSpiderPath: callSpiderPath,
  updateNewsSpiderPath: updateNewsSpiderPath,
  callSpiderUrl: callSpiderUrl,
  updateNewsSpiderUrl: updateNewsSpiderUrl,
  testSpider: testSpider,
  getNewsCall: getNewsCall,
  getNewsCallLimit: getNewsCallLimit,
  getNewsNone: getNewsNone,
  countSpider: countSpider,

  getCategoryByUrl: getCategoryByUrl,
  callSpiderByPath: callSpiderByPath,
  callSpiderByPathUpdate: callSpiderByPathUpdate,
  getSpiderByCrawlingName: getSpiderByCrawlingName,
  updateNewsSpiderUrlByNewsId: updateNewsSpiderUrlByNewsId,
  getNewsByDate: getNewsByDate,


  searchByKey: searchByKey
};

function searchByKey(request) {
  return new Promise(function (resolve, reject) {
    return SpiderCatgory.searchByKey(request.crawlingName, request.searchKey)
      .then(function (res) {
        return resolve(res);
      })
      .catch(function (err) {
        return reject(err);
      })
  });
}

//callSpiderByPath
function callSpiderByPathUpdate(request) {
  return new Promise(function (resolve, reject) {
    return SpiderCatgory.callSpiderByPathUpdate(request.crawlingName, request.namePath, request.catelogyId)
      .then(function (res) {
        return resolve(res);
      })
      .catch(function (err) {
        return reject(err);
      })
  });
}

function getNewsByDate(request) {
  return News.find({
      spiderId: request.spiderId,
      updateDate: {
        $gt: request.startDate,
      }
    }).exec()
    .then(res => {
      return Promise.resolve(res);
    })
    .catch(err => {
      return Promise.reject(err);
    });
}

function getSpiderByCrawlingName(callingName) {
  return new Promise(function (resolve, reject) {
    return Spider.findOne({
        crawlingNane: callingName
      }).exec()
      .then(function (res) {
        return resolve(res._id);
      })
      .catch(function (err) {
        return reject(err);
      });
  });
}
//callSpiderByPath
function callSpiderByPath(request) {
  return new Promise(function (resolve, reject) {
    return SpiderCatgory.callSpiderByPath(request.crawlingName, request.namePath, request.catelogyId)
      .then(function (res) {
        return resolve(res);
      })
      .catch(function (err) {
        return reject(err);
      })
  });
}
//getCategoryByUrl
function getCategoryByUrl(request) {
  return new Promise(function (resolve, reject) {
    SpiderCatgory.spiderCatagoryGetByUrl(request.urlId)
      .then(function (res) {
        return resolve(res);
      })
      .catch(function (err) {
        return reject(err);
      })
  });
}

//getNewsNone
function countSpider(request) {
  return Spider.find().exec()
    .then(function (res) {
      return Promise.resolve({
        spider: res.length
      })
    })
}


function getNewsNone(request) {
  return News.find({
      spiderId: request._id,
      content: undefined
    }).exec()
    .then(function (res) {
      return Promise.resolve({
        news: res
      })
    })
}


//getNewsNone
function getNewsNone(request) {
  return News.find({
      spiderId: request._id,
      content: undefined
    }).exec()
    .then(function (res) {
      return Promise.resolve({
        news: res
      })
    })
}

function getNewsCallLimit(request) {
  return News.find({
      spiderId: request._id
    })
    .limit(parseInt(request.limit))
    .sort({
      'updateDate': -1
    })
    .exec()
    .then(function (res) {
      return Promise.resolve({
        news: res
      })
    })
}

function getNewsCall(request) {
  return News.find({
      spiderId: request._id
    })
    .sort({
      'updateDate': -1
    })
    .exec()
    .then(function (res) {
      return Promise.resolve({
        news: res
      });
    });
}

function testSpider(request) {
  return new Promise(function (resolve, reject) {
    SpiderTinNongNghiep.spiderCountUpdateAll(request.crawlingName)
      .then(function (spider) {
        return resolve({
          messsage: successMessage.spider.callSpider,
          spider: spider
        });
      })
      .catch(function (err) {
        return reject({
          spider: err
        });
      })
  })

}

function createSpider(request) {
  var newSpider = new Spider({
    urlId: request.urlId,
    name: request.name,
    crawlingName: request.crawlingName
  });
  return Spider.findOne({
      $or: [{
        crawlingName: request.crawlingName
      }, {
        name: request.name
      }]
    }).exec()
    .then(function (spider) {
      if (spider !== null) {
        return Promise.reject({
          message: failMessage.spider.dupplicate
        });
      }
      return newSpider.save().then(function (err) {
        return Promise.resolve({
          message: successMessage.spider.create
        });
      });
    });
}

function getAllSpider() {
  return Spider.find().exec()
    .then(function (spiders) {
      if (spiders.length === 0) {
        return Promise.reject({
          message: failMessage.spider.notFound
        });
      }
      return Promise.resolve({
        message: successMessage.spider.getAll,
        spiders: spiders
      });
    });
}

function getSpiderById(request) {
  return Spider.findOne({
    _id: request.id
  }).exec().then(function (spider) {
    if (spider === null) {
      return Promise.reject({
        message: failMessage.spider.notFound
      });
    }
    return Promise.resolve({
      message: successMessage.spider.get,
      spider: spider
    });
  });
}

function updateSpider(request) {
  return Spider.findById({
    _id: request.id
  }).exec().then(function (spider) {
    if (spider === null) {
      return Promise.reject({
        message: failMessage.spider.notFound
      });
    }
    if (request.urlId !== undefined && request.urlId !== '') {
      spider.urlId = request.urlId;
    }
    if (request.name !== undefined && request.name !== '') {
      spider.name = request.name;
    }
    if (request.isSourceUpdated !== undefined && request.isSourceUpdated !== '') {
      spider.isSourceUpdated = request.isSourceUpdated;
    }
    if (request.isActive !== undefined && request.isActive !== '') {
      spider.isActive = request.isActive;
    }
    if (request.crawlingName !== undefined && request.crawlingName !== '') {
      spider.crawlingName = request.crawlingName;
    }
    spider.updateDate = Date.now();
    return Spider.findOne({
        _id: {
          $ne: request.id
        },
        $or: [{
          crawlingName: request.crawlingName
        }, {
          name: request.name
        }]
      }).exec()
      .then(function (spiders) {
        if (spiders !== null) {
          return Promise.reject({
            message: failMessage.spider.dupplicate
          });
        }
        return spider.save().then(function (err) {
          return Promise.resolve({
            message: successMessage.spider.update,
            spider: spider
          });
        });
      });
  });
}

function deleteSpider(request) {
  return Spider.findByIdAndRemove({
    _id: request.id
  }).exec().then(function (err) {
    if (!err) {
      return Promise.reject({
        message: failMessage.spider.notFound
      });
    }
    return Promise.resolve({
      message: successMessage.spider.delete
    });
  });
}

function callSpider(request) {
  return Spider.findOne({
      crawlingName: request.crawlingName
    })
    .populate('urlId')
    .exec()
    .then(function (spider) {
      if (spider === null) {
        return Promise.reject({
          message: failMessage.spider.notFound
        });
      }
      return new Promise(function (resolve, reject) {
        async.series({
          length: function (callback) {
            switch (request.crawlingName) {
              case 'spiderTinNongNghiep':
                SpiderTinNongNghiep.spiderTinNongNghiep(spider.urlId, spider._id).then(function (res) {
                  callback(null, res);
                });;

              case 'spiderTinNongNghiepVietNam':
                SpiderNongNghiepVietNam.spiderNongNghiepVietNam(spider.urlId, spider._id).then(function (res) {
                  callback(null, res);
                });
              case 'spiderBaoDanSinh':
                SpiderBaoDanSinh.getPathBaoDanSinh(spider.urlId, spider._id).then(function (res) {
                  callback(null, res);
                });
              case 'spiderKhoaHocTv':
                SpiderKhoaHocTv.getPathKhoaHocTv(spider.urlId, spider._id).then(function (res) {
                  callback(null, res);
                });
              case 'spiderKhuyenNong':
                SpiderKhuyenNong.getPathKhuyenNong(spider.urlId, spider._id).then(function (res) {
                  callback(null, res);
                });
              case 'spiderKyThuatNuoiTrong':
                SpiderKyThuatNuoiTrong.getPathKyThuatNuoiTrong(spider.urlId, spider._id).then(function (res) {
                  callback(null, res);
                });
              case 'spiderThuySanVietNam':
                SpiderThuySanVietNam.getPathThuySanVietNam(spider.urlId, spider._id).then(function (res) {
                  callback(null, res);
                });
            }
          }
        }, function (err, result) {
          return resolve({
            messsage: successMessage.spider.callSpider,
            spider: result.length
          });
        })
      });
    });
}

function updateNewsSpider(request) {
  return Spider.findOne({
      crawlingName: request.crawlingName
    })
    .exec()
    .then(function (spider) {
      if (spider === null) {
        return Promise.reject({
          message: failMessage.spider.notFound
        });
      }
      return new Promise(function (resolve, reject) {
        switch (request.crawlingName) {
          case 'spiderTinNongNghiep':
            SpiderTinNongNghiep.spiderTinNongNghiepUpdateAll();
            break;
          case 'spiderTinNongNghiepVietNam':
            SpiderNongNghiepVietNam.spiderNongNghiepVietNamUpdateAll();
            break;
          case 'spiderBaoDanSinh':
            SpiderBaoDanSinh.spiderBaoDanSinhUpdateAll();
            break;
          case 'spiderKhoaHocTv':
            SpiderKhoaHocTv.spiderKhoaHocTvUpdateAll();
            break;
          case 'spiderKhuyenNong':
            SpiderKhuyenNong.spiderKhuyenNongUpdateAll();
            break;
          case 'spiderKyThuatNuoiTrong':
            SpiderKyThuatNuoiTrong.spiderKyThuatNuoiTrongUpdateAll();
            break;
          case 'spiderThuySanVietNam':
            SpiderThuySanVietNam.spiderThuySanVietNamUpdateAll();
            break;
        }

        async.series({
          length: function (callback) {
            switch (request.crawlingName) {
              case 'spiderTinNongNghiep':
                SpiderTinNongNghiep.spiderCountUpdateAll(request.crawlingName)
                  .then(function (result1) {
                    callback(null, result1.length);
                  });
                break;
              case 'spiderTinNongNghiepVietNam':
                SpiderNongNghiepVietNam.spiderCountUpdateAll(request.crawlingName)
                  .then(function (result1) {
                    callback(null, result1.length);
                  });
                break;
              case 'spiderBaoDanSinh':
                SpiderBaoDanSinh.spiderCountUpdateAll(request.crawlingName)
                  .then(function (result1) {
                    callback(null, result1.length);
                  });
                break;
              case 'spiderKhoaHocTv':
                SpiderKhoaHocTv.spiderCountUpdateAll(request.crawlingName)
                  .then(function (result1) {
                    callback(null, result1.length);
                  });
                break;
              case 'spiderKhuyenNong':
                SpiderKhuyenNong.spiderCountUpdateAll(request.crawlingName)
                  .then(function (result1) {
                    callback(null, result1.length);
                  });
                break;
              case 'spiderKyThuatNuoiTrong':
                SpiderKyThuatNuoiTrong.spiderCountUpdateAll(request.crawlingName)
                  .then(function (result1) {
                    callback(null, result1.length);
                  });
                break;
              case 'spiderThuySanVietNam':
                SpiderThuySanVietNam.spiderCountUpdateAll(request.crawlingName)
                  .then(function (result1) {
                    callback(null, result1.length);
                  });
                break;

            }

          }
        }, function (err, result) {
          return resolve({
            messsage: successMessage.spider.callSpider,
            spider: result.length
          });
        })
      });
    });
}

function callSpiderPath(request) {
  return Spider.findOne({
      crawlingName: request.crawlingName,
    })
    .populate('urlId')
    .exec()
    .then(function (spider) {
      if (spider === null) {
        return Promise.reject({
          message: failMessage.spider.notFound
        });
      }
      switch (request.crawlingName) {
        case 'spiderTinNongNghiep':
          SpiderTinNongNghiep.spiderTinNongNghiepPath(spider.urlId, spider._id, request.catelogyId);
          break;
        case 'spiderTinNongNghiepVietNam':
          SpiderNongNghiepVietNam.spiderNongNghiepPath(spider.urlId, spider._id, request.catelogyId);
          break;
        case 'spiderBaoDanSinh':
          SpiderBaoDanSinh.spiderBaoDanSinhPath(spider.urlId, spider._id, request.catelogyId);
          break;
        case 'spiderKhoaHocTv':
          SpiderKhoaHocTv.spiderKhoaHocTvPath(spider.urlId, spider._id, request.catelogyId);
          break;
        case 'spiderKhuyenNong':
          SpiderKhuyenNong.spiderKhuyenNongPath(spider.urlId, spider._id, request.catelogyId);
          break;
        case 'spiderKyThuatNuoiTrong':
          SpiderKyThuatNuoiTrong.spiderKyThuatNuoiTrongPath(spider.urlId, spider._id, request.catelogyId);
          break;
        case 'spiderThuySanVietNam':
          SpiderThuySanVietNam.spiderThuySanVietNamPath(spider.urlId, spider._id, request.catelogyId);
          break;
      }
      return Promise.resolve({
        messsage: successMessage.spider.callSpider,
        spider: spider
      });
    });
}

function updateNewsSpiderPath(request) {
  return Spider.findOne({
      crawlingName: request.crawlingName
    })
    .exec()
    .then(function (spider) {
      if (spider === null) {
        return Promise.reject({
          message: failMessage.spider.notFound
        });
      }
      switch (request.crawlingName) {
        case 'spiderTinNongNghiep':
          SpiderTinNongNghiep.spiderTinNongNghiepUpdatePath(request.catelogyId);
          break;
        case 'spiderTinNongNghiepVietNam':
          SpiderNongNghiepVietNam.spiderNongNghiepVietNamUpdatePath(request.catelogyId);
          break;
        case 'spiderBaoDanSinh':
          SpiderBaoDanSinh.spiderBaoDanSinhUpdatePath(request.catelogyId);
          break;
        case 'spiderKhoaHocTv':
          SpiderKhoaHocTv.spiderKhoaHocTvUpdatePath(request.catelogyId);
          break;
        case 'spiderKhuyenNong':
          SpiderKhuyenNong.spiderKhuyenNongUpdatePath(request.catelogyId);
          break;
        case 'spiderKyThuatNuoiTrong':
          SpiderKyThuatNuoiTrong.spiderKyThuatNuoiTrongUpdatePath(request.catelogyId);
          break;
        case 'spiderThuySanVietNam':
          SpiderThuySanVietNam.spiderThuySanVietNamUpdatePath(request.catelogyId);
          break;
      }
      return Promise.resolve({
        messsage: successMessage.spider.callSpider,
        spider: spider
      });
    });
}


function callSpiderUrl(request) {
  return News.findOne({
    originalLink: request.url
  }).exec().then(function (upNews) {
    if (upNews !== null) {
      return Promise.reject({
        message: failMessage.spider.urlDupplicate
      });
    }
    return Spider.findOne({
        crawlingName: request.crawlingName,
      })
      .populate('urlId')
      .exec()
      .then(function (spider) {
        if (spider === null) {
          return Promise.reject({
            message: failMessage.spider.notFound
          });
        }
        switch (request.crawlingName) {
          case 'spiderTinNongNghiep':
            SpiderTinNongNghiep.spiderTinNongNghiepUrl(spider.urlId, spider._id, request.url);
            break;
          case 'spiderTinNongNghiepVietNam':
            SpiderNongNghiepVietNam.spiderNongNghiepVietNamUrl(spider.urlId, spdier._id, request.url);
            break;
          case 'spiderBaoDanSinh':
            SpiderBaoDanSinh.spiderBaoDanSinhUrl(spider.urlId, spdier._id, request.url);
            break;
          case 'spiderKhoaHocTv':
            SpiderKhoaHocTv.spiderKhoaHocTvUrl(spider.urlId, spdier._id, request.url);
            break;
          case 'spiderKhuyenNong':
            SpiderKhuyenNong.spiderKhuyenNongUrl(spider.urlId, spdier._id, request.url);
            break;
          case 'spiderKyThuatNuoiTrong':
            SpiderKyThuatNuoiTrong.spiderKyThuatNuoiTrongUrl(spider.urlId, spdier._id, request.url);
            break;
          case 'spiderThuySanVietNam':
            SpiderThuySanVietNam.spiderThuySanVietNamUrl(spider.urlId, spdier._id, request.url);
            break;
        }
        return Promise.resolve({
          messsage: successMessage.spider.callSpider,
          spider: spider
        });
      });
  });

}


function updateNewsSpiderUrl(request) {
  return Spider.findOne({
      crawlingName: request.crawlingName
    })
    .exec()
    .then(function (spider) {
      if (spider === null) {
        return Promise.reject({
          message: failMessage.spider.notFound
        })
      }
      switch (request.crawlingName) {
        case 'spiderTinNongNghiep':
          SpiderTinNongNghiep.spiderTinNongNghiepUpdateUrl(request.url);
          break;
        case 'spiderTinNongNghiepVietNam':
          SpiderNongNghiepVietNam.spiderNongNghiepVietNamUpdateUrl(request.url);
          break;
        case 'spiderBaoDanSinh':
          SpiderBaoDanSinh.spiderBaoDanSinhUpdateUrl(request.url);
          break;
        case 'spiderKhoaHocTv':
          SpiderKhoaHocTv.spiderKhoaHocTvUpdateUrl(request.url);
          break;
        case 'spiderKhuyenNong':
          SpiderKhuyenNong.spiderKhuyenNongUpdateUrl(request.url);
          break;
        case 'spiderKyThuatNuoiTrong':
          SpiderKyThuatNuoiTrong.spiderKyThuatNuoiTrongUpdateUrl(request.url);
          break;
        case 'spiderThuySanVietNam':
          SpiderThuySanVietNam.spiderThuySanVietNamUpdateUrl(request.url);
          break;

      }
      return Promise.resolve({
        messsage: successMessage.spider.callSpider,
        spider: spider
      });
    });
}

function updateNewsSpiderUrlByNewsId(request) {
  return Spider.findOne({
      crawlingName: request.crawlingName
    })
    .exec()
    .then(function (spider) {
      if (spider === null) {
        return Promise.reject({
          message: failMessage.spider.notFound
        });
      }
      switch (request.crawlingName) {
        case 'spiderTinNongNghiep':
          return SpiderTinNongNghiep.spiderTinNongNghiepUpdateUrlVersion2(request.url)
            .then(res => {
              return Promise.resolve({
                message: true
              })
            })
            .catch(err => {
              return Promise.reject({
                message: false
              })
            })
          break;
        case 'spiderTinNongNghiepVietNam':
          return SpiderNongNghiepVietNam.spiderNongNghiepVietNamUpdateUrlVersion2(request.url)
            .then(res => {
              return Promise.resolve({
                message: true
              })
            })
            .catch(err => {
              return Promise.reject({
                message: false
              })
            })
          break;
        case 'spiderBaoDanSinh':
          return SpiderBaoDanSinh.spiderBaoDanSinhUpdateUrlVersion2(request.url)
            .then(res => {
              return Promise.resolve({
                message: true
              })
            })
            .catch(err => {
              return Promise.reject({
                message: false
              })
            })
          break;
        case 'spiderKhoaHocTv':
          return SpiderKhoaHocTv.spiderKhoaHocTvUpdateUrlVersion2(request.url)
            .then(res => {
              return Promise.resolve({
                message: true
              })
            })
            .catch(err => {
              return Promise.reject({
                message: false
              })
            })
          break;
        case 'spiderKhuyenNong':
          return SpiderKhuyenNong.spiderKhuyenNongUpdateUrlVersion2(request.url)
            .then(res => {
              return Promise.resolve({
                message: true
              })
            })
            .catch(err => {
              return Promise.reject({
                message: false
              })
            })
          break;
        case 'spiderKyThuatNuoiTrong':
          return SpiderKyThuatNuoiTrong.spiderKyThuatNuoiTrongUpdateUrlVersion2(request.url)
            .then(res => {
              return Promise.resolve({
                message: true
              })
            })
            .catch(err => {
              return Promise.reject({
                message: false
              })
            })
          break;
        case 'spiderThuySanVietNam':
          return SpiderThuySanVietNam.spiderThuySanVietNamUpdateUrlVersion2(request.url)
            .then(res => {
              return Promise.resolve({
                message: true
              })
            })
            .catch(err => {
              return Promise.reject({
                message: false
              })
            })
          break;
      }
    });
}
