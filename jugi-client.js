// ======================================================
// JUGI. Jimp User Graphics Interface. Client side part.
// ======================================================

// author: Pavel Yurevich aka yoda49
// version: 0.0.5

var jugi = 
{
	link: undefined,
	
	frame1_active: undefined,
	frame2_active: undefined,
	frame3_active: undefined,

	// image dimensions
	image_w: undefined,
	image_h: undefined,

	// left-top corner of frame
	frame_x1: 0,
	frame_y1: 0,

	// right-bottom corner of frame
	frame_x2: 50,
	frame_y2: 50,

	// center of frame
	frame_center_x: this.frame_x1 + ((this.frame_x2 - this.frame_x1) / 2) - 12,
	frame_center_y: this.frame_y1 + ((this.frame_y2 - this.frame_y1) / 2) - 12,

	// minimum frame dimensions
	frame_min_h: 50,
	frame_min_w: 50,

	// current frame dimensions
	frame_h: 100,
	frame_w: 100,
	
	// old x & y
	xo: undefined,
	yo: undefined,
	
	// frame setting
	frameColor: "black",
	frameOpacity: "0.15",
	
	jpegQuality: 90,
	
	// default settings
	defaults: {
		frame_x1: 0,
		frame_y1: 0,
	},
	
	language: "eng",
	menuOrientation: "",
	
	// data for save
	savePath: "",
	fileName: undefined,

	imageLoaded: false,
	isImageLocal: undefined,
	
	// for status
	timerId: undefined,
	status: undefined,
	blockStatus: false,
	
	// init 
	init: function (config) 
	{
		document.body.onselectstart = function() {return false}
		
		// parse config
		if (config != undefined && typeof(config) == "object")
		{
			// check for minimum sizes
			if (config.cropFrameMinWidth != undefined)
			{
				this.frame_min_w = config.cropFrameMinWidth;
				if (isNaN(this.frame_min_w) || this.frame_min_w < 50 || this.frame_min_w > 200) this.frame_min_w = 50;
				this.frame_x2 = this.frame_x1 + this.frame_min_w;
			}
			// 
			if (config.cropFrameMinHeight != undefined)
			{
				this.frame_min_h = config.cropFrameMinHeight;
				if (isNaN(this.frame_min_h) || this.frame_min_h < 50 || this.frame_min_h > 200) this.frame_min_h = 50;
				this.frame_y2 = this.frame_y1 + this.frame_min_h;
			}
			
			// check for right-left corner
			if (config.initialValueX1 != undefined)
			{
				this.frame_x1 = config.initialValueX1;
				if (isNaN(this.frame_x1) || this.frame_x1 < 0) this.frame_x1 = 0;
				this.frame_x2 = this.frame_x1 + this.frame_min_w;
				this.defaults.frame_x1 = config.initialValueX1;
			}
			if (config.initialValueY1 != undefined)
			{
				this.frame_y1 = config.initialValueY1;
				if (isNaN(this.frame_y1) || this.frame_y1 < 0) this.frame_y1 = 0;
				this.frame_y2 = this.frame_y1 + this.frame_min_h;
				this.defaults.frame_y1 = config.initialValueY1;
			}
			if (config.cropFrameColor != undefined)
			{
				this.frameColor = config.cropFrameColor;
				if (typeof(this.frameColor) != "string" || this.frameColor == "" || this.frameColor.length > 100) this.frameColor = "black";
			}
			if (config.cropFrameOpacity != undefined)
			{
				this.frameOpacity = config.cropFrameOpacity;
				if (typeof(this.frameOpacity) == "string" || isNaN(this.frameOpacity) || this.frameOpacity > 1  || this.frameOpacity < 0) this.frameOpacity = "0.15"; else this.frameOpacity = this.frameOpacity.toString();
			}
			
			if (config.language    == "rus") this.language = "rus";		
			if (!isNaN(config.jpegQuality) && config.jpegQuality > 1 && config.jpegQuality <= 100) this.jpegQuality = config.jpegQuality;
			
			if (config.savePath != undefined) this.savePath = config.savePath;
			if (this.savePath.charAt(this.savePath.length - 1) == "/") this.savePath = this.savePath.substring(0, this.savePath.length - 1);
			if (config.menuOrientation != undefined && config.menuOrientation == "v") this.menuOrientation = "<BR>";		
		}
	
		// fill div "jui_menu"
		var menu = "";
		
		if (this.language == "eng")
		{
			menu += "	<DIV STYLE='border: 1px solid #777777; padding: 5px; display: inline-block; margin-bottom: 5px; background: #EEEEEE;'>";
			menu += "		<SPAN STYLE='display: inline-block; font: bold 90% verdana; width: 185px;'>Link to image:</SPAN>";
			menu += "		<INPUT STYLE='width: 247px; margin-bottom: 5px;' ID='link' PLACEHOLDER='Enter local or web link'><BR>";
			
			menu += "		<SPAN STYLE='display: inline-block; font: bold 90% verdana; width: 185px;'>Save path:</SPAN>";
			menu += "		<INPUT STYLE='width: 247px; margin-bottom: 5px;' ID='save_path' PLACEHOLDER='Default path (__dirname + &prime;public&prime;)'><BR>";
			
			menu += "		<SPAN STYLE='display: inline-block; font: bold 90% verdana; width: 185px;'>Add path / file name:</SPAN>";
			menu += "		<INPUT STYLE='width: 247px; margin-bottom: 5px;' ID='file_name'><BR>";
			
			menu += "		<SPAN STYLE='display: inline-block; font: bold 90% verdana; width: 185px;' ID='statistic_color'>Status:</SPAN>";
			menu += "		<INPUT STYLE='width: 247px;' ID='statistic' DISABLED>";
			menu += "	</DIV>" + this.menuOrientation;
			
			menu += "	<DIV STYLE='border: 1px solid #777777; padding: 5px; display:inline-block; background: #EEEEEE;'>";
			menu += "		<SPAN STYLE='display: inline-block; font: bold 90% verdana; width: 185px;'>Original size:</SPAN>";
			menu += "		<INPUT TITLE='Width' TYPE='number' ID='size_x' STYLE='width: 50px; margin-bottom: 5px;' DISABLED>";
			menu += "		<SPAN STYLE='font: bold 90% verdana;'> x </SPAN>";
			menu += "		<INPUT TITLE='Height' TYPE='number' ID='size_y' STYLE='width: 50px;' DISABLED>&ensp;";
			menu += "		<INPUT STYLE='width: 98px; margin-bottom: 5px; padding-left: 10px;' ID='source' DISABLED><BR>";
			
			menu += "		<SPAN STYLE='display: inline-block; font: bold 90% verdana; width: 185px;'>New size:</SPAN>";
			menu += "		<INPUT TITLE='Width' TYPE='number' ID='new_size_x' STYLE='width: 50px; margin-bottom: 5px;'>";
			menu += "		<SPAN STYLE='font: bold 90% verdana;'> x </SPAN>";
			menu += "		<INPUT TITLE='Height' TYPE='number' ID='new_size_y' STYLE='width: 50px;'>&ensp;";
			menu += "		<INPUT STYLE='width: 112px' TYPE='button' ID='jui_resize' VALUE='Resize image'><BR>";
			
			menu += "		<SPAN STYLE='display: inline-block; font: bold 90% verdana; width: 185px;'>Crop window:</SPAN>";
			menu += "		<INPUT TITLE='Width' MIN='" + jugi.frame_min_w + "' VALUE='" + jugi.frame_min_w + "' TYPE='number' ID='frame_size_x' STYLE='width: 50px; margin-bottom: 5px;'>";
			menu += "		<SPAN STYLE='font: bold 90% verdana;'> x </SPAN>";
			menu += "		<INPUT TITLE='Height' MIN='" + jugi.frame_min_h + "' VALUE='" + jugi.frame_min_h + "' TYPE='number' ID='frame_size_y' STYLE='width: 50px;'>&ensp;";
			menu += "		<INPUT STYLE='width: 112px; margin-bottom: 5px;' TYPE='button' ID='jui_crop' VALUE='Crop image'><BR>";
			
			menu += "		<SPAN STYLE='display: inline-block; font: bold 90% verdana; width: 185px;'>Jpeg quality:</SPAN>";
			menu += "		<INPUT MIN='1' MAX='100' STYLE='width: 50px;' TYPE='number' ID='jpeg_quality' VALUE='" + this.jpegQuality + "'><BR>";
			menu += "	</DIV>";

		}
		else
		{
			menu += "	<DIV STYLE='border: 1px solid #777777; padding: 5px; display: inline-block; margin-bottom: 5px; background: #EEEEEE;'>";
			menu += "		<SPAN STYLE='display: inline-block; font: bold 90% verdana; width: 270px;'>Ссылка на изображение:</SPAN>";
			menu += "		<INPUT STYLE='width: 315px; margin-bottom: 5px;' ID='link' PLACEHOLDER='Введите локальную или веб-ссылку'><BR>";
			
			menu += "		<SPAN STYLE='display: inline-block; font: bold 90% verdana; width: 270px;'>Путь для сохранения:</SPAN>";
			menu += "		<INPUT STYLE='width: 315px; margin-bottom: 5px;' ID='save_path' PLACEHOLDER='Путь по умолчанию (__dirname + &prime;public&prime;)'><BR>";
			
			menu += "		<SPAN STYLE='display: inline-block; font: bold 90% verdana; width: 270px;'>Добавочный путь / имя файла:</SPAN>";
			menu += "		<INPUT STYLE='width: 315px; margin-bottom: 5px;' ID='file_name'><BR>";
			
			menu += "		<SPAN STYLE='display: inline-block; font: bold 90% verdana; width: 270px;' ID='statistic_color'>Статистика:</SPAN>";
			menu += "		<INPUT STYLE='width: 315px;' ID='statistic' DISABLED>";
			menu += "	</DIV>" + this.menuOrientation;
			
			menu += "	<DIV STYLE='border: 1px solid #777777; padding: 5px; display:inline-block; background: #EEEEEE;'>";
			menu += "		<SPAN STYLE='display: inline-block; font: bold 90% verdana; width: 270px;'>Оригинальный размер:</SPAN>";
			menu += "		<INPUT TITLE='Ширина' TYPE='number' ID='size_x' STYLE='width: 50px; margin-bottom: 5px;' DISABLED>";
			menu += "		<SPAN STYLE='font: bold 90% verdana;'> x </SPAN>";
			menu += "		<INPUT TITLE='Высота' TYPE='number' ID='size_y' STYLE='width: 50px;' DISABLED>&ensp;";
			menu += "		<INPUT STYLE='width: 171px; margin-bottom: 5px; padding-left: 5px;' ID='source' DISABLED><BR>";
			
			menu += "		<SPAN STYLE='display: inline-block; font: bold 90% verdana; width: 270px;'>Новый размер:</SPAN>";
			menu += "		<INPUT TITLE='Ширина' TYPE='number' ID='new_size_x' STYLE='width: 50px; margin-bottom: 5px;'>";
			menu += "		<SPAN STYLE='font: bold 90% verdana;'> x </SPAN>";
			menu += "		<INPUT TITLE='Высота' TYPE='number' ID='new_size_y' STYLE='width: 50px;'>&ensp;";
			menu += "		<INPUT STYLE='width: 180px' TYPE='button' ID='jui_resize' VALUE='Изменить размер'><BR>";
			
			menu += "		<SPAN STYLE='display: inline-block; font: bold 90% verdana; width: 270px;'>Область обрезки:</SPAN>";
			menu += "		<INPUT TITLE='Ширина' MIN='" + jugi.frame_min_w + "' VALUE='" + jugi.frame_min_w + "' TYPE='number' ID='frame_size_x' STYLE='width: 50px; margin-bottom: 5px;'>";
			menu += "		<SPAN STYLE='font: bold 90% verdana;'> x </SPAN>";
			menu += "		<INPUT TITLE='Высота' MIN='" + jugi.frame_min_h + "' VALUE='" + jugi.frame_min_h + "' TYPE='number' ID='frame_size_y' STYLE='width: 50px;'>&ensp;";
			menu += "		<INPUT STYLE='width: 180px; margin-bottom: 5px;' TYPE='button' ID='jui_crop' VALUE='Обрезать изображение'><BR>";
			
			menu += "		<SPAN STYLE='display: inline-block; font: bold 90% verdana; width: 270px;'>Качество JPEG:</SPAN>";
			menu += "		<INPUT MIN='1' MAX='100' STYLE='width: 50px;' TYPE='number' ID='jpeg_quality' VALUE='" + this.jpegQuality + "'><BR>";
			menu += "	</DIV>";
		}	
		
		document.getElementById("jui_menu").innerHTML = menu;
		
		// set style
		document.getElementById("jui_menu").style.padding = "5px";
		
		// fill div "jui_area"
		area = "";
		area += "		<IMG STYLE='display: block; margin-left: auto; margin-right: auto;' ID='image' SRC=''>";
		area += "		<DIV ID='frame0' STYLE='display: none; background: black; opacity: 0.15; position: absolute;'></DIV>";
		area += "		<DIV ID='frame1' STYLE='display: none; background: white; opacity: 0.45; cursor: move; position: absolute; border: 2px solid #55CCEE; height: 20px; width: 20px;'></DIV>";
		area += "		<DIV ID='frame2' STYLE='display: none; background: white; opacity: 0.45; cursor: move; position: absolute; border: 2px solid #55CCEE; height: 20px; width: 20px;'></DIV>";
		area += "		<DIV ID='frame3' STYLE='display: none; background: white; opacity: 0.45; cursor: move; position: absolute; border: 2px solid #55CCEE; height: 20px; width: 20px;'></DIV>";
		document.getElementById("jui_area").innerHTML        = area;
		
		// set style
		document.getElementById("jui_area").style.display    = "inline-block";
		document.getElementById("jui_area").style.marginLeft = "5px";
		document.getElementById("jui_area").style.border     = "1px solid black";
		document.getElementById("jui_area").style.position   = "relative";
		
		// set style to frame
		document.getElementById("frame0").style.opacity    = this.frameOpacity;
		document.getElementById("frame0").style.background = this.frameColor;
		
		// parse url when page is loaded
		if (document.location.search != "")
		{
			this.link = (window.location.search).substring(1); // delete "?"
			this.handleUrl();
		}
		
		document.getElementById("image").addEventListener("load",  jugi.imageLoadComplete);
		document.getElementById("image").addEventListener("error", jugi.imageLoadError);
		
		// handler for body mouse move event
		document.body.onmousemove = function()
		{
			var x = event.clientX;
			var y = event.clientY;

			if (jugi.frame1_active)
			{
				if (jugi.frame_x1 >= 0 && jugi.frame_x1 <= jugi.image_w - jugi.frame_min_w) jugi.frame_x1 += x - jugi.xo;
				if (jugi.frame_y1 >= 0 && jugi.frame_y1 <= jugi.image_h - jugi.frame_min_h) jugi.frame_y1 += y - jugi.yo;
				
				if (jugi.frame_x1 > jugi.frame_x2 - jugi.frame_min_w) jugi.frame_x2 = jugi.frame_x1 + jugi.frame_min_w;
				if (jugi.frame_y1 > jugi.frame_y2 - jugi.frame_min_h) jugi.frame_y2 = jugi.frame_y1 + jugi.frame_min_h;
			}
			
			if (jugi.frame2_active)
			{
				// refresh frame_x2 & frame_y2
				if (jugi.frame_x2 >= jugi.frame_min_w && jugi.frame_x2 <= jugi.image_w) jugi.frame_x2 += x - jugi.xo;
				if (jugi.frame_y2 >= jugi.frame_min_h && jugi.frame_y2 <= jugi.image_h) jugi.frame_y2 += y - jugi.yo;
				
				if (jugi.frame_x2 < jugi.frame_x1 + jugi.frame_min_w) jugi.frame_x1 = jugi.frame_x2 - jugi.frame_min_w;
				if (jugi.frame_y2 < jugi.frame_y1 + jugi.frame_min_h) jugi.frame_y1 = jugi.frame_y2 - jugi.frame_min_h;
			}
			
			if (jugi.frame3_active)
			{
				if ((jugi.frame_center_x - jugi.frame_min_w / 2 + 12) >= 0 && (jugi.frame_center_x + jugi.frame_min_w / 2 - 12) <= jugi.image_w) 
				{
					jugi.frame_x1 += x - jugi.xo;
					jugi.frame_x2 += x - jugi.xo;
				}
				if ((jugi.frame_center_y - jugi.frame_min_h / 2 + 12) >= 0 && (jugi.frame_center_y + jugi.frame_min_h / 2 -12) <= jugi.image_h) 
				{
					jugi.frame_y1 += y - jugi.yo;
					jugi.frame_y2 += y - jugi.yo;
				}
				
			}

			if (jugi.frame_x1 < 0)            jugi.frame_x1 = 0;
			if (jugi.frame_x2 > jugi.image_w) jugi.frame_x2 = jugi.image_w;
			if (jugi.frame_y1 < 0)            jugi.frame_y1 = 0;
			if (jugi.frame_y2 > jugi.image_h) jugi.frame_y2 = jugi.image_h;
			
			
			if (jugi.frame_x1 > jugi.image_w - jugi.frame_min_w) jugi.frame_x1 = jugi.image_w - jugi.frame_min_w;
			if (jugi.frame_x2 < jugi.frame_min_w)                jugi.frame_x2 = jugi.frame_min_w;
			if (jugi.frame_y1 > jugi.image_h - jugi.frame_min_h) jugi.frame_y1 = jugi.image_h - jugi.frame_min_h
			if (jugi.frame_y2 < jugi.frame_min_h)                jugi.frame_y2 = jugi.frame_min_h;

			jugi.frame_center_x = Math.floor(jugi.frame_x1 + (jugi.frame_w / 2)) - 12;
			jugi.frame_center_y = Math.floor(jugi.frame_y1 + (jugi.frame_h / 2)) - 12;
			
			if (jugi.frame1_active || jugi.frame2_active || jugi.frame3_active) jugi.redraw ();
			
			jugi.xo = x;
			jugi.yo = y;
			
			jugi.frame_w = jugi.frame_x2 - jugi.frame_x1;
			jugi.frame_h = jugi.frame_y2 - jugi.frame_y1;
		}

		document.getElementById('frame1').onmousedown = function (){jugi.frame1_active = true;}
		document.getElementById('frame2').onmousedown = function (){jugi.frame2_active = true;}
		document.getElementById('frame3').onmousedown = function (){jugi.frame3_active = true;}

		// handler for body mouse up event
		document.body.onmouseup = function ()
		{
			jugi.frame1_active = false;
			jugi.frame2_active = false;
			jugi.frame3_active = false;
		}

		// handler for body mouse leave event
		document.body.onmouseleave = function ()
		{
			jugi.frame1_active = false;
			jugi.frame2_active = false;
			jugi.frame3_active = false;
		}

		// handler for frame_size_x input
		document.getElementById('frame_size_x').onkeydown = function (key) {if (key.which == 13) frame_x_input();}
		document.getElementById('frame_size_x').onclick   = frame_x_input;
		
		function frame_x_input ()
		{
			var x = parseInt(document.getElementById('frame_size_x').value);		
			if (x >= jugi.frame_min_w) 
			{
				jugi.frame_x2 = jugi.frame_x1 + x;
				if (jugi.frame_x2 > jugi.image_w) jugi.frame_x2 = jugi.image_w;
				jugi.frame_w = jugi.frame_x2 - jugi.frame_x1;
				jugi.frame_center_x = jugi.frame_x1 + (jugi.frame_w / 2) - 12;
				jugi.redraw();
			}
		}
		
		// handlerS for frame_size_y input
		document.getElementById('frame_size_y').onkeydown = function (key) {if(key.which == 13)	frame_y_input();}
		document.getElementById('frame_size_y').onclick = frame_y_input;
		
		function frame_y_input ()
		{
			var y = parseInt(document.getElementById('frame_size_y').value);
			if (y >= jugi.frame_min_h) 
			{
				jugi.frame_y2 = jugi.frame_y1 + y;
				if (jugi.frame_y2 > jugi.image_h) jugi.frame_y2 = jugi.image_h;
				jugi.frame_h = jugi.frame_y2 - jugi.frame_y1;
				jugi.frame_center_y = jugi.frame_y1 + (jugi.frame_h / 2) - 12;
				jugi.redraw();
			}
		}
		// handler for link input
		document.getElementById('link').onkeydown = function (key)
		{ 
			if(key.which == 13)
			{
				jugi.link = document.getElementById("link").value;
				jugi.handleUrl();
			}
		}
		
		// handler for button "jui resize"
		document.getElementById("jui_resize").onclick = function ()
		{
			var data = {};
			var error = false;
			
			data.newWidth     = document.getElementById("new_size_x").value;
			data.newHeight    = document.getElementById("new_size_y").value;
			data.imageWidth   = jugi.image_w;
			data.imageHeight  = jugi.image_h;
			data.link         = jugi.link;
			data.isImageLocal = jugi.isImageLocal;
			data.savePath     = jugi.savePath;
			data.fileName     = jugi.fileName;
			data.jpegQuality  = jugi.jpegQuality;
			
			if (data.savePath == "") data.savePath = "default";
			
			if ((data.newWidth == "" || isNaN(data.newWidth)) && (data.newHeight == "" || isNaN(data.newHeight))) error = true;
			
			jugi.r_handler(data, error);
		}
		
		// handler for button "jui crop"
		document.getElementById("jui_crop").onclick = function ()
		{
			var data = {};
			var error = false;
			
			data.frameWidth   = jugi.frame_w;
			data.frameHeight  = jugi.frame_h;
			data.imageWidth   = jugi.image_w;
			data.imageHeight  = jugi.image_h;
			data.frameX1      = jugi.frame_x1;
			data.frameX2      = jugi.frame_x2;
			data.frameY1      = jugi.frame_y1;
			data.frameY2      = jugi.frame_y2;
			data.link         = jugi.link;
			data.isImageLocal = jugi.isImageLocal;
			data.savePath     = jugi.savePath;
			data.fileName     = jugi.fileName;
			data.jpegQuality  = jugi.jpegQuality;
			
			if (data.savePath == "") data.savePath = "default";
			
			if (data.imageWidth < data.frameWidth || data.imageHeight < data.frameHeight || data.frameX1 > data.frameX2 || data.frameY1 > data.frameY2 || data.frameX2 > data.imageWidth || data.frameY2 > data.imageHeight) error = true;
			jugi.c_handler(data, error);
		}
		
		// handler for save_path input
		document.getElementById("save_path").onkeydown = function () {jugi.fileName = document.getElementById('save_path').value;}
		
		// handler for file_name input
		document.getElementById('file_name').onkeydown = function (key)	{jugi.fileName = document.getElementById("file_name").value;}
		
		// handlerS for jpeg_quality input
		document.getElementById('jpeg_quality').onchange =  function (key) {jugi.jpegQuality = document.getElementById("jpeg_quality").value;}
	}, // init end
	
	// ===============================================
	// IMAGE LOAD SUCCESSFULLY
	// ==============================================
	
	imageLoadComplete: function () 
	{
		document.getElementById("image" ).style.display = "block";
		
		jugi.frame_x1 = jugi.defaults.frame_x1;
		jugi.frame_y1 = jugi.defaults.frame_y1;
		jugi.frame_x2 = jugi.frame_x1 + jugi.frame_min_w;
		jugi.frame_y2 = jugi.frame_y1 + jugi.frame_min_h; 
		jugi.frame_center_x = jugi.frame_x1 + jugi.frame_min_w / 2 - 12;
		jugi.frame_center_y = jugi.frame_y1 + jugi.frame_min_h / 2 - 12;
		
		// get image width & height
		jugi.image_w = document.getElementById("image").offsetWidth;
		jugi.image_h = document.getElementById("image").offsetHeight;
		
		if (jugi.frame_x2 > jugi.image_w) jugi.frame_x2 = jugi.image_w;
		if (jugi.frame_y2 > jugi.image_h) jugi.frame_y2 = jugi.image_h;
	
		// fill fields in menu
		document.getElementById("size_x").value = jugi.image_w;
		document.getElementById("size_y").value = jugi.image_h;
		
		// fill fields in menu
		document.getElementById('frame_size_x').value  = Math.floor(jugi.frame_x2 - jugi.frame_x1);
		document.getElementById('frame_size_y').value  = Math.floor(jugi.frame_y2 - jugi.frame_y1);
		
		// 
		document.getElementById("frame3").style.left   = (jugi.frame_center_x) + "px";
		document.getElementById("frame3").style.top    = (jugi.frame_center_y) + "px";
		

		
		document.getElementById("frame0").style.left   =  jugi.frame_x1 + "px";
		document.getElementById("frame0").style.top    =  jugi.frame_y1 + "px";
		document.getElementById("frame0").style.width  = (jugi.frame_x2 - jugi.frame_x1) + "px";
		document.getElementById("frame0").style.height = (jugi.frame_y2 - jugi.frame_y1) + "px";
		
		document.getElementById("frame1").style.left   = (jugi.frame_x1) + "px";
		document.getElementById("frame1").style.top    = (jugi.frame_y1) + "px";
		
		document.getElementById("frame2").style.left   = (jugi.frame_x2 - 24) + "px";
		document.getElementById("frame2").style.top    = (jugi.frame_y2 - 24) + "px";
		
		document.getElementById("frame3").style.left   = (jugi.frame_center_x) + "px";
		document.getElementById("frame3").style.top    = (jugi.frame_center_y) + "px";
		
		// show 
		document.getElementById("frame0").style.display =  "block";
		document.getElementById("frame1").style.display =  "block";
		document.getElementById("frame2").style.display =  "block";
		document.getElementById("frame3").style.display =  "block";
		
		jugi.redraw();
		jugi.imageLoaded = true;
		
		if (jugi.blockStatus == false) 
		{
			if (jugi.language == "eng") jugi.handleStatus("The image is successfully loaded!", true); else jugi.handleStatus("Изображение успешно загружено!", true);
		}

		jugi.blockStatus = false;
	
		document.getElementById("file_name").value = jugi.fileName;
		document.getElementById("save_path").value = jugi.savePath;
	},

	// ==============================================
	// IMAGE LOAD ERROR
	// ==============================================
	imageLoadError: function () 
	{
		jugi.clearFields();
		if (jugi.language == "eng") jugi.handleStatus("Image loading error!", false); else jugi.handleStatus("Ошибка загрузки изображения!", false);
	},
	
	redraw: function ()
	{
		document.getElementById('frame_size_x').value  = Math.floor(this.frame_x2 - this.frame_x1);
		document.getElementById('frame_size_y').value  = Math.floor(this.frame_y2 - this.frame_y1);

		document.getElementById("frame0").style.left   =  this.frame_x1 + "px";
		document.getElementById("frame0").style.top    =  this.frame_y1 + "px";
		document.getElementById("frame0").style.width  = (this.frame_x2 - this.frame_x1) + "px";
		document.getElementById("frame0").style.height = (this.frame_y2 - this.frame_y1) + "px";
		
		document.getElementById("frame1").style.left   = (this.frame_x1) + "px";
		document.getElementById("frame1").style.top    = (this.frame_y1) + "px";
		
		document.getElementById("frame2").style.left   = (this.frame_x2 - 24) + "px";
		document.getElementById("frame2").style.top    = (this.frame_y2 - 24) + "px";
		
		document.getElementById("frame3").style.left   = (this.frame_center_x) + "px";
		document.getElementById("frame3").style.top    = (this.frame_center_y) + "px";
	},
	
	resizeHandler: function (handler)
	{
		this.r_handler = handler;
	},
	
	cropHandler: function (handler)
	{
		this.c_handler = handler;
	},
	
	// default resize handler function 
	r_handler: function (data, error)
	{
		if (error || jugi.imageLoaded == false) 
		{
			alert("Resize error!");
			return;
		}
		
		var xhr = new XMLHttpRequest();
		var query = "/jugi?";
		
		query += "link=" + data.link;
		query += "&savePath=" + data.savePath;
		query += "&fileName=" + data.fileName;
		query += "&isImageLocal=" + data.isImageLocal;
		query += "&type=edit_image";
		query += "&option=resize";
		query += "&newWidth=" + data.newWidth;
		query += "&newHeight=" + data.newHeight;
		query += "&jpegQuality=" + data.jpegQuality;
		xhr.open('GET', query, true);
		xhr.setRequestHeader('Content-Type', 'application/json');

		xhr.timeout = 5000;
		xhr.send();
		
		xhr.onreadystatechange = function() 
		{
			if (xhr.readyState != 4) return;

			if (xhr.status != 200) 
			{
				alert(xhr.status + ': ' + xhr.statusText);
			}
			else 
			{
				//alert(xhr.responseText);
				var refresh_image = jugi.fileName + "?" + new Date().getTime();
				document.getElementById("link").value = jugi.fileName;
				jugi.link = jugi.fileName;
				document.getElementById("image").setAttribute("SRC", refresh_image);
				if (jugi.language == "eng") jugi.handleStatus("Image resize OK!", true); else jugi.handleStatus("Размеры изменены успешно!", true);
				jugi.blockStatus = true;
				jugi.isImageLocal = true;
			}
		}
	},
	
	// default crop handler function 
	c_handler: function (data, error)
	{
		if (error || jugi.imageLoaded == false) 
		{
			alert("Resize error!");
			return;
		}
		
		var xhr = new XMLHttpRequest();
		var query = "/jugi?";
		
		query += "link=" + data.link;
		query += "&savePath=" + data.savePath;
		query += "&fileName=" + data.fileName;
		query += "&isImageLocal=" + data.isImageLocal;
		query += "&type=edit_image";
		query += "&option=crop";
		query += "&frameX1=" + data.frameX1;
		query += "&frameY1=" + data.frameY1;
		query += "&frameWidth=" + data.frameWidth;
		query += "&frameHeight=" + data.frameHeight;
		query += "&jpegQuality=" + data.jpegQuality;
		
		xhr.open('GET', query, true);
		xhr.setRequestHeader('Content-Type', 'application/json');

		xhr.timeout = 5000;
		xhr.send();
		
		xhr.onreadystatechange = function() 
		{
			if (xhr.readyState != 4) return;

			if (xhr.status != 200) 
			{
				alert(xhr.status + ': ' + xhr.statusText);
			}
			else 
			{
				//alert(xhr.responseText);	
				var refresh_image = jugi.fileName + "?" + new Date().getTime();
				document.getElementById("link").value = jugi.fileName;
				jugi.link = jugi.fileName;
				document.getElementById("image").setAttribute("SRC", refresh_image);
				if (jugi.language == "eng") jugi.handleStatus("Image crop OK!", true); else jugi.handleStatus("Изображение обрезано успешно!", true);
				jugi.blockStatus = true;
				jugi.isImageLocal = true;
			}
		}
	},
	
	handleStatus: function (message, type)
	{
		document.getElementById("statistic").value = message;
		
		if (type == true ) document.getElementById("statistic_color").style.color = "green";
		if (type == false) document.getElementById("statistic_color").style.color = "red";
		
		if (this.status) clearTimeout(this.timerId);
		
		this.timeId = setTimeout(function ()
		{
			document.getElementById("statistic").value = ""; 
			document.getElementById("statistic_color").style.color = "black";
			jugi.status = false;
		}, 5000);
	},
	
	handleUrl: function ()
	{
		var url = jugi.link;
		var pos = 0;
		
		// if user add +
		if (jugi.link.substring(0, 2) != "+/")
		{
			pos = url.search("//");
			if (pos == -1 || (url.substring(0, pos) != "http:" && url.substring(0, pos) != "https:" && url.substring(0, pos) != "")) {jugi.handleStatus("Wrong URL!", false); jugi.clearFields(); return;};
			url = url.substring(pos + 2);
			
			pos = url.search("/");
			if (pos == -1) {jugi.handleStatus("Wrong URL!", false); jugi.clearFields(); return;};
			if (url.substring(0, pos) == document.location.host) jugi.isImageLocal = true; else jugi.isImageLocal = false;
		}
		else
		{
			jugi.link = jugi.link.substring(1);
			url = url.substring(1);
			jugi.isImageLocal = true;
		}	
		
		if (jugi.isImageLocal)
		{
			// fill filetype field;
			if (jugi.language == "eng") document.getElementById("source").value = "Source: local"; else document.getElementById("source").value = "Источник: локальный";
			jugi.fileName = url.substring(pos);
		}
		else
		{
			// fill filetype field;
			if (jugi.language == "eng") document.getElementById("source").value = "Source: web"; else document.getElementById("source").value = "Источник: интернет";
			
			jugi.fileName = (jugi.link).split("/");
			jugi.fileName = "/" + jugi.fileName[jugi.fileName.length - 1];
		}
							
		document.getElementById("image").setAttribute("SRC", jugi.link);
		document.getElementById("link").value = jugi.link;
					
	},
	
	clearFields: function ()
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
		document.getElementById("frame_size_x" ).value = jugi.frame_min_w;
		document.getElementById("frame_size_y" ).value = jugi.frame_min_h;
		
		document.getElementById("jpeg_quality" ).value = jugi.jpegQuality;
	}

}
	
