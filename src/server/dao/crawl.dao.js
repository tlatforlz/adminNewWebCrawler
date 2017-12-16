var Spider = require('./../model/spider.model');
var NewsDao = require('./news.dao.js');
var News = require('./../model/news.model');
var async = require('async');
var successMessage = require('./../services/successMessage');
var failMessage = require('./../services/failMessage');
var SpiderTest = require('./../services/crawl');
module.exports = {
  createSpider: createSpider,
  updateSpider: updateSpider,
  getRemove: getRemove,
  addRemove: addRemove,
  RemoveSelector: RemoveSelector,
  UpdateSelector: UpdateSelector,

  CallUrlTest: CallUrlTest,
  CallPathTest: CallPathTest,

  addSelectorTitle: addSelectorTitle,
  addPathSelectorTitle: addPathSelectorTitle,
  removePathSelectorTitle: removePathSelectorTitle,

  addSelectorTitlePath: addSelectorTitlePath,
  addPathSelectorTitlePath: addPathSelectorTitlePath,
  removePathSelectorTitlePath: removePathSelectorTitlePath,

  addSelectorUrlPath: addSelectorUrlPath,
  addPathSelectorUrlPath: addPathSelectorUrlPath,
  removePathSelectorUrlPath: removePathSelectorUrlPath,

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
  removePathSelectorDescription: removePathSelectorDescription,

  addSelectorListNews: addSelectorListNews,
  addPathSelectorListNews: addPathSelectorListNews,
  removePathSelectorListNews: removePathSelectorListNews
}

function CallUrlTest(request) {
  return SpiderTest.spiderCallUrlForTest(request.spiderId, request.Url).then(w => {
    return Promise.resolve(w);
  }).catch(err => {
    return Promise.resolve(err);
  })
}


function CallPathTest(request) {
  return SpiderTest.spiderCallPathForTest(request.spiderId, request.Url).then(w => {
    return Promise.resolve(w);
  }).catch(err => {
    return Promise.resolve(err);
  })
}


function UpdateSelector(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    var t = new Promise(function (resolve, reject) {
      switch (request.name) {
        case 'nextPage':
          {
            removePathSelectorNextPage(request).then(res => {
              if (res.message == true) {
                request.selector = request.newselector;
                addPathSelectorNextPage(request).then(res => {
                  if (res.message == true) {
                    resolve(true);
                  } else {
                    resolve(false);
                  }
                })
              } else {
                resolve(false);
              }
            })
            break;
          }
        case 'image':
          {
            removePathSelectorImage(request).then(res => {
              if (res.message == true) {
                request.selector = request.newselector;
                addPathSelectorImage(request).then(res => {
                  if (res.message == true) {
                    resolve(true);
                  } else {
                    resolve(false);
                  }
                })
              } else {
                resolve(false);
              }
            })
            break;
          }
        case 'createDate':
          {
            removePathSelectorCreatedDate(request).then(res => {
              if (res.message == true) {
                request.selector = request.newselector;
                addPathSelectorCreatedDate(request).then(res => {
                  if (res.message == true) {
                    resolve(true);
                  } else {
                    resolve(false);
                  }
                })
              } else {
                resolve(false);
              }
            })
            break;
          }
        case 'author':
          {
            removePathSelectorAuthor(request).then(res => {
              if (res.message == true) {
                request.selector = request.newselector;
                addPathSelectorAuthor(request).then(res => {
                  if (res.message == true) {
                    resolve(true);
                  } else {
                    resolve(false);
                  }
                })
              } else {
                resolve(false);
              }
            })
            break;
          }
        case 'content':
          {
            removePathSelectorContent(request).then(res => {
              if (res.message == true) {
                request.selector = request.newselector;
                addPathSelectorContent(request).then(res => {
                  if (res.message == true) {
                    resolve(true);
                  } else {
                    resolve(false);
                  }
                })
              } else {
                resolve(false);
              }
            })
            break;
          }
        case 'title':
          {
            removePathSelectorTitle(request).then(res => {
              if (res.message == true) {
                request.selector = request.newselector;
                addPathSelectorTitle(request).then(res => {
                  if (res.message == true) {
                    resolve(true);
                  } else {
                    resolve(false);
                  }
                })
              } else {
                resolve(false);
              }
            })
            break;
          }
        case 'description':
          {
            removePathSelectorDescription(request).then(res => {
              if (res.message == true) {
                request.selector = request.newselector;
                addPathSelectorDescription(request).then(res => {
                  if (res.message == true) {
                    resolve(true);
                  } else {
                    resolve(false);
                  }
                })
              } else {
                resolve(false);
              }
            })
            break;
          }
        case 'listnews':
          {
            removePathSelectorListNews(request).then(res => {
              if (res.message == true) {
                request.selector = request.newselector;
                addPathSelectorListNews(request).then(res => {
                  if (res.message == true) {
                    resolve(true);
                  } else {
                    resolve(false);
                  }
                })
              } else {
                resolve(false);
              }
            })
            break;
          }
        case 'urlPath':
          {
            removePathSelectorUrlPath(request).then(res => {
              if (res.message == true) {
                request.selector = request.newselector;
                addPathSelectorUrlPath(request).then(res => {
                  if (res.message == true) {
                    resolve(true);
                  } else {
                    resolve(false);
                  }
                })
              } else {
                resolve(false);
              }
            })
            break;
          }
        case 'titlePath':
          {
            removePathSelectorTitlePath(request).then(res => {
              if (res.message == true) {
                request.selector = request.newselector;
                addPathSelectorTitlePath(request).then(res => {
                  if (res.message == true) {
                    resolve(true);
                  } else {
                    resolve(false);
                  }
                })
              } else {
                resolve(false);
              }
            })
            break;
          }
      }

    })
    return t.then(res => {
      return Promise.resolve(res);
    })
  })
}

function RemoveSelector(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    var t = new Promise(function (resolve, reject) {
      switch (request.name) {
        case 'nextPage':
          {
            removePathSelectorNextPage(request).then(res => {
              if (res.message == true) {
                resolve(true);
              } else {
                resolve(false);
              }
            })
            break;
          }
        case 'image':
          {
            removePathSelectorImage(request).then(res => {
              if (res.message == true) {
                resolve(true);
              } else {
                resolve(false);
              }
            })
            break;
          }
        case 'createDate':
          {
            removePathSelectorCreatedDate(request).then(res => {
              if (res.message == true) {
                resolve(true);
              } else {
                resolve(false);
              }
            })
            break;
          }
        case 'author':
          {
            removePathSelectorAuthor(request).then(res => {
              if (res.message == true) {
                resolve(true);
              } else {
                resolve(false);
              }
            })
            break;
          }
        case 'content':
          {
            removePathSelectorContent(request).then(res => {
              if (res.message == true) {
                resolve(true);
              } else {
                resolve(false);
              }
            })
            break;
          }
        case 'title':
          {
            removePathSelectorTitle(request).then(res => {
              if (res.message == true) {
                resolve(true);
              } else {
                resolve(false);
              }
            })
            break;
          }
        case 'description':
          {
            removePathSelectorDescription(request).then(res => {
              if (res.message == true) {
                resolve(true);
              } else {
                resolve(false);
              }
            })
            break;
          }
        case 'listnews':
          {
            removePathSelectorListNews(request).then(res => {
              if (res.message == true) {
                resolve(true);
              } else {
                resolve(false);
              }
            })
            break;
          }
        case 'urlPath':
          {
            removePathSelectorUrlPath(request).then(res => {
              if (res.message == true) {
                resolve(true);
              } else {
                resolve(false);
              }
            })
            break;
          }
        case 'titlePath':
          {
            removePathSelectorTitlePath(request).then(res => {
              if (res.message == true) {
                resolve(true);
              } else {
                resolve(false);
              }
            })
            break;
          }
      }

    })
    return t.then(res => {
      return Promise.resolve(res);
    })
  })
}


function addRemove(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    var t = new Promise(function (resolve, reject) {
      switch (request.name) {
        case 'nextPage':
          {
            addPathSelectorNextPage(request).then(res => {
              if (res.message == true) {
                resolve(true);
              } else {
                resolve(false);
              }
            })
            break;
          }
        case 'image':
          {
            addPathSelectorImage(request).then(res => {
              if (res.message == true) {
                resolve(true);
              } else {
                resolve(false);
              }
            })
            break;
          }
        case 'createDate':
          {
            addPathSelectorCreatedDate(request).then(res => {
              if (res.message == true) {
                resolve(true);
              } else {
                resolve(false);
              }
            })
            break;
          }
        case 'author':
          {
            addPathSelectorAuthor(request).then(res => {
              if (res.message == true) {
                resolve(true);
              } else {
                resolve(false);
              }
            })
            break;
          }
        case 'content':
          {
            addPathSelectorContent(request).then(res => {
              if (res.message == true) {
                resolve(true);
              } else {
                resolve(false);
              }
            })
            break;
          }
        case 'title':
          {
            addPathSelectorTitle(request).then(res => {
              if (res.message == true) {
                resolve(true);
              } else {
                resolve(false);
              }
            })
            break;
          }
        case 'description':
          {
            addPathSelectorDescription(request).then(res => {
              if (res.message == true) {
                resolve(true);
              } else {
                resolve(false);
              }
            })
            break;
          }
        case 'listnews':
          {
            addPathSelectorListNews(request).then(res => {
              if (res.message == true) {
                resolve(true);
              } else {
                resolve(false);
              }
            })
            break;
          }
        case 'urlPath':
          {
            addPathSelectorUrlPath(request).then(res => {
              if (res.message == true) {
                resolve(true);
              } else {
                resolve(false);
              }
            })
            break;
          }
        case 'titlePath':
          {
            addPathSelectorTitlePath(request).then(res => {
              if (res.message == true) {
                resolve(true);
              } else {
                resolve(false);
              }
            })
            break;
          }
      }

    })
    return t.then(res => {
      return Promise.resolve(res);
    })
  })
}

function getRemove(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    var listRemove = [];
    var t = new Promise(function (resolve, reject) {
      switch (request.name) {
        case 'nextPage':
          {
            listRemove = spider.spiderInformation.nextPage.remove;
            break;
          }
        case 'image':
          {
            listRemove = spider.spiderInformation.image.remove;
            break;
          }
        case 'createDate':
          {
            listRemove = spider.spiderInformation.createDate.remove;
            break;
          }
        case 'author':
          {
            listRemove = spider.spiderInformation.author.remove;
            break;
          }
        case 'content':
          {
            listRemove = spider.spiderInformation.content.remove;
            break;
          }
        case 'title':
          {
            listRemove = spider.spiderInformation.title.remove;
            break;
          }
        case 'description':
          {
            listRemove = spider.spiderInformation.description.remove;
            break;
          }
        case 'listnews':
          {
            listRemove = spider.spiderInformation.listnews.remove;
            break;
          }
        case 'urlPath':
          {
            listRemove = spider.spiderInformation.urlPath.remove;
            break;
          }
        case 'titlePath':
          {
            listRemove = spider.spiderInformation.titlePath.remove;
            break;
          }
      }
      resolve(listRemove);
    })
    return t.then(res => {
      return Promise.resolve(res);
    })
  })
}

function addPathSelectorListNews(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    var check = new Promise(function (resolve, reject) {
      if (spider.spiderInformation.listnews.remove.length == 0) {
        resolve(true);
      }
      var i = 0;
      spider.spiderInformation.listnews.remove.forEach(element => {
        if (element == request.selector) {
          reject(false);
        }
        i++;
        if (i == spider.spiderInformation.listnews.remove.length) {
          resolve(true);
        }
      });
    });
    return check.then(w => {
      spider.spiderInformation.listnews.remove.push(request.selector);
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

function removePathSelectorListNews(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    var check = new Promise(function (resolve, reject) {
      if (spider.spiderInformation.listnews.remove.length == 0) {
        resolve(false);
      }
      var i = 0;
      spider.spiderInformation.listnews.remove.forEach(element => {
        if (element == request.selector) {
          resolve(true);
        }
        i++;
        if (i == spider.spiderInformation.listnews.remove.length) {
          reject(false);
        }
      });
    });
    return check.then(w => {
      spider.spiderInformation.listnews.remove.pull(request.selector);
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

function addSelectorListNews(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    if (spider.spiderInformation.listnews.selector == request.selector) {
      return Promise.resolve({
        message: false
      })
    }
    spider.spiderInformation.listnews.selector = request.selector;
    spider.save();
    return Promise.resolve({
      message: true
    })
  })
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
    spider.spiderInformation.listnews.selector = request.listnews;
    spider.spiderInformation.urlPath.selector = request.urlpath;
    spider.spiderInformation.titlePath.selector = request.titlepath;
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

function addPathSelectorTitlePath(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    var check = new Promise(function (resolve, reject) {
      if (spider.spiderInformation.titlePath.remove.length == 0) {
        resolve(true);
      }
      var i = 0;
      spider.spiderInformation.titlePath.remove.forEach(element => {
        if (element == request.selector) {
          reject(false);
        }
        i++;
        if (i == spider.spiderInformation.titlePath.remove.length) {
          resolve(true);
        }
      });
    });
    return check.then(w => {
      spider.spiderInformation.titlePath.remove.push(request.selector);
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

function removePathSelectorTitlePath(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    var check = new Promise(function (resolve, reject) {
      if (spider.spiderInformation.titlePath.remove.length == 0) {
        resolve(false);
      }
      var i = 0;
      spider.spiderInformation.titlePath.remove.forEach(element => {
        if (element == request.selector) {
          resolve(true);
        }
        i++;
        if (i == spider.spiderInformation.titlePath.remove.length) {
          reject(false);
        }
      });
    });
    return check.then(w => {
      spider.spiderInformation.titlePath.remove.pull(request.selector);
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

function addSelectorTitlePath(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    if (spider.spiderInformation.titlePath.selector == request.selector) {
      return Promise.resolve({
        message: false
      })
    }
    spider.spiderInformation.titlePath.selector = request.selector;
    spider.save();
    return Promise.resolve({
      message: true
    })
  })
}

function addPathSelectorUrlPath(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    var check = new Promise(function (resolve, reject) {
      if (spider.spiderInformation.urlPath.remove.length == 0) {
        resolve(true);
      }
      var i = 0;
      spider.spiderInformation.urlPath.remove.forEach(element => {
        if (element == request.selector) {
          reject(false);
        }
        i++;
        if (i == spider.spiderInformation.urlPath.remove.length) {
          resolve(true);
        }
      });
    });
    return check.then(w => {
      spider.spiderInformation.urlPath.remove.push(request.selector);
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

function removePathSelectorUrlPath(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    var check = new Promise(function (resolve, reject) {
      if (spider.spiderInformation.urlPath.remove.length == 0) {
        resolve(false);
      }
      var i = 0;
      spider.spiderInformation.urlPath.remove.forEach(element => {
        if (element == request.selector) {
          resolve(true);
        }
        i++;
        if (i == spider.spiderInformation.urlPath.remove.length) {
          reject(false);
        }
      });
    });
    return check.then(w => {
      spider.spiderInformation.urlPath.remove.pull(request.selector);
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

function addSelectorUrlPath(request) {
  return Spider.findById({
    _id: request.spiderId
  }).exec().then(spider => {
    if (spider.spiderInformation.urlPath.selector == request.selector) {
      return Promise.resolve({
        message: false
      })
    }
    spider.spiderInformation.urlPath.selector = request.selector;
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
