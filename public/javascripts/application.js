$(window).load(function() {
	wwyrbMaps.init();
	
	$("#go-there").click(function(e) {
		e.preventDefault();
		$("#location").animate({"top": "0"}, "slow");
		$("#overlay").animate({"opacity": "show"}, "slow");
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
	var geocoderService, gLatLng, infobox, map, mapClickListener, mapbounds, marker, markerClickListener, options, siteURL;
	
	infobox = null;
	marker = null;
	siteURL = "http://wherewouldyouratherbe.rubypdx.com/";
	
	// Google Services:
	geocoderService = new google.maps.Geocoder();
	
/*
** INITIALIZE
---------------------------------------------------------------*/
	function init(custOpts) {
		options = {
			//center: new google.maps.LatLng(27, 170),
			center: new google.maps.LatLng(27, -170),
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
	}

/*
** MAP INTERACTION
---------------------------------------------------------------*/
	function handleMapClick(e) {
		geoCodeLatLng(e.latLng);
	}
	
/*
** MARKERS
---------------------------------------------------------------*/
	function addByClick(position, title) {
		clearMarker();
		
		marker = new google.maps.Marker({
	        clickable: true,
	        icon: getMarkerIcon(),
	        position: position, 
	        title: title
	    });
	    
	    map.panTo(position);
	    map.setCenter(position);
	    marker.setMap(map);
	    $("#wywrb").fadeOut("fast", function() {
	    	$(this).text(marker.title);
	    	$(this).fadeIn("fast");
	    });
	    
	    $("#location_lat").val(position.lat());
	    $("#location_lng").val(position.lng());
	}
	
	function getMarkerIcon() {
		var icon = new google.maps.MarkerImage(
			(siteURL + "images/marker.png"),
			new google.maps.Size(83, 75),
			new google.maps.Point(5, -5),
			new google.maps.Point(41, 75)
		);
		
		return icon;
	}
	
	function clearMarker() {
		if (marker != null) {
			marker.setMap(null);
		}
	}
	
/*
** GEOCODE
---------------------------------------------------------------*/
	function geoCodeAddress(address) {
		geocoderService.geocode({"address": address}, function(results, status) {
			var latlng, title;
			
			if (status == google.maps.GeocoderStatus.OK) {
				latlng = results[0].geometry.location;
				title = results[0].formatted_address;
			} else {
				alert("Unable to locate address");
			}
		});
	}
	
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

	return {
		init: init,
		address: geoCodeAddress
	}

}();
