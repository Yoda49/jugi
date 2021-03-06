# Jugi. Jimp Graphics User Interface.
```
version: 0.1.0

email: yurevich.pavel@gmail.com
```
This tool is a light-weight user graphics interface for **"Javascript image manipulation tools"** aka Jimp (https://www.npmjs.com/package/jimp).
Jugi consists of two parts:

1. Client part for web-browser (jugi-client.js). Written in clear JavaScript.
2. Server part for node.js (jugi-server).js. Written for use with framework express.js.

You can try JUGI client-part at Gitgub pages: https://yoda49.github.io/jugi/jugi.html?http://cdn.tvc.ru/pictures/tc/841/15.jpg

![jugi.js](http://isee.by/images/kim.jpg)

## Client side Jugi API:

jugi-config.js is used for configuration jugi.

### init() 

Make initialization with default config:
```
1.  cropFrameMinWidth  = 50
2.  cropFrameMinHeight = 50
3.  initialValueX1     = 0
4.  initialValueY1     = 0
5.  cropFrameColor     = "black"
6.  cropFrameOpacity   = 0.15
7.  jpegQuality        = 90
8.  savePath           = __dirname + "/public"
9.  blockFileOps       = false
```

### init(config)

Make initialization with user config. The config must be an object with the next possible properties:
```
1.  cropFrameMinWidth  - minimum crop frame width (must be >= 50).
2.  cropFrameMinHeight - minimum crop frame height (must be >= 50).
3.  initialValueX1     - initial coordinate X of left-top crop frame corner (must be >= zero).
4.  initialValueY1     - initial coordinate Y of left-top crop frame corner (must be >= zero).
5.  cropFrameColor     - crop frame color (must be string) e.g. "green" or "#44AAFF".
6.  cropFrameOpacity   - crop frame opacity (must be number 0 ... 1) e.g. 0.5 or 0.9.
7.  jpegQuality        - set jpeg quality (must be number 1 ... 100).
8.  savePath           - save path prefix. By default node.js use __dirname + "/public".
9.  blockFilesOps      - blocking user file operations.

The wrong options will be ignored.
```
Example:
```
jugi.init({
	cropFrameMinWidth: 200,
	cropFrameMinHeight: 150,
	cropFrameColor: "yellow",
	cropFrameOpacity: 0.5,
	});
```


## Server side Jugi API:

Server side part of Jugi written for node.js framework express.js.

### jugi.secure (userHandler)

It is used when you need to limit user access to edit images on your server. In a user handler function you can identify the user and return "boolean true" if the user is authorized. The "boolean false" forbids user access to a server part of Jugi. If the handler is not specified, all users have access. 

Jugi.secure passes two parameters to user handler: req & res (standart objects of express.js).
```js
function userHandler(req, res)
{
	if (allowed user) return true; else return false;
}
```

### jugi.processor (req, res, next)

Main function for processing requests from client side.

Using:
```js
var jugi = require("jugi");

jugi.secure(userHandler);
app.use(jugi.processor);
```
or, if you don't need user identification:
```js
app.use(require("jugi").processor);
```


## Methods of loading of images.

1. Add to your URL symbol "?" + link of your image.

Examples:
```html
http://you-site.com/image-editor.html?http://you-site.com/images/image.jpg
http://you-site.com/image-editor.html?http://another-site.com/image.jpg
http://you-site.com/image-editor.html?//you-site.com/image.jpg
```

2) Write link of your image in corresponding field (LINK TO IMAGE) in menu.

Examples:
```html
http://www.site.com/image.jpg
//site.com/image.png
http://site.com/image.bmp
//192.168.1.1/image.jpg
http://192.168.1.1:2000/image.jpg
```

**Quick link: If you want load local image (from same server which script) you can add "+" before your image url.**

Examples:
```html
+/image.jpg
+/images/your_image.png
+/preview/image1.bmp
```

## Description of menu.

**LINK TO IMAGE** - original link to your image.

**SAVE PATH** - prefix part for local node.js server path for saving images.

**ADD PATH / FILE NAME** - residual part of local node.js server path for saving images. It can include only a name.

Example:
```
If your working directory is:

c:/user/node/server/main.js - path to you main file of node.js server.
c:/user/node/server/public - directory of your static files e.g. js, css, images.
c:/user/node/server/public/images - directory of you static images.

You must set savePath = "c:/user/node/server/public/images" during initialization jugi.init(options). 
Now images will be saved in c:/user/node/server/public/images.
```

## INSTALLATION.

**Server side:** npm install jugi --save

**Client side:** just copy js/jugi-client.js, js/jugi-config.js, css/jugi.css & jugi.html to you project.
