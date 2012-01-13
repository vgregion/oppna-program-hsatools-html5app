/*global $, gmap, google, key, window */

var gmap = {};

/**
 * Returns current position (Singelton) 
 * Methods: get 
 * 			latitude
 * 			longitude
 * 			set
 **/
gmap.curentPosition = (function(){
	var lat, lng, marker = null;
	     
    return {    	     
		get : function() {		
			
			if(lat === null || lng === null){
		     throw "For showing current position lat and lang must be set";  
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

/** 
 * Create an new instance of bubble object
 * e.g gmap infowindow
 * */
gmap.bubble = function(refMap){
	var that = {}, map;	
	
	//Initialization
	this.map = refMap;
	
	/**
	 *Add bubble to map
	 */
	that.addBubble = function(marker, title, bubbleContent, lat, lng, bubbleType) {

        var infowindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function() {
			
			gmap.currentInfoWindow.close();
            
            var content = '<div id="content">' +
                            '<b>' + title + '</b>' +                            
                        '</div>';

            infowindow.content = '<div style="display: block;">' + content + '</div>';            
            infowindow.open(this.map, marker);
            
            gmap.currentInfoWindow.set(infowindow);            
        });

    };    

	return that;
	
};



/**
 *Creates a new instance of marker object
 * Handles POI:s of gmap. 
 * */
gmap.marker = function(){
	
	var that = {}, markers = [], focusOnCurrentPosition, 
	mapPois = [], map, bubble, idxMyPos;
		
	/**
	 * Intitialize
	 */
	that.initialize = function(spec){
		this.map =  spec.refMap;
		this.bubble = gmap.bubble(spec.refMap);
	};
	
	
	that.addPosMarker = function(lat, lng, title, bubbleContent, image, bubbleType, animate){
		idxMyPos = markers.length;
		that.addMarker(lat, lng, title, bubbleContent, image, bubbleType, animate);
				
	};
	
	/**
	 * addMarker
	 */
    that.addMarker = function(lat, lng, title, bubbleContent, image, bubbleType, animate) {        

        var latlng = new google.maps.LatLng(lat, lng),options, marker;
        
        options = {
            position: latlng,
            title: title,
            icon: image,
            //animation: (animate !== undefined ? google.maps.Animation.DROP : null),
            map: this.map,
            shape: {
                coords: [10, 10, 100],
               type: 'circle'
            }
        };
    	
    	marker = new google.maps.Marker(options);

        markers.push(marker);

		if (bubbleType !== undefined) { 
			this.bubble.addBubble(marker, title, bubbleContent, lat, lng, bubbleType); 
		}
	};
	
	/**
	 * showMarkers
	 */
	that.showMarkers = function(refMap) {
		if(mapPois.length < 1) {
			return;
		}		
		
		for(var i =0; i <= mapPois.length; i++){				        
            
			if(mapPois[i]=== undefined){
				continue;
			}		
		
            that.addMarker(mapPois[i].Latitude, mapPois[i].Longitude, 
						   mapPois[i].Title, mapPois[i].BubbleContent, 
						   mapPois[i].Image, 2);						   
		}       
   };	
	
	that.clearMyPos = function(){		
		that.clearMarker(idxMyPos);
	};
	
	/*
	 * clearMarker
	 */
	that.clearMarker = function(idx){
		if(markers.length > 0){		
			markers[idx].setMap(null);
			markers.length = markers.length - 1;
		}
	};
	
	/**
	 * clearMarkers
	 */
    that.clearMarkers = function() {
        for (var i in this.markers) {
            markers[i].setMap(null);
        }
        markers.length = 0;        
    };
		
	/**
	 * getMarkers
	 */
	that.getMarkers = function() {
		return markers;	
	};	
	
	
	/**
	 * setPOIS
	 */
	that.setPOIS = function(p){
		mapPois = p;			
	};
	
	return that;
};



/** 
 * Creates an instance of map object
 * */
gmap.map = function(spec) {

 var mapIsInitialized = false,
		mapIsResized = false,
		mapPois = null,
		//mapPoisOutside = null,
		//lastMapIdClicked = 0,
		//mapIdClicked = -1,
		//focusOnCurrentPosition = false,
	    map = null,	 		 
		marker = null,
		config = {}, that = {};
		
	
  config = {
  		pageId : null,
  		mapCenterLat: null,
        mapCenterLng: null,
        myPosIcon: "images/BlueDot.png",
        myPosTitle: "Här är du!",        
        mapCanvasId: null,
        headerSelector: null,
        footerSelector: null,
        zoomIn : false        
    };	
	
    that.bubbleType = {
        None: 0,
        NoDirections: 1,
        All: 2
    };
    
    
    $.extend(config, spec);
   
	// Intialize google map
	that.initialize = function(spec) {	
		
		if(spec.mapCenterLat === null || spec.mapCenterLng === null){
			throw "For initilization of map the center lat and lang must be set";  
		}
	  
		var myLatlng = new google.maps.LatLng(spec.mapCenterLat, spec.mapCenterLng);	  
		var myOptions = {
			zoom: 10,
			center: myLatlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP,	
			mapTypeControl: false,
			streetViewControl: false	
		};
		this.map = new google.maps.Map(document.getElementById(config.mapCanvasId), myOptions);		
		this.marker = spec.refmarker;		
		
		config.mapCenterLat = spec.mapCenterLat;
		config.mapCenterLng = spec.mapCenterLng;	
		
		that.resizeMap();
		
		config.mapIsInitialized = true;
		
		$(config.pageId).bind("click", that.zoom);
	};


	that.getMap = function(){
		return this.map;		
	};
	

    that.resizeMap = function() {
        if (this.mapIsResized){
            return;
		}
		
    /* Some orientation changes leave the scroll position at something
     * that isn't 0,0. This is annoying for user experience. */
    scroll(0, 0);

    /* Calculate the geometry that our content area should take */
    var header = $(".header:visible");
    //var footer = $(".footer:visible");    
    var content = $(".content:visible");
    var viewport_height = $(window).height();
    
    var content_height = viewport_height - header.outerHeight(); // - footer.outerHeight();
    
    /* Trim margin/border/padding height */
    content_height -= (content.outerHeight() - content.height());
    		
		$('#' + config.mapCanvasId).height(content_height);
        //$('#' + config.mapCanvasId).height($(window).height() - $(config.headerSelector).height() - $(config.footerSelector).height());
        //$('#' + config.mapCanvasId).height($(window).height() - 42 - 44);
        google.maps.event.trigger(this.map, 'resize');

        this.mapIsResized = true;
    };
    
        // Fires every time jQuery Mobile shows the map page
    that.show = function(lat, lng) {

		that.showCurrentPosition();
				
        var myLatlng = new google.maps.LatLng(lat, lng);
        this.map.panTo(myLatlng);                            
        
        google.maps.event.trigger(this.map, 'resize');
    };
    
    that.zoom = function(){
    	var _map = that.getMap();
    	//var myLatlng = new google.maps.LatLng(spec.mapCenterLat, spec.mapCenterLng);
        //_map.panTo(myLatlng);
		if(config.zoomIn){
			_map.setZoom(15);
			config.zoomIn = false;						
		}else{
			_map.setZoom(10);
			config.zoomIn = true;
		}
		
		setTimeout(function(){
			var myLatlng = new google.maps.LatLng(gmap.curentPosition.latitude(), gmap.curentPosition.longitude());
			_map.panTo(myLatlng);    
		}, 500);
		
		return false;		
	};

    that.showMarkers = function() {
        // Only change markers if map has changed
        if (this.mapIdClicked != this.lastMapIdClicked) {
            marker.clearMarkers();
            marker.addMarkers();
            this.focusOnMarkers();
            this.lastMapIdClicked = this.mapIdClicked;
        }

        // Reset id clicked
        this.mapIdClicked = 0;
    };
    
	that.showCurrentPosition = function(){
		this.marker.addPosMarker(gmap.curentPosition.latitude(), gmap.curentPosition.longitude(), 
								 config.myPosTitle, "", config.myPosIcon, that.bubbleType.None, this.map, "animate");			
	};	
		
	return that;

};