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
tiramisu.modules.get.methods.add('ready', function(def) {
    t.d.onreadystatechange = function() {
        if (t.d.readyState == "complete") {
            // Run the callback
            def();
            return this;
        }
    }
});