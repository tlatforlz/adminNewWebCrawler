var router = require('express').Router();
var crawlDao = require('./../dao/crawl.dao');

module.exports = function () {
  router.post('/', createSpider);
  router.put('/', updateSpider);
  router.get('/getRemove/:spiderId/:name', getRemove);
  router.post('/addRemove/:spiderId/:name', addRemove);
  router.post('/RemoveSelector/:spiderId/:name', RemoveSelector);
  router.post('/UpdateSelector/:spiderId/:name', UpdateSelector);

  router.post('/CallUrlTest/:spiderId', CallUrlTest);
  router.post('/CallPathTest/:spiderId', CallPathTest);
  router.post('/CallPageTest/:spiderId', CallPageTest);

  router.post('/addSelectorTitlePath', addSelectorTitlePath);
  router.post('/addPathSelectorTitlePath', addPathSelectorTitlePath);
  router.post('/removePathSelectorTitlePath', removePathSelectorTitlePath);

  router.post('/addSelectorUrlPath', addSelectorUrlPath);
  router.post('/addPathSelectorUrlPath', addPathSelectorUrlPath);
  router.post('/removePathSelectorUrlPath', removePathSelectorUrlPath);

  router.post('/addSelectorTitle', addSelectorTitle);
  router.post('/addPathSelectorTitle', addPathSelectorTitle);
  router.post('/removePathSelectorTitle', removePathSelectorTitle);

  router.post('/addSelectorContent', addSelectorContent);
  router.post('/addPathSelectorContent', addPathSelectorContent);
  router.post('/removePathSelectorContent', removePathSelectorContent);

  router.post('/addSelectorAuthor', addSelectorAuthor);
  router.post('/addPathSelectorAuthor', addPathSelectorAuthor);
  router.post('/removePathSelectorAuthor', removePathSelectorAuthor);

  router.post('/addSelectorCreatedDate', addSelectorCreatedDate);
  router.post('/addPathSelectorCreatedDate', addPathSelectorCreatedDate);
  router.post('/removePathSelectorCreatedDate', removePathSelectorCreatedDate);

  router.post('/addSelectorNextPage', addSelectorNextPage);
  router.post('/addPathSelectorNextPage', addPathSelectorNextPage);
  router.post('/removePathSelectorNextPage', removePathSelectorNextPage);

  router.post('/addSelectorImage', addSelectorImage);
  router.post('/addPathSelectorImage', addPathSelectorImage);
  router.post('/removePathSelectorImage', removePathSelectorImage);

  router.post('/addSelectorDescription', addSelectorDescription);
  router.post('/addPathSelectorDescription', addPathSelectorDescription);
  router.post('/removePathSelectorDescription', removePathSelectorDescription);

  router.post('/addSelectorListNews', addSelectorListNews);
  router.post('/addPathSelectorListNews', addPathSelectorListNews);
  router.post('/removePathSelectorListNews', removePathSelectorListNews);

  function CallUrlTest(req, res, next) {
    var request = {
      spiderId: req.params.spiderId,
      Url: req.body.Url
    }
    crawlDao.CallUrlTest(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function CallPathTest(req, res, next) {
    var request = {
      spiderId: req.params.spiderId,
      Url: req.body.Url
    }
    crawlDao.CallPathTest(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function CallPageTest(req, res, next) {
    var request = {
      spiderId: req.params.spiderId,
      Url: req.body.Url
    }
    crawlDao.CallPageTest(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function UpdateSelector(req, res, next) {
    var request = {
      spiderId: req.params.spiderId,
      name: req.params.name,
      selector: req.body.selector,
      newselector: req.body.newselector
    }
    crawlDao.UpdateSelector(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function RemoveSelector(req, res, next) {
    var request = {
      spiderId: req.params.spiderId,
      name: req.params.name,
      selector: req.body.selector
    }
    crawlDao.RemoveSelector(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function addRemove(req, res, next) {
    var request = {
      spiderId: req.params.spiderId,
      name: req.params.name,
      selector: req.body.selector
    }
    crawlDao.addRemove(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function getRemove(req, res, next) {
    var request = {
      spiderId: req.params.spiderId,
      name: req.params.name
    }
    crawlDao.getRemove(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function addSelectorListNews(req, res, next) {
    var request = {
      spiderId: req.body.spiderId,
      selector: req.body.selector
    };
    crawlDao.addSelectorListNews(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function addPathSelectorListNews(req, res, next) {
    var request = {
      spiderId: req.body.spiderId,
      selector: req.body.selector
    };
    crawlDao.addPathSelectorListNews(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function removePathSelectorListNews(req, res, next) {
    var request = {
      spiderId: req.body.spiderId,
      selector: req.body.selector
    };
    crawlDao.removePathSelectorListNews(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function addSelectorDescription(req, res, next) {
    var request = {
      spiderId: req.body.spiderId,
      selector: req.body.selector
    };
    crawlDao.addSelectorDescription(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function addPathSelectorDescription(req, res, next) {
    var request = {
      spiderId: req.body.spiderId,
      selector: req.body.selector
    };
    crawlDao.addPathSelectorDescription(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function removePathSelectorDescription(req, res, next) {
    var request = {
      spiderId: req.body.spiderId,
      selector: req.body.selector
    };
    crawlDao.removePathSelectorDescription(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function updateSpider(req, res, next) {
    var request = {
      spiderId: req.body.spiderId,
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      createddate: req.body.createddate,
      nextpage: req.body.nextpage,
      image: req.body.image,
      description: req.body.description,
      listnews: req.body.listnews,
      urlpath: req.body.urlpath,
      titlepath: req.body.titlepath
    }
    crawlDao.updateSpider(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function addSelectorImage(req, res, next) {
    var request = {
      spiderId: req.body.spiderId,
      selector: req.body.selector
    };
    crawlDao.addSelectorImage(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function addPathSelectorImage(req, res, next) {
    var request = {
      spiderId: req.body.spiderId,
      selector: req.body.selector
    };
    crawlDao.addPathSelectorImage(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function removePathSelectorImage(req, res, next) {
    var request = {
      spiderId: req.body.spiderId,
      selector: req.body.selector
    };
    crawlDao.removePathSelectorImage(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function addSelectorNextPage(req, res, next) {
    var request = {
      spiderId: req.body.spiderId,
      selector: req.body.selector
    };
    crawlDao.addSelectorNextPage(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function addPathSelectorNextPage(req, res, next) {
    var request = {
      spiderId: req.body.spiderId,
      selector: req.body.selector
    };
    crawlDao.addPathSelectorNextPage(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function removePathSelectorNextPage(req, res, next) {
    var request = {
      spiderId: req.body.spiderId,
      selector: req.body.selector
    };
    crawlDao.removePathSelectorNextPage(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }


  function addSelectorCreatedDate(req, res, next) {
    var request = {
      spiderId: req.body.spiderId,
      selector: req.body.selector
    };
    crawlDao.addSelectorCreatedDate(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function addPathSelectorCreatedDate(req, res, next) {
    var request = {
      spiderId: req.body.spiderId,
      selector: req.body.selector
    };
    crawlDao.addPathSelectorCreatedDate(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function removePathSelectorCreatedDate(req, res, next) {
    var request = {
      spiderId: req.body.spiderId,
      selector: req.body.selector
    };
    crawlDao.removePathSelectorCreatedDate(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function addSelectorAuthor(req, res, next) {
    var request = {
      spiderId: req.body.spiderId,
      selector: req.body.selector
    };
    crawlDao.addSelectorAuthor(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function addPathSelectorAuthor(req, res, next) {
    var request = {
      spiderId: req.body.spiderId,
      selector: req.body.selector
    };
    crawlDao.addPathSelectorAuthor(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function removePathSelectorAuthor(req, res, next) {
    var request = {
      spiderId: req.body.spiderId,
      selector: req.body.selector
    };
    crawlDao.removePathSelectorAuthor(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function addSelectorContent(req, res, next) {
    var request = {
      spiderId: req.body.spiderId,
      selector: req.body.selector
    };
    crawlDao.addSelectorContent(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function addPathSelectorContent(req, res, next) {
    var request = {
      spiderId: req.body.spiderId,
      selector: req.body.selector
    };
    crawlDao.addPathSelectorContent(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function removePathSelectorContent(req, res, next) {
    var request = {
      spiderId: req.body.spiderId,
      selector: req.body.selector
    };
    crawlDao.removePathSelectorContent(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function addPathSelectorTitle(req, res, next) {
    var request = {
      spiderId: req.body.spiderId,
      selector: req.body.selector
    };
    crawlDao.addPathSelectorTitle(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function removePathSelectorTitle(req, res, next) {
    var request = {
      spiderId: req.body.spiderId,
      selector: req.body.selector
    };
    crawlDao.removePathSelectorTitle(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function addSelectorTitle(req, res, next) {
    var request = {
      spiderId: req.body.spiderId,
      selector: req.body.selector
    };
    crawlDao.addSelectorTitle(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function addPathSelectorUrlPath(req, res, next) {
    var request = {
      spiderId: req.body.spiderId,
      selector: req.body.selector
    };
    crawlDao.addPathSelectorUrlPath(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function removePathSelectorUrlPath(req, res, next) {
    var request = {
      spiderId: req.body.spiderId,
      selector: req.body.selector
    };
    crawlDao.removePathSelectorUrlPath(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function addSelectorUrlPath(req, res, next) {
    var request = {
      spiderId: req.body.spiderId,
      selector: req.body.selector
    };
    crawlDao.addSelectorUrlPath(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }


  function addPathSelectorTitlePath(req, res, next) {
    var request = {
      spiderId: req.body.spiderId,
      selector: req.body.selector
    };
    crawlDao.addPathSelectorTitlePath(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function removePathSelectorTitlePath(req, res, next) {
    var request = {
      spiderId: req.body.spiderId,
      selector: req.body.selector
    };
    crawlDao.removePathSelectorTitlePath(request)
      .then(function (status) {
        res.status(200).send(status).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function addSelectorTitlePath(req, res, next) {
    var request = {
      spiderId: req.body.spiderId,
      selector: req.body.selector
    };
    crawlDao.addSelectorTitlePath(request)
      .then(function (status) {
        res.status(200).send(status).end();
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
    crawlDao.createSpider(request)
      .then(function (spider) {
        res.status(200).send(spider).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }
  return router;
}
