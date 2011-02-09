$(window).load(function() {
	wwyrbMaps.init();
	
	$("#go-there").click(function(e) {
		e.preventDefault();
		$("#location").animate({"top": "0"}, "slow");
		$("#overlay").animate({"opacity": "show"}, "slow");
		$("#location_usr_name").focus();
		$("#pull-name").text($("#wywrb").text());
	});
	
	$("#overlay").click(function(e) {
		e.preventDefault();
		$("#location").animate({"top": "-600px"}, "slow");
		$("#overlay").animate({"opacity": "hide"}, "slow");
	});
	
	$("#new_location").submit(function() {
		$.ajax({
			type: "POST",
			url: this.action,
			data: $(this).serialize(),
			success: function() {
				$("#location").animate({"top": "-600px"}, "slow");
				$("#overlay").animate({"opacity": "hide"}, "slow");
			}
		});
		return false;
	});
});

/*
|***************************************************************
| CLASS: WWYRB Maps
|***************************************************************
*/
var wwyrbMaps = new function() {

/*
** VARIABLES
---------------------------------------------------------------*/	
	// Globals:
	var geocoderService, gLatLng, infobox, latlngs, map, mapClickListener, mapbounds, userMarker, markers, markerClickListener, options, siteURL, tweets, twitterURL;
	
	var MARKER_SMALL = "small marker";
	var MARKER_LARGE = "large marker";
	
	latlngs = [];
	markers = [];
	tweets = [];
	userMarker = null;
	siteURL = "http://wherewouldyouratherbe.rubypdx.com/";
	twitterURL = "http://search.twitter.com/search.json?q=%23wwyrb&rpp=4&page=1&show_user=true&callback=?";
	
	// Google Services:
	geocoderService = new google.maps.Geocoder();
	
/*
** INITIALIZE
---------------------------------------------------------------*/
	function init(custOpts) {
		options = {
			center: new google.maps.LatLng(27, -170),
			draggableCursor: "crosshair",
			mapId: "map",
			mapTypeControl: false,
			mapTypeId: google.maps.MapTypeId.TERRAIN,
			zoom: 2
		}
		
		// If passed, extend map options
		if (custOpts) {
			$.extend(options, custOpts);
		}
		
		// Set map and click listener
		map = new google.maps.Map(document.getElementById(options.mapId), options);
		mapClickListener = google.maps.event.addListener(map, "click", handleMapClick);
		google.maps.event.addListenerOnce(map, "tilesloaded", loadFromDB);
		twitter();
	}

/*
** MAP INTERACTION
---------------------------------------------------------------*/
	function handleMapClick(e) {
		geoCodeLatLng(e.latLng);
	}
	
	function loadFromDB() {
		$.getJSON(siteURL + "locations.json", function(data) {
			var lat, lng, m, pos;
			$.each(data, function(i, item) {
				lat = item.location.lat;
				lng = item.location.lng;
				pos = new google.maps.LatLng(lat, lng);
				m = new google.maps.Marker({
					clickable: true,
	        		icon: getMarkerIcon(MARKER_SMALL),
	        		position: pos, 
	        		title: item.location.loc_name
				});
				
				latlngs.push(pos);
				markers.push(m);
				m.setMap(map);
			});
		});
	}
	
/*
** MARKERS
---------------------------------------------------------------*/
	function addByClick(position, title) {
		clearMarker();
		
		userMarker = new google.maps.Marker({
	        clickable: true,
	        icon: getMarkerIcon(MARKER_LARGE),
	        position: position, 
	        title: title
	    });
	    
	    map.panTo(position);
	    map.setCenter(position);
	    userMarker.setMap(map);
	    $("#wywrb").fadeOut("fast", function() {
	    	$(this).text(userMarker.title);
	    	$(this).fadeIn("fast");
	    });
	    
	    $("#location_lat").val(position.lat());
	    $("#location_lng").val(position.lng());
	}
	
	function getMarkerIcon(mType) {
		if (mType == MARKER_LARGE) {
			var icon = new google.maps.MarkerImage(
				(siteURL + "images/marker.png"),
				new google.maps.Size(60, 75),
				new google.maps.Point(0, 0),
				new google.maps.Point(60, 75)
			);
		} else if (mType == MARKER_SMALL) {
			var icon = new google.maps.MarkerImage(
				(siteURL + "images/marker-small.png"),
				new google.maps.Size(25, 31),
				new google.maps.Point(0, 0),
				new google.maps.Point(25, 31)
			);
		}
		
		return icon;
	}
	
	function clearMarker() {
		if (userMarker != null) {
			userMarker.setMap(null);
		}
	}
	
/*
** GEOCODE
---------------------------------------------------------------*/
	function geoCodeLatLng(latlng) {
		gLatLng = latlng;
		
		geocoderService.geocode({"latLng": latlng}, function(results, status) {
			var latlng, title;
			
			if (status == google.maps.GeocoderStatus.OK) {
				latlng = results[1].geometry.location;
				title = results[1].formatted_address;
				addByClick(latlng, title);
			} else {
				addByClick(gLatLng, "Unkown, you better claim this spot now!");
			}
		});
	}

/*
** TWITTER
---------------------------------------------------------------*/
	function twitter() {
		$.getJSON(twitterURL, function(data) {
			var tweet;
			$.each(data.results, function(i, item) {
				tweet = (i == 3) ? '<li class="col col3 last">' : '<li class="col col3">';
				tweet += '<p><img src="' + item.profile_image_url + '" alt="' + item.from_user + '" />';
				tweet += item.text.linkify();
				tweet += '<span class="time"> ' + relativeTime(item.created_at) + '</span>';
				tweet += '<span class="author"> by: <a href="http://twitter.com/' + item.from_user + '" target="_blank">';
				tweet += '@' + item.from_user + '</a>' + '</span>';
				tweet += '</p></li>';
				$("#tweets").append(tweet);
				tweets.push(tweet);
			});
		});
	}

/*
** RESETS
---------------------------------------------------------------*/	
	function reset() {
		
	}

/*
** RETURN PUBLICS
---------------------------------------------------------------*/
	return {
		init: init
	}

}();
<<<<<<< HEAD
=======

String.prototype.linkify = function() {
	return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&\?\/.=]+/, function(m) {
		return m.link(m);
	});
};

function relativeTime(time_value) {
	var parsed_date = Date.parse(time_value);
	var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
	var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
	if(delta < 60) {
		return "less than a minute ago";
	} else if(delta < 120) {
		return "about a minute ago";
	} else if(delta < (45*60)) {
		return (parseInt(delta / 60)).toString() + " minutes ago";
	} else if(delta < (90*60)) {
		return "about an hour ago";
	} else if(delta < (24*60*60)) {
		return "about " + (parseInt(delta / 3600)).toString() + " hours ago";
	} else if(delta < (48*60*60)) {
		return "1 day ago";
	} else {
		return (parseInt(delta / 86400)).toString() + " days ago";
	}
}
>>>>>>> master
