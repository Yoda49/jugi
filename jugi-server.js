// ======================================================
// JUGI. Jimp User Graphics Interface. Server side part.
// ======================================================

// author: Pavel Yurevich aka yoda49
// version: 0.0.6

var jimp          = require("jimp");
var fs            = require('fs');
var secureHandler = undefined;


// =======================================================================
// PROCESS IMAGES EDIT REQUEST
//========================================================================
function processor (req, res, next) 
{
	if (req.path != "/jugi" || req.method != "GET") return next();
	if (secureHandler != undefined && secureHandler(req, res) == false) return;

	if (req.query.option == "resize") resizeImage(req, res);
	else if (req.query.option == "crop") cropImage (req, res);
	else console.log("JUGI: unknown command!");
}

// =======================================================================
// SET UP SECURE HANDLER
//========================================================================
function secure (handler)
{
	secureHandler = handler;
	console.log("JUGI [init]: " + (secureHandler == undefined ? "Secure=OFF " : "Secure=ON "));
}


// =======================================================================
// RESIZE IMAGE
//========================================================================
function resizeImage(req, res)
{
	var link         = req.query.link;
	var savePath     = req.query.savePath; 
	var isImageLocal = (req.query.isImageLocal == "true");
	var fileName     = req.query.fileName; 
	var newWidth     = parseInt(req.query.newWidth);
	var newHeight    = parseInt(req.query.newHeight);
	var jpegQuality  = parseInt(req.query.jpegQuality);
	
	var extension    = link.split(".");
	extension = extension[extension.length - 1];
	
	if (savePath  == "default") savePath = __dirname + "/public";
	if (isNaN(newWidth )) newWidth  = jimp.AUTO;
	if (isNaN(newHeight)) newHeight = jimp.AUTO;
	
	jimp.read((isImageLocal ? savePath + link : link), function (err, img) 
	{
		
		if (err) 
		{
			console.log("JUGI [resize]: " + err);
			res.send("ERROR");
			return;
		}
		img.resize(newWidth, newHeight).quality(jpegQuality).write(savePath + fileName);
		
		if (extension == "jpg") console.log("JUGI [resize]: " + link + " resize to (" + newWidth + " x " + newHeight + ") with " + jpegQuality + " % jpeg quality. ");
		else console.log("JUGI [resize]: " + link + " resize to (" + newWidth + " x " + newHeight + ").");
		console.log("JUGI [save]: " + savePath + fileName); 
		
		res.send("OK");
	});
}

// =======================================================================
// CROP IMAGE
//========================================================================
function cropImage(req, res)
{
	var link         = req.query.link;
	var savePath     = req.query.savePath;
	var isImageLocal = (req.query.isImageLocal == "true");
	var fileName     = req.query.fileName; 
	var frameX1      = parseInt(req.query.frameX1);
	var frameY1      = parseInt(req.query.frameY1);
	var frameWidth   = parseInt(req.query.frameWidth);
	var frameHeight  = parseInt(req.query.frameHeight);
	var jpegQuality  = parseInt(req.query.jpegQuality);
	
	var extension    = link.split(".");
	extension = extension[extension.length - 1];
	
	if (savePath == "default") savePath = __dirname + "/public";
	
	jimp.read((isImageLocal ? savePath + link : link), function (err, img) 
	{
		if (err) 
		{
			console.log("JUGI [resize]: " + err);
			res.send("ERROR");
			return;
		}
		
		if (extension == "jpg") console.log("JUGI [crop]: " + link + " crop to (" + frameWidth + " x " + frameHeight + ") with " + jpegQuality + " % jpeg quality. ");
		else console.log("JUGI [crop]: " + link + " crop to (" + frameWidth + " x " + frameHeight + ").");
		console.log("JUGI [save]: " + savePath + fileName); 
		
		img.crop(frameX1, frameY1, frameWidth, frameHeight).quality(jpegQuality).write(savePath + fileName);
		res.send("OK");
	});
	
}

module.exports.secure = secure;
module.exports.processor = processor;