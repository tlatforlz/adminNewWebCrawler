var Restrict = require('./../model/restrict.model');

module.exports = {
  createRestrict: createRestrict,
  getAllRestrict: getAllRestrict,
  getByIdRestrict: getByIdRestrict,
  updateRestrict: updateRestrict,
  deleteRestrict: deleteRestrict
}

function createRestrict(request) {
  var newRestrict = new Restrict({
    name: request.name,
    level: request.level
  });
  return Restrict.findOne({
    name: request.name
  }).exec().then(res => {
    if (res) {
      return Promise.reject(false);
    }
    newRestrict.save();
    return Promise.resolve(true);
  });
}

function getAllRestrict(request) {
  return Restrict.find().exec().then(res => {
    return Promise.resolve(res);
  })
}

function getByIdRestrict(request) {
  return Restrict.findById({
    _id: request.id
  }).exec().then(res => {
    return Promise.resolve(res);
  })
}

function updateRestrict(request) {
  return Restrict.findById({
    _id: request.id
  }).exec().then(res => {
    if (res) {
      res.name = request.name;
      res.level = request.level;
      res.save();
      return Promise.resolve(true);
    }
    return Promise.reject(false);
  })
}

function deleteRestrict(request) {
  return Restrict.findByIdAndRemove({
    _id: request.id
  }).exec().then(res => {
    return Promise.resolve(true);
  })
}
