/*global $, hriv, q, console, gmap, google, PhoneGap, window */

/*************************************
* Initializer jQuery mobile framework
*************************************/

$(document).bind("mobileinit", function() {
    // Make your jQuery Mobile framework configuration changes here!
    //$.support.cors = true;
    //$.mobile.allowCrossDomainPages = true;
    //$.mobile.fixedToolbars.setTouchToggleEnabled(false);  
    //$.mobile.touchOverflowEnabled = true;
});


$(document).ready(function(){
    
    //$.support.cors = true;
    $.mobile.allowCrossDomainPages = true;  
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
* Case phongegap 
* Instansitate the applications objects 
*****************************************/          
window.addEventListener('load', function () {
    document.addEventListener('deviceready', function () {
        console.log("PhoneGap is now loaded!");         
        gmap.curentPosition.update();
        hriv.state.gotGeoPos = true;                        
    }, false);
}, false);

/*****************************************
* Case desktop browser 
* Instansitate the applications objects 
*****************************************/          
$(document).ready(function() {
                
    $('#jqmModal-start').modal();
    setTimeout(function(){        
        $.mobile.showPageLoadingMsg("laddar");
        if (!hriv.state.gotGeoPos){
            gmap.curentPosition.update();                   
        }        
    },500);
    
    setTimeout(function(){
        hriv.app.inst();
    },1000);
     
    setTimeout(function(){
        hriv.app.init();
    },15000);
         
});


/*******************************
* Page initializers CareUnits 
*******************************/
$('#mapCareUnits').live('pagecreate', function(event){  
    hriv.CareUnits.mode.map.init("map");
});
$('#mapCareUnits').live('pageshow', function(event){
    hriv.CareUnits.mode.map.mapOn();    
    hriv.CareUnits.map.showCurrentPosition(true);  
    
    setTimeout(function(){
        hriv.CareUnits.map.resizeMap();
        hriv.CareUnits.map.show(gmap.curentPosition.latitude(), gmap.curentPosition.longitude());               
    }, 1000);   
});
$('#mapCareUnits').live('pagehide', function(event){    
    hriv.CareUnits.map.watchCurrentPosition(false);
    gmap.currentInfoWindow.close();
    hriv.CareUnits.marker.clearMyPos(); 
});
$('#listCareUnits').live('pagecreate', function(event){ 
    hriv.CareUnits.mode.list.init("list");
});
$('#listCareUnits').live('pagebeforeshow', function(event){
    q.skip("CareUnits");
    hriv.CareUnits.list.update();
});
$('#listCareUnits').live('pageshow', function(event){   
    hriv.CareUnits.mode.list.listOn();
    setTimeout(function(){ q.skip(""); }, 200);     
});
$('#listCareUnits').live('pagehide', function(event){
    hriv.CareUnits.list.remove();   
});

/*********************************
 * Page initializers DutyUnits 
 *********************************/
$('#mapDutyUnits' ).live('pagecreate', function(event){ 
    hriv.DutyUnits.mode.map.init("map");    
});
$('#mapDutyUnits' ).live('pageshow', function(event){       
    hriv.DutyUnits.mode.map.mapOn();    
    hriv.DutyUnits.map.showCurrentPosition(true);      
        
    setTimeout(function(){
        hriv.DutyUnits.map.resizeMap();
        hriv.DutyUnits.map.show(gmap.curentPosition.latitude(), gmap.curentPosition.longitude());
    }, 1000);   
});
$('#mapDutyUnits' ).live('pagehide', function(event){           
    hriv.DutyUnits.map.watchCurrentPosition(false); 
    gmap.currentInfoWindow.close();
    hriv.DutyUnits.marker.clearMyPos();
});
$('#listDutyUnits' ).live('pagecreate', function(event){
    hriv.DutyUnits.mode.list.init("list");
});
$('#listDutyUnits').live('pagebeforeshow', function(event){
    q.skip("DutyUnits");
    hriv.DutyUnits.list.update();
});
$('#listDutyUnits' ).live('pageshow', function(event){
    hriv.DutyUnits.mode.list.listOn();  
    setTimeout(function(){ q.skip(""); }, 200); 
});
$('#listDutyUnits').live('pagehide', function(event){
    hriv.DutyUnits.list.remove();
});


/****************************************
 * Page initializers for EmergencyUnits 
 ***************************************/
$('#mapEmergencyUnits' ).live('pagecreate', function(event){
    hriv.EmergencyUnits.mode.map.init("map");
});
$('#mapEmergencyUnits' ).live('pageshow', function(event){      
    hriv.EmergencyUnits.mode.map.mapOn();
    hriv.EmergencyUnits.map.showCurrentPosition(true);
        
    setTimeout(function(){
        hriv.EmergencyUnits.map.resizeMap();
        hriv.EmergencyUnits.map.show(gmap.curentPosition.latitude(), gmap.curentPosition.longitude());  
    }, 1000);       
});
$('#mapEmergencyUnits' ).live('pagehide', function(event){          
    hriv.EmergencyUnits.map.watchCurrentPosition(false);
    gmap.currentInfoWindow.close();
    hriv.EmergencyUnits.marker.clearMyPos();
});
$('#listEmergencyUnits' ).live('pagecreate', function(event){
    hriv.EmergencyUnits.mode.list.init("list");
});
$('#listEmergencyUnits').live('pagebeforeshow', function(event){
    q.skip("EmergencyUnits");
    hriv.EmergencyUnits.list.update();      
});
$('#listEmergencyUnits' ).live('pageshow', function(event){
    hriv.EmergencyUnits.mode.list.listOn(); 
    setTimeout(function(){ q.skip(""); }, 200);         
});
$('#listEmergencyUnits').live('pagehide', function(event){
    hriv.EmergencyUnits.list.remove();  
});

/**************************************
 * Page initializers DetailView
 *************************************/
$("#detailview").live('pagebeforeshow', function(event){
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
