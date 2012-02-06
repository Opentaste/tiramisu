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
     * - *requestAnimFrame* (used for handling tasks).
     * - A *Module Container* (TODO: Write detailed docs about it)
     */

    function Tiramisu() {

        this.d = document;

        // Tiramisu modules
        this.modules = Tiramisu.prototype;

        this.requestAnimFrame = (function() {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function(callback, element) {
                window.setTimeout(callback, 1000 / 60);
            };
        })();
        
        // used in Ready function
        this.list_def = [];

        this.version = '0.1.6';
     }

     // Exposing the framework
     window.tiramisu = window.t = new Tiramisu();


     // Cancels the event if it is cancelable, without stopping further propagation of the event.
     Event.prototype.preventDefault = function() {
        if (e.preventDefault) {
            e.preventDefault();
        } else { // IE
            e.returnValue = false;
        }
     }

     // Keep in memory the events created
     var local_event = {};

     /**
      * Make Module
      * =========================
      *
      */
     tiramisu.modules.make = function(element) {
         return t.get(t.d.createElement(element));
     }

})(window);