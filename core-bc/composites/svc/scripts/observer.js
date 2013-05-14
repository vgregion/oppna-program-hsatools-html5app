/*global $, DED, window, console, gmap, google, hriv, dataStore */

Function.prototype.method = function(name, fn) {
  this.prototype[name] = fn;
  return this;
};



// From the Mozilla Developer Center website at 
// http://developer.mozilla.org/en/docs/New_in_JavaScript_1.6#Array_extras.
if (!Array.prototype.forEach) {
    Array.method('forEach', function (fn, thisObj) {
        var scope = thisObj || window;
        for (var i = 0, len = this.length; i < len; ++i) {
            fn.call(scope, this[i], i, this);
        }
    });
}

if (!Array.prototype.filter) {
    Array.method('filter', function (fn, thisObj) {
        var scope = thisObj || window;
        var a = [];
        for (var i = 0, len = this.length; i < len; ++i) {
            if (!fn.call(scope, this[i], i, this)) {
                continue;
            }
            a.push(this[i]);
        }
        return a;
    });
}


/************
 * Observer
 ************/
window.DED = window.DED || {};
DED.util = DED.util || {};

DED.util.Observer = function () {
    this.fns = [];
};

DED.util.Observer.prototype = {
    subscribe: function (fn) {
        this.fns.push(fn);
    },
    unsubscribe: function (fn) {
        this.fns = this.fns.filter(
          function (el) {
              if (el !== fn) {
                  return el;
              }
          }
        );
    },
    fire: function (o, data) {
        this.fns.forEach(
        function (el) {
            el(o, data);            
        }
    );
    }
};