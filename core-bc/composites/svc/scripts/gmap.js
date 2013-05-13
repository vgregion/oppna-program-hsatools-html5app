/*global $, google, key, window, hriv, console, DED */

var gmap = { obs : {}};

gmap.obs.getPosition = new DED.util.Observer();
//o.subscribe(fn);
//o.fire('here is my data');
//o.unsubscribe(fn);
    


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


// onSuccess Geolocation
gmap.curentPosition.onSuccess = function (position) {    
    gmap.curentPosition.set(position.coords.latitude, position.coords.longitude);     
};

gmap.curentPosition.onSuccess1 = function (position) { 
    console.log("geo fetching success:" + position.coords.latitude + " " + position.coords.longitude);
    gmap.curentPosition.set(position.coords.latitude, position.coords.longitude); 
    gmap.obs.getPosition.fire("succues");    
};


// onError Callback receives a PositionError object    
gmap.curentPosition.onError = function (error) {     
     gmap.curentPosition.set(57.6969943, 11.9865);     
};

gmap.curentPosition.onError1 = function (error) {
     console.log("geo fetching error");
     gmap.curentPosition.set(57.6969943, 11.9865);
     gmap.obs.getPosition.fire("error"); 
};


gmap.curentPosition.update = function(){
    if(navigator.geolocation){
        //console.log("geo fetching coordinate");
        navigator.geolocation.getCurrentPosition(gmap.curentPosition.onSuccess, gmap.curentPosition.onError);
    }else{
        gmap.curentPosition.onError();
    }   
};


gmap.curentPosition.update1 = function(func){
    if(navigator.geolocation){
        //console.log("geo fetching coordinate1");
        navigator.geolocation.getCurrentPosition(gmap.curentPosition.onSuccess1, gmap.curentPosition.onError1);
    }else{
        gmap.curentPosition.onError1();
    }   
};

