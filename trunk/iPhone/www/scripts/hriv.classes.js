/*global $, gmap, google, hriv, PhoneGap */


/*****************************
* Hriv object classes
*****************************/
hriv.classes = {};

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
		var bolThrow = false;
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
			     bolThrow = true;	
            break;
        }
        
        if(bolThrow){
            throw("argument [mode, list] to init func is neeed.");
        }
	};
	
	that.mapClick = function(){
		//$(conf.linkId).attr("href", conf.linkMap);
		that.mapOn();		
	};
	
	that.listClick = function(){
		//$(conf.linkId).attr("href", conf.linkList);
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
			
			for(var i2 = 0; i2 < arrDropIn.length ; i2++){			
				dropInHours = '<div class="ui-li-desc">' + arrDropIn[i2] + '</div>';
			}
			
		}else {
			dropInHours = '<div class="ui-li-desc">Ingen dropin</div>';
		}
			
	
		//Kontroll telefontider
		if(Object.keys(obj.hsaTelephoneTime).length > 0){
			arrTeleTime = hriv.fn.calc.openhours(obj.hsaTelephoneTime);
			
			for(var i3 = 0; i3 < arrTeleTime.length ; i3++){			
				teletime = '<div class="ui-li-desc">' + arrTeleTime[i3] + '</div>';
			}
			
		}else {
			teletime = '<div class="ui-li-desc">Uppgifter saknas</div>';
		}
	
		//Kontroll ålder
		if(obj.hsaVisitingRuleAge === "0-99") {age = "Alla åldrar"; }else{ age = obj.hsaVisitingRuleAge; }
	
		//Kontroll operatör	
		if(obj.hsaManagementCodeText === "Landsting/Region"){ operator = "Offentlig vårdgivare"; }else{ operator = "Privat vårdgivare"; }
		
		
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
				
		if (PhoneGap.available){
            nativeDirectionsLink = 'maps:q=http://maps.google.com/maps?';
        }else{
            nativeDirectionsLink = 'http://maps.google.com/maps?';
        }		
		
		nativeDirectionsLink += 'll=' + gmap.curentPosition.latitude() + ',+' + gmap.curentPosition.longitude();
		nativeDirectionsLink += '&saddr=' + gmap.curentPosition.latitude() + ',+' + gmap.curentPosition.longitude();
		nativeDirectionsLink += '&daddr=' + conf.myListArr[idx].latitude + ',+' + conf.myListArr[idx].longitude;
		//nativeDirectionsLink +=  + '&iwloc=A';
					
		var telnb = (conf.myListArr[idx].tel.length > 0) ? '0'+ conf.myListArr[idx].tel.substring(3, conf.myListArr[idx].tel.length) : "";		
		
		str = '<div class="detailview-head">' + conf.myListArr[idx].name + ' , ' + conf.myListArr[idx].locale + '</div>' +
                    '<div class="detailview-content1">'+
					'<div class="ui-li-heading">Öppettider</div>' +					
					'' + conf.myListArr[idx].open + ''+					
					'<hr class="detailview-divider">'+
					'<div class="ui-li-heading">Dropin</div>' +
					'' + conf.myListArr[idx].dropin + ''+
					'<hr class="detailview-divider">'+
					'<div class="ui-li-heading">Drivs av</div>' +
					'<div class="ui-li-desc">' + conf.myListArr[idx].operatedBy + '</div>' +
					'<hr class="detailview-divider">' +
					'<div class="ui-li-heading">Tar emot åldersintervall</div>' +
					'<div class="ui-li-desc">'+ conf.myListArr[idx].age +'</div>' +
				'</div>'+
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
						'<div class="detailview-buttons2"><a  target="_blank" href="'+ conf.myListArr[idx].website +'" data-role="button" data-inline="true">Webbplats</a></div>'+
					'</div>' +
					'<hr class="detailview-divider">' +
					'<div class="ui-li-desc">' +
						'<a id="btnMap" data-role="button" href="'+ nativeDirectionsLink +'">Färdbeskrivning</a>' +
					'</div>' +
				'</div>'+
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


/***
 * Class item
 * */



/**
 * Class list
 * */
hriv.classes.list = function(spec){
	var that = {}, conf, _listItems = [];
	
	conf = {
		listId : null,
		start : 0,
		stop : 0,
		itms : 0
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
			
	that.print = function(itms, start, stop){
		
		var strDistance =  "", bolShow = false, strList ="";
				
		if(itms !== undefined){ 
			conf.itms = itms;			
			if(itms < _listItems.length){
				conf.stop = itms;
				bolShow = true;
			}else{
				conf.stop = _listItems.length;			
			}					
		}

		if(start !== undefined){ conf.start = start; }
		if(stop !== undefined){ conf.stop = stop; }
		if(conf.stop > _listItems.length){ conf.stop = _listItems.length; bolShow = false; }
									
		for(var i = conf.start; i < conf.stop; i++){
			
            strDistance = (_listItems[i].distance === 999999999) ? "Avstånd saknas, " + _listItems[i].locale : _listItems[i].distance + ' km, '+ _listItems[i].locale;
			
			strList = strList + '<li class="ui-listItem" data-icon="false">';
			strList = strList + '<a rel=external href="' + _listItems[i].link + '">';
			strList = strList + '<img src="images/' + _listItems[i].openImg  + '" alt="" class="ui-li-icon">';
			strList = strList + '<h3>' + _listItems[i].name + '</h3>';
			strList = strList + '<p>' + strDistance + '</p>';
			strList = strList + '</a></li>';
		}
		
		if(bolShow){
			strList = strList + '<li data-icon="false" class="ui-list-load-down"><a><h3>Hämta mer</h3></a></li>';
			strList = strList + '<li data-icon="false" class="ui-list-marker"></li>';
		}
		
		$(conf.listId).append(strList);		
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
	
	that.update = function(){
		var list = [], strList ="";
				
		$(conf.listId + " li.ui-listItem").each(function(index) {
			var i = 0 + index;
			var strDistance = (_listItems[i].distance === 999999999) ? "Avstånd saknas, " + _listItems[i].locale : _listItems[i].distance + ' km, '+ _listItems[i].locale;

			strList = "";			
			strList = strList + '<li class="ui-listItem" data-icon="false">';
			strList = strList + '<a rel=external href="' + _listItems[i].link + '">';
			strList = strList + '<img src="images/' + that.isOpen(_listItems[i].open)  + '" alt="" class="ui-li-icon">';
			strList = strList + '<h3>' + _listItems[i].name + '</h3>';
			strList = strList + '<p>' + strDistance + '</p>';
			strList = strList + '</a></li>';
					 
			$(this).replaceWith(strList);
		});
		
		try{$(conf.listId).listview("refresh");}catch(e){}
	};	
		
	that.isOpen = function(obj){
		var val, open = 0; 
		if(Object.keys(obj).length > 0){
			open = hriv.fn.calc.isOpen(obj);														
		}
		val = (open === 1) ? 'DotGreen.png' : 'DotGray.png' ;		
		return val;		
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
	var that ={}, conf = {}, list, panel; 
	
	conf = {
		listId : null,
		listLength : 0,
		listStart : 0,
		listStop : 0,
		listPadding : 0,
		refObj : null						
	};	
	$.extend(conf, spec);		
	list = hriv.classes.list(spec);
		
	that.print = function(itms){
		conf.listStop = itms;
		conf.listPadding = itms;
		conf.listLength = list.get().length;
		list.sortOnDistance();
		list.print(itms);
		
		$(conf.listId + " .ui-list-load-down").on("click", that.downClick);	
	};
	
	that.load = function(refObj, obj, lat, lng){
		list.load(refObj, obj, lat, lng);		
	};
	
	that.reload = function(refData){
		//Loads pois to marker object
		var data = refData, 
			latit = gmap.curentPosition.latitude(), 
			longi = gmap.curentPosition.longitude();	
		
		list.set([]);
		
		//Load list items	
		for(var i = 0; i < data.length; i++){	
			list.load(conf.refObj, data[i], latit, longi);
		}	
		
		list.sortOnDistance();						
	};	
	
	that.remove = function(){
		conf.listStart = 0;
		conf.listStop = conf.listPadding;		
		$(conf.listId + "  .ui-list-marker ~ li").remove();
		$(conf.listId + "  .ui-list-load-down").show();
	};
	
	that.update = function(){		
		list.update();		
	};
	
	that.downClick = function($e){		
		
		$(this).hide();
		
		$.mobile.showPageLoadingMsg();						
		
		conf.listStart = conf.listStart + conf.listPadding;
		conf.listStop = conf.listStop + conf.listPadding;	
		
		list.print(conf.listPadding, conf.listStart, conf.listStop);			
		$(conf.listId).listview("refresh");		
		
		$(conf.listId + " .ui-list-load-down").off("click", that.downClick);	
		$(conf.listId + " .ui-list-load-down").on("click", that.downClick);	
		
		$.mobile.hidePageLoadingMsg();						
		
		return false;
	};
	
	return that;
};
