var router = require('express').Router();
var http = require('http');
var path = require('path');
var fs = require("fs");
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var ip = require('ip');
module.exports = function () {
  router.post("/", multipartMiddleware, update);
  router.get('/', function (req, res) {
    res.render('index');
  });

  function update(req, res, next) {
    var fs = require('fs');

    fs.readFile(req.files.upload.path, function (err, data) {
      var newPath = __dirname + '/../public/uploads/' + req.files.upload.name;
      fs.writeFile(newPath, data, function (err) {
        if (err) console.log({
          err: err
        });
        else {
          console.log(ip.address());
          html = "";
          html += "<script type='text/javascript'>";
          html += "    var funcNum = " + req.query.CKEditorFuncNum + ";";
          html += "    var url     = \"http://" + ip.address() + ":3002/src/server/public/uploads/" + req.files.upload.name + "\";";
          html += "    var message = \"Uploaded file successfully\";";
          html += "";
          html += "    window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
          html += "</script>";

          res.send(html);
        }
      });
    });
  }

  return router;
}
