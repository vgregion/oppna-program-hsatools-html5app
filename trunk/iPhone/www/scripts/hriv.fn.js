/*global $, gmap, google, hriv */


/*****************************
* Extends Javascript objects 
* with custom functionality
*****************************/


/** 
 * Extends Array 
 * Search for specific property value in object array 
 **/
if (typeof(Array.prototype.getIndex) === "undefined") {
  Array.prototype.getIndex = function(hsaId){			
				
		for(var i = 0; i < this.length; i++){
			if (this[i].detailViewId === hsaId) {
		      return i;		      
		   } 
		}		
		return null;
	};    
    
};

/** 
 * Converts numeric degrees to radians 
 **/
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  };
}


/**
 * Fallback solution for keys 
 * function in Object type.
 * */
if(!Object.keys){ 
	Object.keys = function(o){  
		if (o !== Object(o)){  
			throw new TypeError('Object.keys called on non-object');
		}
		var ret=[], p;
		for(p in o){ 
			if(Object.prototype.hasOwnProperty.call(o,p)){ 
				ret.push(p);
			}
		}	 
		return ret;
	};
}


/************************
* Namespace HRIV
************************/
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
		}			
	};


/************************
* Functions HRIV
************************/


/**
 * Calculate distance between two sets of lat lang coordinates 
 **/
hriv.fn.calc.distance = function(lat1, lng1, lat2, lng2){
				
		var _calculate = function(lt1, ln1, lt2, ln2){
			var R = 6371; // km
			var dLat = (lt2-lt1).toRad();
			var dLon = (ln2-ln1).toRad();
			var lat1 = lt1.toRad();
			var lat2 = lt2.toRad();
			
			var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
			var d = R * c;
			
			return d;
		};		
		
		return _calculate(lat1, lng1, lat2, lng2);
};



/**
 * Calculate open icon
 **/
 hriv.fn.calc.isOpen = function(hours){

	var arrDays = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];
	var arrOpen = [];
	var monday, tuesday, wednesday, thursday, friday, saturday, sunday;	
	
	var obj = hours;
	
	if(obj.hasOwnProperty('monday')){
	    monday = obj.monday[0];
	    monday.day = "monday";
	    monday.daynb = 0;
	    monday.openingHour = (obj.monday[0].openingHour === null ? "00:00" : obj.monday[0].openingHour );
	    monday.closingHour = obj.monday[0].closingHour;
	    arrOpen[0] = monday;
	}else{arrOpen[0] = null;}	
	
	if(obj.hasOwnProperty('tuesday')){
	    tuesday= obj.tuesday[0];
	    tuesday.day = "tuesday";
	    tuesday.daynb = 1;
	    tuesday.openingHour = (obj.tuesday[0].openingHour === null ? "00:00" : obj.tuesday[0].openingHour );
	    tuesday.closingHour = obj.tuesday[0].closingHour;
	    arrOpen[1] = tuesday;
	}else{arrOpen[1] = null;}	
	
	if(obj.hasOwnProperty('wednesday')){
	    wednesday= obj.wednesday[0];
	    wednesday.day = "wednesday";
	    wednesday.daynb = 2;
	    wednesday.openingHour = (obj.wednesday[0].openingHour === null ? "00:00" : obj.wednesday[0].openingHour );
	    wednesday.closingHour = obj.wednesday[0].closingHour;
	    arrOpen[2] = wednesday;
	}else{arrOpen[2] = null;}	
		
	if(obj.hasOwnProperty('thursday')){
	    thursday= obj.thursday[0];
	    thursday.day = "thursday";
	    thursday.daynb = 3;
	    thursday.openingHour = (obj.thursday[0].openingHour === null ? "00:00" : obj.thursday[0].openingHour );
	    thursday.closingHour = obj.thursday[0].closingHour;	    
	    arrOpen[3] = thursday;
	}else{arrOpen[3] = null;}	
		
	if(obj.hasOwnProperty('friday')){
	    friday= obj.friday[0];
	    friday.day = "friday";
	    friday.daynb = 4;	    
	    friday.openingHour = (obj.friday[0].openingHour === null ? "00:00" : obj.friday[0].openingHour );
	    friday.closingHour = obj.friday[0].closingHour;	    
	    arrOpen[4] = friday;
	}else{arrOpen[4] = null;}	

	
	if(obj.hasOwnProperty('saturday')){
	    saturday= obj.saturday[0];
	    saturday.day = "saturday";
	    saturday.daynb = 5;	    
	    saturday.openingHour = (obj.saturday[0].openingHour === null ? "00:00" : obj.saturday[0].openingHour );
	    saturday.closingHour = obj.saturday[0].closingHour;	    
	    arrOpen[5] = saturday;
	}else{arrOpen[5] = null;}	
	
	if(obj.hasOwnProperty('sunday')){
	    sunday= obj.sunday[0];
	    sunday.day = "sunday";
	    sunday.daynb = 6;	    
	    sunday.openingHour = (obj.sunday[0].openingHour === null ? "00:00" : obj.sunday[0].openingHour );
	    sunday.closingHour = obj.sunday[0].closingHour;	    
	    arrOpen[6] = sunday;
	}else{arrOpen[6] = null;}	

	var d = new Date();	
	var day = d.getDay() - 1;
	day = arrOpen[day];
	var result;
	
	result = (day !== null) ? hriv.fn.calc.time(day.openingHour +":00", day.closingHour +":00") : -1;
	
	return result;
};

hriv.fn.calc.time =  function (open1,close2) {
  
	var now = new Date();	
	var t1 = new Date();
	var parts = open1.split(":");
	t1.setHours(parts[0],parts[1],parts[2],0);
	var t2 = new Date();
	parts = close2.split(":");
	t2.setHours(parts[0],parts[1],parts[2],0);

	// returns 1 if is in intervall, -1 if otherwise
	if (t1.getTime() < now.getTime() && now.getTime() < t2.getTime()) { 
		return 1;
	}
	
	return -1;
  
};


/**
 * Calculate display layout open hours
 **/
 hriv.fn.calc.openhours = function(hours){

	var arrDays = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];
	var arrOpen = [];
	var arrOpenHours = [];
	var monday, tuesday, wednesday, thursday, friday, saturday, sunday;	
	
	var obj = hours;
	
	if(obj.hasOwnProperty('monday')){
	    monday = obj.monday[0];
	    monday.day = "monday";
	    monday.daynb = 0;
	    arrOpen.push(monday);
	}	
	
	if(obj.hasOwnProperty('tuesday')){
	    tuesday= obj.tuesday[0];
	    tuesday.day = "tuesday";
	    tuesday.daynb = 1;
	    arrOpen.push(tuesday);
	}	
	
	if(obj.hasOwnProperty('wednesday')){
	    wednesday= obj.wednesday[0];
	    wednesday.day = "wednesday";
	    wednesday.daynb = 2;
	    arrOpen.push(wednesday);
	}	
	
	if(obj.hasOwnProperty('thursday')){
	    thursday= obj.thursday[0];
	    thursday.day = "thursday";
	    thursday.daynb = 3;
	    arrOpen.push(thursday);
	}	
	
	if(obj.hasOwnProperty('friday')){
	    friday= obj.friday[0];
	    friday.day = "friday";
	    friday.daynb = 4;	    
	    arrOpen.push(friday);
	}	
	
	if(obj.hasOwnProperty('saturday')){
	    saturday= obj.saturday[0];
	    saturday.day = "saturday";
	    saturday.daynb = 5;	    
	    arrOpen.push(saturday);
	}	
	
	if(obj.hasOwnProperty('sunday')){
	    sunday= obj.sunday[0];
	    sunday.day = "sunday";
	    sunday.daynb = 6;	    
	    arrOpen.push(sunday);
	}	
	
	arrOpen.sort(function(a,b){
	    if(a !== null && b !==null ){
	        if(a.openingHour<b.openingHour) return -1;
	        if(a.openingHour>b.openingHour) return 1;
	    }
	    return 0;
	});
	
	arrOpen.sort(function(a,b){
	    if(a !== null && b !==null ){
	        if(a.closingHour<b.closingHour) return -1;
	        if(a.closingHour>b.closingHour) return 1;
	    }
	    return 0;
	});


	var i = 0, start = 0, stop = 0, open1, open2, close1, close2, str = "";	
	for(i = 0; i < arrOpen.length; i++){
	
	    open1 = arrOpen[start].openingHour;
	    close1 = arrOpen[start].closingHour;
	    	
	    if(arrOpen[i] !== undefined ){
	        open2 = arrOpen[i].openingHour;
	        close2 = arrOpen[i].closingHour;
	    }     
	        
         if(open1 !== open2 || close1 !== close2 ){         
	        str = arrDays[arrOpen[start].daynb] + " - " + arrDays[arrOpen[i-1].daynb] + ": "+ open1 + " - " + close1 ;		        
	        arrOpenHours.push(str);        
	        str = "";
	        start = i;
    	}	     	
	   		
	   stop = i;
	}	
	if(arrOpen[start] !== undefined)  {
		str = arrDays[arrOpen[start].daynb] + " - " + arrDays[arrOpen[stop].daynb] + ": "+ open1 + " - " + close1 ;
	}
	arrOpenHours.push(str);	
	
	return arrOpenHours;
};


/**
 * Compare distance in object array
 * */
hriv.fn.compare = {};
hriv.fn.compare.distance = function (a,b) {
		
	if (a.distance < b.distance){
		return -1;
	}
	
	if (a.distance > b.distance){
		return 1;
	}
    
  return 0;
};





/**
 * Load info from datastore to listarray
 * */
hriv.fn.listview.load = function(obj, listItems){
		
		var arrOpenHours, openHours;
		var openImg = "DotGray.png";
		var isOpen = -1;
		//Kontroll öppettider
		if(Object.keys(obj.hsaSurgeryHours).length > 0){
			isOpen = hriv.fn.calc.isOpen(obj.hsaSurgeryHours);			
			openImg = (isOpen === 1) ? 'DotGreen.png' : 'DotGray.png' ;			
		}	
		
		//Load listitem info
		var dist = "";
		if(!(obj.latitude < 1 ||  obj.longitude < 1)){
			dist =  hriv.fn.calc.distance(gmap.curentPosition.latitude(), gmap.curentPosition.longitude(), obj.latitude, obj.longitude);
			try { dist = Math.round(dist*10)/10; }catch(e){}
		}else{ dist = 999999999; }				  
		
		listItems.push({
			name : obj.name,			
			locale : obj.locale,
			hsaIdentity : obj.hsaIdentity,
			distance: dist,
			open: obj.hsaSurgeryHours,
			openImg: openImg,
			isOpen : isOpen
		});					
};


/** 
 * Load info from datastore to details array
 * */
hriv.fn.detailview.load = function(obj, listDetails) {
			
	var openHours ="", arrOpenHours = [], dropInHours = "", arrDropIn, teletime ="", arrTeleTime, age ="", operator ="";	
		
	//Kontroll öppettider
	if(Object.keys(obj.hsaSurgeryHours).length > 0){
		arrOpenHours = hriv.fn.calc.openhours(obj.hsaSurgeryHours);
		
		for(var i = 0; i < arrOpenHours.length; i++){			
			openHours = openHours + '<div class="ui-li-desc">'+ arrOpenHours[i] + '</div>';			
		}
		
	}else {
		openHours =  '<div class="ui-li-desc">Uppgifter saknas</div>';
	}
	
	//Kontroll dropintider
	if(Object.keys(obj.hsaDropInHours).length > 0){
		arrDropIn = hriv.fn.calc.openhours(obj.hsaDropInHours);
		
		for(var i = 0; i < arrDropIn.length ; i++){			
			dropInHours = '<div class="ui-li-desc">' + arrDropIn[i] + '</div>';
		}
		
	}else {
		dropInHours = '<div class="ui-li-desc">Ingen dropin</div>';
	}
		

	//Kontroll telefontider
	if(Object.keys(obj.hsaTelephoneTime).length > 0){
		arrTeleTime = hriv.fn.calc.openhours(obj.hsaTelephoneTime);
		
		for(var i = 0; i < arrTeleTime.length ; i++){			
			teletime = '<div class="ui-li-desc">' + arrTeleTime[i] + '</div>';
		}
		
	}else {
		teletime = '<div class="ui-li-desc">Uppgifter saknas</div>';
	}

	//Kontroll ålder
	(obj.hsaVisitingRuleAge === "0-99") ? age = "Alla åldrar" : age = obj.hsaVisitingRuleAge;  

	//Kontroll operatör	
	(obj.hsaManagementCodeText === "Landsting/Region") ? operator = "Offentlig vårdgivare" : operator = "Privat vårdgivare";
	
	
	listDetails.push({
		detailViewId : obj.hsaIdentity,
		name : obj.name,			
		locale : obj.locale,		
		open : openHours,
		dropin : dropInHours,
		operatedBy : operator, 
		age : age,
		teltime : arrTeleTime, 
		tel: obj.hsaPublicTelephoneNumber,
		website : obj.labeleduri,
		desc: obj.description,		
		latitude : obj.latitude,
		longitude :  obj.longitude,
		title : obj.name
	});	
	
};


hriv.classes =  {};


/**
 * Class mode 
 **/
hriv.classes.mode = function(spec){
	var that = {}, mode, conf, _toggle, dataBase = 0; 
	
	conf = {
		mapId : null, 
		listId : null,
		linkId : null,
		linkMap : null,
		linkList : null
	};
	
	$.extend(conf, spec);
	
	that.init = function(mod){
		
		if(mod === undefined){
			throw("argument [mode, list] to init func is neeed.");
		}
		
		$(conf.mapId).bind("click", that.mapClick);
		$(conf.mapId).bind("mouseover", that.mapOn);		
		$(conf.listId).bind("click", that.listClick);	
		$(conf.listId).bind("mouseover", that.listOn);
		
		switch(mod){
			case "map":
				$(conf.mapId).bind("mouseout", that.mapOn);
				$(conf.listId).bind("mouseout", that.mapOn);
			break;
			case "list":
				$(conf.mapId).bind("mouseout", that.listOn);
				$(conf.listId).bind("mouseout", that.listOn);
			break;
			default:
				throw("argument [mode, list] to init func is neeed.");
			break;
		}			
	};
	
	that.mapClick = function(){
		$(conf.linkId).attr("href", conf.linkMap);
		that.mapOn();		
	};
	
	that.listClick = function(){
		$(conf.linkId).attr("href", conf.linkList);
		that.listOn();
	};
	
	that.mapOn = function(){
		setTimeout(function(){
			$(conf.mapId).mousedown();
			$(conf.listId).mouseup();	
		}, 10);
				
	};
	that.listOn = function(){		
		setTimeout(function(){
			$(conf.listId).mousedown();
			$(conf.mapId).mouseup();		
		}, 10);				
	};	
	
	return that;
};


/**
 * Class DetailView 
 **/
hriv.detailview = function(spec){
		
	var that = {}, conf, pois = [];
	
	conf = {
		myListArr : null,
		listId : null	
	};	
	
	$.extend(conf, spec);
			
	that.init = function(){		
		
		$(conf.listId + " li").unbind('click');
		$(conf.listId + " li").bind('click', function($e){			
			$e.preventDefault();							
			that.print($(this).attr("data-viewid"));
			$.mobile.changePage("#detailview");
			return false;
		});		
		
	};
	
	that.print = function(hsaId){				
		
		var str, idx, nativeDirectionsLink;	
		
		idx = conf.myListArr.getIndex(hsaId);
		if(idx === null){ return; }
		
	
		nativeDirectionsLink = 'http://maps.google.com/maps?daddr=' + conf.myListArr[idx].latitude + ',+' + conf.myListArr[idx].longitude + '&iwloc=A';
		// Check if user let's us track position. If not, do not pass the source address. This will force the user to choose it.	        
	    if(gmap.curentPosition.latitude() !== null && gmap.curentPosition.longitude() !== null){
			nativeDirectionsLink += '&saddr=' + gmap.curentPosition.latitude() + ',+' + gmap.curentPosition.longitude();
		};
		
		var telnb = (conf.myListArr[idx].tel.length > 0) ? '0'+ conf.myListArr[idx].tel.substring(3, conf.myListArr[idx].tel.length) : "";		
		
		str = '<div class="detailview-head">' + conf.myListArr[idx].name + ' , ' + conf.myListArr[idx].locale + '</div>' +
				'<div class="detailview-content1">'    			 +
					'<div class="ui-li-heading">Öppettider</div>' +					
					'' + conf.myListArr[idx].open + ''+					
					'<hr class="detailview-divider">'    			 +
					'<div class="ui-li-heading">Dropin</div>' +
					'' + conf.myListArr[idx].dropin + ''+
					'<hr class="detailview-divider">'     			 +
					'<div class="ui-li-heading">Drivs av</div>' +
					'<div class="ui-li-desc">' + conf.myListArr[idx].operatedBy + '</div>' +
					'<hr class="detailview-divider">' +
					'<div class="ui-li-heading">Tar emot åldersintervall</div>' +
					'<div class="ui-li-desc">'+ conf.myListArr[idx].age +'</div>' +
				'</div>'    		    		 +
				'<div class="detailview-head">Kontaktinfomation</div>' +
				'<div class="detailview-content2">' +
					'<div class="ui-li-heading">Telefontid</div>' +
					'<div class="ui-li-desc">'+ (conf.myListArr[idx].teltime !== undefined ? conf.myListArr[idx].teltime : "") +'</div>' +
					'<hr class="detailview-divider">' +
					'<div class="ui-li-heading">Telefonnummer</div>' +
					'<div class="ui-li-desc"> '+ telnb +'</div>' +
					'<hr class="detailview-divider">' +
					'<div class="ui-li-desc detailview-buttons">' +      								
						'<div class="detailview-buttons1"><a href="tel:'+ conf.myListArr[idx].tel +'" data-role="button" data-inline="true">Ring</a></div>' +
						'<div class="detailview-buttons2"><a  target="_blank" href="'+ conf.myListArr[idx].website +'" data-role="button" data-inline="true">Webbplats</a></div>' +    								
					'</div>' +
					'<hr class="detailview-divider">' +
					'<div class="ui-li-desc">' +
						'<a href="'+ nativeDirectionsLink +'" data-role="button">Färdbeskrivning</a>' +   				   				
					'</div>' +
				'</div>' +    		    		
				'<div class="detailview-head">Beskrivning</div>' +
				'<div class="ui-li-heading"></div>' +
				'<div class="ui-li-desc">'+ conf.myListArr[idx].desc +
				'<br/>' +
				'<br/>' +							
			'</div>';
		
		
		$("#detailview-content").html(str);
		$("#detailview-content").trigger("create");		
	};	
	
	that.set = function(arr){
		conf.myListArr = arr;		
	};
	
	that.get = function(){
		return conf.myListArr;		
	};
	
	return that;
};


/**
 * Class listview
 * */
hriv.listview = function(spec){
	var that = {}, conf = {}; 
	
	conf = {
		listId : null, 
		myListArr : []	
	};	
	
	$.extend(conf, spec);
	
	that.sortOnDistance = function(){
		conf.myListArr.sort(hriv.fn.compare.distance);		
	};
	 
	that.print = function(){
			
		that.sortOnDistance();
			
		var strDistance =  "";				
		for(var i = 0; i < conf.myListArr.length; i++){
			
			strDistance = (conf.myListArr[i].distance === 999999999) ? "Avstånd saknas, " + conf.myListArr[i].locale : conf.myListArr[i].distance + ' km, '+ conf.myListArr[i].locale;			
			
			$(conf.listId).append('<li data-icon="false" data-viewid="' + conf.myListArr[i].hsaIdentity + '"><a href="#detailview">' +
								  '<img src="images/' + conf.myListArr[i].openImg  + '" alt="" class="ui-li-icon">' +
								  '<h3>' + conf.myListArr[i].name + '</h3>' +
								  '<p>' + strDistance + '</p>' + 							  								  
								  '</a></li>');
		}			
	};
	
	that.isOpen = function(){
		
		var $li = $(conf.listId +" li");
		
		//Kontroll öppettider		
		for(var i = 0; i < conf.myListArr.length; i++){
			if(Object.keys(conf.myListArr[i].open).length > 0){
				var open = hriv.fn.calc.isOpen(conf.myListArr[i].open);

				if(open !== conf.myListArr[i].isOpen){
									
					switch(open){
						case 1:
							$li[i].children[0].children[0].children[0].children[0].src  = "images/DotGreen.png";
							conf.myListArr[i].isOpen = -1;
						break;							
						case -1:
							$li[i].children[0].children[0].children[0].children[0].src  = "images/DotGray.png";
							conf.myListArr[i].isOpen = 1;
						break;						
					}					
				}					
			}			
		} 
		
	};
		
	that.set = function(myListArr){
		conf.myListArr = myListArr;
	};
	
	return that;
};


hriv.CareUnits.getData = function(){
	
	
};


/**
 * Careunit section
 * */
hriv.CareUnits.init = function(){
	
	//Loads pois to marker object
	var pois = [], listItems = [], listDetails = [], 
		data = hriv.dataStore.CareUnits.careUnits;	
		
	for(var i = 0; i < data.length; i++){
		
		//Load POI info
		pois.push({
			Latitude : data[i].latitude,
			Longitude :  data[i].longitude,
			Title : data[i].name
		});
		
		//Load list items
		hriv.fn.listview.load(data[i], listItems);
		
		//Load detail items
		hriv.fn.detailview.load(data[i], listDetails);
	}
		
	hriv.CareUnits.marker.setPOIS(pois);
	hriv.CareUnits.list.set(listItems);	
	hriv.CareUnits.detail.set(listDetails);		
};

/**
 * DutyUnits - Utility function
 * Load pois from datastore to marker object
 * */
hriv.DutyUnits.init = function(){
	
	//Loads pois to marker object
	var pois = [], listItems = [], listDetails = [],
		data = hriv.dataStore.DutyUnits.dutyUnits;	
	
	for(var i = 0; i < data.length; i++){
		pois.push({
			Latitude : data[i].latitude,
			Longitude :  data[i].longitude,
			Title : data[i].name
		});		

		//Load list items
		hriv.fn.listview.load(data[i], listItems);
		
		//Load detail items		
		hriv.fn.detailview.load(data[i], listDetails);
			
	}
		
	hriv.DutyUnits.marker.setPOIS(pois);
	hriv.DutyUnits.list.set(listItems);	
	hriv.DutyUnits.detail.set(listDetails);			
};

/**
 * EmergencyUnits - Utility function
 * Load pois from datastore to marker object
 * */
hriv.EmergencyUnits.init = function(){
	
	//Loads pois to marker object
	var pois = [], listItems = [], listDetails = [],
		data = hriv.dataStore.EmergencyUnits.emergencyUnits;	
	
	for(var i = 0; i < data.length; i++){
		pois.push({
			Latitude : data[i].latitude,
			Longitude :  data[i].longitude,
			Title : data[i].name
		});		
		
		//Load list items
		hriv.fn.listview.load(data[i], listItems);
		
		//Load detail items
		hriv.fn.detailview.load(data[i], listDetails);			
	}
		
	hriv.EmergencyUnits.marker.setPOIS(pois);
	hriv.EmergencyUnits.list.set(listItems);
	hriv.EmergencyUnits.detail.set(listDetails);			
};

