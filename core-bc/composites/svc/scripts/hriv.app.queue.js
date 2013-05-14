/*global $,window, google, console, dataStore, hriv, gmap, q, aq, onDeviceReady, PhoneGap */

/**
 * @author Johan Holm 
 * 
 */


hriv.app.initQueue = function(){
    
};


hriv.app.initAjaxQueue = function(){

    aq.add({        
        url: "Please contact responsible person at VGR for url to service: https://code.google.com/p/oppna-program/",
        cmd: "FetchingCareUnits"
        //data: hriv.dataStore.CareUnits.careUnits 
    });

    aq.add({        
        url: "Please contact responsible person at VGR for url to service: https://code.google.com/p/oppna-program/",
        cmd: "FetchingDutyUnits"
        //data : hriv.dataStore.DutyUnits.dutyUnits
    });
    
    aq.add({        
        url: "Please contact responsible person at VGR for url to service: https://code.google.com/p/oppna-program/",
        cmd: "FetchingEmergencyUnits"
        //data: hriv.dataStore.EmergencyUnits.emergencyUnits
    }); 
    
    
    /********************************************
    * Notifier for each request that 
    * is being flushed, eg. when its success.
    *********************************************/
    aq.onFlush.subscribe(function (cmd, data) {
        console.log("exec reload :" + cmd + "  " + new Date());
        //q.pause();        
        
        switch (cmd) {
            case 'FetchingCareUnits':
                    hriv.dataStore.CareUnits.careUnits = null;  //Removes data
                    hriv.dataStore.CareUnits.careUnits = data.careUnits;  //Adds new data                    
                    hriv.CareUnits.list.reload(data.careUnits);
                    hriv.CareUnits.marker.reload(data.careUnits, hriv.CareUnits);
                    hriv.CareUnits.detail.reload(data.careUnits, hriv.CareUnits);
                break;
            case 'FetchingDutyUnits':
                    hriv.dataStore.DutyUnits.dutyUnits = null;  //Removes data
                    hriv.dataStore.DutyUnits.dutyUnits = data.dutyUnits;  //Adds new data
                    hriv.DutyUnits.list.reload(data.dutyUnits);
                    hriv.DutyUnits.marker.reload(data.dutyUnits, hriv.DutyUnits);
                    hriv.DutyUnits.detail.reload(data.dutyUnits, hriv.DutyUnits);

                break;
            case 'FetchingEmergencyUnits':
                    hriv.dataStore.EmergencyUnits.emergencyUnits = null; //Removes data
                    hriv.dataStore.EmergencyUnits.emergencyUnits = data.emergencyUnits; //Adds new data
                    hriv.EmergencyUnits.list.reload(data.emergencyUnits);
                    hriv.EmergencyUnits.marker.reload(data.emergencyUnits, hriv.EmergencyUnits);
                    hriv.EmergencyUnits.detail.reload(data.emergencyUnits, hriv.EmergencyUnits);

                break;
        }       
        
    });
    
    // Notifier for any failures.
    aq.onFailure.subscribe(function() {
        console.log("failure queue");       
        //q.start();
        //q.flush();
    });
    
    // Notifier of the completion of the flush.
    aq.onComplete.subscribe(function (cmd, data) {      
        console.log("started queue");
        //q.start();
        //q.flush();
    });     
    
};


/*
 *
 * */
hriv.app.runQueue = function(){
  var that = {}, isRunning = false, lastRun;
  
  that.start = function(){
      
    //setTimeout(function () { q.flush(); }, 2000);       //2 sec
    aq.flush();
    //setTimeout(function () {  }, 3000);    //4 min
    isRunning = true;
    lastRun = new Date().getTime();  
  };
  
  that.isRunning = function(){
    return isRunning;  
  };
  
  that.restart = function(){
      if(isRunning){
        var elapsed = new Date().getTime() - lastRun;
        console.log(elapsed);
        
        //if(elapsed > hriv.app.settings.timeGetData()){
        if(elapsed > 600000){          //If more than 10 min last used, fetch new items from server.
            console.log("restart");         
            //q.pause();
            //q.stopTimeOut();
            aq.pause();
            aq.stopTimeOut();
          
            //setTimeout(function () { q.start(); q.flush(); }, 30000);       //2 sec
            setTimeout(function () { aq.start(); aq.flush(); }, 10000);    //2 min
            lastRun = new Date().getTime(); 
        }
        
      }      
  };
  
  return that;  
    
};