// ======================================================
// JUGI. Jimp User Graphics Interface. Server side part.
// ======================================================

// author: Pavel Yurevich aka yoda49
// version: 0.1.0

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

	if      (req.query.option == "resize"    ) resizeImage (req, res);
	else if (req.query.option == "crop"      ) cropImage   (req, res);
	else if (req.query.option == "flip"      ) flipImage   (req, res);
	else if (req.query.option == "rotate"    ) rotateImage (req, res);
	else if (req.query.option == "brightness") brightness  (req, res);
	else if (req.query.option == "contrast"  ) contrast    (req, res);
	else if (req.query.option == "opacity"   ) opacity     (req, res);
	else if (req.query.option == "blur"      ) blur        (req, res);
	else if (req.query.option == "posterize" ) posterize   (req, res);
	else if (req.query.option == "sepia"     ) sepia       (req, res);
	else if (req.query.option == "pixelate"  ) pixelate    (req, res);
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

// =======================================================================
// FLIP IMAGE
//========================================================================
function flipImage(req, res)
{
	var link         = req.query.link;
	var savePath     = req.query.savePath;
	var isImageLocal = (req.query.isImageLocal == "true");
	var fileName     = req.query.fileName; 
	var flip         = req.query.flip;
	
	if (savePath == "default") savePath = __dirname + "/public";
	
	jimp.read((isImageLocal ? savePath + link : link), function (err, img) 
	{
		if (err) 
		{
			console.log("JUGI [flip]: " + err);
			res.send("ERROR");
			return;
		}
		
		console.log("JUGI [flip]: " + link + (flip == "v" ? " vertical." : " horizontal."));
		console.log("JUGI [save]: " + savePath + fileName); 
		
		img.flip(flip == "h", flip=="v").write(savePath + fileName);
		res.send("OK");
	});
}

// =======================================================================
// ROTATE IMAGE
//========================================================================
function rotateImage(req, res)
{
	var link         = req.query.link;
	var savePath     = req.query.savePath;
	var isImageLocal = (req.query.isImageLocal == "true");
	var fileName     = req.query.fileName; 
	var angle        = parseInt(req.query.angle);
	
	if (angle < 1) angle = 1;
	if (angle > 359) angle = 359;
	
	if (savePath == "default") savePath = __dirname + "/public";
	
	jimp.read((isImageLocal ? savePath + link : link), function (err, img) 
	{
		if (err) 
		{
			console.log("JUGI [rotate]: " + err);
			res.send("ERROR");
			return;
		}
		
		console.log("JUGI [rotate]: " + link + " by angle " + angle);
		console.log("JUGI [save]: " + savePath + fileName); 
		
		img.rotate(angle, false).write(savePath + fileName);
		res.send("OK");
	});
}

// =======================================================================
// BRIGHTNESS
//========================================================================
function brightness(req, res)
{
	var link         = req.query.link;
	var savePath     = req.query.savePath;
	var isImageLocal = (req.query.isImageLocal == "true");
	var fileName     = req.query.fileName; 
	var value        = parseInt(req.query.value);
	
	if      (value == 0  ) value = -1;
	else if (value == 100) value =  1;
	else if (value == 50 ) value =  0;
	else if (value > 0 && value < 50) value = -1 * (1 - (value / 50));
	else value = (value - 50) / 50;

	
	if (savePath == "default") savePath = __dirname + "/public";
	
	jimp.read((isImageLocal ? savePath + link : link), function (err, img) 
	{
		if (err) 
		{
			console.log("JUGI [brightness]: " + err);
			res.send("ERROR");
			return;
		}
		
		console.log("JUGI [brightness]: " + link + " set brightess value to " + value);
		console.log("JUGI [save]: " + savePath + fileName); 
		
		img.brightness(value).write(savePath + fileName);
		res.send("OK");
	});
}

// =======================================================================
// CONTRAST
//========================================================================
function contrast(req, res)
{
	var link         = req.query.link;
	var savePath     = req.query.savePath;
	var isImageLocal = (req.query.isImageLocal == "true");
	var fileName     = req.query.fileName; 
	var value        = parseInt(req.query.value);
	
	if      (value == 0  ) value = -1;
	else if (value == 100) value =  1;
	else if (value == 50 ) value =  0;
	else if (value > 0 && value < 50) value = -1 * (1 - (value / 50));
	else value = (value - 50) / 50;

	
	if (savePath == "default") savePath = __dirname + "/public";
	
	jimp.read((isImageLocal ? savePath + link : link), function (err, img) 
	{
		if (err) 
		{
			console.log("JUGI [contrast]: " + err);
			res.send("ERROR");
			return;
		}
		
		console.log("JUGI [contrast]: " + link + " set contrast value to " + value);
		console.log("JUGI [save]: " + savePath + fileName); 
		
		img.contrast(value).write(savePath + fileName);
		res.send("OK");
	});
}

// =======================================================================
// OPACITY
//========================================================================
function opacity(req, res)
{
	var link         = req.query.link;
	var savePath     = req.query.savePath;
	var isImageLocal = (req.query.isImageLocal == "true");
	var fileName     = req.query.fileName; 
	var value        = parseInt(req.query.value) / 100;

	if (savePath == "default") savePath = __dirname + "/public";
	
	jimp.read((isImageLocal ? savePath + link : link), function (err, img) 
	{
		if (err) 
		{
			console.log("JUGI [opacity]: " + err);
			res.send("ERROR");
			return;
		}
		
		console.log("JUGI [opacity]: " + link + " set opacity value to " + value);
		console.log("JUGI [save]: " + savePath + fileName); 
		
		img.opacity(value).write(savePath + fileName);
		res.send("OK");
	});
}

// =======================================================================
// OPACITY
//========================================================================
function blur(req, res)
{
	var link         = req.query.link;
	var savePath     = req.query.savePath;
	var isImageLocal = (req.query.isImageLocal == "true");
	var fileName     = req.query.fileName; 
	var value        = parseInt(req.query.value);
	
	if (savePath == "default") savePath = __dirname + "/public";
	
	jimp.read((isImageLocal ? savePath + link : link), function (err, img) 
	{
		if (err) 
		{
			console.log("JUGI [blur]: " + err);
			res.send("ERROR");
			return;
		}
		
		console.log("JUGI [blur]: " + link + " set blur value to " + value);
		console.log("JUGI [save]: " + savePath + fileName); 
		
		img.blur(value).write(savePath + fileName);
		res.send("OK");
	});
}

// =======================================================================
// POSTERIZE
//========================================================================
function posterize(req, res)
{
	var link         = req.query.link;
	var savePath     = req.query.savePath;
	var isImageLocal = (req.query.isImageLocal == "true");
	var fileName     = req.query.fileName; 
	var value        = parseInt(req.query.value);
	
	if (savePath == "default") savePath = __dirname + "/public";
	
	jimp.read((isImageLocal ? savePath + link : link), function (err, img) 
	{
		if (err) 
		{
			console.log("JUGI [posterize]: " + err);
			res.send("ERROR");
			return;
		}
		
		console.log("JUGI [posterize]: " + link + " set posterize value to " + value);
		console.log("JUGI [save]: " + savePath + fileName); 
		
		img.posterize(value).write(savePath + fileName);
		res.send("OK");
	});
}

// =======================================================================
// SEPIA
//========================================================================
function sepia(req, res)
{
	var link         = req.query.link;
	var savePath     = req.query.savePath;
	var isImageLocal = (req.query.isImageLocal == "true");
	var fileName     = req.query.fileName; 
	
	if (savePath == "default") savePath = __dirname + "/public";
	
	jimp.read((isImageLocal ? savePath + link : link), function (err, img) 
	{
		if (err) 
		{
			console.log("JUGI [sepia]: " + err);
			res.send("ERROR");
			return;
		}
		
		console.log("JUGI [sepia]: " + link + " set sepia effect");
		console.log("JUGI [save]: " + savePath + fileName); 
		
		img.sepia().write(savePath + fileName);
		res.send("OK");
	});
}

// =======================================================================
// PIXELATE
//========================================================================
function pixelate(req, res)
{
	var link         = req.query.link;
	var savePath     = req.query.savePath;
	var isImageLocal = (req.query.isImageLocal == "true");
	var fileName     = req.query.fileName; 
	var value        = parseInt(req.query.value);
	
	if (savePath == "default") savePath = __dirname + "/public";
	
	jimp.read((isImageLocal ? savePath + link : link), function (err, img) 
	{
		if (err) 
		{
			console.log("JUGI [pixelate]: " + err);
			res.send("ERROR");
			return;
		}
		
		console.log("JUGI [pixelate]: " + link + " set pixelate value to " + value);
		console.log("JUGI [save]: " + savePath + fileName); 
		
		img.pixelate(value).write(savePath + fileName);
		res.send("OK");
	});
}

module.exports.secure = secure;
module.exports.processor = processor;