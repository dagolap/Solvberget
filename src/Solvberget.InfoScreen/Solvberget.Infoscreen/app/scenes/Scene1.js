WEB_APP_URL = 'http://solvbergetapp.cloudapp.net/infoscreen/#/';

function SceneScene1() { };

SceneScene1.prototype.initialize = function () {
	alert("SceneScene1.initialize()");
	// this function will be called only once when the scene manager show this scene first time
	// initialize the scene controls and styles, and initialize your variables here
	// scene HTML and CSS will be loaded before this function is called
	tvID = this.getid();
	alert("Current Widget id:" + curWidget.id);
	$('#id-label').html(tvID);
};

SceneScene1.prototype.handleKeyDown = function (keyCode) {
	switch (keyCode) {
		case sf.key.ENTER:
			if (this.hostReachable()) {
				document.location = WEB_APP_URL+tvID;
			} else {
				$('#feedback-label').html('Kunne ikke koble til infoskjerm-app. Prøv igjen senere.');
			}
			break;
		default:
			break;
	}
};

SceneScene1.prototype.getid = function() {
	var tvID = sf.core.localData("tv-id");
	
	if (!tvID) {
		tvID = this.makeid();
		sf.core.localData("tv-id", tvID);
		alert("Generated new id: " + tvID);
	}
	
	return tvID;
};

SceneScene1.prototype.makeid = function()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for( var i=0; i < 6; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

SceneScene1.prototype.hostReachable = function() {
	  var xhr = new XMLHttpRequest();

	  // Request HEAD from infoscreen webapp. Rand param used to make sure no caching is involved.
	  xhr.open( "HEAD", WEB_APP_URL + "/?rand=" + Math.floor((1 + Math.random()) * 0x10000), false );

	  try {
	    xhr.send();
	    return ( xhr.status >= 200 && xhr.status < 300 || xhr.status === 304 );
	  } catch (error) {
	    return false;
	  }
};

SceneScene1.prototype.handleShow = function (data) { };
SceneScene1.prototype.handleHide = function () { };
SceneScene1.prototype.handleFocus = function () { };
SceneScene1.prototype.handleBlur = function () { };