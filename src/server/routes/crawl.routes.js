var router = require('express').Router();
var crawlDao = require('./../dao/crawl.dao');

module.exports = function () {
  router.post('/', createSpider);
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
