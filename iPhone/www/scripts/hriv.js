/*global $, gmap, google */

/**************************
* Initializer framework
**************************/
$.support.cors = true;
$.mobile.allowCrossDomainPages = true;
$( document ).bind( "mobileinit", function() {
	// Make your jQuery Mobile framework configuration changes here!
	$.mobile.allowCrossDomainPages = true;
	$.mobile.fixedToolbars.setTouchToggleEnabled(false);
	$.mobile.touchOverflowEnabled = true;
});

/*****************************************
* Function setup & object initilization 
*****************************************/
hriv.CareUnits.map = gmap.map({mapCanvasId: "map_canvas", headerSelector : ".ui-page-active .ui-header", footerSelector : ".ui-page-active .ui-footer"});
hriv.CareUnits.marker = gmap.marker();
hriv.CareUnits.list = hriv.listview({listId: "#lCareUnits"});
hriv.CareUnits.detail = hriv.detailview({listId: "#lCareUnits"});

hriv.DutyUnits.map = gmap.map({mapCanvasId: "map_canvas_DutyUnits", headerSelector : ".ui-page-active .ui-header", footerSelector : ".ui-page-active .ui-footer"});
hriv.DutyUnits.marker = gmap.marker();
hriv.DutyUnits.list = hriv.listview({listId: "#ldutyUnits"});
hriv.DutyUnits.detail = hriv.detailview({listId: "#ldutyUnits"});

hriv.EmergencyUnits.map = gmap.map({mapCanvasId: "map_canvas_Emergency", headerSelector : ".ui-page-active .ui-header", footerSelector : ".ui-page-active .ui-footer"});
hriv.EmergencyUnits.marker = gmap.marker();
hriv.EmergencyUnits.list = hriv.listview({listId: "#lemergencyUnits"});
hriv.EmergencyUnits.detail = hriv.detailview({listId: "#lemergencyUnits"});


$(document).ready(function() {
	
	navigator.geolocation.getCurrentPosition(function(position){					
		gmap.curentPosition.set(position.coords.latitude, position.coords.longitude);
		
		hriv.CareUnits.init();
		hriv.DutyUnits.init();	
		hriv.EmergencyUnits.init();
			
		setTimeout(function(){
			hriv.CareUnits.list.print();
			hriv.DutyUnits.list.print();		
			hriv.EmergencyUnits.list.print();
			
			hriv.EmergencyUnits.detail.init();
			hriv.CareUnits.detail.init();
			hriv.DutyUnits.detail.init();

		}, 500);	
	});			

    $(document).bind("deviceready", function(){
		navigator.geolocation.getCurrentPosition(function(position){			
			gmap.curentPosition.set(position.coords.latitude, position.coords.longitude);
			
			hriv.CareUnits.init();
			hriv.DutyUnits.init();	
			hriv.EmergencyUnits.init();	
			
			setTimeout(function(){
				hriv.CareUnits.list.print();
				hriv.DutyUnits.list.print();
				hriv.EmergencyUnits.list.print();
				
				
				hriv.EmergencyUnits.detail.init();
				hriv.CareUnits.detail.init();
				hriv.DutyUnits.detail.init();

			}, 500);								
		});			
	});	
	
});
	



/************************
* Page initializers 
************************/
$('#mapCareUnits' ).live('pagecreate', function(event){
	//hriv.CareUnits.map.create();		
	hriv.CareUnits.map.initialize({refmarker : hriv.CareUnits.marker, 
								   mapCenterLat : gmap.curentPosition.latitude(), 
								   mapCenterLng : gmap.curentPosition.longitude()});
								   
	hriv.CareUnits.marker.initialize({refMap : hriv.CareUnits.map.getMap()});
	
	setTimeout(function(){
		hriv.CareUnits.marker.showMarkers(hriv.CareUnits.map.getMap());		
	},1000);
});

//Page initializers CareUnits
$('#mapCareUnits' ).live( 'pageshow', function(event){			
	setTimeout(function(){
		hriv.CareUnits.map.show(gmap.curentPosition.latitude(), gmap.curentPosition.longitude());		
	}, 700);	
});

$('#mapCareUnits' ).live( 'pagehide', function(event){			
	gmap.currentInfoWindow.close();
	hriv.CareUnits.marker.clearMyPos();
});





//Page initializers CareUnits
$('#mapDutyUnits' ).live('pagecreate', function(event){
	hriv.DutyUnits.map.initialize({refmarker : hriv.DutyUnits.marker,
								   mapCenterLat : gmap.curentPosition.latitude(), 
								   mapCenterLng : gmap.curentPosition.longitude()});
								   	   
	hriv.DutyUnits.marker.initialize({refMap : hriv.DutyUnits.map.getMap()});
	
	setTimeout(function(){
		hriv.DutyUnits.marker.showMarkers(hriv.DutyUnits.map.getMap());	
	},1000);		
});

$('#mapDutyUnits' ).live('pageshow', function(event){		
	setTimeout(function(){
		hriv.DutyUnits.map.show(gmap.curentPosition.latitude(), gmap.curentPosition.longitude());
	}, 700);	
});

$('#mapDutyUnits' ).live( 'pagehide', function(event){			
	gmap.currentInfoWindow.close();
	hriv.DutyUnits.marker.clearMyPos();
});


//Page initializers EmergencyUnits
$('#mapEmergencyUnits' ).live('pagecreate', function(event){
	hriv.EmergencyUnits.map.initialize({refmarker : hriv.EmergencyUnits.marker,
								   mapCenterLat : gmap.curentPosition.latitude(), 
								   mapCenterLng : gmap.curentPosition.longitude()});
								   
	hriv.EmergencyUnits.marker.initialize({refMap : hriv.EmergencyUnits.map.getMap()});
	
	setTimeout(function(){
		hriv.EmergencyUnits.marker.showMarkers(hriv.EmergencyUnits.map.getMap());	
	},1000);		
});

$('#mapEmergencyUnits' ).live('pageshow', function(event){		
	setTimeout(function(){		
		hriv.EmergencyUnits.map.show(gmap.curentPosition.latitude(), gmap.curentPosition.longitude());
	}, 700);		
});

$('#mapEmergencyUnits' ).live( 'pagehide', function(event){			
	gmap.currentInfoWindow.close();
	hriv.EmergencyUnits.marker.clearMyPos();
});