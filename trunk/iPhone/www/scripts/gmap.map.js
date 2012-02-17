/*global $, console, gmap, google, key, window */


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
	that.addBubble = function(marker, title, bubbleContent, lat, lng, bubbleType, link) {

        var infowindow = new google.maps.InfoWindow(), slink;
		
        google.maps.event.addListener(marker, 'click', function() {
			
			gmap.currentInfoWindow.close();
            
            var content = '<div id="content">' +
								'<b>' + title + '</b></br>'+((link !== null) ? '<a rel=external href="' + link  + '">Mer info</a>' : "") +''+
							'</div>';

            infowindow.content = '<div style="display: block;">' + content + '</div>';            
            infowindow.open(this.map, marker);
            
            gmap.currentInfoWindow.set(infowindow);   
        });        
    };    

	return that;
	
};


gmap.state = function(){
	var that = {}, state = {}, idle = [], loading = [],
		config = {
		map : null
	};
	
	that.init = function(spec){
		$.extend(config, spec);		
		that.bind();						
	};
	
	
	that.bind = function() {
		
		google.maps.event.addListener(config.map, 'idle', function(){ 
			state.mapLoad = false;
			console.log("idle");			
			idle.forEach(function (el) {el();});
		     
		});
				
		google.maps.event.addListener(config.map, 'bounds_changed', function(){ 
			state.mapLoad = true;
			console.log("map change");			
			loading.forEach(function (el) {el();});
		});		
		
	};	
	
	that.getState = function(){
		return state;
	};
	
	that.addListener = function(obj, func){
		switch(obj){
			case "idle":
				idle.push(func);
			break;
			case "load":
				loading.push(func);
			break;
		}
	};
	
	that.popListerner = function(obj){        
        switch(obj){
            case "idle":
                idle.pop();
            break;
            case "load":
                loading.pop();
            break;
        }	
    };
	
	that.unbind = function(obj){
		switch(obj){
			case "idle":
				idle = [];
			break;
			case "load":
				loading = [];
			break;
		}
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
		map = null,
		marker = null,
		watch = null,
		watchRun = false,
		mapState = gmap.state(),
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
        zoomIn : false,
        linkMap : null, 
        page : null   
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
		 
		config.mapIsInitialized = true;
		
		$(config.pageId).bind("click", that.zoom);
		
		mapState.init({map : this.map});
	};
	
	
	that.addListerner = function(obj, func){
		mapState.addListener(obj, func);
	};
	
	that.popListerner = function(obj){
        mapState.popListerner(obj);
    };
	
	that.getLink = function(){
		return config.linkMap;		
	};
	
    that.getMap = function(){
        return this.map;        
    };	
	
	that.getPage = function(){
		return config.page;
	};
	
	that.getState = function(){
	    return mapState.getState();
	};

    that.resizeMap = function() {
        if (this.mapIsResized){
            return;
		}		
		/* Some orientation changes leave the scroll position at something
		* that isn't 0,0. This is annoying for user experience. */
		//scroll(0, 0);

		/* Calculate the geometry that our content area should take */
		var header = $(".header:visible");
		//var footer = $(".footer:visible");    
		var content = $(".content:visible");
		var viewport_height = $(document).height();    
		var content_height = viewport_height - header.outerHeight(); // - footer.outerHeight();
    
		/* Trim margin/border/padding height */
		content_height -= (content.outerHeight() - content.height());

		$('#' + config.mapCanvasId).height(content_height);
		//$('#' + config.mapCanvasId).height($(window).height() - $(config.headerSelector).height() - $(config.footerSelector).height());
        google.maps.event.trigger(this.map, 'resize');

        this.mapIsResized = true;
    };
    
    // Fires every time jQuery Mobile shows the map page
    that.show = function(lat, lng) {
       
        var zoomMap = function(){
            var myLatlng = new google.maps.LatLng(lat, lng);
            that.getMap().panTo(myLatlng);        
        };       
        
        setTimeout(function(){                
            zoomMap();                        
        }, 1500);
        
        
        google.maps.event.trigger(this.map, 'resize');        
    };
    
    that.zoom = function(){
		var _map = that.getMap();

		if(!config.zoomIn){
			_map.setZoom(15);
			config.zoomIn = true;										
		}else{
			_map.setZoom(10);
			config.zoomIn = false;					
		}
		
		setTimeout(function(){
			var myLatlng = new google.maps.LatLng(gmap.curentPosition.latitude(), gmap.curentPosition.longitude());
			_map.panTo(myLatlng);    
		}, 500);		
		
		return false;		
	};	
	
	that.addMarker = function(){
	    this.marker.addPosMarker(gmap.curentPosition.latitude(), gmap.curentPosition.longitude(), 
                                 config.myPosTitle, "", config.myPosIcon, that.bubbleType.None, null);
	};

	that.showCurrentPosition = function(val){
		that.addMarker();		
		that.watchCurrentPosition(val);		
	};
	
	that.watchCurrentPosition = function(val){		
		
		if(val){		
			if(!this.watchRun){				
				this.watch = setInterval(function(){					 
						that.marker.clearMyPos();
						that.addMarker();
				}, 10000);
				this.watchRun = true;
			}
			return;
		}
	
		clearTimeout(this.watch);
		this.watchRun = false;						
	};
		
	return that;

};