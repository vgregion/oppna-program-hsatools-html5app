/*global $,window, google, console, dataStore, hriv, gmap, q, aq, onDeviceReady, PhoneGap */

           
/**
 * Initilize HRIV javascript application framework
 * */
hriv.app.state = (function(){
    
    var init = false, isLoading, loadingObj, timeOutLoadModal, _isStarted = false;
     
    loadingObj = {
        CareUnits : false,
        DutyUnits : false,
        EmergencyUnits : false
    };      
    
    isLoading = function(){
        var res = false;
        
        for(var prop in loadingObj){                
            if(!loadingObj[prop]){
                res = true;
            } 
        }
        
        if(!res){
            setTimeout(function(){
                $.modal.close();
                $.mobile.hidePageLoadingMsg();                
            }, 2500); 
        }   
        
        return res;  
    };
    
    return{
        isInit : function(){
            return init;
            
        },
        setStarted : function(val){
            _isStarted = val;
        },
        isStarted : function(){
            return _isStarted;
        },
        clearTimeOut : function(){
          clearTimeout(timeOutLoadModal.clear);  
        },
        set : function(val){
            init = val;
        }, 
        isLoading : function(){
           return isLoading();
        },
        readyLoading : function(prop, val){
            loadingObj[prop] = val;
            isLoading();
        }
    };
    
})();


/**
 * Settings HRIV javscript application
 * */
hriv.app.settings = (function(){
    
    var numPrintListItems = 30,
        timeGetData = 14400000; //4 hours interval for fetching new data
    
    return {
        printListItems : function(){
            return numPrintListItems;   
        },
        timeGetData : function(){
            return timeGetData;
        }
    };
    
})();


hriv.app.start2 = function(){
    console.log("app: start2");
    
    //Kontrollera om nativagor är redo    
    gmap.curentPosition.update1();
    hriv.state.gotGeoPos = true;
        
    //Fires after geo pos is fetched
    console.log("app: waiting for geo pos");
    gmap.obs.getPosition.subscribe(function(){
        //Initialiserar och startar app 
        setTimeout(function(){
           hriv.app.init();
           $.mobile.hidePageLoadingMsg();
           $.modal.close();
            
           setTimeout(function(){
               //start ajax queue
               hriv.app.run = hriv.app.runQueue();
               hriv.app.run.start();                          
               $.modal.close();
               $.mobile.hidePageLoadingMsg(); 
           }, 6000);         
        }, 2500);
    });        
};

function mapsLoaded() {
    console.log("app: google maps api loaded");    
    // //Instansierar app    
    setTimeout(hriv.app.inst, 3000);
     
    //Kör igång appen   
    setTimeout(hriv.app.start2, 5000);              
}

function loadMaps() {
    google.load("maps", "3", {"other_params":"sensor=true", "callback" : mapsLoaded});    
}

/*
 *
 * */
hriv.app.start = function(){           
    if(hriv.app.state.isStarted()){ return; };
    hriv.app.state.setStarted(true);
    
    console.log("app: starting");
    
    $.getScript("https://www.google.com/jsapi?callback=loadMaps", function(){        
    }).error(function() {
        console.log("app error: error fetching google maps");
        alert("Kunde ej ansluta till Internet.");                 
        $.modal.close();
        $.mobile.hidePageLoadingMsg();
    });
};

/**
 * Object instantiation
 * */
hriv.app.inst = function(){ 
    console.log("app: inst");
    
    /*****************************************
    * Function setup & object initilization 
    *****************************************/   
    hriv.CareUnits.map = gmap.map({pageId : '#mapCareUnits [data-icon="compass"]', mapCanvasId: "map_canvas", headerSelector : ".ui-page-active .ui-header", footerSelector : ".ui-page-active .ui-footer", linkMap : "#detailview", page : "CareUnits"});
    hriv.CareUnits.marker = gmap.marker();
    hriv.CareUnits.list = hriv.classes.listview({refObj : hriv.CareUnits, listId: "#lCareUnits"});
    hriv.CareUnits.detail = hriv.classes.detailview({listId: "#lCareUnits"});
    hriv.CareUnits.mode.map = hriv.classes.mode({mapId : "#mapCareUnits .ui-button-map", listId : "#mapCareUnits .ui-button-list", linkId : "#linkCareUnits", linkMap: "#mapCareUnits" , linkList : "#listCareUnits" });
    hriv.CareUnits.mode.list = hriv.classes.mode({mapId : "#listCareUnits .ui-button-map", listId : "#listCareUnits .ui-button-list", linkId : "#linkCareUnits", linkMap: "#mapCareUnits" , linkList : "#listCareUnits" });
    
    
    hriv.DutyUnits.map = gmap.map({pageId : '#mapDutyUnits [data-icon="compass"]', mapCanvasId: "map_canvas_DutyUnits", headerSelector : ".ui-page-active .ui-header", footerSelector : ".ui-page-active .ui-footer", linkMap : "#detailview", page : "DutyUnits"});
    hriv.DutyUnits.marker = gmap.marker();
    hriv.DutyUnits.list = hriv.classes.listview({refObj : hriv.DutyUnits, listId: "#ldutyUnits"});
    hriv.DutyUnits.detail = hriv.classes.detailview({listId: "#ldutyUnits"});
    hriv.DutyUnits.mode.map = hriv.classes.mode({mapId : "#mapDutyUnits .ui-button-map", listId : "#mapDutyUnits .ui-button-list", linkId : "#linkDutyUnits", linkMap: "#mapDutyUnits" , linkList : "#listDutyUnits"});
    hriv.DutyUnits.mode.list = hriv.classes.mode({mapId : "#listDutyUnits .ui-button-map", listId : "#listDutyUnits .ui-button-list", linkId : "#linkDutyUnits", linkMap: "#mapDutyUnits" , linkList : "#listDutyUnits" });
    
    
    hriv.EmergencyUnits.map = gmap.map({pageId : '#mapEmergencyUnits [data-icon="compass"]', mapCanvasId: "map_canvas_Emergency", headerSelector : ".ui-page-active .ui-header", footerSelector : ".ui-page-active .ui-footer", linkMap : "#detailview", page : "EmergencyUnits"});
    hriv.EmergencyUnits.marker = gmap.marker();
    hriv.EmergencyUnits.list = hriv.classes.listview({refObj : hriv.EmergencyUnits, listId: "#lemergencyUnits"});
    hriv.EmergencyUnits.detail = hriv.classes.detailview({listId: "#lemergencyUnits"});
    hriv.EmergencyUnits.mode.map = hriv.classes.mode({mapId : "#mapEmergencyUnits .ui-button-map", listId : "#mapEmergencyUnits .ui-button-list", linkId : "#linkEmergencyUnits", linkMap: "#mapEmergencyUnits" , linkList : "#listEmergencyUnits"});
    hriv.EmergencyUnits.mode.list = hriv.classes.mode({mapId : "#listEmergencyUnits .ui-button-map", listId : "#listEmergencyUnits .ui-button-list", linkId : "#linkEmergencyUnits", linkMap: "#mapEmergencyUnits" , linkList : "#listEmergencyUnits"});
    
    
    hriv.app.qFactory = hriv.classes.queueFactory();          
};

/**
 * Object initilization
 * */
hriv.app.init = function(){    
    
    var timerInitMap;    
    
    //Check if app is initilized
    if(hriv.app.state.isInit()){ return; }        
    hriv.app.state.set(true);    
    console.log("app: init");    
    
    hriv.app.load(hriv.dataStore.CareUnits.careUnits, hriv.CareUnits);
    hriv.app.load(hriv.dataStore.DutyUnits.dutyUnits, hriv.DutyUnits);
    hriv.app.load(hriv.dataStore.EmergencyUnits.emergencyUnits, hriv.EmergencyUnits);        
        
    hriv.CareUnits.map.initialize({refmarker : hriv.CareUnits.marker, mapCenterLat : gmap.curentPosition.latitude(), mapCenterLng : gmap.curentPosition.longitude()});                                             
    hriv.DutyUnits.map.initialize({refmarker : hriv.DutyUnits.marker, mapCenterLat : gmap.curentPosition.latitude(), mapCenterLng : gmap.curentPosition.longitude()});         
    hriv.EmergencyUnits.map.initialize({refmarker : hriv.EmergencyUnits.marker, mapCenterLat : gmap.curentPosition.latitude(), mapCenterLng : gmap.curentPosition.longitude()});    
           
    hriv.CareUnits.map.addListerner("idle", function(){
        //console.log("Care idle");    
        hriv.app.state.readyLoading("CareUnits", true);
    });
    
    hriv.DutyUnits.map.addListerner("idle", function(){    
        //console.log("Duty idle");
        hriv.app.state.readyLoading("DutyUnits", true);
    });    
    
    hriv.EmergencyUnits.map.addListerner("idle", function(){    
        //console.log("Emg idle");
        hriv.app.state.readyLoading("EmergencyUnits", true);
    }); 
   
   hriv.app.initMarkers();   
   hriv.app.initQueue();
   hriv.app.initAjaxQueue(); 
   hriv.app.qFactory.init();
   
        
   timerInitMap = setInterval(function(){
   //setTimeout(function(){       
        console.log("init map run");
        if(!hriv.app.state.isLoading()){ 
            clearInterval(timerInitMap);
            //hriv.app.printMarkers();
            hriv.app.printList();  
            console.log("init map stopped"); }        
    }, 1000);   
    
    console.log("app: started");      
};

/**
 * Load data to HRIV javscript application
 * */
hriv.app.load = function(refData, refObj){
    
    //Loads pois to marker object
    var pois = [], listItems = [], listDetails = [], 
        data = refData, lat = gmap.curentPosition.latitude(), lng = gmap.curentPosition.longitude();    
        
    for(var i = 0; i < data.length; i++){
        
        //Load marker items
        refObj.marker.load(refObj, data[i]);
        
        //Load list items
        refObj.list.load(refObj, data[i], lat, lng);
        
        //Load detail items
        refObj.detail.load(data[i], listDetails);
    }    
};


/**
 * Print out data to html
 * */
hriv.app.printList = function(){
    var itms = hriv.app.settings.printListItems();
    
    hriv.CareUnits.list.print(itms);
    hriv.DutyUnits.list.print(itms);        
    hriv.EmergencyUnits.list.print(itms);   
    
    hriv.EmergencyUnits.detail.init();
    hriv.CareUnits.detail.init();
    hriv.DutyUnits.detail.init();
};