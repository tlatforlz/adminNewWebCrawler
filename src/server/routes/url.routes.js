var router = require('express').Router();
var urlDao = require('./../dao/url.dao');

module.exports = function () {
  router.post('/', createUrl);
  router.get('/', getAllUrl);
  router.get('/:id', getUrlById);
  router.put('/:id', updateUrl);
  router.delete('/:id', deleteUrl);
  router.post('/addPath/:id', addPathInUrl);
  router.post('/removePath/:id', removePathInUrl);
  router.post('/addCategory/:id/:object/:cateId', addCategory);
  router.post('/removeCategory/:id/:object', addCategory);

  function addCategory(req, res, next) {
    var request = {
      id: req.params.id,
      object: req.params.object,
      cateId: req.params.cateId
    }
    urlDao.addCategory(request)
      .then(function (url) {
        res.status(200).send(url).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }


  function removeCategory(req, res, next) {
    var request = {
      id: req.params.id,
      object: req.params.object
    }
    urlDao.removeCategory(request)
      .then(function (url) {
        res.status(200).send(url).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function addPathInUrl(req, res, next) {
    var request = {
      id: req.params.id,
      namePath: req.body.namePath
    }
    urlDao.addPathInUrl(request)
      .then(function (url) {
        res.status(200).send(url).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function removePathInUrl(req, res, next) {
    var request = {
      id: req.params.id,
      namePath: req.body.namePath
    }
    urlDao.removePathInUrl(request)
      .then(function (url) {
        res.status(200).send(url).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function createUrl(req, res, next) {
    var request = {
      title: req.body.title,
      hostname: req.body.hostname,
      path: req.body.path
    };
    urlDao.createUrl(request)
      .then(function (url) {
        res.status(200).send(url).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      });
  }

  function getAllUrl(req, res, next) {
    urlDao.getAllUrl()
      .then(function (urls) {
        res.status(200).send(urls).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      });
  }

  function getUrlById(req, res, next) {
    var request = {
      id: req.params.id
    }
    urlDao.getUrlById(request)
      .then(function (url) {
        res.status(200).send(url).end();
      }).catch(function (err) {
        res.status(400).send(err).end();
      });
  }

  function updateUrl(req, res, next) {
    var request = {
      id: req.params.id,
      title: req.body.title,
      hostname: req.body.hostname,
      path: req.body.path
    }
    urlDao.updateUrl(request)
      .then(function (url) {
        res.status(200).send(url).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      });
  }

  function deleteUrl(req, res, next) {
    var request = {
      id: req.params.id
    }
    urlDao.deleteUrl(request)
      .then(function (url) {
        res.status(200).send(url).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      });
  }

  return router;
};
