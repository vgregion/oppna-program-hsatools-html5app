/*global $,window, gmap, google, console, hriv */


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
    
}

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
* Functions HRIV
************************/
hriv.fn.getQueryStringParamters = function(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.href);
	if(results === null){
		return "";
	}else{
		return decodeURIComponent(results[1].replace(/\+/g, " "));
	}
};

/**
 * Calculate distance between two sets of lat lang coordinates 
 **/
hriv.fn.calc.distance = function(lat1, lng1, lat2, lng2){
				
		var _calculate = function(lt1, ln1, lt2, ln2){
			if(lt1 === null || ln1 === null || lt2 === null || ln2 === null){
			     return;
		    }
						
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

hriv.fn.calc.time =  function (o1,c2) {
  
	var now = new Date(),	
	    open1 = new Date(),
	    close1 = new Date(),
	    parts = null;
	
	parts = o1.split(":");
	open1.setHours(parts[0],parts[1],parts[2],0);
	parts = c2.split(":");
	close1.setHours(parts[0],parts[1],parts[2],0);

	// returns 1 if is in intervall, -1 if otherwise	
	if (now.getTime() > open1.getTime()){	    
	   if(close1.getTime() > open1.getTime()){
	       if(now.getTime() < close1.getTime()){  
	           return 1;
	       }
       } else if(close1.getTime() < open1.getTime() ) {           
           return 1;
       }
    }else if(close1.getTime() < open1.getTime()){
        if(now.getTime() < close1.getTime()){            
            return 1;
        }
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
	        if(a.openingHour<b.openingHour){ return -1; } 
	        if(a.openingHour>b.openingHour){ return 1; } 
	    }
	    return 0;
	});
	
	arrOpen.sort(function(a,b){
	    if(a !== null && b !==null ){
	        if(a.closingHour<b.closingHour){ return -1; } 
			if(a.closingHour>b.closingHour){ return 1; } 
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