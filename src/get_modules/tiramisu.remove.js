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
    if (results[0] === undefined) {
        return '';
    }

    for (var i = 0; i < len_result; i++) {
        var child = results[i].childNodes[0];
        while (child) {
            var next = child.nextSibling;
            results[i].removeChild(child);
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
    if (results[0] === undefined) {
        return '';
    }

    if (el !== undefined && typeof el === 'string') {
        var res = t.get(selector + ' ' + el),
            len = res.length;
        for (var i = len; i--;) {
            var parent = res[i].parentNode;
            parent.removeChild(res[i]);
        }
    } else {
        for (i = len_result; i--;) {
            var parent = results[i].parentNode;
            parent.removeChild(results[i]);
        }
    }

    return this;
},