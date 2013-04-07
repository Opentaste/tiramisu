/**
 *
 * Tiramisu - A JavaScript μLibrary
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 * Copyright: (c) 2011/2012 Gianluca Bargelli and Leonardo Zizzamia
 * License: BSD (See LICENSE for details)
 *
 * @private
 **/
(function(window) {

    /**
     * The Framework's costructor exposes externally:
     *
     * - A version number;
     * - A document object reference;
     * - A *Module Container* (TODO: Write detailed docs about it)
     */
    function Tiramisu() {
        
        this.version = '0.2.5';
        this.d = document;
        this.modules = Tiramisu.prototype;
                
     }
     
     // Exposing the framework
     window.tiramisu = window.t = new Tiramisu();
     
     
     // Cancels the event if it is cancelable, 
     // without stopping further propagation of the event.
     tiramisu.modules.preventDefault = function(e) {
         if (e) {
             if ( e.stopPropagation ) {
                 e.stopPropagation();
             } else if (e.preventDefault) {
                 e.preventDefault();
             }
             e.cancelBubble = true;
         }
         return false;
     }
     
     /**
      * Make Module
      * =========================
      *
      */
     tiramisu.modules.make = function(element) {
         return t.get(t.d.createElement(element));
     }

})(window);/** 
 * # Framework Json Module
 *
 * This module is mainly used to
 *
 *     tiramisu.json(my_json_text, reviver);
 *
 * .....
 *
 *
 * Example #1 (...)
 *
 *     var json_object = tiramisu.json.decode(' ... ');
 *
 *
 * Example #2 (...)
 *
 *     t.json.decode('{ "age" : {"today": 24 }, "name" : "leo" }', function (key, value) {
 *         if (value && typeof value === 'object') {
 *             return value;
 *         }
 *         var text = value + "_tiramisu";
 *         return text;
 *     })
 *
 *
 * @api public
 */
tiramisu.modules.json = {

    // Each module within Tiramisu can to need inherit other modules.
    // The number of cups of coffee is identified for each module.
    'ingredients': [],
    'cups_of_coffee': 7,

    decode: function(my_json_text, reviver) {
        // JSON in JavaScript
        // by http://www.json.org/js.html
        try {
            return JSON.parse(my_json_text, reviver);
        } catch (e) {
            // Input is not a valid JSON, you can check it on http://jsonlint.com/
            return '';
        }
    },

    encode: function(json_object, replacer) {
        // JSON in JavaScript
        // by http://www.json.org/js.html
        try {
            return JSON.stringify(json_object, replacer);
        } catch (e) {
            // Input is not a valid JSON Object, you can check it on http://jsonlint.com/
            return '';
        }
    }
};
/** 
 * Task Engine Module
 * ==================
 *
 * This module is used to perform a function at a particular amount of time or perform the same
 * function several times in that time frame.
 *
 *     tiramisu.task(delay, [interval], callback);
 *
 * where “interval” is an optional argument
 *
 *
 * Example #1 (The callback is executed after 2000 ms)
 *
 *     tiramisu.task(2000, callback)
 *
 *
 * Example #2 (The callback is executed every 100 ms in a period of 2000ms)
 *
 *     tiramisu.task(2000, 100, callback)
 *
 *
 * Example #3 (The callback is executed every 500 ms in loop.)
 *
 *     tiramisu.task('loop', 500, callback)
 *
 *
 * param {integer} delay The total task delay(ms)
 * param {integer} [interval] The interval of the repetitions(ms)
 * param {Function} cb The callback function
 */
// *requestAnimFrame* (used for handling tasks), thx @paul_irish for this idea
tiramisu.modules.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();
tiramisu.modules.task = function(delay, cb) {

    // Each module within Tiramisu can to need inherit other modules.
    // The number of cups of coffee is identified for each module.
    var ingredients = [],
        cups_of_coffee = 6;

    var interval, requestAnimFrame = t.requestAnimFrame;

    if (arguments.length > 2) {
        interval = arguments[1];
        cb = arguments[2];
    }

    var start = +new Date(),
        pass = interval;

    function animate() {
        var progress = +new Date() - start;

        if (interval !== undefined) {
            if (progress > pass) {
                pass += interval;
                cb();
            }
        }

        // The recursion continues only in two cases:
        // - The elapsed time is less than the total time;
        // - The total time is infinite (so a loop) but there 
        //   is an interval of time between repetitions of the callback.
        if (progress < delay || (delay == 'loop' && interval !== undefined)) {
            requestAnimFrame(animate);
        } else {
            if (interval === undefined) {
                cb();
            }
        }
    }
    animate();
};
