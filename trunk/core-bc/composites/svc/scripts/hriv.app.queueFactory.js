/**
 * @author JOHO7326
 */
hriv.classes.queueFactory = function(){  
    
    var that = {},     
    q = {
        ListCareUnits : null,
        ListDutyUnits : null,
        ListEmergencyUnits : null,
        MapCareUnits : null,
        MapDutyUnits : null,
        MapEmergencyUnits : null        
    }, 
    config = {
        lastRun : null    
    };    
   
    that.init = function(){
        
        q.ListCareUnits = new DED.Queue();        
        q.ListCareUnits.setRetryCount(5);      // Reset our retry count to be higher for slow connections.
        q.ListCareUnits.setTimeout(30000);    //Timeout when failure in ajax call 10 min
        q.ListCareUnits.setInterval(30000);    //Time between runs 30 sec
        q.ListCareUnits.setSleep(30000);      //Time between each iteration 20 sec

        q.MapCareUnits = new DED.Queue();        
        q.MapCareUnits.setRetryCount(5);      // Reset our retry count to be higher for slow connections.
        q.MapCareUnits.setTimeout(60000);    //Timeout when failure in ajax call 10 min
        q.MapCareUnits.setInterval(60000);    //Time between runs 1 min
        q.MapCareUnits.setSleep(60000);      //Time between each iteration 1min
        
        
        q.ListDutyUnits = new DED.Queue();
        q.ListDutyUnits.setRetryCount(5);      // Reset our retry count to be higher for slow connections.
        q.ListDutyUnits.setTimeout(30000);    //Timeout when failure in ajax call 10 min
        q.ListDutyUnits.setInterval(30000);    //Time between runs 30 sec
        q.ListDutyUnits.setSleep(30000);      //Time between each iteration 30 sec
        
        
        q.MapDutyUnits = new DED.Queue();
        q.MapDutyUnits.setRetryCount(5);      // Reset our retry count to be higher for slow connections.
        q.MapDutyUnits.setTimeout(60000);    //Timeout when failure in ajax call 10 min
        q.MapDutyUnits.setInterval(60000);    //Time between runs 1 min
        q.MapDutyUnits.setSleep(60000);      //Time between each iteration 1min
        
        
        q.ListEmergencyUnits = new DED.Queue();
        q.ListEmergencyUnits.setRetryCount(5);      // Reset our retry count to be higher for slow connections.
        q.ListEmergencyUnits.setTimeout(30000);    //Timeout when failure in ajax call 10 min
        q.ListEmergencyUnits.setInterval(30000);    //Time between runs 30 sec
        q.ListEmergencyUnits.setSleep(30000);      //Time between each iteration 30 sec


        q.MapEmergencyUnits = new DED.Queue();
        q.MapEmergencyUnits.setRetryCount(5);      // Reset our retry count to be higher for slow connections.
        q.MapEmergencyUnits.setTimeout(60000);    //Timeout when failure in ajax call 10 min
        q.MapEmergencyUnits.setInterval(60000);    //Time between runs 1 min
        q.MapEmergencyUnits.setSleep(60000);      //Time between each iteration 1 min

        
        //Queue ListCareUnits
        q.ListCareUnits.add({ func : gmap.curentPosition.update, para : null, cmd : "UpdateCurrentPos" });
        q.ListCareUnits.add({ func : function(){ hriv.CareUnits.list.reload(hriv.dataStore.getCareUnits().careUnits); },
            para : hriv.dataStore.getCareUnits,
            cmd : "ListCareUnits"
        });
        q.ListCareUnits.add({ func : hriv.CareUnits.list.update, para : hriv.dataStore.getCareUnits, cmd : "CareUnits" });         

        
        //Queue MapCareUnits
        q.MapCareUnits.add({ func : gmap.curentPosition.update, para : null, cmd : "UpdateCurrentPos" });
        q.MapCareUnits.add({ func : function(){ hriv.CareUnits.marker.reload(hriv.dataStore.getCareUnits().careUnits, hriv.CareUnits); },
            para : hriv.dataStore.getCareUnits,
            cmd : "MapCareUnits"
        });                
        q.MapCareUnits.add({ 
            func : function(){                           
                hriv.CareUnits.marker.clearMyPos();
                hriv.CareUnits.marker.clearMarkers();
                hriv.CareUnits.map.showCurrentPosition(true);
                hriv.CareUnits.marker.showMarkers();                             
            },
            para : hriv.dataStore.getCareUnits,
            cmd : "MapCareUnits"
        });

                
        //Queue ListDutyUnits
        q.ListDutyUnits.add({ func : gmap.curentPosition.update, para : null, cmd : "UpdateCurrentPos" });
        q.ListDutyUnits.add({ func : function(){ hriv.DutyUnits.list.reload(hriv.dataStore.getDutyUnits().dutyUnits); },
            para : hriv.dataStore.getDutyUnits,
            cmd : "ListDutyUnits"
        });                        
        q.ListDutyUnits.add({ func : hriv.DutyUnits.list.update, para : hriv.dataStore.getDutyUnits, cmd : "DutyUnits" });
        
        
        //Qeueu MapDutyUnits   
        q.MapDutyUnits.add({ func : gmap.curentPosition.update, para : null, cmd : "UpdateCurrentPos" });
        q.MapDutyUnits.add({ func : function(){ hriv.DutyUnits.marker.reload(hriv.dataStore.getDutyUnits().dutyUnits, hriv.DutyUnits); },
            para : hriv.dataStore.getDutyUnits,
            cmd : "MapDutyUnits"
        }); 
        q.MapDutyUnits.add({ 
            func : function(){                           
                hriv.DutyUnits.marker.clearMyPos();
                hriv.DutyUnits.marker.clearMarkers();
                hriv.DutyUnits.map.showCurrentPosition(true);
                hriv.DutyUnits.marker.showMarkers();                             
            },
            para : hriv.dataStore.getDutyUnits,
            cmd : "MapDutyUnits"
        });           
                
        
        //Queue ListEmergencyUnits
        q.ListEmergencyUnits.add({ func : gmap.curentPosition.update, para : null, cmd : "UpdateCurrentPos" });
        q.ListEmergencyUnits.add({ func : function(){ hriv.EmergencyUnits.list.reload(hriv.dataStore.getEmergencyUnits().emergencyUnits); },
            para : hriv.dataStore.getEmergencyUnits,
            cmd : "ListEmergencyUnits"
        });                
        q.ListEmergencyUnits.add({ func : hriv.EmergencyUnits.list.update, para : hriv.dataStore.getEmergencyUnits, cmd : "EmergencyUnits" });
        
        
        //Qeueu MapEmergencyUnits
        q.MapEmergencyUnits.add({ func : gmap.curentPosition.update, para : null, cmd : "UpdateCurrentPos" });
        q.MapEmergencyUnits.add({ func : function(){ hriv.EmergencyUnits.marker.reload(hriv.dataStore.getEmergencyUnits().emergencyUnits, hriv.EmergencyUnits); },
            para : hriv.dataStore.getEmergencyUnits,
            cmd : "MapEmergencyUnits"
        });         
        q.MapEmergencyUnits.add({ 
            func : function(){                           
                hriv.EmergencyUnits.marker.clearMyPos();
                hriv.EmergencyUnits.marker.clearMarkers();
                hriv.EmergencyUnits.map.showCurrentPosition(true);
                hriv.EmergencyUnits.marker.showMarkers();                             
            },
            para : hriv.dataStore.getCareUnits,
            cmd : "MapEmergencyUnits"
        });
                
    };
    
    that.start = function(name){
        if(!name){return;};        
        config.lastRun = name;        
        q[name].start();
        q[name].flush();
        console.log("app: starting queue: " + name);         
    };
    
    that.stop = function(name){        
        q[name].pause();
        q[name].stopTimeOut();
        console.log("app: stopping queue: " + name);
    };
    
    that.flush = function(){
        if(!config.lastRun){return;}
        q[config.lastRun].start();
        q[config.lastRun].flush();        
    };
    
    return that;    
}
