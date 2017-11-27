var router = require('express').Router();
var restrictDao = require('./../dao/restrict.dao');
module.exports = function () {
  router.post('/', createRestrict);
  router.get('/', getAllRestrict);
  router.get('/:id', getByIdRestrict);
  router.put('/:id', updateRestrict);
  router.delete('/:id', deleteRestrict);

  function createRestrict(req, res, next) {
    var request = {
      name: req.body.name,
      level: req.body.level
    }
    restrictDao.createRestrict(request)
      .then(w => {
        res.status(200).send(w).end();
      })
      .catch(err => {
        res.status(400).send(err).end();
      })
  }

  function getAllRestrict(req, res, next) {
    restrictDao.getAllRestrict()
      .then(w => {
        res.status(200).send(w).end();
      })
      .catch(err => {
        res.status(400).send(err).end();
      })
  }

  function getByIdRestrict(req, res, next) {
    var request = {
      id: req.params.id
    }
    restrictDao.getByIdRestrict(request)
      .then(w => {
        res.status(200).send(w).end();
      })
      .catch(err => {
        res.status(400).send(err).end();
      })
  }

  function updateRestrict(req, res, next) {
    var request = {
      id: req.params.id,
      name: req.body.name,
      level: req.body.level
    }
    restrictDao.updateRestrict(request)
      .then(w => {
        res.status(200).send(w).end();
      })
      .catch(err => {
        res.status(400).send(err).end();
      })
  }

  function deleteRestrict(req, res, next) {
    var request = {
      id: req.params.id
    }
    restrictDao.deleteRestrict(request)
      .then(w => {
        res.status(200).send(w).end();
      })
      .catch(err => {
        res.status(400).send(err).end();
      })
  }
  return router;
}
