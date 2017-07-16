FindbyPlace - with Marker
=========================

This <a href="http://maps.nls.uk/geo/find/marker/">application</a> uses the <a href="https://developers.google.com/maps/documentation/javascript/">Google Maps Javascript API</a>,  and <a href="http://geoserver.org/">GeoServer</a> to form a search and retrieval interface for historical maps. Searching is possible using the Google Places API Web Service, or by zooming in on the map, with an option to change the map base layer between Google Maps or Satellite layers. 

The location of the marker is translated into British National Grid using <a href="http://www.fieldenmaps.info/cconv/">Ed Fielden's Coordinate Convertor</a>. A Web Feature Service request to GeoServer returns maps whose bounding boxes cover the marker location. A <a href="https://jqueryui.com/slider/">jQuery slider</a> provides a way of narrowing the date range of the maps.

<a href="http://maps.nls.uk/geo/find/marker/">This application</a> was originally developed by the <a href="http://www.nls.uk">National Library of Scotland<a> in 2017. We hope that other libraries, archives and institutions may benefit from the code in making available their geographical collections ON CONDITION THAT IT IS DEVELOPED WITH A DIFFERENT IMPLEMENTATION OF GEOSERVER, AND NOT AS A REPLACEMENT OR ALTERNATIVE TO VIEWING THE NATIONAL LIBRARY OF SCOTLAND'S MAPS.

View a more <a href="http://maps.nls.uk/geo/find/marker/">complete working version of the application</a> on the National Library of Scotland Map Images website.
