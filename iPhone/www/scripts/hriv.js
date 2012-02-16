/*global $, q, console, gmap, google, PhoneGap */

/**************************
* 
**************************/
window.addEventListener('load', function () {
    document.addEventListener('deviceready', function () {
        console.log("PhoneGap is now loaded!");
    }, false);
}, false);


/**************************
* App global variables
**************************/
var hriv = {
        get : {},
        dataStore : {
            CareUnits : null,
            DutyUnits : null,
            EmergencyUnits : null                       
        },      
        CareUnits : {
            init : null,
            map : null,
            marker : null,
            list : {}, 
            detail : {}, 
            mode : {}
        },
        DutyUnits : {
            init: null,
            map : null,
            marker : null, 
            list : {},
            detail : {},
            mode : {}
        },
        EmergencyUnits : {
            init : null,
            map : null,
            marker : null,
            list : {},
            detail : {},
            mode : {}
        },
        listview : {},
        detailview : {},
        fn : {listview : {},
              detailview :  {} ,
              calc : {}
        },
        app : {}            
    };

