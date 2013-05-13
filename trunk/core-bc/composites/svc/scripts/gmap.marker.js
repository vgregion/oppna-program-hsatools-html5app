/*global $, gmap, i, google, key, window,hriv */

/**
 *Creates a new instance of marker object
 * Handles POI:s of gmap. 
 * */
gmap.marker = function(){
	
	var that = {}, markers = [], focusOnCurrentPosition, 
	mapPois = [], map, bubble, idxMyPos = null;
		
	/**
	 * Intitialize
	 */
	that.initialize = function(spec){
		this.map =  spec.refMap;
		this.bubble = gmap.bubble(spec.refMap);
	};
	
	
	that.addPosMarker = function(lat, lng, title, bubbleContent, image, bubbleType, link){
		idxMyPos = markers.length;
		that.addMarker(lat, lng, title, bubbleContent, image, bubbleType, link, null);				
	};
	
	/**
	 * addMarker
	 */
    that.addMarker = function(lat, lng, title, bubbleContent, image, bubbleType, link, open) {        

        var latlng = new google.maps.LatLng(lat, lng),options, marker,
            openHours, openImg = "PinGray.png", isOpen = -1;
        
        //Kontroll öppettider
        if(open){
            isOpen = hriv.fn.calc.isOpen(open);          
            openImg = (isOpen === 1) ? 'PinGreen.png' : 'PinGray.png' ;         
        }
        
        options = {
            position: latlng,
            title: title,
            icon: (open !== null) ? 'images/' + openImg : image, 
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
			this.bubble.addBubble(marker, title, bubbleContent, lat, lng, bubbleType, link); 
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
						   mapPois[i].Image, 2, mapPois[i].link, mapPois[i].open);

		}       
   };	
	
	that.clearMyPos = function(){		
		if(idxMyPos !== null){
			that.clearMarker(idxMyPos);
		}
	};
	
	/*
	 * clearMarker
	 */
	that.clearMarker = function(idx){
		if(markers.length > 0 && idx < markers.length){		
			markers[idx].setMap(null);
			markers.length = markers.length - 1;
		}
	};
	
	/**
	 * clearMarkers
	 */
    that.clearMarkers = function() {
        for (var i=0; i < markers.length; i++){
			markers[i].setMap(null);
		}

		markers.length = 0;
    };
	
	that.reload = function(data, refObj){
	    mapPois = [];
	    
	    for(var i = 0; i < data.length; i++){
	        //Load marker items
            that.load(refObj, data[i]);
	    }
	};	
		
	that.load = function(refObj, obj){        
              
        //Load POI info
        mapPois.push({
            Latitude : obj.latitude,
            Longitude :  obj.longitude,
            Title : obj.name,
            hsaIdentity : obj.hsaIdentity,
            link : refObj.map.getLink() +'?page='+ refObj.map.getPage() +'&id='+ obj.hsaIdentity,
            open: obj.hsaSurgeryHours 
        });
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
