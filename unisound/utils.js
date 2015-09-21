/*
* StackOverflow Link: http://stackoverflow.com/questions/391979/get-client-ip-using-just-javascript
*/

function getDeviceIP() {
    if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
    else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.open("GET","http://api.hostip.info/get_html.php",false);
    xmlhttp.send();

    hostipInfo = xmlhttp.responseText.split("\n");

    for (i=0; hostipInfo.length >= i; i++) {
        ipAddress = hostipInfo[i].split(":");
        if ( ipAddress[0] == "IP" ){
        	return ipAddress[1];
        }
    }

    return false;
}

/* 
  * From GitHub: https://github.com/gouch/to-title-case
  * To Title Case 2.1 – http://individed.com/code/to-title-case/
  * Copyright © 2008–2013 David Gouch. Licensed under the MIT License.
 */

String.prototype.toTitleCase = function(){
  var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;

  return this.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title){
    if (index > 0 && index + match.length !== title.length &&
      match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
      (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
      title.charAt(index - 1).search(/[^\s-]/) < 0) {
      return match.toLowerCase();
    }

    if (match.substr(1).search(/[A-Z]|\../) > -1) {
      return match;
    }

    return match.charAt(0).toUpperCase() + match.substr(1);
  });
};

/*
* Collapsing Header on Scroll Tutorial:
* http://callmenick.com/post/animated-resizing-header-on-scroll
*/

function init() {
    window.addEventListener('scroll', function(e){
        var distanceY = window.pageYOffset || document.documentElement.scrollTop,
            shrinkOn = 50,
            header = document.querySelector("header");
        if (distanceY > shrinkOn) {
            classie.add(header,"smaller");
        } else {
            if (classie.has(header,"smaller")) {
                classie.remove(header,"smaller");
            }
        }
    });
}
window.onload = init();

function closeAlerts(){
	var alerts = document.getElementsByClassName('alert');
	for(var a = 0; a < alerts.length; a++){
		alerts[a].style.display = 'none';
	}
}

/*
* http://stackoverflow.com/questions/15802858/jquery-call-function-if-enter-hit
*/
$("#searchBar").keypress(function(e) {
    if(e.which == 13) {
      //alert('You pressed enter!');
      $("#searchButton").click();
    }
});
$("#partyID").keypress(function(e) {
    if(e.which == 13) {
      //alert('You pressed enter!');
      $("#joinParty").click();
    }
});

/*
* http://stackoverflow.com/questions/6199038/javascript-event-triggered-by-pressing-space
*/
/*$(window).keypress(function(e) {
  if (e.keyCode === 0 || e.keyCode === 32) {
    //console.log('Space pressed');
    $("#playButton").click();
  }
});*/

function instruct(message){
  var instructions = document.getElementById('instruct');
  instructions.innerHTML = message;
}