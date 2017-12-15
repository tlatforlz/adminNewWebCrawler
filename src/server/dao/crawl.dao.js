var Spider = require('./../model/spider.model');
var NewsDao = require('./news.dao.js');
var News = require('./../model/news.model');
var async = require('async');
var successMessage = require('./../services/successMessage');
var failMessage = require('./../services/failMessage');
module.exports = {
  createSpider: createSpider,
  updateSpider: updateSpider,
  addSelectorTitle: addSelectorTitle,
  addPathSelectorTitle: addPathSelectorTitle,
  removePathSelectorTitle: removePathSelectorTitle,

  addSelectorContent: addSelectorContent,
  addPathSelectorContent: addPathSelectorContent,
  removePathSelectorContent: removePathSelectorContent,

  addSelectorAuthor: addSelectorAuthor,
  addPathSelectorAuthor: addPathSelectorAuthor,
  removePathSelectorAuthor: removePathSelectorAuthor,

  addSelectorCreatedDate: addSelectorCreatedDate,
  addPathSelectorCreatedDate: addPathSelectorCreatedDate,
  removePathSelectorCreatedDate: removePathSelectorCreatedDate,

  addSelectorNextPage: addSelectorNextPage,
  addPathSelectorNextPage: addPathSelectorNextPage,
  removePathSelectorNextPage: removePathSelectorNextPage,

  addSelectorImage: addSelectorImage,
  addPathSelectorImage: addPathSelectorImage,
  removePathSelectorImage: removePathSelectorImage,

  addSelectorDescription: addSelectorDescription,
  addPathSelectorDescription: addPathSelectorDescription,
  removePathSelectorDescription: removePathSelectorDescription
}

function addPathSelectorDescription(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    var check = new Promise(function (resolve, reject) {
      if (spider.spiderInformation.description.remove.length == 0) {
        resolve(true);
      }
      var i = 0;
      spider.spiderInformation.description.remove.forEach(element => {
        if (element == request.selector) {
          reject(false);
        }
        i++;
        if (i == spider.spiderInformation.description.remove.length) {
          resolve(true);
        }
      });
    });
    return check.then(w => {
      spider.spiderInformation.description.remove.push(request.selector);
      spider.save();
      return Promise.resolve({
        message: true
      })
    }).catch(err => {
      return Promise.resolve({
        message: false
      })
    })
  })
}

function removePathSelectorDescription(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    var check = new Promise(function (resolve, reject) {
      if (spider.spiderInformation.description.remove.length == 0) {
        resolve(false);
      }
      var i = 0;
      spider.spiderInformation.description.remove.forEach(element => {
        if (element == request.selector) {
          resolve(true);
        }
        i++;
        if (i == spider.spiderInformation.description.remove.length) {
          reject(false);
        }
      });
    });
    return check.then(w => {
      spider.spiderInformation.description.remove.pull(request.selector);
      spider.save();
      return Promise.resolve({
        message: true
      })
    }).catch(err => {
      return Promise.resolve({
        message: false
      })
    })
  })
}

function addSelectorDescription(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    if (spider.spiderInformation.description.selector == request.selector) {
      return Promise.resolve({
        message: false
      })
    }
    spider.spiderInformation.description.selector = request.selector;
    spider.save();
    return Promise.resolve({
      message: true
    })
  })
}

function updateSpider(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    spider.spiderInformation.title.selector = request.title;
    spider.spiderInformation.content.selector = request.content;
    spider.spiderInformation.author.selector = request.author;
    spider.spiderInformation.createDate.selector = request.createddate;
    spider.spiderInformation.image.selector = request.image;
    spider.spiderInformation.nextPage.selector = request.nextpage;
    spider.spiderInformation.description.selector = request.description;
    spider.save();
    return Promise.resolve({
      message: true
    })
  })
}

function addPathSelectorImage(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    var check = new Promise(function (resolve, reject) {
      if (spider.spiderInformation.image.remove.length == 0) {
        resolve(true);
      }
      var i = 0;
      spider.spiderInformation.image.remove.forEach(element => {
        if (element == request.selector) {
          reject(false);
        }
        i++;
        if (i == spider.spiderInformation.image.remove.length) {
          resolve(true);
        }
      });
    });
    return check.then(w => {
      spider.spiderInformation.image.remove.push(request.selector);
      spider.save();
      return Promise.resolve({
        message: true
      })
    }).catch(err => {
      return Promise.resolve({
        message: false
      })
    })
  })
}

function removePathSelectorImage(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    var check = new Promise(function (resolve, reject) {
      if (spider.spiderInformation.image.remove.length == 0) {
        resolve(false);
      }
      var i = 0;
      spider.spiderInformation.image.remove.forEach(element => {
        if (element == request.selector) {
          resolve(true);
        }
        i++;
        if (i == spider.spiderInformation.image.remove.length) {
          reject(false);
        }
      });
    });
    return check.then(w => {
      spider.spiderInformation.image.remove.pull(request.selector);
      spider.save();
      return Promise.resolve({
        message: true
      })
    }).catch(err => {
      return Promise.resolve({
        message: false
      })
    })
  })
}

function addSelectorImage(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    if (spider.spiderInformation.image.selector == request.selector) {
      return Promise.resolve({
        message: false
      })
    }
    spider.spiderInformation.image.selector = request.selector;
    spider.save();
    return Promise.resolve({
      message: true
    })
  })
}


function addPathSelectorNextPage(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    var check = new Promise(function (resolve, reject) {
      if (spider.spiderInformation.nextPage.remove.length == 0) {
        resolve(true);
      }
      var i = 0;
      spider.spiderInformation.nextPage.remove.forEach(element => {
        if (element == request.selector) {
          reject(false);
        }
        i++;
        if (i == spider.spiderInformation.nextPage.remove.length) {
          resolve(true);
        }
      });
    });
    return check.then(w => {
      spider.spiderInformation.nextPage.remove.push(request.selector);
      spider.save();
      return Promise.resolve({
        message: true
      })
    }).catch(err => {
      return Promise.resolve({
        message: false
      })
    })
  })
}

function removePathSelectorNextPage(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    var check = new Promise(function (resolve, reject) {
      if (spider.spiderInformation.createDate.remove.length == 0) {
        resolve(false);
      }
      var i = 0;
      spider.spiderInformation.nextPage.remove.forEach(element => {
        if (element == request.selector) {
          resolve(true);
        }
        i++;
        if (i == spider.spiderInformation.nextPage.remove.length) {
          reject(false);
        }
      });
    });
    return check.then(w => {
      spider.spiderInformation.nextPage.remove.pull(request.selector);
      spider.save();
      return Promise.resolve({
        message: true
      })
    }).catch(err => {
      return Promise.resolve({
        message: false
      })
    })
  })
}

function addSelectorNextPage(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    if (spider.spiderInformation.nextPage.selector == request.selector) {
      return Promise.resolve({
        message: false
      })
    }
    spider.spiderInformation.nextPage.selector = request.selector;
    spider.save();
    return Promise.resolve({
      message: true
    })
  })
}

function addPathSelectorCreatedDate(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    var check = new Promise(function (resolve, reject) {
      if (spider.spiderInformation.createDate.remove.length == 0) {
        resolve(true);
      }
      var i = 0;
      spider.spiderInformation.createDate.remove.forEach(element => {
        if (element == request.selector) {
          reject(false);
        }
        i++;
        if (i == spider.spiderInformation.createDate.remove.length) {
          resolve(true);
        }
      });
    });
    return check.then(w => {
      spider.spiderInformation.createDate.remove.push(request.selector);
      spider.save();
      return Promise.resolve({
        message: true
      })
    }).catch(err => {
      return Promise.resolve({
        message: false
      })
    })
  })
}

function removePathSelectorCreatedDate(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    var check = new Promise(function (resolve, reject) {
      if (spider.spiderInformation.createDate.remove.length == 0) {
        resolve(false);
      }
      var i = 0;
      spider.spiderInformation.createDate.remove.forEach(element => {
        if (element == request.selector) {
          resolve(true);
        }
        i++;
        if (i == spider.spiderInformation.createDate.remove.length) {
          reject(false);
        }
      });
    });
    return check.then(w => {
      spider.spiderInformation.createDate.remove.pull(request.selector);
      spider.save();
      return Promise.resolve({
        message: true
      })
    }).catch(err => {
      return Promise.resolve({
        message: false
      })
    })
  })
}

function addSelectorCreatedDate(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    if (spider.spiderInformation.createDate.selector == request.selector) {
      return Promise.resolve({
        message: false
      })
    }
    spider.spiderInformation.createDate.selector = request.selector;
    spider.save();
    return Promise.resolve({
      message: true
    })
  })
}

function addPathSelectorAuthor(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    var check = new Promise(function (resolve, reject) {
      if (spider.spiderInformation.author.remove.length == 0) {
        resolve(true);
      }
      var i = 0;
      spider.spiderInformation.author.remove.forEach(element => {
        if (element == request.selector) {
          reject(false);
        }
        i++;
        if (i == spider.spiderInformation.author.remove.length) {
          resolve(true);
        }
      });
    });
    return check.then(w => {
      spider.spiderInformation.author.remove.push(request.selector);
      spider.save();
      return Promise.resolve({
        message: true
      })
    }).catch(err => {
      return Promise.resolve({
        message: false
      })
    })
  })
}

function removePathSelectorAuthor(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    var check = new Promise(function (resolve, reject) {
      if (spider.spiderInformation.author.remove.length == 0) {
        resolve(false);
      }
      var i = 0;
      spider.spiderInformation.author.remove.forEach(element => {
        if (element == request.selector) {
          resolve(true);
        }
        i++;
        if (i == spider.spiderInformation.author.remove.length) {
          reject(false);
        }
      });
    });
    return check.then(w => {
      spider.spiderInformation.author.remove.pull(request.selector);
      spider.save();
      return Promise.resolve({
        message: true
      })
    }).catch(err => {
      return Promise.resolve({
        message: false
      })
    })
  })
}

function addSelectorAuthor(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    if (spider.spiderInformation.author.selector == request.selector) {
      return Promise.resolve({
        message: false
      })
    }
    spider.spiderInformation.author.selector = request.selector;
    spider.save();
    return Promise.resolve({
      message: true
    })
  })
}

function addPathSelectorContent(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    var check = new Promise(function (resolve, reject) {
      if (spider.spiderInformation.content.remove.length == 0) {
        resolve(true);
      }
      var i = 0;
      spider.spiderInformation.content.remove.forEach(element => {
        if (element == request.selector) {
          reject(false);
        }
        i++;
        if (i == spider.spiderInformation.content.remove.length) {
          resolve(true);
        }
      });
    });
    return check.then(w => {
      spider.spiderInformation.content.remove.push(request.selector);
      spider.save();
      return Promise.resolve({
        message: true
      })
    }).catch(err => {
      return Promise.resolve({
        message: false
      })
    })
  })
}

function removePathSelectorContent(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    var check = new Promise(function (resolve, reject) {
      if (spider.spiderInformation.content.remove.length == 0) {
        resolve(false);
      }
      var i = 0;
      spider.spiderInformation.content.remove.forEach(element => {
        if (element == request.selector) {
          resolve(true);
        }
        i++;
        if (i == spider.spiderInformation.content.remove.length) {
          reject(false);
        }
      });
    });
    return check.then(w => {
      spider.spiderInformation.content.remove.pull(request.selector);
      spider.save();
      return Promise.resolve({
        message: true
      })
    }).catch(err => {
      return Promise.resolve({
        message: false
      })
    })
  })
}

function addSelectorContent(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    if (spider.spiderInformation.content.selector == request.selector) {
      return Promise.resolve({
        message: false
      })
    }
    spider.spiderInformation.content.selector = request.selector;
    spider.save();
    return Promise.resolve({
      message: true
    })
  })
}

function addPathSelectorTitle(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    var check = new Promise(function (resolve, reject) {
      if (spider.spiderInformation.title.remove.length == 0) {
        resolve(true);
      }
      var i = 0;
      spider.spiderInformation.title.remove.forEach(element => {
        if (element == request.selector) {
          reject(false);
        }
        i++;
        if (i == spider.spiderInformation.title.remove.length) {
          resolve(true);
        }
      });
    });
    return check.then(w => {
      spider.spiderInformation.title.remove.push(request.selector);
      spider.save();
      return Promise.resolve({
        message: true
      })
    }).catch(err => {
      return Promise.resolve({
        message: false
      })
    })
  })
}

function removePathSelectorTitle(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    var check = new Promise(function (resolve, reject) {
      if (spider.spiderInformation.title.remove.length == 0) {
        resolve(false);
      }
      var i = 0;
      spider.spiderInformation.title.remove.forEach(element => {
        if (element == request.selector) {
          resolve(true);
        }
        i++;
        if (i == spider.spiderInformation.title.remove.length) {
          reject(false);
        }
      });
    });
    return check.then(w => {
      spider.spiderInformation.title.remove.pull(request.selector);
      spider.save();
      return Promise.resolve({
        message: true
      })
    }).catch(err => {
      return Promise.resolve({
        message: false
      })
    })
  })
}

function addSelectorTitle(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    if (spider.spiderInformation.title.selector == request.selector) {
      return Promise.resolve({
        message: false
      })
    }
    spider.spiderInformation.title.selector = request.selector;
    spider.save();
    return Promise.resolve({
      message: true
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
