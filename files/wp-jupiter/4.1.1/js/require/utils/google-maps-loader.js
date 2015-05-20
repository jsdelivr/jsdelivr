/**
 * GoogleMapsAPI Loader Module
 * 
 * Returns a promise that resolves with the google.maps object when all of the google maps api loading process is complete
 * 
 * Example Usage:
 *
 * 	define([ 'app/lib/google-maps-loader' ], function(GoogleMapsLoader){
 * 		GoogleMapsLoader.done(function(GoogleMaps){
 *			// your google maps code here!
 *			var geocoder = new GoogleMaps.Geocoder();
 *		}).fail(function(){	
 *			console.error("ERROR: Google maps library failed to load");
 *		});
 *	});
 *
 *	-OR-
 *
 *	define([ 'app/lib/google-maps-loader' ], function(GoogleMapsLoader){
 * 		GoogleMapsLoader.done(function(){
 *			// your google maps code here!
 *			var geocoder = new google.maps.Geocoder();
 *		}).fail(function(){	
 *			console.error("ERROR: Google maps library failed to load");
 *		});
 *	});
 *
 */

var google_maps_loaded_def = null;

define(['jquery'],function($) {

  
  if(!google_maps_loaded_def) {
    
    google_maps_loaded_def = $.Deferred();
  
    window.google_maps_loaded = function() {
      // console.log('called-google-api');  
      google_maps_loaded_def.resolve(google.maps);  
    }
    
    require(['http://maps.google.com/maps/api/js?sensor=false&callback=google_maps_loaded'],function(){},function(err) {
      google_maps_loaded_def.reject();
      //throw err; // maybe freak out a little?
    });
    
  }
  
  return google_maps_loaded_def.promise();
  
});