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
        
        this.version = '0.2.6';
        this.d = document;
        this.modules = Tiramisu.prototype;
                
     }
     
     // Exposing the framework
     window.tiramisu = window.t = new Tiramisu();
     
     /**
      * Make Module
      * =========================
      *
      */
     tiramisu.modules.make = function(element) {
         return t.get(t.d.createElement(element));
     }

})(window);