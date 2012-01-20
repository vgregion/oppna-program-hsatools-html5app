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
		},
		app : {}			
	};


/************************
* Functions HRIV
************************/


hriv.fn.getQueryStringParamters = function(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.href);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
};

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

	var arrDays = ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"];
	var arrOpen = [];
	var monday, tuesday, wednesday, thursday, friday, saturday, sunday;	
	
	var obj = hours;
	
	if(obj.hasOwnProperty('monday')){
	    monday = obj.monday[0];
	    monday.day = "monday";
	    monday.daynb = 0;
	    monday.openingHour = (obj.monday[0].openingHour === null ? "00:00" : obj.monday[0].openingHour );
	    monday.closingHour = obj.monday[0].closingHour;
	    arrOpen[1] = monday;
	}else{arrOpen[1] = null;}	
	
	if(obj.hasOwnProperty('tuesday')){
	    tuesday= obj.tuesday[0];
	    tuesday.day = "tuesday";
	    tuesday.daynb = 1;
	    tuesday.openingHour = (obj.tuesday[0].openingHour === null ? "00:00" : obj.tuesday[0].openingHour );
	    tuesday.closingHour = obj.tuesday[0].closingHour;
	    arrOpen[2] = tuesday;
	}else{arrOpen[2] = null;}	
	
	if(obj.hasOwnProperty('wednesday')){
	    wednesday= obj.wednesday[0];
	    wednesday.day = "wednesday";
	    wednesday.daynb = 2;
	    wednesday.openingHour = (obj.wednesday[0].openingHour === null ? "00:00" : obj.wednesday[0].openingHour );
	    wednesday.closingHour = obj.wednesday[0].closingHour;
	    arrOpen[3] = wednesday;
	}else{arrOpen[3] = null;}	
		
	if(obj.hasOwnProperty('thursday')){
	    thursday= obj.thursday[0];
	    thursday.day = "thursday";
	    thursday.daynb = 3;
	    thursday.openingHour = (obj.thursday[0].openingHour === null ? "00:00" : obj.thursday[0].openingHour );
	    thursday.closingHour = obj.thursday[0].closingHour;	    
	    arrOpen[4] = thursday;
	}else{arrOpen[4] = null;}	
		
	if(obj.hasOwnProperty('friday')){
	    friday= obj.friday[0];
	    friday.day = "friday";
	    friday.daynb = 4;	    
	    friday.openingHour = (obj.friday[0].openingHour === null ? "00:00" : obj.friday[0].openingHour );
	    friday.closingHour = obj.friday[0].closingHour;	    
	    arrOpen[5] = friday;
	}else{arrOpen[5] = null;}	

	
	if(obj.hasOwnProperty('saturday')){
	    saturday= obj.saturday[0];
	    saturday.day = "saturday";
	    saturday.daynb = 5;	    
	    saturday.openingHour = (obj.saturday[0].openingHour === null ? "00:00" : obj.saturday[0].openingHour );
	    saturday.closingHour = obj.saturday[0].closingHour;	    
	    arrOpen[6] = saturday;
	}else{arrOpen[6] = null;}	
	
	if(obj.hasOwnProperty('sunday')){
	    sunday= obj.sunday[0];
	    sunday.day = "sunday";
	    sunday.daynb = 6;	    
	    sunday.openingHour = (obj.sunday[0].openingHour === null ? "00:00" : obj.sunday[0].openingHour );
	    sunday.closingHour = obj.sunday[0].closingHour;	    
	    arrOpen[0] = sunday;
	}else{arrOpen[0] = null;}	

	var d = new Date();	
	var day = d.getDay();
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

	var arrDays = ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"];
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
hriv.classes.detailview = function(spec){
		
	var that = {}, conf, pois = [], _listDetails = [];
	
	conf = {
		myListArr : null,
		listId : null	
	};	
	
	$.extend(conf, spec);
	conf.myListArr = _listDetails;
			
	that.init = function(){		
		
		$(conf.listId + " li.ui-listItem").unbind('click');
		$(conf.listId + " li.ui-listItem").bind('click', function($e){			
			//$e.preventDefault();						
			//that.print($(this).attr("data-viewid"));
			//$.mobile.changePage("#detailview");
			//return false;
		});				
	};
	
	/** 
	 * Load info from datastore to details array
	 * */
	that.load = function(obj, listDetails) {
				
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
		
		
		conf.myListArr.push({
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
 * Class list
 * */
hriv.classes.list = function(spec){
	var that = {}, conf, _listItems = [];
	
	conf = {
		listId : null,
		start : 0,
		stop : 0
	};	
	$.extend(conf, spec);			
	
	
	that.load = function(refObj, obj, lat, lng){
		
		var openHours, openImg = "DotGray.png", isOpen = -1;
		
		//Kontroll öppettider
		if(Object.keys(obj.hsaSurgeryHours).length > 0){
			isOpen = hriv.fn.calc.isOpen(obj.hsaSurgeryHours);			
			openImg = (isOpen === 1) ? 'DotGreen.png' : 'DotGray.png' ;			
		}	
		
		//Load listitem info
		var dist = "";
		if(!(obj.latitude < 1 ||  obj.longitude < 1)){
			dist =  hriv.fn.calc.distance(lat, lng, obj.latitude, obj.longitude);
			try { dist = Math.round(dist*10)/10; }catch(e){}
		}else{ dist = 999999999; }				  
		
		_listItems.push({
			name : obj.name,			
			locale : obj.locale,
			hsaIdentity : obj.hsaIdentity,
			distance: dist,
			open: obj.hsaSurgeryHours,
			openImg: openImg,
			isOpen : isOpen, 
			link : refObj.map.getLink() +'?page='+ refObj.map.getPage() +'&id='+ obj.hsaIdentity
		});						
	};
			
	that.print2 = function(itms){
		
		var strDistance =  "", bolShow = false, strList ="";
	
		if(itms < _listItems.length){
			conf.stop = itms;
			bolShow = true;
		}else{
			conf.stop = _listItems.length;			
		}
		
		//strList = '<ul data-inset="true" data-role="listview" data-theme="d">';				
		strList = strList + '<li data-icon="false" class="ui-list-load-up"><a><h3>Gå upp</h3></a></li>';
							
		for(var i = 0; i < conf.stop; i++){
			
			strDistance = (_listItems[i].distance === 999999999) ? "Avstånd saknas, " + _listItems[i].locale : _listItems[i].distance + ' km, '+ _listItems[i].locale;			
			
			strList = strList + '<li class="ui-listItem" data-icon="false" data-viewid="' + _listItems[i].hsaIdentity + '"><a rel=external href="' + _listItems[i].link + '">';
			strList = strList + '<img src="images/' + _listItems[i].openImg  + '" alt="" class="ui-li-icon">';
			strList = strList + '<h3>' + _listItems[i].name + '</h3>';
			strList = strList + '<p>' + strDistance + '</p>';					  								  
			strList = strList + '</a></li>';
		}
		
		if(bolShow){
			strList = strList + '<li data-icon="false" class="ui-list-load-down"><a><h3>Gå ner</h3></a></li>';
		};		
		
		//strList = strList + '</ul>';
		$(conf.listId).append(strList);		
		//$(conf.listId).listview();
		//$(conf.listId).listview('refresh');
		$(conf.listId).trigger("create");
	};
	
	that.sortOnDistance = function(){
		_listItems.sort(hriv.fn.compare.distance);				
	};
	
	that.get = function(){
		return _listItems;
	};
	
	that.set = function(val){
		_listItems = val;		
	};
	
	that.update = function(start, stop){
		var list = [];
	
		(stop < _listItems.length) ? stop : (stop = _listItems.length);
		$(conf.listId + " li.ui-listItem").unbind('click');
	
		for(var i = start; i < stop; i++){

			strDistance = (_listItems[i].distance === 999999999) ? "Avstånd saknas, " + _listItems[i].locale : _listItems[i].distance + ' km, '+ _listItems[i].locale;			

			list.push('<li class="ui-listItem" data-icon="false" data-viewid="' + _listItems[i].hsaIdentity + '"><a href="#detailview">' +
								  '<img src="images/' + _listItems[i].openImg  + '" alt="" class="ui-li-icon">' +
								  '<h3>' + _listItems[i].name + '</h3>' +
								  '<p>' + strDistance + '</p>' + 							  								  
								  '</a></li>');
		  
		}
		
		$(conf.listId + " li.ui-listItem").each(function(index) {
		  $(this).replaceWith(list[index]);
		});			
		
		$(conf.listId).listview('refresh');
		
		$(conf.listId + " li.ui-listItem").bind('click', function($e){			
			$e.preventDefault();						
			that.print($(this).attr("data-viewid"));
			$.mobile.changePage("#detailview");
			return false;
		});	
	};
	
	that.isOpen = function(){
		
		var $li = $(conf.listId +" li.ui-listItem");
		
		//Kontroll öppettider		
		for(var i = conf.start; i < conf.stop; i++){
			if(Object.keys(_listItems[i].open).length > 0){
				var open = hriv.fn.calc.isOpen(_listItems[i].open);

				if(open !== _listItems[i].isOpen){									
					switch(open){
						case 1:
							$li[i].children[0].children[0].children[0].children[0].src  = "images/DotGreen.png";
							_listItems[i].isOpen = -1;
						break;							
						case -1:
							$li[i].children[0].children[0].children[0].children[0].src  = "images/DotGray.png";
							_listItems[i].isOpen = 1;
						break;						
					}					
				}					
			}			
		} 
		
	};
	
	return that;	
};

/**
 * Class panel
 * */

/**
 * Class listview
 * */
hriv.classes.listview = function(spec){
	var that, conf = {}, list, panel; 
	
	conf = {
		listId : null,
		listLength : 0,
		listStart : 0,
		listStop : 0,
		listPadding : 0						
	};	
	$.extend(conf, spec);		
	that = hriv.classes.list(spec);
		
	that.print = function(itms){
		conf.listStop = itms;
		conf.listPadding = itms;
		conf.listLength = that.get().length;
		that.sortOnDistance();
		that.print2(itms);
		
		$(conf.listId + " .ui-list-load-up").on("click", that.upClick);
		$(conf.listId + " .ui-list-load-down").on("click", that.downClick);	
	};		
		
	that.upClick = function(){
		$.mobile.showPageLoadingMsg();
		var res  = conf.listStart - conf.listPadding; 
		
		if( res > 0){
			conf.listStart = (conf.listStart - conf.listPadding);
		}else {
			conf.listStart = 0;
			$(conf.listId + " .ui-list-load-up").hide();
		}
		
		conf.listStop = (conf.listStop - conf.listPadding) >= conf.listPadding ? (conf.listStop - conf.listPadding) :  conf.listPadding;
		that.update(conf.listStart, conf.listStop);
		
		setTimeout(function(){
			$.mobile.hidePageLoadingMsg();
		},2000);
		
		return false;
	};
	
	that.downClick = function(){		
		$.mobile.showPageLoadingMsg();						
		
		conf.listStart = conf.listStart + conf.listPadding;
		conf.listStop = conf.listStop + conf.listPadding;
		
	
		that.update(conf.listStart, conf.listStop);			
		
		setTimeout(function(){
			$.mobile.hidePageLoadingMsg();					
			$(conf.listId + " .ui-list-load-up").show();				   
		},2000);
		
		return false;
	};
	
	return that;
};


hriv.CareUnits.getData = function(){
	
	
};


/**
 * Careunit section
 * */

hriv.CareUnits.init = function(){
	hriv.app.load(hriv.dataStore.CareUnits.careUnits, hriv.CareUnits);
};


/**
 * DutyUnits - Utility function
 * Load pois from datastore to marker object
 * */
hriv.DutyUnits.init = function(){
	hriv.app.load(hriv.dataStore.DutyUnits.dutyUnits, hriv.DutyUnits);
};

/**
 * EmergencyUnits - Utility function
 * Load pois from datastore to marker object
 * */
hriv.EmergencyUnits.init = function(){
	hriv.app.load(hriv.dataStore.EmergencyUnits.emergencyUnits, hriv.EmergencyUnits);
};



/**
 * Initilize HRIV javascript application framework
 * */
hriv.app.state = (function(){
	
	var init = false;
	
	return{
		isInit : function(){
			return init;
			
		},
		set : function(val){
			init = val;
		}		
	};
	
})();


hriv.app.settings = (function(){
	
	var numPrintListItems = 30;
	
	return {
		printListItems : function(){
			return numPrintListItems;	
		}
	};
	
})();

hriv.app.load = function(refData, refObj){
	
	//Loads pois to marker object
	var pois = [], listItems = [], listDetails = [], 
		data = refData, lat = gmap.curentPosition.latitude(), lng = gmap.curentPosition.longitude();	
		
	for(var i = 0; i < data.length; i++){
		
		//Load POI info
		pois.push({
			Latitude : data[i].latitude,
			Longitude :  data[i].longitude,
			Title : data[i].name,
			hsaIdentity : data[i].hsaIdentity,
			link : refObj.map.getLink() +'?page='+ refObj.map.getPage() +'&id='+ data[i].hsaIdentity 
		});
		
		//Load list items
		refObj.list.load(refObj, data[i], lat, lng);
		
		//Load detail items
		refObj.detail.load(data[i], listDetails);
	}

	refObj.marker.setPOIS(pois);	
	
};

hriv.app.init = function(){
	
	//Check if app is initilized
	if(hriv.app.state.isInit()){ 
		return;
	}
	hriv.app.state.set(true);	
	
	hriv.CareUnits.init();
	hriv.DutyUnits.init();	
	hriv.EmergencyUnits.init();
	
	setTimeout(function(){		
		hriv.app.print();
	}, 700);	
	
	setInterval(function(){
		hriv.DutyUnits.list.isOpen();
	},120000);
			
	setInterval(function(){
		hriv.EmergencyUnits.list.isOpen();
	},360000);	
	setInterval(function(){
		hriv.CareUnits.list.isOpen();
	},720000);
		
};

hriv.app.print = function(){
	var itms = hriv.app.settings.printListItems();
	
	hriv.CareUnits.list.print(itms);
	hriv.DutyUnits.list.print(itms);		
	hriv.EmergencyUnits.list.print(itms);	
	
	hriv.EmergencyUnits.detail.init();
	hriv.CareUnits.detail.init();
	hriv.DutyUnits.detail.init();	
};



