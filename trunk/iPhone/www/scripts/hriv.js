/*global $, gmap, google */

/**************************
* Initializer framework
**************************/
var getData = "";

var jCall = function(){
	console.log("Here");
};


function jsonp(url,callback,name, query)
{                
    if (url.indexOf("?") > -1)
         url += "&callback="; 
    else
        url += "?callback=";
    url += name;
    if (query)
        url += encodeURIComponent(query) + "&";   
    //url += new Date().getTime().toString(); // prevent caching        
    
    var script = document.createElement("script");        
    script.setAttribute("src",url);
    script.setAttribute("type","text/javascript");  
    script.setAttribute('id','myID');              
    document.body.appendChild(script);
}



$(document).bind( "mobileinit", function() {
	// Make your jQuery Mobile framework configuration changes here!
	$.support.cors = true;
	$.mobile.allowCrossDomainPages = true;
	$.mobile.fixedToolbars.setTouchToggleEnabled(false);	
	$.mobile.touchOverflowEnabled = true;
});


$(document).ready(function(){
	//$.support.cors = true;
	//$.mobile.allowCrossDomainPages = true;	
	$.mobile.fixedToolbars.setTouchToggleEnabled(false);
	$.mobile.touchOverflowEnabled = true;
	
	$("#main").bind("vmousemove", function(e){    			
		e.preventDefault();
	});
	
	$(".ui-page-map").bind("vmousemove", function(e){    			
		e.preventDefault();
	});
		
	$(".listview-header").bind("vmousemove", function(e){    			
		e.preventDefault();
	});
	
	$(".listview-footer").bind("vmousemove", function(e){    			
		e.preventDefault();
	});
	
	$('#detailview .detailview-header').bind("vmousemove", function(e){    			
		e.preventDefault();
	});    		
});

/*****************************************
* Function setup & object initilization 
*****************************************/

hriv.CareUnits.map = gmap.map({pageId : '#mapCareUnits [data-icon="compass"]', mapCanvasId: "map_canvas", headerSelector : ".ui-page-active .ui-header", footerSelector : ".ui-page-active .ui-footer", linkMap : "#detailview", page : "CareUnits"});
hriv.CareUnits.marker = gmap.marker();
hriv.CareUnits.list = hriv.classes.listview({listId: "#lCareUnits"});
hriv.CareUnits.detail = hriv.classes.detailview({listId: "#lCareUnits"});
hriv.CareUnits.mode.map = hriv.classes.mode({mapId : "#mapCareUnits .ui-button-map", listId : "#mapCareUnits .ui-button-list", linkId : "#linkCareUnits", linkMap: "#mapCareUnits" , linkList : "#listCareUnits" });
hriv.CareUnits.mode.list = hriv.classes.mode({mapId : "#listCareUnits .ui-button-map", listId : "#listCareUnits .ui-button-list", linkId : "#linkCareUnits", linkMap: "#mapCareUnits" , linkList : "#listCareUnits" });


hriv.DutyUnits.map = gmap.map({pageId : '#mapDutyUnits [data-icon="compass"]', mapCanvasId: "map_canvas_DutyUnits", headerSelector : ".ui-page-active .ui-header", footerSelector : ".ui-page-active .ui-footer", linkMap : "#detailview", page : "DutyUnits"});
hriv.DutyUnits.marker = gmap.marker();
hriv.DutyUnits.list = hriv.classes.listview({listId: "#ldutyUnits"});
hriv.DutyUnits.detail = hriv.classes.detailview({listId: "#ldutyUnits"});
hriv.DutyUnits.mode.map = hriv.classes.mode({mapId : "#mapDutyUnits .ui-button-map", listId : "#mapDutyUnits .ui-button-list", linkId : "#linkDutyUnits", linkMap: "#mapDutyUnits" , linkList : "#listDutyUnits"});
hriv.DutyUnits.mode.list = hriv.classes.mode({mapId : "#listDutyUnits .ui-button-map", listId : "#listDutyUnits .ui-button-list", linkId : "#linkDutyUnits", linkMap: "#mapDutyUnits" , linkList : "#listDutyUnits" });


hriv.EmergencyUnits.map = gmap.map({pageId : '#mapEmergencyUnits [data-icon="compass"]', mapCanvasId: "map_canvas_Emergency", headerSelector : ".ui-page-active .ui-header", footerSelector : ".ui-page-active .ui-footer", linkMap : "#detailview", page : "EmergencyUnits"});
hriv.EmergencyUnits.marker = gmap.marker();
hriv.EmergencyUnits.list = hriv.classes.listview({listId: "#lemergencyUnits"});
hriv.EmergencyUnits.detail = hriv.classes.detailview({listId: "#lemergencyUnits"});
hriv.EmergencyUnits.mode.map = hriv.classes.mode({mapId : "#mapEmergencyUnits .ui-button-map", listId : "#mapEmergencyUnits .ui-button-list", linkId : "#linkEmergencyUnits", linkMap: "#mapEmergencyUnits" , linkList : "#listEmergencyUnits"});
hriv.EmergencyUnits.mode.list = hriv.classes.mode({mapId : "#listEmergencyUnits .ui-button-map", listId : "#listEmergencyUnits .ui-button-list", linkId : "#linkEmergencyUnits", linkMap: "#mapEmergencyUnits" , linkList : "#listEmergencyUnits"});




    // onSuccess Geolocation
gmap.curentPosition.onSuccess1 = function (position) { 
	if(position.coords === undefined){
		return;
	}
	
	gmap.curentPosition.set(position.coords.latitude, position.coords.longitude); 
	hriv.app.init();
};
gmap.curentPosition.onSuccess2 = function (position) { gmap.curentPosition.set(position.coords.latitude, position.coords.longitude); };

// onError Callback receives a PositionError object    
gmap.curentPosition.onError = function (error) { gmap.curentPosition.set(57.6969943, 11.9865); };


$(document).ready(function() {	
	
	navigator.geolocation.getCurrentPosition(gmap.curentPosition.onSuccess1, gmap.curentPosition.onError);					
    
    if(gmap.curentPosition.get() === null){
    	gmap.curentPosition.onError();
    }
	
	hriv.app.init();
    	
	hriv.CareUnits.map.initialize({refmarker : hriv.CareUnits.marker, mapCenterLat : gmap.curentPosition.latitude(), mapCenterLng : gmap.curentPosition.longitude()});								   
	hriv.CareUnits.marker.initialize({refMap : hriv.CareUnits.map.getMap()});		
		
	hriv.DutyUnits.map.initialize({refmarker : hriv.DutyUnits.marker, mapCenterLat : gmap.curentPosition.latitude(), mapCenterLng : gmap.curentPosition.longitude()});								   	   
	hriv.DutyUnits.marker.initialize({refMap : hriv.DutyUnits.map.getMap()});
	
	hriv.EmergencyUnits.map.initialize({refmarker : hriv.EmergencyUnits.marker, mapCenterLat : gmap.curentPosition.latitude(), mapCenterLng : gmap.curentPosition.longitude()});
	hriv.EmergencyUnits.marker.initialize({refMap : hriv.EmergencyUnits.map.getMap()});
		
	setTimeout(function(){
		hriv.CareUnits.marker.showMarkers(hriv.CareUnits.map.getMap());
		hriv.DutyUnits.marker.showMarkers(hriv.DutyUnits.map.getMap());			
		hriv.EmergencyUnits.marker.showMarkers(hriv.EmergencyUnits.map.getMap());	
	},400);
	
	
    $(document).bind("deviceready", function(){    	
		//navigator.geolocation.watchPosition(gmap.curentPosition.onSuccess2, gmap.curentPosition.onError, { frequency: 30000 });
	});		
});



/************************
* Page initializers CareUnits 
************************/

$('#mapCareUnits').live('pagecreate', function(event){	
	hriv.CareUnits.mode.map.init("map");
});

$('#mapCareUnits').live('pageshow', function(event){
	hriv.CareUnits.mode.map.mapOn();
	hriv.CareUnits.map.resizeMap();
	hriv.CareUnits.map.showCurrentPosition();  
	
	setTimeout(function(){
		hriv.CareUnits.map.show(gmap.curentPosition.latitude(), gmap.curentPosition.longitude());				
	}, 1000);	
});
$('#mapCareUnits').live('pagehide', function(event){	
	gmap.currentInfoWindow.close();
	hriv.CareUnits.marker.clearMyPos();
});

$('#listCareUnits').live('pagecreate', function(event){	
	hriv.CareUnits.mode.list.init("list");
});
$('#listCareUnits').live('pageshow', function(event){
	hriv.CareUnits.mode.list.listOn();
});
$('#listCareUnits').live('pagehide', function(event){
});



/***
 * Page initializers DutyUnits 
 **/
$('#mapDutyUnits' ).live('pagecreate', function(event){	
	hriv.DutyUnits.mode.map.init("map");	
});
$('#mapDutyUnits' ).live('pageshow', function(event){		
	hriv.DutyUnits.mode.map.mapOn();
	hriv.DutyUnits.map.resizeMap();
	hriv.DutyUnits.map.showCurrentPosition();      
		
	setTimeout(function(){
		hriv.DutyUnits.map.show(gmap.curentPosition.latitude(), gmap.curentPosition.longitude());  	
	}, 1000);	
});
$('#mapDutyUnits' ).live('pagehide', function(event){			
	gmap.currentInfoWindow.close();
	hriv.DutyUnits.marker.clearMyPos();
});


$('#listDutyUnits' ).live('pagecreate', function(event){
	hriv.DutyUnits.mode.list.init("list");
});
$('#listDutyUnits' ).live('pageshow', function(event){
	hriv.DutyUnits.mode.list.listOn();
});
$('#listDutyUnits').live('pagehide', function(event){

});




/***
 * Page initializers EmergencyUnits 
 **/
$('#mapEmergencyUnits' ).live('pagecreate', function(event){
	hriv.EmergencyUnits.mode.map.init("map");
});
$('#mapEmergencyUnits' ).live('pageshow', function(event){		
	hriv.EmergencyUnits.mode.map.mapOn();
	hriv.EmergencyUnits.map.resizeMap();
	hriv.EmergencyUnits.map.showCurrentPosition();
		
	setTimeout(function(){
		hriv.EmergencyUnits.map.show(gmap.curentPosition.latitude(), gmap.curentPosition.longitude());	
	}, 1000);		
});
$('#mapEmergencyUnits' ).live('pagehide', function(event){			
	gmap.currentInfoWindow.close();
	hriv.EmergencyUnits.marker.clearMyPos();
});

$('#listEmergencyUnits' ).live('pagecreate', function(event){
	hriv.EmergencyUnits.mode.list.init("list");
});
$('#listEmergencyUnits' ).live('pageshow', function(event){
	hriv.EmergencyUnits.mode.list.listOn();
});
$('#listEmergencyUnits').live('pagehide', function(event){
	
});


$("#detailview").live('pageshow', function(event){
	var page = hriv.fn.getQueryStringParamters("page"),
		id = hriv.fn.getQueryStringParamters("id");
	
	switch(page){
		case "CareUnits":
			hriv.CareUnits.detail.print(id);
		break;
		case "DutyUnits":
			hriv.DutyUnits.detail.print(id);
		break;
		case "EmergencyUnits":
			hriv.EmergencyUnits.detail.print(id);
		break;		
	}
});
