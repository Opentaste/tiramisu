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
