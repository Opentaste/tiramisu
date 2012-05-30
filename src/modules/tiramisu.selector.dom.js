/**
 * # DOM Selector methods
 *
 * Several methods for DOM-related tasks:
 *
 * *  *Insert/Append*
 * *  *Insert Before/Prepend*
 * *  *Empty/Destroy*
 *
 *
 * ## Insert Before method
 *
 * Insert text or html, before each element.
 *
 *     tiramisu.get(*SELECTOR*).before(*HTML*)
 *
 * where *SELECTOR* is a valid CSS selector, *HTML* is the element to insert.
 *
 * Example #1 ()
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
 * ## Insert After method
 *
 * Insert text or html, after each element.
 *
 *     tiramisu.get(*SELECTOR*).after(*HTML*)
 *
 * where *SELECTOR* is a valid CSS selector and *HTML* is the element to insert.
 *
 * Example #1 (Inserting an element multiple times)
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
 * ## Append method
 *
 * Appends a DOM element into a list of selector results.
 *
 *     tiramisu.get(*SELECTOR*).append(*HTML*)
 *
 * where *SELECTOR* is a valid CSS selector and *HTML* is a string containing some HTML
 * (such as &lt;p>hi&lt;/p>, &lt;h1>headline&lt;/h1> etc.)
 *
 * Example #1 (Append a single element)
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
 *
 * ## Prepend method
 *
 * Prepends a DOM element into a list of selector results.
 *
 *     tiramisu.get(*SELECTOR*).prepend(*HTML*)
 *
 * where *SELECTOR* is a valid CSS selector and *HTML* is a string containing some HTML
 * (such as &lt;p>hi&lt;/p>, &lt;h1>headline&lt;/h1> etc.)
 *
 * Example #1 (Prepend a single element)
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
 *
 * ## Empty extension method
 *
 * Removes all the child elements of a specific node from the DOM.
 *
 *     tiramisu.get(*SELECTOR*).empty()
 *
 * where *SELECTOR* is a valid CSS selector (containing *one* or *more* elements).
 *
 * Example #1 (Remove all element of a list)
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
 *
 * ## Destroy extension method
 *
 * Removes element
 *
 *     tiramisu.get(*SELECTOR*).destroy(*ELEMENT*)
 *
 * where *SELECTOR* is a valid CSS selector and *ELEMENT* is the DOM element
 *
 * Example #1 (Remove all element child)
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
tiramisu.modules.get.methods.dom = {

    // Each module within Tiramisu can to need inherit other modules.
    // The number of cups of coffee is identified for each module.
    'ingredients': [1],
    'cups_of_coffee': 3,

    'before': function(html) {
        insert_content(this, html, true, false)
        return this;
    },
    'after': function(html) {
        insert_content(this, html, false, false);
        return this;
    },
    'append': function(html) {
        insert_content(this, html, false, true);
        return this;
    },
    'prepend': function(html) {
        insert_content(this, html, true, true);
        return this;
    },
    'empty': function() {
        // Todo
        // Remove events to avoid memory leaks;
        for (var i = 0; i < tiramisu.get.results.length; i++) {
            var child = tiramisu.get.results[i].childNodes[0];
            while (child) {
                var next = child.nextSibling;
                tiramisu.get.results[i].removeChild(child);
                child = next;
            }
        }
    },
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

// DOM Node insertion generic utility

function insert_content(self, html, before, append) {
    // Aliasing results
    var results = self,
        len_result = results.length;

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
