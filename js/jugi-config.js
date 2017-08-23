// ======================================================
// JUGI CONFIG
// ======================================================
var config = 
{
	cropFrameMinWidth: 50,
	cropFrameMinHeight: 50,
	initialValueX1: 0,
	initialValueY1: 0,
	frameColor: "green",
	frameOpacity: 0.4,
	blockFilesOps: true
}	
if (document.location.hostname == "isee.by") config.savePath = "/root/eye/public"; else config.savePath = "z:/programming/web/eye/public/";

init(jugi_config);
// init ();