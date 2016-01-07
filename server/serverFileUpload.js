var express = require("express");
var fs = require("fs");
var multer  = require("multer");

var app     = express();

var storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function (req, file, cb) {
    cb(null, file.originalname + '-' + Date.now());
  }
});

var upload = multer({ storage: storage });

app.use(express.static('./public'));

app.post('/api/file', upload.array('file'), function (req, res) {

  console.log("received " + req.files.length + " files");// form files
  for(var i=0; i < req.files.length; i++) {
  	console.log("### " + req.files[i].path);
  }
  //console.log("The URL for the file is:" + "localhost:3000\\"+req.file.path);

  res.status(204).end();  

});

app.get('/', function (req, res) {

  res.sendFile("index.html");

});

app.get('/uploads', function (req, res) {
	fs.readdir("./public/uploads", function(err, list) {
			res.end(JSON.stringify(list));
	});
  
});

app.listen(3000, function () {

  console.log("Server is listening on port 3000");
  console.log("Open http://localhost:3000 and upload some files!")

});
