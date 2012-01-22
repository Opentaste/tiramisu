tiramisu.modules.get.methods = {
	/**
	 * Ready method
	 * ----------------------
	 *
	 * Make sure that DOM elements exist when it run the events.
	 *
	 * Usage
	 * -----
	 *
	 *     tiramisu.get(*SELECTOR*).ready(*FUNCTION*)
	 *
	 * where *SELECTOR* is a valid CSS selector (containing *one* or *more* elements)
	 * and *FUNCTION* is the function to execute when the DOM is ready.
	 *
	 * Example #1
	 * -----------------------------------------
	 *
	 *     t.get(document).ready(function(){
	 *          alert('This will be executed when the dom is ready");
	 *     });
	 *
	 *
 	 */
	'ready': function(def) {
    	t.d.onreadystatechange = function() {
	        if (t.d.readyState == "complete") {
	            // Run the callback
	            def();
	            return this;
	        }
	    }
    },
    'hello': function() {
    	alert(tiramisu.modules.get.results.html());
    },
    'set': function(thing) {
    	tiramisu.modules.get.results[0].innerHTML = thing;
    }
};