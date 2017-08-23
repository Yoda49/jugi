// ======================================================
// JUGI. Jimp User Graphics Interface. Client side part.
// ======================================================

// author: Pavel Yurevich aka yoda49
// version: 0.1.0

// ======================================================
// VARIABLES
// ======================================================

var m0 = false;
var m1 = false; 
var m2 = false;
var m3 = false;
var mcnt = 0; // counter for menu animation

var link = undefined;
	
var frame1_active = undefined;
var frame2_active = undefined;
var frame3_active = undefined;

// image dimensions
var image_w = undefined;
var image_h = undefined;

// left-top corner of frame
var frame_x1 = 0;
var frame_y1 = 0;

// right-bottom corner of frame
var frame_x2 = 50;
var frame_y2 = 50;

// center of frame
var frame_center_x = frame_x1 + ((frame_x2 - frame_x1) / 2) - 12;
var frame_center_y = frame_y1 + ((frame_y2 - frame_y1) / 2) - 12;

// minimum frame dimensions
var frame_min_h = 50;
var frame_min_w = 50;

// current frame dimensions
var frame_h = 100;
var frame_w = 100;
	
// old x & y
var xo = undefined;
var yo = undefined;
	
// frame setting
var frameColor   = "black";
var frameOpacity = "0.15";
	
var jpegQuality = 90;
	
// default settings
defaults = {
	frame_x1: 0,
	frame_y1: 0,
};
	
// data for save
var savePath = "";
var fileName = undefined;

var imageLoaded  = false;
var isImageLocal = undefined;
	
	// for status
var timerId = undefined;
var status  = undefined;
var blockStatus = false;


// ======================================================
// INIT FUNCTION
// ======================================================
function init(config) 
{
	if (config != undefined && typeof(config) == "object")
	{
		if (config.blockFilesOps === true) 
		{
			document.getElementById("link").disabled = true;
			document.getElementById("save_path").disabled = true;
			document.getElementById("file_name").disabled = true;
		}
		
		// check for minimum sizes
		if (config.cropFrameMinWidth != undefined)
		{
			frame_min_w = config.cropFrameMinWidth;
			if (isNaN(frame_min_w) || frame_min_w < 50 || frame_min_w > 200) frame_min_w = 50;
			frame_x2 = frame_x1 + frame_min_w;
		}
		// 
		if (config.cropFrameMinHeight != undefined)
		{
			frame_min_h = config.cropFrameMinHeight;
			if (isNaN(frame_min_h) || frame_min_h < 50 || frame_min_h > 200) frame_min_h = 50;
			frame_y2 = frame_y1 + frame_min_h;
		}
		
		// check for right-left corner
		if (config.initialValueX1 != undefined)
		{
			frame_x1 = config.initialValueX1;
			if (isNaN(frame_x1) || frame_x1 < 0) frame_x1 = 0;
			frame_x2 = frame_x1 + frame_min_w;
			defaults.frame_x1 = config.initialValueX1;
		}
		if (config.initialValueY1 != undefined)
		{
			frame_y1 = config.initialValueY1;
			if (isNaN(frame_y1) || frame_y1 < 0) frame_y1 = 0;
			frame_y2 = frame_y1 + frame_min_h;
			defaults.frame_y1 = config.initialValueY1;
		}
		if (config.cropFrameColor != undefined)
		{
			frameColor = config.cropFrameColor;
			if (typeof(frameColor) != "string" || frameColor == "" || frameColor.length > 100) frameColor = "black";
		}
		if (config.cropFrameOpacity != undefined)
		{
			frameOpacity = config.cropFrameOpacity;
			if (typeof(frameOpacity) == "string" || isNaN(frameOpacity) || frameOpacity > 1  || frameOpacity < 0) frameOpacity = "0.15"; else frameOpacity = frameOpacity.toString();
		}
		
		if (!isNaN(config.jpegQuality) && config.jpegQuality > 1 && config.jpegQuality <= 100) jpegQuality = config.jpegQuality;
		
		if (config.savePath != undefined) savePath = config.savePath;
		if (savePath.charAt(savePath.length - 1) == "/") savePath = savePath.substring(0, savePath.length - 1);
		
	} // END OF CONFIG
} // INIT END


// fill html attr`s
document.getElementById("frame_size_x").min   = frame_min_w;
document.getElementById("frame_size_x").value = frame_min_w;
document.getElementById("frame_size_y").min   = frame_min_h;
document.getElementById("frame_size_y").value = frame_min_h;	
document.getElementById("jpeg_quality").value = jpegQuality;

// set style to frame
document.getElementById("frame0").style.opacity    = frameOpacity;
document.getElementById("frame0").style.background = frameColor;
	
// image handlerS
document.getElementById("image").addEventListener("load",  imageLoadComplete);
document.getElementById("image").addEventListener("error", imageLoadError);
	
// ==============================================================================
// SET CLICK FUNCTIONS
// ==============================================================================
document.getElementById("m1_toggle").onclick = function () 
{
	if (m1) 
	{
		document.getElementById("m1").style.height = "17px";
		document.getElementById("m1a").innerHTML = "&#9660;";
		m1 = false;
	}
	else
	{
		document.getElementById("m1").style.height = "110px";
		document.getElementById("m1a").innerHTML = "&#9650;";
		m1 = true;
	}
}

document.getElementById("m2_toggle").onclick = function () 
{
	if (m2) 
	{
		document.getElementById("m2").style.height = "17px";
		document.getElementById("m2a").innerHTML = "&#9660;";
		m2 = false;
	}
	else
	{
		document.getElementById("m2").style.height = "135px";
		document.getElementById("m2a").innerHTML = "&#9650;";
		m2 = true;
	}
}

document.getElementById("m3_toggle").onclick = function () 
{
	if (m3) 
	{
		document.getElementById("m3").style.height = "17px";
		document.getElementById("m3a").innerHTML = "&#9660;";
		m3 = false;
	}
	else
	{
		document.getElementById("m3").style.height = "270px";
		document.getElementById("m3a").innerHTML = "&#9650;";
		m3 = true;
	}
}

document.getElementById("main_menu").onclick = function () 
{
	if (m0) 
	{
		mcnt = 0;
		
		function animation ()
		{
			mcnt -= 10;
			if (mcnt == -480) 
			{
				m0 = false;
				return;
			}
			
			setTimeout(function (){
				document.getElementById("wrapper").style.left = mcnt + "px";

				animation ();
			},1);
		}
		animation();
	}
	else
	{
		mcnt = -470;
		
		function animation ()
		{
			mcnt += 10;
			if (mcnt == 10) 
			{
				m0 = true;
				return;
			}
			
			setTimeout(function (){
				document.getElementById("wrapper").style.left = mcnt + "px";
				animation ();
			},1);
		}
		animation();
	}
}
	


	
// parse url when page is loaded
if (document.location.search != "")
{
	link = (window.location.search).substring(1); // delete "?"
	handleUrl();
}
	

// ==============================================================================
// HANDLER`S FOR MOUSE EVENTS
// ==============================================================================	

// handler for body mouse move event
document.body.onmousemove = function()
{
	var x = event.clientX;
	var y = event.clientY;

	if (frame1_active)
	{
		if (frame_x1 >= 0 && frame_x1 <= image_w - frame_min_w) frame_x1 += x - xo;
		if (frame_y1 >= 0 && frame_y1 <= image_h - frame_min_h) frame_y1 += y - yo;
		
		if (frame_x1 > frame_x2 - frame_min_w) frame_x2 = frame_x1 + frame_min_w;
		if (frame_y1 > frame_y2 - frame_min_h) frame_y2 = frame_y1 + frame_min_h;
	}
	
	if (frame2_active)
	{
		// refresh frame_x2 & frame_y2
		if (frame_x2 >= frame_min_w && frame_x2 <= image_w) frame_x2 += x - xo;
		if (frame_y2 >= frame_min_h && frame_y2 <= image_h) frame_y2 += y - yo;
		
		if (frame_x2 < frame_x1 + frame_min_w) frame_x1 = frame_x2 - frame_min_w;
		if (frame_y2 < frame_y1 + frame_min_h) frame_y1 = frame_y2 - frame_min_h;
	}
	
	if (frame3_active)
	{
		if ((frame_center_x - frame_min_w / 2 + 12) >= 0 && (frame_center_x + frame_min_w / 2 - 12) <= image_w) 
		{
			frame_x1 += x - xo;
			frame_x2 += x - xo;
		}
		if ((frame_center_y - frame_min_h / 2 + 12) >= 0 && (frame_center_y + frame_min_h / 2 -12) <= image_h) 
		{
			frame_y1 += y - yo;
			frame_y2 += y - yo;
		}
		
	}

	if (frame_x1 < 0) frame_x1 = 0;
	if (frame_x2 > image_w) frame_x2 = image_w;
	if (frame_y1 < 0) frame_y1 = 0;
	if (frame_y2 > image_h) frame_y2 = image_h;
	
	
	if (frame_x1 > image_w - frame_min_w) frame_x1 = image_w - frame_min_w;
	if (frame_x2 < frame_min_w) frame_x2 = frame_min_w;
	if (frame_y1 > image_h - frame_min_h) frame_y1 = image_h - frame_min_h
	if (frame_y2 < frame_min_h) frame_y2 = frame_min_h;

	frame_center_x = Math.floor(frame_x1 + (frame_w / 2)) - 12;
	frame_center_y = Math.floor(frame_y1 + (frame_h / 2)) - 12;
	
	if (frame1_active || frame2_active || frame3_active) redraw ();
	
	xo = x;
	yo = y;
	
	frame_w = frame_x2 - frame_x1;
	frame_h = frame_y2 - frame_y1;
}

// handler for frame1 mouse up event
document.getElementById('frame1').onmousedown = function ()
{
	frame1_active = true;
}
// handler for frame2 mouse up event
document.getElementById('frame2').onmousedown = function ()
{
	frame2_active = true;
}
// handler for frame3 mouse up event
document.getElementById('frame3').onmousedown = function ()
{
	frame3_active = true;
}
// handler for body mouse up event
document.body.onmouseup = function ()
{
	frame1_active = false;
	frame2_active = false;
	frame3_active = false;
}
// handler for body mouse leave event
document.body.onmouseleave = function ()
{
	frame1_active = false;
	frame2_active = false;
	frame3_active = false;
}


// ==============================================================================
// HANDLER`S FOR INPUT WINDOWS
// ==============================================================================	

// handler for frame_size_x input
document.getElementById('frame_size_x').onkeydown = function (key) 
{
	if (key.which == 13) frame_x_input();
}
document.getElementById('frame_size_x').onclick = frame_x_input;

function frame_x_input ()
{
	var x = parseInt(document.getElementById('frame_size_x').value);		
	if (x >= frame_min_w) 
	{
		frame_x2 = frame_x1 + x;
		if (frame_x2 > image_w) frame_x2 = image_w;
		frame_w = frame_x2 - frame_x1;
		frame_center_x = frame_x1 + (frame_w / 2) - 12;
		redraw();
	}
}

// handlerS for frame_size_y input
document.getElementById('frame_size_y').onkeydown = function (key) 
{
	if(key.which == 13)	frame_y_input();
}
document.getElementById('frame_size_y').onclick = frame_y_input;

function frame_y_input ()
{
	var y = parseInt(document.getElementById('frame_size_y').value);
	if (y >= frame_min_h) 
	{
		frame_y2 = frame_y1 + y;
		if (frame_y2 > image_h) frame_y2 = image_h;
		frame_h = frame_y2 - frame_y1;
		frame_center_y = frame_y1 + (frame_h / 2) - 12;
		redraw();
	}
}
// handler for link input
document.getElementById('link').onkeydown = function (key)
{ 
	if(key.which == 13)
	{
		link = document.getElementById("link").value;
		handleUrl();
	}
}

// handler for save_path input
document.getElementById("save_path").onkeydown = function () 
{
	fileName = document.getElementById('save_path').value;
}

// handler for file_name input
document.getElementById('file_name').onkeydown = function (key)	
{
	fileName = document.getElementById("file_name").value;
}

// handlerS for jpeg_quality input
document.getElementById('jpeg_quality').onchange =  function (key) 
{
	jpegQuality = document.getElementById("jpeg_quality").value;
}
	
	
// ==============================================================================
// FUNCTION FOR TOOLS BUTTONS
// ==============================================================================		
	
	// helper
	function checkForStandartErrors()
	{
		var error = false;
		
		if (link == "" || link == undefined ) error = "Link error!";
		if (fileName == "" || fileName == undefined) error = "Image filename error!";
		if (imageLoaded == false) error = "Image not loaded!";

		return error;
	}
	
	// brightness
	document.getElementById("jugi_brightness_button").onclick = function ()
	{
		var sp = savePath;
		var value = document.getElementById("jugi_brightness_value").value;
		var error = checkForStandartErrors();	
		
		if (isNaN(parseInt(value))) error = "Incorrect brightness value!";
		else 
		{
			if (value < 0 || value > 100) error = "Incorrect brightness value!";
		}
		
		if (sp == "") sp = "default";
		if (error)
		{
			handleStatus(error, false);
			return;
		}

		var xhr = new XMLHttpRequest();
		var query = "/jugi?";
		
		query += "link=" + link;
		query += "&savePath=" + sp;
		query += "&fileName=" + fileName;
		query += "&isImageLocal=" + isImageLocal;
		query += "&type=edit_image";
		query += "&option=brightness";
		query += "&value=" + value;
		
		xhr.open('GET', query, true);
		xhr.setRequestHeader('Content-Type', 'application/json');

		xhr.timeout = 5000;
		xhr.send();
		
		xhr.onreadystatechange = function() 
		{
			if (xhr.readyState != 4) return;
			if (xhr.status != 200) alert(xhr.status + ': ' + xhr.statusText);
			else 
			{
				document.getElementById("link").value = fileName;
				link = fileName;
				
				setTimeout(function() 
				{
					document.getElementById("image").src = fileName + "?" + new Date().getTime();
					closeMenu();
				}, 1000);
				
				handleStatus("Image brightness change OK!", true);
				blockStatus = true;
				isImageLocal = true;
			}
		}
	}
	
	// contrast
	document.getElementById("jugi_contrast_button").onclick = function ()
	{
		var sp = savePath;
		var value = document.getElementById("jugi_contrast_value").value;
		var error = checkForStandartErrors();	
		
		if (isNaN(parseInt(value))) error = "Incorrect contrast value!";
		else 
		{
			if (value < 0 || value > 100) error = "Incorrect contrast value!";
		}
		
		if (sp == "") sp = "default";
		if (error)
		{
			handleStatus(error, false);
			return;
		}

		var xhr = new XMLHttpRequest();
		var query = "/jugi?";
		
		query += "link=" + link;
		query += "&savePath=" + sp;
		query += "&fileName=" + fileName;
		query += "&isImageLocal=" + isImageLocal;
		query += "&type=edit_image";
		query += "&option=contrast";
		query += "&value=" + value;
		
		xhr.open('GET', query, true);
		xhr.setRequestHeader('Content-Type', 'application/json');

		xhr.timeout = 5000;
		xhr.send();
		
		xhr.onreadystatechange = function() 
		{
			if (xhr.readyState != 4) return;
			if (xhr.status != 200) alert(xhr.status + ': ' + xhr.statusText);
			else 
			{
				document.getElementById("link").value = fileName;
				link = fileName;
				
				setTimeout(function() 
				{
					document.getElementById("image").src = fileName + "?" + new Date().getTime();
					closeMenu();
				}, 1000);
				
				handleStatus("Image contrast change OK!", true);
				blockStatus = true;
				isImageLocal = true;
			}
		}
	}
	
	// opacity
	document.getElementById("jugi_opacity_button").onclick = function ()
	{
		var sp = savePath;
		var value = document.getElementById("jugi_opacity_value").value;
		var error = checkForStandartErrors();	
		
		if (isNaN(parseInt(value))) error = "Incorrect opacity value!";
		else 
		{
			if (value < 0 || value > 100) error = "Incorrect opacity value!";
		}
		
		if (sp == "") sp = "default";
		if (error)
		{
			handleStatus(error, false);
			return;
		}

		var xhr = new XMLHttpRequest();
		var query = "/jugi?";
		
		query += "link=" + link;
		query += "&savePath=" + sp;
		query += "&fileName=" + fileName;
		query += "&isImageLocal=" + isImageLocal;
		query += "&type=edit_image";
		query += "&option=opacity";
		query += "&value=" + value;
		
		xhr.open('GET', query, true);
		xhr.setRequestHeader('Content-Type', 'application/json');

		xhr.timeout = 5000;
		xhr.send();
		
		xhr.onreadystatechange = function() 
		{
			if (xhr.readyState != 4) return;
			if (xhr.status != 200) alert(xhr.status + ': ' + xhr.statusText);
			else 
			{
				document.getElementById("link").value = fileName;
				link = fileName;
				
				setTimeout(function() 
				{
					document.getElementById("image").src = fileName + "?" + new Date().getTime();
					closeMenu();
				}, 1000);
				
				handleStatus("Image opacity change OK!", true);
				blockStatus = true;
				isImageLocal = true;
			}
		}
	}
	
	// blur
	document.getElementById("jugi_blur_button").onclick = function ()
	{
		var sp = savePath;
		var value = document.getElementById("jugi_blur_value").value;
		var error = checkForStandartErrors();	
		
		if (isNaN(parseInt(value))) error = "Incorrect blur value!";
		else 
		{
			if (value < 0 || value > 100) error = "Incorrect blur value!";
		}
		if (sp == "") sp = "default";
		if (error)
		{
			handleStatus(error, false);
			return;
		}

		var xhr = new XMLHttpRequest();
		var query = "/jugi?";
		
		query += "link=" + link;
		query += "&savePath=" + sp;
		query += "&fileName=" + fileName;
		query += "&isImageLocal=" + isImageLocal;
		query += "&type=edit_image";
		query += "&option=blur";
		query += "&value=" + value;
		
		xhr.open('GET', query, true);
		xhr.setRequestHeader('Content-Type', 'application/json');

		xhr.timeout = 5000;
		xhr.send();
		
		xhr.onreadystatechange = function() 
		{
			if (xhr.readyState != 4) return;
			if (xhr.status != 200) alert(xhr.status + ': ' + xhr.statusText);
			else 
			{
				document.getElementById("link").value = fileName;
				link = fileName;
				
				setTimeout(function() 
				{
					document.getElementById("image").src = fileName + "?" + new Date().getTime();
					closeMenu();
				}, 1000);
				
				handleStatus("Image blur OK!", true);
				blockStatus = true;
				isImageLocal = true;
			}
		}
	}
	
	// posterize
	document.getElementById("jugi_posterize_button").onclick = function ()
	{
		var sp = savePath;
		var value = document.getElementById("jugi_posterize_value").value;
		var error = checkForStandartErrors();	
		
		if (isNaN(parseInt(value))) error = "Incorrect posterize value!";
		else 
		{
			if (value < 0 || value > 100) error = "Incorrect posterize value!";
		}
		if (sp == "") sp = "default";
		if (error)
		{
			handleStatus(error, false);
			return;
		}

		var xhr = new XMLHttpRequest();
		var query = "/jugi?";
		
		query += "link=" + link;
		query += "&savePath=" + sp;
		query += "&fileName=" + fileName;
		query += "&isImageLocal=" + isImageLocal;
		query += "&type=edit_image";
		query += "&option=posterize";
		query += "&value=" + value;
		
		xhr.open('GET', query, true);
		xhr.setRequestHeader('Content-Type', 'application/json');

		xhr.timeout = 5000;
		xhr.send();
		
		xhr.onreadystatechange = function() 
		{
			if (xhr.readyState != 4) return;
			if (xhr.status != 200) alert(xhr.status + ': ' + xhr.statusText);
			else 
			{
				document.getElementById("link").value = fileName;
				link = fileName;
				
				setTimeout(function() 
				{
					document.getElementById("image").src = fileName + "?" + new Date().getTime();
					closeMenu();
				}, 1000);
				
				handleStatus("Image posterize OK!", true);
				blockStatus = true;
				isImageLocal = true;
			}
		}
	}
	
	// pixelate
	document.getElementById("jugi_pixelate_button").onclick = function ()
	{
		var sp = savePath;
		var value = document.getElementById("jugi_pixelate_value").value;
		var error = checkForStandartErrors();	
		
		if (isNaN(parseInt(value))) error = "Incorrect pixelate value!";
		else 
		{
			if (value < 0 || value > 100) error = "Incorrect pixelate value!";
		}
		if (sp == "") sp = "default";
		if (error)
		{
			handleStatus(error, false);
			return;
		}

		var xhr = new XMLHttpRequest();
		var query = "/jugi?";
		
		query += "link=" + link;
		query += "&savePath=" + sp;
		query += "&fileName=" + fileName;
		query += "&isImageLocal=" + isImageLocal;
		query += "&type=edit_image";
		query += "&option=pixelate";
		query += "&value=" + value;
		
		xhr.open('GET', query, true);
		xhr.setRequestHeader('Content-Type', 'application/json');

		xhr.timeout = 5000;
		xhr.send();
		
		xhr.onreadystatechange = function() 
		{
			if (xhr.readyState != 4) return;
			if (xhr.status != 200) alert(xhr.status + ': ' + xhr.statusText);
			else 
			{
				document.getElementById("link").value = fileName;
				link = fileName;
				
				setTimeout(function() 
				{
					document.getElementById("image").src = fileName + "?" + new Date().getTime();
					closeMenu();
				}, 1000);
				
				handleStatus("Image pixelate OK!", true);
				blockStatus = true;
				isImageLocal = true;
			}
		}
	}
	
	// sepia
	document.getElementById("jugi_sepia_button").onclick = function ()
	{
		var sp = savePath;
		var error = checkForStandartErrors();	

		if (error)
		{
			handleStatus(error, false);
			return;
		}

		var xhr = new XMLHttpRequest();
		var query = "/jugi?";
		
		query += "link=" + link;
		query += "&savePath=" + sp;
		query += "&fileName=" + fileName;
		query += "&isImageLocal=" + isImageLocal;
		query += "&type=edit_image";
		query += "&option=sepia";
		
		xhr.open('GET', query, true);
		xhr.setRequestHeader('Content-Type', 'application/json');

		xhr.timeout = 5000;
		xhr.send();
		
		xhr.onreadystatechange = function() 
		{
			if (xhr.readyState != 4) return;
			if (xhr.status != 200) alert(xhr.status + ': ' + xhr.statusText);
			else 
			{
				document.getElementById("link").value = fileName;
				link = fileName;
				
				setTimeout(function() 
				{
					document.getElementById("image").src = fileName + "?" + new Date().getTime();
					closeMenu();
				}, 1000);
				
				handleStatus("Image sepia OK!", true);
				blockStatus = true;
				isImageLocal = true;
			}
		}
	}
	
	// jugi_rotate
	document.getElementById("jugi_rotate_button").onclick = function ()
	{
		var sp = savePath;
		var angle = document.getElementById("jugi_rotate_value").value;
		var error = checkForStandartErrors();
		
		if (isNaN(parseInt(angle))) error = "Incorrect angle value!";
		else 
		{
			if (angle < 1 || value > 359) error = "Incorrect angle value!";
		}
		
		if (sp == "") sp = "default";
		if (error)
		{
			handleStatus(error, false);
			return;
		}
		
		var xhr = new XMLHttpRequest();
		var query = "/jugi?";
		
		query += "link=" + link;
		query += "&savePath=" + sp;
		query += "&fileName=" + fileName;
		query += "&isImageLocal=" + isImageLocal;
		query += "&type=edit_image";
		query += "&option=rotate";
		query += "&angle=" + angle;
		
		xhr.open('GET', query, true);
		xhr.setRequestHeader('Content-Type', 'application/json');

		xhr.timeout = 5000;
		xhr.send();
		
		xhr.onreadystatechange = function() 
		{
			if (xhr.readyState != 4) return;
			if (xhr.status != 200) alert(xhr.status + ': ' + xhr.statusText);
			else 
			{
				document.getElementById("link").value = fileName;
				link = fileName;
				
				setTimeout(function() 
				{
					document.getElementById("image").src = fileName + "?" + new Date().getTime();
					closeMenu();
				}, 1000);
				
				handleStatus("Image rotate OK!", true);
				blockStatus = true;
				isImageLocal = true;
			}
		}
	}
	
	// jugi_flip_h
	document.getElementById("jugi_flip_h").onclick = function ()
	{
		var sp = savePath;
		var error = checkForStandartErrors();
		
		if (sp == "") sp = "default";
		if (error)
		{
			handleStatus(error, false);
			return;
		}
		
		var xhr = new XMLHttpRequest();
		var query = "/jugi?";
		
		query += "link=" + link;
		query += "&savePath=" + sp;
		query += "&fileName=" + fileName;
		query += "&isImageLocal=" + isImageLocal;
		query += "&type=edit_image";
		query += "&option=flip";
		query += "&flip=h";
		
		xhr.open('GET', query, true);
		xhr.setRequestHeader('Content-Type', 'application/json');

		xhr.timeout = 5000;
		xhr.send();
		
		xhr.onreadystatechange = function() 
		{
			if (xhr.readyState != 4) return;
			if (xhr.status != 200) alert(xhr.status + ': ' + xhr.statusText);
			else 
			{
				document.getElementById("link").value = fileName;
				link = fileName;
				
				setTimeout(function() 
				{
					document.getElementById("image").src = fileName + "?" + new Date().getTime();
					closeMenu();
				}, 1000);
				
				handleStatus("Image horizontal flip OK!", true);
				blockStatus = true;
				isImageLocal = true;
			}
		}
	}
	
	// jugi_flip_v
	document.getElementById("jugi_flip_v").onclick = function ()
	{
		var sp = savePath;
		var error = checkForStandartErrors();
		
		if (sp == "") sp = "default";
		if (error)
		{
			alert(error);
			return;
		}
		
		var xhr = new XMLHttpRequest();
		var query = "/jugi?";
		
		query += "link=" + link;
		query += "&savePath=" + sp;
		query += "&fileName=" + fileName;
		query += "&isImageLocal=" + isImageLocal;
		query += "&type=edit_image";
		query += "&option=flip";
		query += "&flip=v";
		
		xhr.open('GET', query, true);
		xhr.setRequestHeader('Content-Type', 'application/json');

		xhr.timeout = 5000;
		xhr.send();
		
		xhr.onreadystatechange = function() 
		{
			if (xhr.readyState != 4) return;
			if (xhr.status != 200) alert(xhr.status + ': ' + xhr.statusText);
			else 
			{
				document.getElementById("link").value = fileName;
				link = fileName;
				
				setTimeout(function() 
				{
					document.getElementById("image").src = fileName + "?" + new Date().getTime();
					closeMenu();
				}, 1000);
				
				handleStatus("Image vertical flip OK!", true);
				blockStatus = true;
				isImageLocal = true;
			}
		}
	}
	
	// handler for button "jugi crop"
	document.getElementById("jugi_crop").onclick = function ()
	{
		var error = checkForStandartErrors();
		var sp = savePath;
		
		if (sp == "") sp = "default";
		if (image_w < frame_w || image_h < frame_h || frame_x1 > frame_x2 || frame_y1 > frame_y2 || frame_x2 > image_w || frame_y2 > image_h) error = "Image crop frame error!";
		
		if (error)
		{
			alert(error);
			return;
		}
		
		var xhr = new XMLHttpRequest();
		var query = "/jugi?";
		
		query += "link=" + link;
		query += "&savePath=" + sp;
		query += "&fileName=" + fileName;
		query += "&isImageLocal=" + isImageLocal;
		query += "&type=edit_image";
		query += "&option=crop";
		query += "&frameX1=" + frame_x1;
		query += "&frameY1=" + frame_y1;
		query += "&frameWidth=" + frame_w;
		query += "&frameHeight=" + frame_h;
		query += "&jpegQuality=" + jpegQuality;
		
		xhr.open('GET', query, true);
		xhr.setRequestHeader('Content-Type', 'application/json');

		xhr.timeout = 5000;
		xhr.send();
		
		xhr.onreadystatechange = function() 
		{
			if (xhr.readyState != 4) return;
			if (xhr.status != 200) alert(xhr.status + ': ' + xhr.statusText);
			else 
			{
				document.getElementById("link").value = fileName;
				link = fileName;
				
				setTimeout(function() 
				{
					document.getElementById("image").src = fileName + "?" + new Date().getTime();
					closeMenu();
				}, 1000);
				
				handleStatus("Image crop OK!", true);
				blockStatus = true;
				isImageLocal = true;
			}
		}
	}
	
	// handler for button "jugi resize"
	document.getElementById("jugi_resize").onclick = function ()
	{
		var error = checkForStandartErrors();
		var sp = savePath;
		var newWidth     = document.getElementById("new_size_x").value;
		var newHeight    = document.getElementById("new_size_y").value;
		
		if (sp == "") sp = "default";
		
		if ((newWidth == "" || isNaN(newWidth)) && (newHeight == "" || isNaN(newHeight))) error = "Resize frame error!";
		
		if (error)
		{
			alert(error);
			return;
		}

		var xhr = new XMLHttpRequest();
		var query = "/jugi?";
		
		query += "link=" + link;
		query += "&savePath=" + sp;
		query += "&fileName=" + fileName;
		query += "&isImageLocal=" + isImageLocal;
		query += "&type=edit_image";
		query += "&option=resize";
		query += "&newWidth=" + newWidth;
		query += "&newHeight=" + newHeight;
		query += "&jpegQuality=" + jpegQuality;
		
		xhr.open('GET', query, true);
		xhr.setRequestHeader('Content-Type', 'application/json');

		xhr.timeout = 5000;
		xhr.send();
		
		xhr.onreadystatechange = function() 
		{
			if (xhr.readyState != 4) return;
			if (xhr.status != 200) alert(xhr.status + ': ' + xhr.statusText);
			else 
			{
				//alert(xhr.responseText);
				document.getElementById("link").value = fileName;
				link = fileName;
				
				setTimeout(function() 
				{
					document.getElementById("image").src = fileName + "?" + new Date().getTime();
					closeMenu();
				}, 1000);
				
				handleStatus("Image resize OK!", true);
				blockStatus = true;
				isImageLocal = true;
			}
		}
	}
	

	
	
	
	
// ===============================================
// IMAGE LOAD SUCCESSFULLY
// ==============================================

function imageLoadComplete() 
{
	document.getElementById("image" ).style.display = "block";
	
	frame_x1 = defaults.frame_x1;
	frame_y1 = defaults.frame_y1;
	frame_x2 = frame_x1 + frame_min_w;
	frame_y2 = frame_y1 + frame_min_h; 
	frame_center_x = frame_x1 + frame_min_w / 2 - 12;
	frame_center_y = frame_y1 + frame_min_h / 2 - 12;
	
	// get image width & height
	image_w = document.getElementById("image").offsetWidth;
	image_h = document.getElementById("image").offsetHeight;
	
	if (frame_x2 > image_w) frame_x2 = image_w;
	if (frame_y2 > image_h) frame_y2 = image_h;

	// fill fields in menu
	document.getElementById("size_x").value = image_w;
	document.getElementById("size_y").value = image_h;
	
	// fill fields in menu
	document.getElementById('frame_size_x').value = Math.floor(frame_x2 - frame_x1);
	document.getElementById('frame_size_y').value = Math.floor(frame_y2 - frame_y1);
	
	document.getElementById("frame3").style.left  = (frame_center_x) + "px";
	document.getElementById("frame3").style.top   = (frame_center_y) + "px";

	document.getElementById("frame0").style.left   =  frame_x1 + "px";
	document.getElementById("frame0").style.top    =  frame_y1 + "px";
	document.getElementById("frame0").style.width  = (frame_x2 - frame_x1) + "px";
	document.getElementById("frame0").style.height = (frame_y2 - frame_y1) + "px";
	
	document.getElementById("frame1").style.left   = (frame_x1) + "px";
	document.getElementById("frame1").style.top    = (frame_y1) + "px";
	
	document.getElementById("frame2").style.left   = (frame_x2 - 24) + "px";
	document.getElementById("frame2").style.top    = (frame_y2 - 24) + "px";
	
	document.getElementById("frame3").style.left   = (frame_center_x) + "px";
	document.getElementById("frame3").style.top    = (frame_center_y) + "px";
	
	// show 
	document.getElementById("frame0").style.display =  "block";
	document.getElementById("frame1").style.display =  "block";
	document.getElementById("frame2").style.display =  "block";
	document.getElementById("frame3").style.display =  "block";
	
	redraw();
	imageLoaded = true;
	
	if (blockStatus == false) 
	{
		handleStatus("The image is successfully loaded!", true);
		if (m1) document.getElementById("m1").click();
	}

	blockStatus = false;

	document.getElementById("file_name").value = fileName;
	document.getElementById("save_path").value = savePath;
}

// ==============================================
// IMAGE LOAD ERROR
// ==============================================
function imageLoadError() 
{
	clearFields();
	handleStatus("Image loading error!", false);
}

// ==============================================
// REDRAW FRAME
// ==============================================
function redraw()
{
	document.getElementById('frame_size_x').value  = Math.floor(frame_x2 - frame_x1);
	document.getElementById('frame_size_y').value  = Math.floor(frame_y2 - frame_y1);

	document.getElementById("frame0").style.left   =  frame_x1 + "px";
	document.getElementById("frame0").style.top    =  frame_y1 + "px";
	document.getElementById("frame0").style.width  = (frame_x2 - frame_x1) + "px";
	document.getElementById("frame0").style.height = (frame_y2 - frame_y1) + "px";
	
	document.getElementById("frame1").style.left   = (frame_x1) + "px";
	document.getElementById("frame1").style.top    = (frame_y1) + "px";
	
	document.getElementById("frame2").style.left   = (frame_x2 - 24) + "px";
	document.getElementById("frame2").style.top    = (frame_y2 - 24) + "px";
	
	document.getElementById("frame3").style.left   = (frame_center_x) + "px";
	document.getElementById("frame3").style.top    = (frame_center_y) + "px";
}
	
// ==============================================
// HANDLE URL
// ==============================================	
function handleUrl()
{
	var url = link;
	var pos = 0;
	
	// if user add +
	if (link.substring(0, 2) != "+/")
	{
		pos = url.search("//");
		if (pos == -1 || (url.substring(0, pos) != "http:" && url.substring(0, pos) != "https:" && url.substring(0, pos) != "")) 
		{
			handleStatus("Wrong URL!", false); 
			clearFields(); 
			return;
		}
		url = url.substring(pos + 2);
		
		pos = url.search("/");
		if (pos == -1) 
		{
			handleStatus("Wrong URL!", false); 
			clearFields(); 
			return;
		}
		if (url.substring(0, pos) == document.location.host) isImageLocal = true; else isImageLocal = false;
	}
	else
	{
		link = link.substring(1);
		url = url.substring(1);
		isImageLocal = true;
	}	
	
	if (isImageLocal)
	{
		// fill filetype field;
		document.getElementById("source").value = "Source: local";
		fileName = url.substring(pos);
	}
	else
	{
		// fill filetype field;
		document.getElementById("source").value = "Source: web";
		
		fileName = (link).split("/");
		fileName = "/" + fileName[fileName.length - 1];
	}
						
	document.getElementById("image").src = link + "?old";
	document.getElementById("link").value = link;
				
}


// =======================================================
// HELPERS
// =======================================================

function closeMenu()
{
	document.getElementById("m1").style.height = "17px";
	document.getElementById("m2").style.height = "17px";
	document.getElementById("m3").style.height = "17px";
	
	document.getElementById("m1a").innerHTML = "&#9660;";
	document.getElementById("m2a").innerHTML = "&#9660;";
	document.getElementById("m3a").innerHTML = "&#9660;";
	m1 = false;
	m2 = false;
	m3 = false;	
}

// view result in status line
function handleStatus(message, type)
{
	document.getElementById("statistic_msg").innerHTML = message;
	
	if (type == true ) document.getElementById("statistic_color").style.color = "green";
	if (type == false) document.getElementById("statistic_color").style.color = "red";
	
	if (status) clearTimeout(timerId);
	
	timeId = setTimeout(function ()
	{
		document.getElementById("statistic_msg").innerHTML = ""; 
		document.getElementById("statistic_color").style.color = "black";
		status = false;
	}, 5000);
}

// clear all inputs
function clearFields()
{
	document.getElementById("frame0").style.display = "none";
	document.getElementById("frame1").style.display = "none";
	document.getElementById("frame2").style.display = "none";
	document.getElementById("frame3").style.display = "none";
	document.getElementById("image" ).style.display = "none";
	
	document.getElementById("save_path" ).value = "";
	document.getElementById("file_name" ).value = "";
	document.getElementById("new_size_x" ).value = "";
	document.getElementById("new_size_y" ).value = "";
	
	document.getElementById("source" ).value = "";
	
	document.getElementById("size_x" ).value = "";
	document.getElementById("size_y" ).value = "";
	document.getElementById("frame_size_x" ).value = frame_min_w;
	document.getElementById("frame_size_y" ).value = frame_min_h;
	
	document.getElementById("jpeg_quality" ).value = jpegQuality;
}

document.body.onselectstart = function() {return false}
