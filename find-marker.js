




// sets marker at location

	function showMarker(loc) {
	    marker.setPosition(loc);
	}

// convert from latitude and longitude to a simple (elliptical) Mercator projection
// from http://wiki.openstreetmap.org/wiki/Mercator#JavaScript_.28or_ActionScript.29_implementation

	function deg_rad(ang) {
	    return ang * (Math.PI/180.0)
	}
	function merc_x(lon) {
	    var r_major = 6378137.000;
	    return r_major * deg_rad(lon);
	}
	function merc_y(lat) {
	    if (lat > 89.5)
	        lat = 89.5;
	    if (lat < -89.5)
	        lat = -89.5;
	    var r_major = 6378137.000;
	    var r_minor = 6356752.3142;
	    var temp = r_minor / r_major;
	    var es = 1.0 - (temp * temp);
	    var eccent = Math.sqrt(es);
	    var phi = deg_rad(lat);
	    var sinphi = Math.sin(phi);
	    var con = eccent * sinphi;
	    var com = .5 * eccent;
	    con = Math.pow((1.0-con)/(1.0+con), com);
	    var ts = Math.tan(.5 * (Math.PI*0.5 - phi))/con;
	    var y = 0 - r_major * Math.log(ts);
	    return y;
	}
	function merc(x,y) {
	    return [merc_x(x),merc_y(y)];
	}

// main function retrieving maps through Web Feature Service

	function getmapsheets(inlat, inlong) {
	
		setResults("Loading... please wait");
	
		features27700 = [];
	
		var latLng = marker.getPosition();
	
		inlat = deg2rad(latLng.lat());
		inlon = deg2rad(latLng.lng());
		
// find current center in British National Grid Eastings and Northings

		var osgb36 = WGS842OSGB36(inlat, inlon); var cooresult = Geo2TM(osgb36.latitude, osgb36.longitude, OSNG);
		var refresult = conv_EN2GR(cooresult.eastings, cooresult.northings, OSNG_GS);
		var eastings = Math.round(cooresult.eastings);
		var northings = Math.round(cooresult.northings);


// the WFS request to GeoServer

	TypeName  = 'nls:catalog_25inch,nls:catalog_25_inch_2nd_later,nls:OS_25_Inch_Eng_Wales,nls:OS_6inch_UK_27700';

// the WFS request to GeoServer

	var urlgeoserver =  'http://geoserver.nls.uk/geodata/wfs?service=WFS' + 
				'&version=1.1.0&request=GetFeature&typename=' + TypeName +
				'&outputFormat=text/javascript&format_options=callback:getJson27700' +
				'&srsname=EPSG:3857&cql_filter=INTERSECTS(the_geom,POINT(' 
				+ eastings + ' ' + northings + '))'; 

// The GeoJSON response from the jQuery ajax Web Feature Service request and callback


	window.handleJson27700 = function(response) {
			features = response.features;


// gets date range from slider and filters results

		dates = [];
		dates = $( "#slider-range" ).slider( "values");
		var minyear = dates[0];
		var maxyear = dates[1];


		filteredFeatures1 = jQuery.grep(features, function(n, i){
		  return n.properties.YEAR > minyear;
		});

		filteredFeatures = jQuery.grep(filteredFeatures1, function(n, i){
		  return n.properties.YEAR < maxyear;
		});



		var content = '';

		if (filteredFeatures.length < 1)
			content += '<br/><p id="noMapsSelected">No maps returned</p>';

		else if (filteredFeatures.length == 1)
	            content += '<p><strong>Results - 1 map:</strong><br />(click to view)</p>';
		else if (features.length > 1)

	        content += '<p><strong>Results - ' + filteredFeatures.length + ' maps:</strong><br />(Ordered by date - <br/>click to view)</p>';

		

		if (filteredFeatures.length > 0) {

// sorts the maps by YEAR

		filteredFeatures.sort(function(a, b){
		   var nameA=a.properties.YEAR, nameB=b.properties.YEAR
		   if (nameA < nameB) //sort string ascending
		       return -1 
		   if (nameA > nameB)
		       return 1
		   return 0 //default return value (no sorting)

		})

		jQuery.each(filteredFeatures, function (key, val) {
			geometry = val.geometry;
			properties = val.properties;
			if (properties.SHEET != '') {
				content += '<p><a href="' + properties.IMAGEURL + '"><img src="' + properties.IMAGETHUMB + '" width="150" /><br />'  + properties.SHEET + '</a><br />' + properties.DATES + '</p>';
							} 
			});  
					// content += stringResult.replace(/<br>/g, ', ');
		}
		setResults(content);
		}

		jQuery.ajax({
			jsonp: false,
			jsonpCallback: 'getJson27700',
			url: urlgeoserver,
			dataType: 'jsonp',
			contentType: 'application/json',
			success: handleJson27700
		});
	
	};


	function checkmarker() {
	
	        var map_centre = map.getCenter();
	 	if ( !map.getBounds().contains(marker.getPosition()))
			{ marker.setPosition(map_centre); }
		getmapsheets();
	
	}

	function check_is_in_or_out(marker){
	  return map.getBounds().contains(marker.getPosition());
	}



// Auto text for right-hand results panel

	function setResults(str) {
	    if (!str) str = "<br/><p id=\"noMapsSelected\">No maps selected</p>";
	    document.getElementById('results').innerHTML = str;
	}


      setResults();

// Main Google Maps API functions - documentation at: https://developers.google.com/maps/documentation/javascript/ 

      function initMap() {

	var bounds;
	var features27700;

	var currentLat = 56.0;
	var currentLon = -4.0;

        var mapBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(49.205882, -14.169172),
            new google.maps.LatLng(61.483786, 4.393046));
        var mapMinZoom = 1;
        var mapMaxZoom = 17;

        var map_centre = {lat: currentLat, lng: currentLon};

        map = new google.maps.Map(document.getElementById('map'), {
          center: map_centre,
          zoom: 7,
 	  mapTypeControl: true,
          mapTypeControlOptions: {
	      mapTypeIds:[google.maps.MapTypeId.SATELLITE,google.maps.MapTypeId.ROADMAP],
              style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
              position: google.maps.ControlPosition.BOTTOM_CENTER
          },
          zoomControl: true,
          zoomControlOptions: {
              position: google.maps.ControlPosition.LEFT_BOTTOM
          },
          scaleControl: true,
          streetViewControl: false

        });



	map.setMapTypeId(google.maps.MapTypeId.ROADMAP);

        var input = /** @type {!HTMLInputElement} */(
            document.getElementById('pac-input'));

       // var types = document.getElementById('type-selector');
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
       // map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);



        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        var infowindow = new google.maps.InfoWindow();



        autocomplete.addListener('place_changed', function() {

       google.maps.event.removeListener(zoomchangedlistener);
          infowindow.close();
          marker.setVisible(false);
          var place = autocomplete.getPlace();
          if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
          }


          // If the place has a geometry, then present it on a map.
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);  // Why 17? Because it looks good.

          }

          marker.setPosition(place.geometry.location);
          marker.setVisible(true);

	  latLng = marker.getPosition();
          var mlat = latLng.lat().toFixed(4);
	  var mlon = latLng.lng().toFixed(4);

	  var mapcenter = map.getCenter();

          getmapsheets(mlat,mlon);

          var address = '';
          if (place.address_components) {
            address = [
              (place.address_components[0] && place.address_components[0].short_name || ''),
              (place.address_components[1] && place.address_components[1].short_name || ''),
              (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
          }

	setTimeout( function(){
		map.addListener('zoom_changed', function() {
			
			var latLng = marker.getPosition();
			var lat = latLng.lat().toFixed(4);
			var lon = latLng.lng().toFixed(4);
	          	getmapsheets(lat,lon);

		  });

	}, 500); // delay 500 ms


        });

	google.maps.event.addDomListener(window, 'load', checkmarker);

// request map sheets again if slider dates change

	$( "#slider-range" ).on( "slidestop", function( event, ui ) { getmapsheets();  } );

        var map_centre = {lat: currentLat, lng: currentLon};
        var marker_centre = {lat: currentLat, lng: currentLon};
	map.setCenter(map_centre);
	map.setZoom(5);

	marker = new google.maps.Marker({
    	position: marker_centre,
    	draggable: true,
    	map: map
  	});


// marker listener to retrieve maps if marker is moved

	  marker.addListener('center_changed', function() {
		getmapsheets();
	  });

// initiates the date slider

	$(document).ready(function(){
	
	   $( "#slider-range" ).slider({
	      range: true,
	      min: 1800,
	      max: 2000,
	      values: [ 1840, 1960 ],
	      slide: function( event, ui ) {
	        $( "#amount" ).val(  ui.values[ 0 ] + " - " + ui.values[ 1 ] );
	      }
	    });
	    $( "#amount" ).val(   $( "#slider-range" ).slider( "values", 0 ) +
	      " - " + $( "#slider-range" ).slider( "values", 1 ) );
	  });

// places the marker at double-clicked location

	map.addListener('dblclick', function(e) {
		showMarker(e.latLng);
		getmapsheets();

	});
	
	marker.addListener('dragend', function() {
		var center = marker.getPosition();
		getmapsheets();

  	});
	marker.addListener('click', function(e) {
		//lookupAddress(e.latLng);
		var center = marker.getPosition();

		getmapsheets();
	});

      }


