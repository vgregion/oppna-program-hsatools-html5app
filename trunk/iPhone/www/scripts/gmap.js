/*global $, google, key, window */

var gmap = {};

/**
 * Returns current position (Singelton) 
 * Methods: get 
 *          latitude
 *          longitude
 *          set
 **/
gmap.curentPosition = (function(){
	var lat = null, lng = null, marker = null;
	     
    return {
		get : function() {		
			
			if(lat === null || lng === null){
				return null;
			}
			
			return {latitude : lat, longitude: lng};		
		},
		latitude : function(){			
			return lat;
		},
		longitude : function(){
			return lng;
		},
		set : function(latitude, longitude){
			lat = latitude;
			lng = longitude;
		}			
    };		
})();

/**
 * Singelton current window 
 */
gmap.currentInfoWindow = (function(){
	var currentWindow = null;
	
	return{
		get : function(){ return currentWindow; },
		set : function(val){ currentWindow = val; },
		close : function(){
			if(currentWindow !== null) {
				currentWindow.close();								
			}			
		}				
	};	
})();