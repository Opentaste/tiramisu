/**
 * Event Selector methods
 * ======================
 * 
 * Several methods for Events tasks:
 *
 * *  *Ready*
 * *  *On/Off*
 *
 */
tiramisu.modules.get.methods.event = {
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
    /**
     * Event handler extension
     * -----------------------
     *
     * Attach a callback function to an event.
     *
     * Usage
     * -----
     *
     *     tiramisu.get(*SELECTOR*).on(*EVENT*, *CALLBACK*)
     *
     * where *SELECTOR* is a valid CSS selector, *EVENT* is
     * the event listener and *CALLBACK* the function to attach.
     *
     * Example #1 (Clicking on a p element displays “Hello!”)
     * ------------------------------------------------------
     *
     *     <p> Click me! </p>
     *     <p> Click me too! </p>
     *     <p> And me? </p>
     *     ...
     *     tiramisu.get('p').on('click', function() {
     *         alert('Hello!');
     *     });
     *
     * Example #2 (Hovering on a li element displays his innerHTML)
     * ------------------------------------------------------------
     *
     *      <ol>
     *        <li> Banana </li>
     *        <li> Apple </li>
     *        <li> Pineapple </li>
     *        <li> Strawberry </li>
     *      </ol>
     *      ...
     *      tiramisu.get('ul li').on('mouseover', function() {
     *          alert(this.innerHTML);
     *      });
     *
     *  As in the “each” example, it is possible to use **this** to
     *  reference the current list item.
     *
     * Example #3 (Defining a window.onload callback)
     * ----------------------------------------------
     *
     *     tiramisu.get(window).on('load', function() {
     *         alert('This will be executed after the DOM loading");
     *     });
     *
     * Example #4 (Alert message when pressing the “m” key)
     * ----------------------------------------------------
     *
     *     tiramisu.get(document).on('keydown', function(evt) {
     *         if (evt.keyCode == 77) {
     *             alert("M as Marvelous!");
     *         }
     *     });
     *
     * Example #5 ()
     * ----------------------------------------------------
     *
     *     tiramisu.get('p').on('keydown', 'click', function(evt) {
     *         alert('This will be executed after click or keydown on 'p' element");
     *     });
     *
     * @param {event} evt An event listener
     * @param {function} cb The callback function to attach
     */
    'on': function(evt, cb) {
        if (arguments.length > 2) {
            return '';
        }
        var evt_len = 1,
            ev = [],
            callback = [];
        if (typeof(evt) === 'string') {
            ev[0] = evt;
            callback[0] = cb;
        } else if (typeof(evt) === 'object') {
            if (typeof(evt[0]) === 'string') {
                ev = evt;
                callback[0] = cb;
            } else {
                for (key in evt) {
                    evt_len = ev.push(key);
                    callback.push(evt[key]);
                }
            }
        }
        // if tiramisu.get.results[0] === undefined : *SELECTOR* is not a valid CSS selector or not exist;)
        for (var j = evt_len; j--;) {
            var cb = callback[j];
            for (i = tiramisu.get.results.length; i--;) {
                add_handler(tiramisu.get.results[i], ev[j], cb);
            }
            if (typeof selector === 'string') {
                local_event[selector] = {};
                local_event[selector] = {
                    'cb': cb,
                    'element': tiramisu.get.results
                };
            }
        }
        return this;
    },
    /**
     * Remove Event handler extension
     * -----------------------
     *
     */
    'off': function(evt) {
        if (arguments.length > 1) {
            return '';
        }
        if (typeof selector === 'string') {
            if (local_event[selector] !== undefined) {
                var cb = local_event[selector]['cb'],
                    element = local_event[selector]['element'],
                    len = element.length;
                for (i = len; i--;) {
                    remove_handler(tiramisu.get.results[i], evt, cb);
                }
                delete local_event[selector];
            }
        }

        return this;
    },
}

// The good way to eliminate a work repetition in functions is through lazy loading.
// Lazy loading means that no work is done until the information is necessary.
// Here I implement a lazy-loading pattern. The first time either method is
// called, a check is made to determine the appropriate way to attach or detach the
// event handler. Then the original function is overwrittern with a new function that
// contains just the appropriate course of action.
// By High Performance JavaScript, Nicholas C. Zakas
var add_handler = function(target, event_type, handler) {

    // overwrite te existing function
    if (target.addEventListener) { // DOM 2 Events
        add_handler = function(target, event_type, handler) {
            target.addEventListener(event_type, handler, false);
        }
    } else { // IE
        add_handler = function(target, event_type, handler) {
            target.attachEvent('on' + event_type, handler);
        }
    }

    // call the new functions
    add_handler(target, event_type, handler);
}

// And brother function, remove_handler
var remove_handler = function(target, event_type, handler) {

    // overwrite te existing function
    if (target.removeEventListener) { // DOM 2 Events
        remove_handler = function(target, event_type, handler) {
            target.removeEventListener(event_type, handler, false);
        }
    } else { // IE
        remove_handler = function(target, event_type, handler) {
            target.detachEvent('on' + event_type, handler);
        }
    }

    // call the new functions
    remove_handler(target, event_type, handler);
}