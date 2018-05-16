var moment = require("moment");

// Reveal player once it's loaded
$("#show-player iframe").load(function(){
	$("#show-player").show();
});

// Promise while searching for shows
var seekingDeferred = getAllShows();

// Wait until all heights are adjusted before making a move
$.when.apply($, seekingDeferred).then(function(){
	// Scroll down to top of chosen podcast
	if (show){
		var pageEl = $('#'+show);
		setTimeout(function(){
			$('html, body').scrollTop(pageEl.offset().top-140);
		}, 100);
	}
});

function getAllShows(){
	var seekingArray = [];
	// Get episodes for the podcasts
	$(".podcast").each(function(index, item){
		seekingArray.push($.Deferred());
		// If there's a libsyn ID attached, go fetch the eps
		var podcastID = $(this).attr("id");
		var $thisPodcast = $(this);
		if ($(this).attr("id")){
			$.get("https://"+podcastID+".libsyn.com/rss", function(data) {
	    	const rss = $(data);
	    	var episodes = rss.find("item");
	    	$.each(episodes, function(index, episode){
	    		var episodeTitle = $(this).find("title").first().text();
	    		var findDuration = $(this).find("itunes\\:duration");
	    		var epID = $(this).find("guid").text();
		      // Fallback for older browsers
		      if (findDuration.length == 0){
		        findDuration = $(this).find("duration");
		      }
		      // Create the div
	    		$newEp = $("<div>", {
		        class: "episode",
		        "id": epID,
		        "data-podcast": podcastID,
		        html: "<img class='next-play' src='assets/play-circle.svg' />\
		        	<p class='next-date'>"+moment($(this).find("pubDate").text()).format("MMMM D, YYYY")+" | "+findDuration.text()+"</p>\
		          <p class='next-title'>"+episodeTitle+"</p>",
		      });
		      // Add event to the div
		      $newEp.click(function(){
		      	$("#show-player iframe").attr("src", "//projects.sfchronicle.com/tools/podcast-embed/player.html?landing=true&start=true&show="+podcastID+"&id="+epID);
		      	// Change URL
		      	var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?show="+podcastID+"&id="+epID;
    				window.history.pushState({path:newurl},'',newurl);
		      	// Unselect all
		      	$(".episode").removeClass("active");
		      	// Select this one
		      	$(this).addClass("active");
		      });
		      // Append div to the DOM
		      $thisPodcast.find(".episodes").append($newEp);
	    	});
	    	// Got data, resolve
	    	seekingArray[index].resolve();
	    });
		} else {
			// If there's no ID, resolve immediately
			seekingArray[index].resolve();
		}
	});
	// Return promises
	return seekingArray;
}

// Logos can start show players
$(".logo").click(function(){
	var thisPodID = $(this).closest(".podcast").attr("id");
	// Update URL
	var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?show="+thisPodID;
  window.history.pushState({path:newurl},'',newurl);
  // Update player
  $("#show-player iframe").attr("src", "//projects.sfchronicle.com/tools/podcast-embed/player.html?landing=true&start=true&show="+thisPodID);
});

/* Gets data off the URL params */
var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }
};

var show = getUrlParameter('show'); // Which podcast
var urlID = getUrlParameter('id'); // Which episode

// Set the ep based on the ID
setTimeout(function(){
	if (urlID && show){
		$("#show-player iframe").attr("src", "//projects.sfchronicle.com/tools/podcast-embed/player.html?landing=true&start=true&show="+show+"&id="+urlID);
	} else if (show){
		// If only the show is set, still kickstart it
		$("#show-player iframe").attr("src", "//projects.sfchronicle.com/tools/podcast-embed/player.html?landing=true&start=true&show="+show);
	} 
}, 1000);


