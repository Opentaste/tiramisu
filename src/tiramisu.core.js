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
        
        this.version = '0.2.5-b1';
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

})(window);