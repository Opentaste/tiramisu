// DOM Node insertion generic utility
 function insert_content(html, before, append) {
	// Aliasing results
	var results 	= tiramisu.get.results,
		len_result 	= results.length;

    if (results[0] === undefined) {
        return '';
    }

    var i, j, parent, elements = [];

    var div = t.d.createElement('div');
    // “...A better version will be to create a document fragment, update it "offline",
    // and add it to the live DOM when it's ready. When you add a document fragment to
    // the DOM tree, the content of the fragment gets added, not the fragment itself.
    // And this is really convenient. So the document fragment is a good way to wrap
    // a number of nodes even when you're not containing them in a suitable parent
    // (for example, your paragraphs are not in a div element)”
    // 
    // From “JavaScript Patterns”, pages 184-185, chapter VIII
    var frag = t.d.createDocumentFragment();

    for (i = 0; i < len_result; i++) {

        if (typeof html === 'string') {
            div.innerHTML = html;
            elements = div.children;

        } else if (typeof html.css === 'function') {
            elements.push(html[0]); // html is t.get(t.make('p'))
        } else {
            elements.push(html); // html is an element
        }

        parent = results[i].parentNode;

        for (j = 0; j < elements.length; j++) {

            if (before) {
                frag.insertBefore(elements[j], frag.firstChild);
            } else {
                frag.appendChild(elements[j]);
            }
        }

        if (before) {
            (append) ? results[i].insertBefore(frag, results[i].firstChild) : parent.insertBefore(frag, results[i]);
        } else {
            (append) ? results[i].appendChild(frag) : parent.insertBefore(frag, results[i].nextSibling);
        }
    }
}

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
    /**
     * Insert Before method
     * --------------------
     *
     * Insert text or html, before each element.
     *
     * Usage
     * -----
     *
     *     tiramisu.get(*SELECTOR*).before(*HTML*)
     *
     * where *SELECTOR* is a valid CSS selector, *HTML* is
     * the element to insert.
     *
     * Example #1 ()
     * ------------------------------------------------------
     *
     *     <h1>Hello Tiramisu</h1>
     *     <div class="inner">ciao</div>
     *     <div class="inner">mondo</div>
     *     ...
     *     t.get('.inner').before('<p>ciccio</p>')
     *
     *     produce the following result:
     *
     *     <h1>Hello Tiramisu</h1>
     *     <p>ciccio</p>
     *     <div class="inner">ciao</div>
     *     <p>ciccio</p>
     *     <div class="inner">mondo</div>
     *
     *
     * @param {html} The element to insert
     */
    'before': function(html) {
        insert_content(html, true, false)
        return this;
    },
    /**
     * Insert After method
     * -------------------
     *
     * Insert text or html, after each element.
     *
     * Usage
     * -----
     *
     *     tiramisu.get(*SELECTOR*).after(*HTML*)
     *
     * where *SELECTOR* is a valid CSS selector and *HTML* is
     * the element to insert.
     *
     * Example #1 (Inserting an element multiple times)
     * ------------------------------------------------
     *
     *     <h1>Hello Tiramisu</h1>
     *     <div class="inner">ciao</div>
     *     <div class="inner">mondo</div>
     *     ...
     *     t.get('.inner').after('<p>ciccio</p>')
     *
     *     produces the following result:
     *
     *     <h1>Hello Tiramisu</h1>
     *     <div class="inner">ciao</div>
     *     <p>ciccio</p>
     *     <div class="inner">mondo</div>
     *     <p>ciccio</p>
     *
     *
     * @param {html} The element to insert
     */
    'after': function(html) {
        insert_content(html, false, false);
        return this;
    },
    /**
     * Append method
     * -------------
     *
     * Appends a DOM element into a list of selector results.
     *
     * Usage
     * -----
     *
     *     tiramisu.get(*SELECTOR*).append(*HTML*)
     *
     * where *SELECTOR* is a valid CSS selector and *HTML* is
     * a string containing some HTML (such as "<p>hi</p>,
     * <h1>headline</h1> etc.)
     *
     * Example #1 (Append a single element)
     * ------------------------------------
     *
     *     <ul>
     *       <li>One</li>
     *       <li>Two</li>
     *     </ul>
     *     ...
     *     t.get('ul').append('<li>Three</li>');
     *
     *     produces the following:
     *
     *     <ul>
     *       <li>One</li>
     *       <li>Two</li>
     *       <li>Three</li>
     *     </ul>
     *
     * Example #2 (Append multiple elements)
     * -------------------------------------
     *
     *      <ul>
     *        <li>
     *          <p>One</p>
     *        </li>
     *        <li>
     *          <p>Two</p>
     *        </li>
     *      </ul>
     *      ...
     *      t.get('ul li').append('<p>append</p>');
     *
     *      produces the following:
     *
     *      <ul>
     *        <li>
     *          <p>One</p>
     *          <p>append</p>
     *        </li>
     *        <li>
     *          <p>Two</p>
     *          <p>append</p>
     *        </li>
     *      </ul>
     *
     * @param {html} The element to append
     */
    'append': function(html) {
        insert_content(html, false, true);
        return this;
    },
    /**
     * Prepend method
     * --------------
     *
     * Prepends a DOM element into a list of selector results.
     *
     * Usage
     * -----
     *
     *     tiramisu.get(*SELECTOR*).prepend(*HTML*)
     *
     * where *SELECTOR* is a valid CSS selector and *HTML* is
     * a string containing some HTML (such as "<p>hi</p>,
     * <h1>headline</h1> etc.)
     *
     * Example #1 (Prepend a single element)
     * ------------------------------------
     *
     *     <ul>
     *       <li>One</li>
     *       <li>Two</li>
     *     </ul>
     *     ...
     *     t.get('ul').prepend('<li>Three</li>');
     *
     *     produces the following:
     *
     *     <ul>
     *       <li>Zero</li>
     *       <li>One</li>
     *       <li>Two</li>
     *     </ul>
     *
     * Example #2 (Prepend multiple elements)
     * -------------------------------------
     *
     *      <ul>
     *        <li>
     *          <p>One</p>
     *        </li>
     *        <li>
     *          <p>Two</p>
     *        </li>
     *      </ul>
     *      ...
     *      t.get('ul li').prepend('<p>prepend</p>');
     *
     *      produces the following:
     *
     *      <ul>
     *        <li>
     *          <p>prepend</p>
     *          <p>One</p>
     *        </li>
     *        <li>
     *          <p>prepend</p>
     *          <p>Two</p>
     *        </li>
     *      </ul>
     *
     * @param {html} The element to prepend
     */
    'prepend': function(html) {
        insert_content(html, true, true);
        return this;
    },
    /**
     * Empty extension method
     * ----------------------
     *
     * Removes all the child elements of a specific node from the DOM.
     *
     * Usage
     * -----
     *
     *     tiramisu.get(*SELECTOR*).empty()
     *
     * where *SELECTOR* is a valid CSS selector (containing *one* or *more* elements).
     *
     * Example #1 (Remove all element of a list)
     * -----------------------------------------
     *
     *     <ol id="myList">
     *        <li>This is my <span class="tasty">icecake</span></li>
     *        <li>I love <span class="tasty">chocolate</span> chips!</li>
     *     </ol>
     *
     * calling *t.get('#myList').empty()* will give the following results:
     *
     *     <ol id="myList"></ol>
     *
     * Example #2 (Remove a specific element)
     * --------------------------------------
     *
     *     <ol id="myList">
     *        <li>This is my <span class="tasty">icecake</span></li>
     *        <li>I love <span class="tasty">chocolate chips!</span></li>
     *     </ol>
     *
     * calling *t.get('.tasty').empty()* will give the following results:
     *
     *     <ol id="myList">
     *        <li>This is my <span class="tasty"></span></li>
     *        <li>I love <span class="tasty"></span> chips!</li>
     *     </ol>
     *
     * Todo
     * ----
     *
     * -    Remove events to avoid memory leaks;
     *
     */
    'empty': function() {
        if (tiramisu.get.results[0] === undefined) {
            return '';
        }

        for (var i = 0; i < tiramisu.get.results.length; i++) {
            var child = tiramisu.get.results[i].childNodes[0];
            while (child) {
                var next = child.nextSibling;
                tiramisu.get.results[i].removeChild(child);
                child = next;
            }
        }
    },
    /**
     * Destroy extension method
     * ---------------------------------
     *
     * Removes element
     *
     * Usage
     * -----
     *
     *     tiramisu.get(*SELECTOR*).destroy(*ELEMENT*)
     *
     * where *SELECTOR* is a valid CSS selector and *ELEMENT* is the DOM element
     *
     * Example #1 (Remove all element child)
     * -----------------------------------------
     *
     *     <ol id="myList">
     *        <li>This is my <span class="tasty">icecake</span></li>
     *        <li>I love <span class="tasty">chocolate</span> chips!</li>
     *     </ol>
     *
     * calling *t.get('#myList').destroy('.tasty')* will give the following results:
     *
     *     <ol id="myList">
     *         <li>This is my </li>
     *         <li>I love  chips!</li>
     *     </ol>
     *
     * Example #2 (Remove element and child)
     * --------------------------------------
     *
     *     <ol id="myList">
     *        <li>This is my <span class="tasty">icecake</span></li>
     *        <li>I love <span class="tasty">chocolate chips!</span></li>
     *     </ol>
     *
     * calling *t.get('#myList').destroy()* will give the following results:
     *
     *     <div id="myDestroyList">
     *
     *     </div>
     *
     *
     */
    'destroy': function(el) {
        if (tiramisu.get.results[0] === undefined) {
            return '';
        }

        if (el !== undefined && typeof el === 'string') {
            var res = t.get(tiramisu.get.selector + ' ' + el),
                len = res.length;
            for (var i = len; i--;) {
                var parent = res[i].parentNode;
                parent.removeChild(res[i]);
            }
        } else {
            for (i = tiramisu.get.results.length; i--;) {
                var parent = tiramisu.get.results[i].parentNode;
                parent.removeChild(tiramisu.get.results[i]);
            }
        }
        return this;
    },
};