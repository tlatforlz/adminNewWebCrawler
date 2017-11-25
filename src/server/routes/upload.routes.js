var router = require('express').Router();
var http = require('http');
var path = require('path');
var fs = require("fs");

module.exports = function () {
  router.post("/", update);

  function update(req, res, next) {
    var dest, fileName, l, tmpPath;
    tmpPath = req.files.upload.path;
    l = tmpPath.split('/').length;
    fileName = tmpPath.split('/')[l - 1] + "_" + req.files.upload.name;
    dest = __dirname + "/public/uploads/" + fileName;
    fs.readFile(req.files.upload.path, function (err, data) {
      if (err) {
        console.log('this is bug');
        return;
      }
      fs.writeFile(dest, data, function (err) {
        var html;
        if (err) {
          console.log('this is bug');
          return;
        }
        html = "";
        html += "<script type='text/javascript'>";
        html += "    var funcNum = " + req.query.CKEditorFuncNum + ";";
        html += "    var url     = \"/uploads/" + fileName + "\";";
        html += "    var message = \"Uploaded file successfully\";";
        html += "";
        html += "    window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
        html += "</script>";
        res.stauts(200).send(html);
      });
    });
  }

  return router;
}
