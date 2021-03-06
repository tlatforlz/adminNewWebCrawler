var router = require('express').Router();
var categoryDao = require('./../dao/category.dao');

//category
module.exports = function () {
  router.post('/', createCategory);
  router.get('/', getAllCategory);
  router.get('/:id', getCategoryById);
  router.put('/:id', updateCategory);
  router.delete('/:id', deleteCategory);
  router.post('/addKey/:id', addKey);
  router.post('/removeKey/:id', removeKey);
  router.post('/checkKey/:id', checkKey);
  router.post('/updateKey/:id/:pos', updateKey);

  function updateKey(req, res, next) {
    var request = {
      key: req.body.key,
      id: req.params.id,
      pos: req.params.pos
    };
    categoryDao.updateKey(request)
      .then(function (Category) {
        res.status(200).send(Category).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }


  function checkKey(req, res, next) {
    var request = {
      key: req.body.key,
      id: req.params.id
    };
    categoryDao.checkKey(request)
      .then(function (Category) {
        res.status(200).send(Category).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function addKey(req, res, next) {
    var request = {
      key: req.body.key,
      id: req.params.id
    };
    categoryDao.addKey(request)
      .then(function (Category) {
        res.status(200).send(Category).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function removeKey(req, res, next) {
    var request = {
      key: req.body.key,
      id: req.params.id
    };
    categoryDao.removeKey(request)
      .then(function (Category) {
        res.status(200).send(Category).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function createCategory(req, res, next) {
    var request = {
      name: req.body.name,
      keys: req.body.keys
    };
    categoryDao.createCategory(request)
      .then(function (Category) {
        res.status(200).send(Category).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      })
  }

  function getAllCategory(req, res, next) {
    categoryDao.getAllCategory()
      .then(function (Categorys) {
        res.status(200).send(Categorys).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      });
  }

  function getCategoryById(req, res, next) {
    var request = {
      id: req.params.id
    }
    categoryDao.getCategoryById(request)
      .then(function (Category) {
        res.status(200).send(Category).end();
      }).catch(function (err) {
        res.status(400).send(err).end();
      });
  }

  function updateCategory(req, res, next) {
    var request = {
      id: req.params.id,
      name: req.body.name,
      keys: req.body.keys
    }
    categoryDao.updateCategory(request)
      .then(function (Category) {
        res.status(200).send(Category).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      });
  }

  function deleteCategory(req, res, next) {
    var request = {
      id: req.params.id
    }
    categoryDao.deleteCategory(request)
      .then(function (Category) {
        res.status(200).send(Category).end();
      })
      .catch(function (err) {
        res.status(400).send(err).end();
      });
  }

  return router;
}
