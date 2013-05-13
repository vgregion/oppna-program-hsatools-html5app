/*global $, DED, window, console, gmap, google, hriv, dataStore */


/***********************************
* App Data Engine
*  Handles:
*  - fetching data from server
*  - reloading/calulates data
***********************************/



/* 
 *  
 * */
DED.Queue = function () {
    // Queued requests.
    this.queue = [];

    // Observable Objects that can notify the client of interesting moments
    // on each DED.Queue instance.
    this.onComplete = new DED.util.Observer();
    this.onFailure = new DED.util.Observer();
    this.onFlush = new DED.util.Observer();

    // Core properties that set up a frontend queueing system.
    this.retryCount = 3;
    this.currentRetry = 0;
    this.paused = false;
    this.timeout = 4000;
    this.interval = 500;
    this.conn = {};
    this.timer = {};
    this.isRunning = false;
    this.indx = 0;
    this.jump = null;    
};
DED.Queue.method('flush', function () {
      if (this.queue.length < 1) {
          return;
      }
      if (this.paused) {
          //this.paused = false;
          return;
      }
      var that = this;      
      this.currentRetry++;
      this.isRunning = true;
      
      var callback = function (cmd, data) {
        //window.clearTimeout(that.timer);
        that.indx++;
                    
        that.onFlush.fire(cmd, data);
          
		if (that.indx >= that.queue.length) {
            that.indx  = 0;
            that.pause();
            that.timer = setTimeout(function(){that.start(); that.flush(); }, that.timeout);              
        }else{
            // recursive call to flush
            that.timer = setTimeout(function () { that.flush(); }, that.interval);
        }        
      };

      //var para = this.queue[0]['cmd'];
      var func = this.queue[this.indx].func;
      var getData = this.queue[this.indx].para;
      var data = "";
	  var cmd  = this.queue[this.indx].cmd;
	  if(getData) { data = getData(); }
	  
	  if(this.jump !== cmd){
		console.log("exe func qeueu: " + cmd + " " + new Date());
		func(data);
	  }
	  callback(cmd,"");
	  
  }).method('setRetryCount', function (count) {
      this.retryCount = count;
  }).method('setTimeout', function (time) {
      this.timeout = time;
  }).method('setInterval', function (time) {
      this.interval = time;
  }).method('setSleep', function (time) {
      this.sleep = time;      
  }).method('add', function (o) {
      this.queue.push(o);
  }).method('pause', function () {
      this.paused = true;
  }).method('start', function () {
      this.paused = false;
  }).method('stopTimeOut', function () {
      window.clearTimeout(this.timer);
  }).method('dequeue', function () {
      this.queue.pop();
  }).method('clear', function () {
      this.queue = [];
  }).method('isRunning', function () {
      return this.isRunning;
  }).method('skip', function (val) {
      this.jump = val;
  });


	

/******************************
* Ajax queue handling 
* - Fetch external data
* - Update internal data
* - Update POI:s
*******************************/
DED.AjaxQueue = function () {
    // Queued requests.
    this.queue = [];

    // Observable Objects that can notify the client of interesting moments
    // on each DED.Queue instance.
    this.onComplete = new DED.util.Observer();
    this.onFailure = new DED.util.Observer();
    this.onFlush = new DED.util.Observer();

    // Core properties that set up a frontend queueing system.
    this.retryCount = 3;
    this.currentRetry = 0;
    this.paused = false;
    this.timeout = 4000;
    this.interval = 500;
    this.sleep = 600000;			//Sleep in 10 min
    this.conn = {};
    this.timer = {};
    this.timer2 = {};
    this.isRunning = false;      
    this.indx = 0;
};

DED.AjaxQueue.method('flush', function () {
	  if (this.queue.length < 1) {
	      return;
	  }
	  if (this.paused) {
	      //this.paused = false;
	      return;
	  }
	  var that = this;
	  this.currentRetry++;
	  this.isRunning = true;
	
	  var abort = function () {
	      if (that.currentRetry == that.retryCount) {
	          that.onFailure.fire();
	          that.currentRetry = 0;
	          this.timer = setTimeout(function () { that.flush(); } , that.timeout);
	      } else {              
	          this.timer = setTimeout(function () { that.flush(); } , that.interval);
	      }
	  };
	
	  var callback = function (o, data) {
	      window.clearTimeout(that.timer);
	      that.currentRetry = 0;
	      
	      that.indx++;
	      that.onFlush.fire(o, data);
	      
          if (that.indx >= that.queue.length) {
	          that.indx  = 0;
	          that.timer2 = setTimeout(function(){that.start(); that.flush(); }, that.sleep);
	          that.onComplete.fire(o, data);	          
	      }else{          
	          // recursive call to flush
              that.timer2 = setTimeout(function () { that.flush(); }, that.interval);
	      }
	  };	  
	  
	  var para = this.queue[this.indx].cmd;
	  //var data = this.queue[this.indx].data;
      
      $.ajax({
          url: this.queue[this.indx].url,
          data: {},
          cache : false,
          dataType: "jsonp",
          jsonp: 'callback',
          jsonpCallback: "jsonpRequest",        
          success: function (data) {
              callback(para, data);
          },
          error: function () {
              abort();
          }
      });	  
		  
	  //callback(para, data);
	
	  }).method('setRetryCount', function (count) {
	      this.retryCount = count;
	  }).method('setTimeout', function (time) {
	      this.timeout = time;
	  }).method('setInterval', function (time) {
	      this.interval = time;
      }).method('setSleep', function (time) {
          this.sleep = time;	      
	  }).method('add', function (o) {
	      this.queue.push(o);
	  }).method('pause', function () {
	      this.paused = true;
	  }).method('start', function () {
	      this.paused = false;
      }).method('stopTimeOut', function () {
          window.clearTimeout(this.timer);
          window.clearTimeout(this.timer2);
	  }).method('dequeue', function () {
          this.queue.pop();
	  }).method('clear', function () {
	      this.queue = [];
	  }).method('isRunning', function () {
	      return this.isRunning;
	  });
    

    /* Usage. */
    //var q = new DED.Queue();
    //q.setRetryCount(5);      // Reset our retry count to be higher for slow connections.
    //q.setTimeout(30000);    //Timeout when failure in ajax call 10 min
    //q.setInterval(30000);    //Time between runs 1 min
    //q.setSleep(30000);      //Time between each iteration 2min

    //q.setTimeout(15000);    //Timeout when failure in ajax call 10 min
    //q.setInterval(15000);    //Time between runs 1 min
    //q.setSleep(15000);      //Time between each iteration 2min


    var aq = new DED.AjaxQueue();
    aq.setRetryCount(5);     // Reset our retry count to be higher for slow connections.
    //aq.setTimeout(1200000);   //Timeout when failure in ajax call 10 min
    //aq.setInterval(30000);   //Time between runs 30 sec
    //aq.setSleep(1200000);     //Time between each iteration 20min
    
    aq.setTimeout(240000);   //Timeout when failure in ajax call 4 min
    aq.setInterval(30000);   //Time between runs 30 sec
    aq.setSleep(600000);     //Time between each iteration 10min  
