/*global $, hriv, q, console, gmap, google, PhoneGap, window, alert */

/****************************************************
* Instansitate and start the applications objects 
****************************************************/   
    
    /*****************************************
    * Case phongegap 
    * Instansitate the applications objects 
    *****************************************/ 
    // If you want to prevent dragging, uncomment this section
    /*
    function preventBehavior(e) 
    { 
      e.preventDefault(); 
    };
    document.addEventListener("touchmove", preventBehavior, false);
    */
    
    /* If you are supporting your own protocol, the var invokeString will contain any arguments to the app launch.
    see http://iphonedevelopertips.com/cocoa/launching-your-own-application-via-a-custom-url-scheme.html
    for more details -jm */
    /*
    function handleOpenURL(url)
    {
        // TODO: do something with the url passed in.
    }
    */
    
    // Handle the resume event    
    function onResume() {
        console.log("Debugg info: app resume");
        setTimeout(function(){
            if(hriv.app.run){
                hriv.app.run.restart();
            }            
        }, 4000);    
    }    
    
    /* When this function is called, Cordova has been initialized and is ready to roll */
    /* If you are supporting your own protocol, the var invokeString will contain any arguments to the app launch.
    see http://iphonedevelopertips.com/cocoa/launching-your-own-application-via-a-custom-url-scheme.html
    for more details -jm */
    function onDeviceReady()
    {        
        //navigator.notification.alert("Cordova is working");
        document.addEventListener("resume", onResume, false);
        hriv.state.isNative = true;
        hriv.app.start(); 
    }
    
    function onBodyLoad()
    {       
        document.addEventListener("deviceready", onDeviceReady, false);
    } 


/*************************************
* Initializer jQuery mobile framework
*************************************/
$(document).ready(function(){       
    
    //$.support.cors = true;
    $.mobile.allowCrossDomainPages = true;  
    $.mobile.defaultPageTransition = 'none';
    $.mobile.transitionFallbacks.slideout = "none"
    $('[data-position="fixed"]').fixedtoolbar({ tapToggle: false });
    //$.mobile.fixedToolbars.setTouchToggleEnabled(false);
    //$.mobile.pushStateEnabled = false;
    //$.mobile.loadingMessage = "Vänligen vänta, uppdaterar...";
    //$.mobile.touchOverflowEnabled = true;
    
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
    
    $('#jqmModal-start').modal();
    $.mobile.showPageLoadingMsg();    
    setTimeout(hriv.app.start, 30000);
        
});


/*******************************
* Page initializers CareUnits 
*******************************/
$('#mapCareUnits').live('pagecreate', function(event){  
    hriv.CareUnits.map.resizeMap();
    hriv.CareUnits.mode.map.mapOn(); 
    hriv.CareUnits.mode.map.init("map");
    hriv.CareUnits.map.show(gmap.curentPosition.latitude(), gmap.curentPosition.longitude()); 
});
$('#mapCareUnits').live('pagebeforeshow', function(event){
    hriv.CareUnits.mode.map.mapOn();
});
$('#mapCareUnits').live('pageshow', function(event){       
   hriv.CareUnits.map.show2();
   
    setTimeout(function(){
        hriv.CareUnits.marker.clearMyPos();
        hriv.CareUnits.marker.clearMarkers();            
        hriv.CareUnits.map.showCurrentPosition(true);
        hriv.CareUnits.marker.showMarkers();
        
        hriv.app.qFactory.start("MapCareUnits");                           
    }, 1000);   
});
$('#mapCareUnits').live('pagehide', function(event){     
    hriv.CareUnits.map.watchCurrentPosition(false);
    gmap.currentInfoWindow.close();
    hriv.app.qFactory.stop("MapCareUnits");
});


$('#listCareUnits').live('pagecreate', function(event){ 
    hriv.CareUnits.mode.list.init("list");
});
$('#listCareUnits').live('pagebeforeshow', function(event){
    hriv.CareUnits.mode.list.listOn();
});
$('#listCareUnits').live('pageshow', function(event){   
    $(".ui-header-fixed").fixedtoolbar('updatePagePadding');
    $(".ui-footer-fixed").fixedtoolbar('updatePagePadding');
    hriv.CareUnits.mode.list.listOn();
    setTimeout(function(){ 
        hriv.CareUnits.list.update();
        hriv.app.qFactory.start("ListCareUnits");
     }, 800);    
});
$('#listCareUnits').live('pagehide', function(event){
    hriv.app.qFactory.stop("ListCareUnits");   
});

/*********************************
 * Page initializers DutyUnits 
 *********************************/
$('#mapDutyUnits' ).live('pagecreate', function(event){ 
    hriv.DutyUnits.map.resizeMap();    
    hriv.DutyUnits.mode.map.mapOn();
    hriv.DutyUnits.mode.map.init("map");
    hriv.DutyUnits.map.show(gmap.curentPosition.latitude(), gmap.curentPosition.longitude());        
});
$('#mapDutyUnits' ).live('pagebeforeshow', function(event){
    hriv.DutyUnits.mode.map.mapOn();
});
$('#mapDutyUnits' ).live('pageshow', function(event){                
    hriv.DutyUnits.map.show2();
    
    setTimeout(function(){
        hriv.DutyUnits.marker.clearMyPos();
        hriv.DutyUnits.marker.clearMarkers();           
        hriv.DutyUnits.map.showCurrentPosition(true);
        hriv.DutyUnits.marker.showMarkers();  
        
        hriv.app.qFactory.start("MapDutyUnits");          
    }, 1000);   
});
$('#mapDutyUnits' ).live('pagehide', function(event){           
    hriv.DutyUnits.map.watchCurrentPosition(false); 
    gmap.currentInfoWindow.close(); 
    hriv.app.qFactory.stop("MapDutyUnits");   
});
$('#listDutyUnits' ).live('pagecreate', function(event){
    hriv.DutyUnits.mode.list.init("list");
});
$('#listDutyUnits').live('pagebeforeshow', function(event){
    hriv.DutyUnits.mode.list.listOn();        
});
$('#listDutyUnits' ).live('pageshow', function(event){
    $(".ui-header-fixed").fixedtoolbar('updatePagePadding');
    $(".ui-footer-fixed").fixedtoolbar('updatePagePadding');
    hriv.DutyUnits.mode.list.listOn();  
    setTimeout(function(){ 
        hriv.DutyUnits.list.update(); 
        hriv.app.qFactory.start("ListDutyUnits");
    }, 800);
     
});
$('#listDutyUnits').live('pagehide', function(event){
    hriv.app.qFactory.stop("ListDutyUnits");
});


/****************************************
 * Page initializers for EmergencyUnits 
 ***************************************/
$('#mapEmergencyUnits' ).live('pagecreate', function(event){
    hriv.EmergencyUnits.map.resizeMap();
    hriv.EmergencyUnits.mode.map.mapOn();
    hriv.EmergencyUnits.mode.map.init("map");
    hriv.EmergencyUnits.map.show(gmap.curentPosition.latitude(), gmap.curentPosition.longitude());
});
$('#mapEmergencyUnits' ).live('pagebeforeshow', function(event){
    hriv.EmergencyUnits.mode.map.mapOn();
});
$('#mapEmergencyUnits' ).live('pageshow', function(event){
    hriv.EmergencyUnits.map.show2();
    
    setTimeout(function(){
        hriv.EmergencyUnits.marker.clearMyPos();
        hriv.EmergencyUnits.marker.clearMarkers();        
        hriv.EmergencyUnits.map.showCurrentPosition(true);
        hriv.EmergencyUnits.marker.showMarkers();
        
        hriv.app.qFactory.start("MapEmergencyUnits");          
    }, 1000);       
});
$('#mapEmergencyUnits' ).live('pagehide', function(event){          
    hriv.EmergencyUnits.map.watchCurrentPosition(false);
    gmap.currentInfoWindow.close();
    hriv.app.qFactory.stop("MapEmergencyUnits");
});
$('#listEmergencyUnits' ).live('pagecreate', function(event){
    hriv.EmergencyUnits.mode.list.init("list");
});
$('#listEmergencyUnits').live('pagebeforeshow', function(event){
    hriv.EmergencyUnits.mode.list.listOn();       
});
$('#listEmergencyUnits' ).live('pageshow', function(event){
    $(".ui-header-fixed").fixedtoolbar('updatePagePadding');
    $(".ui-footer-fixed").fixedtoolbar('updatePagePadding');
    hriv.EmergencyUnits.mode.list.listOn(); 
    setTimeout(function(){  
        hriv.EmergencyUnits.list.update();
        hriv.app.qFactory.start("ListEmergencyUnits"); 
    }, 800);         
});
$('#listEmergencyUnits').live('pagehide', function(event){
    hriv.app.qFactory.stop("ListEmergencyUnits");  
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
    
    $("#btnWebSite").on("vclick", function(){
        
        var url =  $(this).attr("href");
        var re = new RegExp("^(http|https)://");
        var m = re.exec(url);        
        
        if(!m){            
           url = "http://" + url;
        }
        
        window.open(url); 
        return false; 
                        
    });             
});
$("#detailview").live('pageshow', function(event){
    $(".ui-header-fixed").fixedtoolbar('updatePagePadding');
});
$("#detailview").live('pagehide', function(event){
    $("#btnWebSite").off("vclick");
});