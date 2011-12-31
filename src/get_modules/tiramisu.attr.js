/**
 * Attribute extension method
 * ---------------------------------
 *
 * Gets or sets the attribute of an element.
 *
 * Usage
 * -----
 *
 *     tiramisu.get(*SELECTOR*).attr(*ATTRIBUTE*, [*VALUE*])
 *
 * where *SELECTOR* is a valid CSS selector,*ATTRIBUTE* is the name of
 * the attribute and *[VALUE]* is an optional value for setting the attribute.
 *
 * Example #1 (Get the current src of an image)
 * ---------------------------------------------------
 *
 *     <img src="www.example.com/image_num_one.png" id="id_image" />
 *     ...
 *     var current = t.get('#id_image').attr('src');
 *
 * Example #2 (Set the current src of an image)
 * ---------------------------------------------------
 *
 *     <img src="www.example.com/image_num_one.png" id="id_image" />
 *     ...
 *     t.get('#id_image').attr('src', 'www.example.com/image_num_two.png');
 *
 * Example #3 (Set the class)
 * ---------------------------------------------------
 *
 *     <p class="old_class old_class_two">Hi class</p>
 *
 * calling *t.get('p').attr('class', 'new_class')* will give the following results:
 *
 *     <p class="new_class">Hi class</p>
 *
 * Example #4 (Set the class)
 * ---------------------------------------------------
 *
 *     <p class="old_class old_class_two">Hi class</p>
 *
 * calling *t.get('p').attr('class', 'new_class', true)* will give the following results:
 *
 *     <p class="old_class old_class_two new_class">Hi class</p>
 *
 * @param {String} [set] An optional string containing the field src to set
 * @return {[String]} An optional string containing the selector's first element field src
 *
 */
'attr': function(attr, value, add) {
    for (var i = len_result; i--;) {
        if (value !== undefined) {
            if (attr === 'class') {
                if (add) {
                    results[i].className = results[i].className + ' ' + value;
                } else {
                    results[i].className = value;
                }
            } else {
                results[i].setAttribute(attr, value);
            }
        } else {
            if (attr === 'class') {
                return results[i].className;
            } else {
                return results[i].getAttribute(attr);
            }
        }
    }
    return this;
},
/**
 * Remove Class extension method
 * ---------------------------------
 *
 * Removes class
 *
 * Usage
 * -----
 *
 *     tiramisu.get(*SELECTOR*).removeClass(*CLASS*)
 *
 * where *SELECTOR* is a valid CSS selector and *CLASS* is class name
 *
 * Example #1 (Remove class of the element)
 * -----------------------------------------
 *
 *     <p id="tasty" class="my_class my_class_two">Hi Gianluca</p>
 *
 * calling *t.get('#tasty').removeClass('my_class_two')* will give the following results:
 *
 *     <p id="tasty" class="my_class">Hi Gianluca</p>
 *
 * Example #2 (Remove all class of the element)
 * --------------------------------------
 *
 *     <p id="tasty" class="my_class my_class_two">Hi Gianluca</p>
 *
 * calling *t.get('#tasty').removeClass()* will give the following results:
 *
 *     <p id="tasty" class="">Hi Gianluca</p>
 *
 *
 * Example #3 (Remove all class of the element and child)
 * --------------------------------------
 *
 *     <p id="tasty" class="my_class">
 *          <span class="my_class_one">Hi one</span>
 *          <span class="my_class_two">Hi two</span>
 *     </p>
 *
 * calling *t.get('#tasty').removeClass(':all')* will give the following results:
 *
 *     <p id="tasty" class="">
 *          <span class="">Hi one</span>
 *          <span class="">Hi two</span>
 *     </p>
 *
 *
 */
'removeClass': function(el) {
    if (results[0] === undefined) {
        return '';
    }

    var i, j, text, all = false;

    if (el === ':all') {
        el = undefined;
        var all = true;
    }


    if (el !== undefined && typeof el === 'string') {

        var re = new RegExp('(\\s|^)' + el + '(\\s|$)');
        // Remove class into element
        for (i = len_result; i--;) {
            text = results[i].className.replace(re, '');
            results[i].className = text;
        }

    } else {

        for (i = len_result; i--;) {
            // Remove all class into element
            results[i].className = '';

            // Remove all class into child
            if (all) {
                var list_child = results[i].childNodes,
                    len = list_child.length;
                if (len > 0) {
                    (function(list, len) {
                        for (var j = len; j--;) {
                            list[j].className = '';
                            var new_list = list[j].childNodes,
                                new_len = new_list.length;
                            if (new_len > 0) {
                                arguments.callee(new_list, new_len);
                            }
                        }
                    })(list_child, len);
                }
            }
        }

    }
    return this;
},