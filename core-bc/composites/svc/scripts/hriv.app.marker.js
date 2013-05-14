/*global $,window, google, console, dataStore, hriv, gmap, q, aq, onDeviceReady, PhoneGap */

/**
 * @author JOHO7326
 * 
 */


hriv.app.initMarkers = function(){
    hriv.EmergencyUnits.marker.initialize({refMap : hriv.EmergencyUnits.map.getMap()});
    hriv.CareUnits.marker.initialize({refMap : hriv.CareUnits.map.getMap()});       
    hriv.DutyUnits.marker.initialize({refMap : hriv.DutyUnits.map.getMap()});
};

hriv.app.printMarkers = function(){
    hriv.CareUnits.marker.showMarkers(hriv.CareUnits.map.getMap());
    hriv.DutyUnits.marker.showMarkers(hriv.DutyUnits.map.getMap());         
    hriv.EmergencyUnits.marker.showMarkers(hriv.EmergencyUnits.map.getMap());
};