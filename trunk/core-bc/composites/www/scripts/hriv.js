/*global $, q, console, gmap, google, PhoneGap, window */

/**************************
* 
**************************/



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
        app : {},
        state : {
            gotGeoPos : false
        }            
    };

