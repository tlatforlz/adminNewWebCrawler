var router = require('express').Router();
var spiderDao = require('./../dao/spider.dao');

module.exports = function () {
  router.post('/', createSpider);
  router.get('/', getAllSpider);
  router.get('/countSpider', countSpider);
  router.get('/:id', getSpiderById);
  router.get('/getNewsCall/:id', getNewsCall);
  router.get('/getNewsCall/:id/:limit', getNewsCallLimit);
  router.get('/getNewsNone/:id', getNewsNone);
  router.post('/getNewsByDate/:id', getNewsByDate);
  router.put('/:id', updateSpider);
  router.delete('/:id', deleteSpider);
  router.post('/:crawlingName', callSpider);
  router.post('/:crawlingName/update', updateNewsSpider);
  router.post('/:crawlingName/:catelogyId', callSpiderPath);
  router.post('/:crawlingName/:catelogyId/update', updateNewsSpiderPath);
  router.post('/:crawlingName/call/url', callSpiderUrl);
  router.post('/:crawlingName/:url/updateurl', updateNewsSpiderUrl);
  router.post('/:crawlingName/:url/updateurlByNewsId', updateNewsSpiderUrlByNewsId);


  router.get('/callSpiderCategory/:urlId', getCategoryByUrl);
  router.post('/categorySpider/callSpiderByPath/:crawlingName', callSpiderByPath);
  router.post('/categorySpider/callSpiderByPathUpdate/:crawlingName', callSpiderByPathUpdate);


  function callSpiderByPathUpdate(req, res, next) {
    var request = {
      crawlingName: req.params.crawlingName,
      namePath: req.body.namePath,
      catelogyId: req.body.catelogyId,
    };
    spiderDao.callSpiderByPathUpdate(request)
      .then(function (spider) {
        res.status(200).send(spider).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }


  function getNewsByDate(req, res, next) {
    var request = {
      spiderId: req.params.id,
      startDate: req.body.startDate
    };
    spiderDao.getNewsByDate(request)
      .then(function (spider) {
        res.status(200).send(spider).end();
      }).catch(function (err) {
        res.status(400).send(err).end();
      });
  }

  function updateNewsSpiderUrlByNewsId(req, res, next) {
    var request = {
      crawlingName: req.params.crawlingName,
      url: req.params.url
    };
    spiderDao.updateNewsSpiderUrlByNewsId(request)
      .then(function (spider) {
        res.status(200).send(spider).end();
      }).catch(function (err) {
        res.status(400).send(err).end();
      });
  }

  function callSpiderByPath(req, res, next) {
    var request = {
      crawlingName: req.params.crawlingName,
      namePath: req.body.namePath,
      catelogyId: req.body.catelogyId,
    };
    spiderDao.callSpiderByPath(request)
      .then(function (spider) {
        res.status(200).send(spider).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function getCategoryByUrl(req, res, next) {
    var request = {
      urlId: req.params.urlId
    };
    spiderDao.getCategoryByUrl(request)
      .then(function (spider) {
        res.status(200).send(spider).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function createSpider(req, res, next) {
    var request = {
      urlId: req.body.urlId,
      name: req.body.name,
      crawlingName: req.body.crawlingName
    };
    spiderDao.createSpider(request)
      .then(function (spider) {
        res.status(200).send(spider).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function getAllSpider(req, res, next) {
    spiderDao.getAllSpider()
      .then(function (spiders) {
        res.status(200).send(spiders).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      });
  }

  function getSpiderById(req, res, next) {
    var request = {
      id: req.params.id
    }
    spiderDao.getSpiderById(request)
      .then(function (spider) {
        res.status(200).send(spider).end();
      }).catch(function (err) {
        res.status(400).send(err).end();
      });
  }

  function updateSpider(req, res, next) {
    var request = {
      id: req.params.id,
      name: req.body.name,
      isSourceUpdated: req.body.isSourceUpdated,
      isActive: req.body.isActive,
      updateDate: Date.now(),
      crawlingName: req.body.crawlingName,
      urlId: req.body.urlId
    }
    spiderDao.updateSpider(request)
      .then(function (spider) {
        res.status(200).send(spider).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      });
  }

  function deleteSpider(req, res, next) {
    var request = {
      id: req.params.id
    }
    spiderDao.deleteSpider(request)
      .then(function (spider) {
        res.status(200).send(spider).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      });
  }

  //update all news in crawlingName
  function callSpider(req, res, next) {
    var request = {
      crawlingName: req.params.crawlingName
    }
    spiderDao.callSpider(request)
      .then(function (spider) {
        res.status(200).send(spider).end();
      }).catch(function (err) {
        res.status(400).send(err).end();
      });
  }

  //update all news in crawlingName
  function updateNewsSpider(req, res, next) {
    var request = {
      crawlingName: req.params.crawlingName,
    }
    spiderDao.updateNewsSpider(request)
      .then(function (spider) {
        res.status(200).send(spider).end();
      }).catch(function (err) {
        res.status(400).send(err).end();
      });
  }

  //call get all news in crawlingNews with catelogyId
  function callSpiderPath(req, res, next) {
    var request = {
      crawlingName: req.params.crawlingName,
      catelogyId: req.params.catelogyId
    };
    spiderDao.callSpiderPath(request)
      .then(function (spider) {
        res.status(200).send(spider).end();
      }).catch(function (err) {
        res.status(400).send(err).end();
      });
  }


  // update all news in crawlingName with catelogyId
  function updateNewsSpiderPath(req, res, next) {
    var request = {
      crawlingName: req.params.crawlingName,
      catelogyId: req.params.catelogyId
    }
    spiderDao.updateNewsSpiderPath(request)
      .then(function (spider) {
        res.status(200).send(spider).end();
      }).catch(function (err) {
        res.status(400).send(err).end();
      });
  }

  //call get all news in crawlingNews with URL
  function callSpiderUrl(req, res, next) {
    var request = {
      crawlingName: req.params.crawlingName,
      url: req.body.url
    };
    spiderDao.callSpiderUrl(request)
      .then(function (spider) {
        res.status(200).send(spider).end();
      }).catch(function (err) {
        res.status(400).send(err).end();
      });
  }

  // update all news in crawlingName with newsID
  function updateNewsSpiderUrl(req, res, next) {
    var request = {
      crawlingName: req.params.crawlingName,
      url: req.params.url
    };
    spiderDao.updateNewsSpiderUrl(request)
      .then(function (spider) {
        res.status(200).send(spider).end();
      }).catch(function (err) {
        res.status(400).send(err).end();
      });
  }

  function getNewsCallLimit(req, res, next) {
    var request = {
      _id: req.params.id,
      limit: req.params.limit
    };
    spiderDao.getNewsCallLimit(request)
      .then(function (spider) {
        res.status(200).send(spider).end();
      }).catch(function (err) {
        res.status(400).send(err).end();
      });
  }

  function getNewsCall(req, res, next) {
    var request = {
      _id: req.params.id
    };
    spiderDao.getNewsCall(request)
      .then(function (spider) {
        res.status(200).send(spider).end();
      }).catch(function (err) {
        res.status(400).send(err).end();
      });
  }

  //getNewsNone
  function getNewsNone(req, res, next) {
    var request = {
      _id: req.params.id
    };
    spiderDao.getNewsNone(request)
      .then(function (spider) {
        res.status(200).send(spider).end();
      }).catch(function (err) {
        res.status(400).send(err).end();
      });
  }

  //countSpider
  function countSpider(req, res, next) {

    spiderDao.countSpider()
      .then(function (spider) {
        res.status(200).send(spider).end();
      }).catch(function (err) {
        res.status(400).send(err).end();
      });
  }
  return router;
}
