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
        
        this.version = '0.2.1';
        this.d = document;
        this.modules = Tiramisu.prototype;
                
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

     /**
      * Make Module
      * =========================
      *
      */
     tiramisu.modules.make = function(element) {
         return t.get(t.d.createElement(element));
     }

})(window);/**
 * Framework Selector Module
 * =========================
 *
 * A CSS Parser for handling DOM elements.
 *
 * Usage
 * -----
 *
 *     tiramisu.get(*SELECTOR*)
 *
 * or
 *
 *     t.get(*SELECTOR*)
 *
 * where *SELECTOR* is a *valid* CSS selector or, alternatively, an object
 * (see examples below).
 *
 * Tiramisu will use *querySelectorAll* if the current browser implements it;
 * if not present **Tiramisu** fallback to a custom, simple CSS selector.
 *
 * This simple selector implementation is *cross-browser* and actually implements
 * the following CSS rules:
 *
 * -  *id and name*;
 * -  *id*;
 * -  *class*;
 * -  *name and class*;
 * -  *element*;
 *
 * Note that this implementation is not fast as *querySelectorAll* since it relies
 * on pure (*not optimized*) JavaScript.
 *
 * Example #1 (Select all li elements)
 * --------------------------------
 *
 *     <ul id="myList">
 *       <li> First. </li>
 *       <li> Second. </li>
 *       <li> Third. </li>
 *     </ul>
 *     ...
 *     var li = tiramisu.get('#myList li');
 *
 * Example #2 (Select all li with class “special”)
 * --------------------------------------------
 *
 *     <ul id="myList">
 *       <li> First. </li>
 *       <li class="special"> Second. </li>
 *       <li> Third. </li>
 *     </ul>
 *     ...
 *     var li_special1 = tiramisu.get('#myList .special');
 *
 *     // Better way to do it :)
 *     var li_special2 = tiramisu.get('#myList li.special');
 *
 * @param {String} selector A CSS Selector
 * @returns {Object} The node list
 * @api public
 *
 */
tiramisu.modules.list_def = [];
tiramisu.modules.get = function(selector) {

    // Each module within Tiramisu can to need inherit other modules.
    // The number of cups of coffee is identified for each module.
    var ingredients = [2],
        cups_of_coffee = 1;

    this.selector = 'QSA';
    this.native_qsa = (this.selector === 'QSA' && typeof this.d.querySelectorAll !== 'undefined' ? true : false);

    function toArray(obj) {
        var array = [];
        // Zero-fill right shift to ensure that length is an UInt32
        for (var i = obj.length; i--;) {
            array[i] = obj[i];
        }
        return array;
    }

    var macros = {
        'nl': '\n|\r\n|\r|\f',
        'nonascii': '[^\0-\177]',
        'unicode': '\\[0-9A-Fa-f]{1,6}(\r\n|[\s\n\r\t\f])?',
        'escape': '#{unicode}|\\[^\n\r\f0-9A-Fa-f]',
        'nmchar': '[_A-Za-z0-9-]|#{nonascii}|#{escape}',
        'nmstart': '[_A-Za-z]|#{nonascii}|#{escape}',
        'ident': '[-@]?(#{nmstart})(#{nmchar})*',
        'name': '(#{nmchar})+'
    };

    var rules = {
        'id and name': '(#{ident}##{ident})',
        'id': '(##{ident})',
        'class': '(\\.#{ident})',
        'name and class': '(#{ident}\\.#{ident})',
        'element': '(#{ident})',
        'pseudo class': '(:#{ident})'
    };

    // Normalize the selector

    function normalize(text) {
        return text.replace(/^\s+|\s+$/g, '').replace(/[ \t\r\n\f]+/g, ' ');
    }

    // Scan macros and rules to build a big regex
    var scanner = function() {
            function replacePattern(pattern, patterns) {
                var matched = true,
                    match;
                while (matched) {
                    match = pattern.match(/#\{([^}]+)\}/);
                    if (match && match[1]) {
                        pattern = pattern.replace(new RegExp('#\{' + match[1] + '\}', 'g'), patterns[match[1]]);
                        matched = true;
                    } else {
                        matched = false;
                    }
                }
                return pattern;
            }

            function escapePattern(text) {
                return text.replace(/\//g, '//');
            }

            function convertPatterns() {
                var key, pattern, results = {},
                    patterns, source;

                if (arguments.length === 2) {
                    source = arguments[0];
                    patterns = arguments[1]
                } else {
                    source = arguments[0];
                    patterns = arguments[0];
                }

                for (key in patterns) {
                    pattern = escapePattern(replacePattern(patterns[key], source));
                    results[key] = pattern;
                }
                return results;
            }

            function joinPatterns(regexps) {
                var results = [],
                    key;

                for (key in regexps) {
                    results.push(regexps[key]);
                }

                return new RegExp(results.join('|'), 'g');
            }

            return joinPatterns(convertPatterns(convertPatterns(macros), rules));
        };

    var filter = {
        'byAttr': function(elements, attribute, value) {
            var key, results = [];
            for (key in elements) {
                if (elements[key] && elements[key][attribute] === value) {
                    results.push(elements[key]);
                }
            }
            return results;
        }
    };

    var find = {
        'byId': function(root, id) {
            return (root) ? [root.getElementById(id)] : [];
        },

        'byNodeName': function(root, tagName) {
            if (root === null) return [];
            var i, results = [],
                nodes = root.getElementsByTagName(tagName);

            for (i = 0; i < nodes.length; i++) {
                results.push(nodes[i]);
            }
            return results;
        },

        'byClassName': function(root, className) {
            if (root === null) return [];
            var i, results = [],
                nodes = root.getElementsByTagName('*');

            for (i = 0; i < nodes.length; i++) {
                if (nodes[i].className.match('\\b' + className + '\\b')) {
                    results.push(nodes[i]);
                }
            }
            return results;
        }
    };

    var findMap = {
        'id': function(root, selector) {
            selector = selector.split('#')[1];
            return find.byId(root, selector);
        },

        'name and id': function(root, selector) {
            var matches = selector.split('#'),
                name = matches[0],
                id = matches[1];
            return filter.byAttr(find.byId(root, id), 'nodeName', name.toUpperCase());
        },

        'name': function(root, selector) {
            return find.byNodeName(root, selector);
        },

        'class': function(root, selector) {
            selector = selector.split('\.')[1];
            return find.byClassName(root, selector);
        },

        'name and class': function(root, selector) {
            var matches = selector.split('\.'),
                name = matches[0],
                className = matches[1];
            return filter.byAttr(find.byClassName(root, className), 'nodeName', name.toUpperCase());
        }
    };

    var matchMap = {
        'id': function(element, selector) {
            selector = selector.split('#')[1];
            return element && element.id === selector;
        },

        'name': function(element, nodeName) {
            return element.nodeName === nodeName.toUpperCase();
        },

        'name and id': function(element, selector) {
            return matchMap.id(element, selector) && matchMap.name(element, selector.split('#')[0]);
        },

        'class': function(element, selector) {
            if (element && element.className) {
                selector = selector.split('\.')[1];
                return element.className.match('\\b' + selector + '\\b');
            }
        },

        'name and class': function(element, selector) {
            return matchMap['class'](element, selector) && matchMap.name(element, selector.split('\.')[0]);
        }
    };

    /**
     * Models a Token class.
     *
     * @param {String} identity The original selector rule;
     * @param {String} finder The category of the selector;
     * @api private
     */

    function Token(identity, finder) {
        this.identity = identity;
        this.finder = finder;
    }

    Token.prototype.toString = function() {
        return 'identity: ' + this.identity + ', finder: ' + this.finder;
    };

    /**
     * Classify sections of the scanner output.
     *
     * @param {String} selector A CSS selector;
     * @api private
     */

    function Tokenizer(selector) {
        this.selector = normalize(selector);
        this.tokens = [];
        this.tokenize();
    }

    Tokenizer.prototype.tokenize = function() {
        var match, r, finder;

        r = scanner();
        r.lastIndex = 0;

        while (match = r.exec(this.selector)) {
            finder = null;

            if (match[10]) {
                finder = 'id';
            } else if (match[1]) {
                finder = 'name and id';
            } else if (match[15]) {
                finder = 'class';
            } else if (match[20]) {
                finder = 'name and class';
            } else if (match[29]) {
                finder = 'name';
            }

            this.tokens.push(new Token(match[0], finder));
        }
        return this.tokens;
    };

    /**
     * Uses an array of tokens to perform DOM operations.
     *
     * @param {HTMLNode} root The starting DOM node;
     * @param {Array} tokens An array containing tokens;
     * @api private
     */

    function Searcher(root, tokens) {
        this.root = root;
        this.key_selector = tokens.pop();
        this.tokens = tokens;
        this.results = [];
    }

    Searcher.prototype.find = function(token) {
        if (!findMap[token.finder]) {
            throw new Error('Invalid Finder: ' + token.finder);
        }
        return findMap[token.finder](this.root, token.identity);
    };

    Searcher.prototype.matchesToken = function(element, token) {
        if (!matchMap[token.finder]) {
            throw new Error('Invalid Matcher: ' + token.finder);
        }
        return matchMap[token.finder](element, token.identity);
    };

    Searcher.prototype.matchesAllRules = function(element) {
        if (this.tokens.length === 0) return;

        var i = this.tokens.length - 1,
            token = this.tokens[i],
            matchFound = false;

        while (i >= 0 && element) {
            if (this.matchesToken(element, token)) {
                matchFound = true;
                i--;
                token = this.tokens[i];
            }
            element = element.parentNode;
        }

        return matchFound && i < 0;
    };

    Searcher.prototype.parse = function() {
        var i, element, elements = this.find(this.key_selector),
            results = [];

        // Each element that matches the key selector is used as a 
        // starting point. Its ancestors are analysed to see 
        // if they match all of the selector’s rules.
        for (i = 0; i < elements.length; i++) {
            element = elements[i];
            if (this.tokens.length > 0) {
                if (this.matchesAllRules(element.parentNode)) {
                    results.push(element);
                }
            } else {
                if (this.matchesToken(element, this.key_selector)) {
                    results.push(element);
                }
            }
        }
        return results;
    };

    // The result variable
    var results;

    if (typeof selector === 'string') {

        if (this.native_qsa) {
            // Use querySelectorAll
            results = toArray(t.d.querySelectorAll(selector));
        } else {
            // Use the built-in CSS Selector
            var lexer = new Tokenizer(selector);

            // Exposing lexer for testing purposes
            Tiramisu.prototype.tokenize = new Tokenizer(selector);
            var parser = new Searcher(document, lexer.tokens),
                results = parser.parse();
        }
    } else {
        // Selector is not a string so return it as 1-item list
        results = [selector];
    }

    // Keeps the number of results obtained from the selector
    var len_result = results.length;

    // Exposing basic methods
    var methods = {
        /**
         * Each iterator extension
         * -----------------------
         *
         * Applies a callback function to a list of DOM nodes.
         *
         * Usage
         * -----
         *
         *     tiramisu.get(*SELECTOR*).each(*CALLBACK*)
         *
         * Where *SELECTOR* is a valid CSS selector and *CALLBACK* a
         * function object.
         *
         * It is common to retrieve a list of DOM nodes and then apply the
         * *same* function to all of it's element:
         *
         * Example #1 (alert the innerHTML of every element in a list)
         * -----------------------------------------------------------
         *
         *     <ul>
         *       <li> One. </li>
         *       <li> Two. </li>
         *       <li> Three. </li>
         *     </ul>
         *     ...
         *     tiramisu.get('ul li').each(function() {
         *         alert(this.innerHTML);
         *     });
         *
         * As you can see, **this** is used for referencing the current
         * iteration item.
         *
         * @param {function} cb The callback function to apply
         */
        'each': function(cb) {
            var i;
            for (i = 0; i < results.length; i++) {
                cb.apply(results[i]);
            }
            return this;
        },
        /**
         * CSS handler extension
         * ---------------------
         *
         * Alter the CSS properties of a list of DOM nodes.
         *
         * Usage
         * -----
         *
         *     tiramisu.get(*SELECTOR*).css(*CSS_PROPERTIES*)
         *
         * where *SELECTOR* is a valid CSS selector and *CSS_PROPERTIES*
         * is an object containing the CSS properties to set.
         *
         * Example #1 (Set all h1 tags to 34px with color red)
         * ---------------------------------------------------
         *
         *     <h1> This is one headline. </h1>
         *     <h1> This is another headline. </h1>
         *     ...
         *     tiramisu.get('h1').css({
         *         'font-size': '12px',
         *         'color': 'red'
         *     });
         *
         * Example #2 (Get attribute out of style)
         * ---------------------------------------------------
         *
         *     <h1 id="my_id" style="color:red"> This is one headline. </h1>
         *     ...
         *     tiramisu.get('#my_id').css("color")
         *
         *  @param {Object} obj An object containing CSS properties
         */
        'css': function(obj) {
            var i, key, browser = t.detect('browser'),
                ie_older = t.detect('isIEolder'),
                ie = t.detect('isIE');

            // For handling IE CSS Attributes
            var attr = {
                'opacity': function(obj, value) {
                    if (value !== undefined) {
                        // Setter
                        if (ie) {
                            obj.style.opacity = value;
                            obj.style.filter = 'alpha(opacity=' + value * 100 + ')';
                        } else {
                            obj.style.opacity = value;
                        }
                    } else {
                        // Getter
                        return obj.style.opacity
                    }
                },
                'border-radius': function(obj, value) {
                    if (value) {
                        if (browser === 'f3') {
                            obj.style.MozBorderRadius = value; // Firefox 3.6 <=
                        }
                    } else {
                        if (browser === 'f3') {
                            return obj.style.MozBorderRadius;
                        } else if (browser === 'ie9+') {
                            return obj.style.borderRadius;
                        }
                    }
                }
            };

            if (typeof(obj) === 'string') {
                if (ie || browser === 'f3') {
                    if (obj == 'border-radius') {
                        return attr[obj](results[0])
                    }
                    return results[0].style[obj];
                }
                return results[0].style[obj];
            }

            // Apply to all elements
            for (i = len_result; i--;) {
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        // Need to handle different browsers
                        if (ie || browser === 'f3') {
                            if (attr[key] !== undefined) {
                                attr[key](results[i], obj[key]);
                            } else {
                                // No match in attr
                                results[i].style[key] = obj[key];
                            }
                        } else {
                            // The third param is for W3C Standard
                            results[i].style.setProperty(key, obj[key], '');
                        }
                    }
                }
            }
            return this;
        },
        /**
         * HTML extension method
         * ---------------------
         *
         * Gets or sets the HTML Markup of the first CSS
         * selector element.
         *
         * Usage
         * -----
         *
         *     tiramisu.get(*SELECTOR*).html([*HTML*])
         *
         * where *SELECTOR* is a valid CSS selector and *[HTML]* is an
         * optional value to set the element's innerHTML value.
         *
         * Example #1 (Getting the HTML value of a div)
         * --------------------------------------------
         *
         *     <div id="header">
         *       <p> I love pizza! </p>
         *     </div>
         *     ...
         *     var pizza = tiramisu.get('#header').html()
         *
         * Example #2 (Setting the HTML value of a div)
         *
         *     <div id="header">
         *       <p> I love pizza! </p>
         *     </div>
         *     ...
         *     tiramisu.get('#header').html('<p> i hate cakes! </p>');
         *
         * @param {String} [set] An optional string containing the HTML to replace
         * @return {[String]} An optional string containing the selector's first element HTML value
         */
        'html': function(set) {
            if (set !== undefined) {
                results[0].innerHTML = set;
            } else {
                return results[0].innerHTML;
            }
            return this;
        },
        /**
         * Form field value extension method
         * ---------------------------------
         *
         * Gets or sets the value of a form field of the first CSS Selector
         * element.
         *
         * Usage
         * -----
         *
         *     tiramisu.get(*SELECTOR*).value([*VALUE*])
         *
         * where *SELECTOR* is a valid CSS selector and *[VALUE]* is an
         * optional value to set the element's innerHTML value.
         *
         * Example #1 (Get the current value of a select list)
         * ---------------------------------------------------
         *
         *     <form id="myForm" action='#' method="GET">
         *       <select>
         *         <option> Apple </option>
         *         <option> Strawberry </option>
         *         <option> Banana </option>
         *       </select>
         *     </form>
         *     ...
         *     // The default selected value is “Apple”
         *     var current = t.get('myForm select').value();
         *
         * Example #2 (Set the current value of a select list)
         * ---------------------------------------------------
         *
         *     <form id="myForm" action='#' method="GET">
         *       <select>
         *         <option> Apple </option>
         *         <option> Strawberry </option>
         *         <option> Banana </option>
         *       </select>
         *     </form>
         *     ...
         *     t.get('myForm select').value('Strawberry');
         *
         *     // Now the selected value is “Strawberry”
         *     var current = t.get('myForm select').value();
         *
         * Example #3 (Get the current values of a series of elements)
         * ---------------------------------------------------
         *
         *     <input type="hidden" name="name_one" value="one" class="i_am_class">
         *     <input type="hidden" name="name_two" value="two" class="i_am_class">
         *     <input type="hidden" name="name_three" value="three" class="i_am_class">
         *     <input type="hidden" name="name_four" value="four" class="i_am_class">
         *     ...
         *     t.get('.i_am_class').value(); // ['one', 'two', 'three', 'four']
         *
         *
         * @param {String} [set] An optional string containing the field value to set
         * @return {[String]} An optional string containing the selector's first element field value
         *
         */
        'value': function(set) {
            var value = function(i) {
                    if (t.detect('isIE') || t.detect('isIEolder')) {
                        if (results[i].type == 'select-one') {
                            return results[i].options[results[i].selectedIndex].value;
                        }
                        return results[i].value;
                    }
                    return results[i].value;
                };

            var setValue = function(i, s) {
                    if (t.detect('isIE') || t.detect('isIEolder')) {
                        if (results[i].type == 'select-one') {
                            results[i].options[results[i].selectedIndex].value = s;
                        }
                        results[i].value = s;
                    } else {
                        results[i].value = s;
                    }
                };

            if (results[0] === undefined) {
                return '';
            }

            if (set !== undefined) {
                setValue(0, set);
            } else {
                if (len_result > 1) {
                    var list = [];
                    for (i = 0; i < len_result; i++) {
                        list.push(value(i));
                    }
                    return list;
                }
                return value(0);
            }
        },
        /**
         * Focus extension method
         * ---------------------------------
         *
         * Set focus on elements
         *
         * Usage
         * -----
         *
         *     tiramisu.get(*SELECTOR*).focus()
         *
         * where *SELECTOR* is a valid CSS selector
         *
         * Example #1 (Set focus on elements)
         * ---------------------------------------------------
         *
         *     tiramisu.get(*SELECTOR*).focus()
         *
         *
         */
        'focus': function() {
            for (var i = len_result; i--;) {
                results[i].focus();
            }
        },
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
            // A list with the desired attribute for each result.
            var list_attr = [];

            // The good way to eliminate a work repetition in functions is through lazy loading.
            var get_or_set_value = function() {
                    if (value !== undefined) {
                        // set value
                        get_or_set_value = function() {
                            for (var i = len_result; i--;) {
                                if (attr === 'class') {
                                    if (add) {
                                        results[i].className = results[i].className + ' ' + value;
                                    } else {
                                        results[i].className = value;
                                    }
                                } else {
                                    results[i].setAttribute(attr, value);
                                }
                            }
                        }
                    } else {
                        // get value
                        get_or_set_value = function() {
                            for (var i = len_result; i--;) {
                                if (attr === 'class') {
                                    list_attr.push(results[i].className);
                                } else {
                                    list_attr.push(results[i].getAttribute(attr));
                                }
                            }
                            return list_attr;
                        }
                    }
                    return get_or_set_value();
                }

                // set_value returns undefined when used so return this 
                // else return list_attr (get value)
            return get_or_set_value() || this;
        },
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
            t.list_def.push(def);
            t.d.onreadystatechange = function() {
                if (t.d.readyState == "complete") {

                    var len = t.list_def.length;
                    for (var i = 0; i < len; i++) {
                        var def = t.list_def[i];
                        // Run the callback
                        def();
                    }

                    return this;

                }
            }
        },
        /**
         * Index extension method
         * ---------------------------------
         *
         * Get the index position of an element.
         *
         * Usage
         * -----
         *
         *     tiramisu.get(*SELECTOR*).index(*ELEMENT*)
         *
         * where *SELECTOR* is a valid CSS selector and *ELEMENT* is the DOM element
         * to search.
         *
         * The function returns -1 if no element is found.
         *
         * Example #1 (Get the index of a selector element)
         * ------------------------------------------------
         *
         *     <p>This</p>      // element 0
         *     <p>is</p>        // element 1
         *     <p>Sparta!</p>   // element 2
         *     ...
         *     var el = t.get('p')[2];
         *     var index = t.get('p').index(el); // Contains '2';
         *
         * @param {Object} the element to search (that is, a DOM element, not a *string*)
         * @return {index} the index of the element if found, -1 otherwise
         */
        'index': function(el) {
            if (el !== undefined) {
                for (var i = len_result; i >= 0; i--) {
                    if (results[i] === el) break;
                }
                return i;
            }
        },
        /**
         * Filter extension method
         * -----------------------
         *
         * Filters a selector or a custom function to the CSS Selector list's results.
         *
         * Usage
         * -----
         *
         *     tiramisu.get(*SELECTOR*).filter([*FILTER*])
         *
         * where *SELECTOR* is a valid CSS selector, *FILTER* is a built-in filter (see the list below)
         * or can be defined as a custom function.
         *
         * Currently implemented filters are:
         * *  *:odd*;
         * *  *:even*;
         *
         * Custom filter functions
         * -----------------------
         *
         * A custom filter function **must** conform to the following scheme:
         *
         *     function([index]) {
         *         ...code here...
         *         return true or false;
         *     }
         *
         * where **index** is an optional index which can be used to perform the filter's choices.
         *
         * Example #1 (Filtering even elements by using the built-in filter)
         * -----------------------------------------------------------------
         *
         *     <p>Zero</p>
         *     <p>One</p>
         *     <p>Two</p>
         *     <p>Three</p>
         *     ...
         *     t.get('p').filter(':even')
         *
         * gives the following selector list:
         *
         *      [<p>Zero</p>, <p>Two</p>]
         *
         * Example #2 (Filtering elements by using a custom function)
         * ----------------------------------------------------------
         *
         *      <p>Zero</p>
         *      <p>One</p>
         *      <p>Two</p>
         *      <p>Three</p>
         *      ...
         *      t.get('p').filter(function(index) {
         *          return (index === 2) ? true : false;
         *      });
         *
         */
        'filter': function(selector) {
            var selectors = {
                ':odd': function(index) {
                    return (index % 2 !== 0) ? true : false;
                },
                ':even': function(index) {
                    return (index % 2 === 0) ? true : false;
                }
            };

            if (typeof selector === 'string' && typeof selectors[selector] === 'function') {
                for (var i = len_result; i--;) {
                    !selectors[selector](i) && results.splice(i, 1);
                }
            } else if (typeof selector === 'function') {
                for (var i = len_result; i--;) {
                    !selector(i) && results.splice(i, 1);
                }
            }

            len_result = results.length;

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
        }
    };

    // Append methods to the result object
    (function append_methods() {
        var key;

        for (key in methods) {
            // returns an empty string inside a function if selector result is empty 
            if (len_result) {
                results[key] = methods[key];
            } else {
                results[key] = function() {
                    return '';
                };
            }
        }

        if (typeof(tiramisu.modules.get.methods) !== 'undefined') {

            // Addictional methods
            for (key in tiramisu.modules.get.methods) {
                for (method in tiramisu.modules.get.methods[key]) {
                    if (len_result) {
                        results[method] = tiramisu.modules.get.methods[key][method];
                    } else {
                        results[method] = function() {
                            return '';
                        };
                    }
                }
            }
        }
    })();
    // Exposing results
    tiramisu.get.results = results;
    // Exposing selector
    tiramisu.get.selector = selector;

    return results;
};

// Allocate methods object
tiramisu.modules.get.methods = tiramisu.modules.get.methods || {};
/** 
 * Framework Detection Module
 * ==========================
 *
 * This module is mainly used to perform several *browser-detection tests*:
 *
 * - browser
 * - isIE, isFirefox, isChrome
 * - querySelectorAll
 * - opacity, color
 *
 * Compatibility for not support CSS:
 *
 * - position:fixed - iOS Safari / Opera Mini
 * - CSS3 Opacity - I8 older using the "filter" property
 * - CSS3 Colors - I8 older using rgb rather than rgba
 *
 * Example #1 (Detect browser)
 * ------------------------
 *
 * Here's an example on how to *detect* the current browser:
 *
 *     if (tiramisu.detect('browser') === 'IE9')) {
 *         console.log('IE');
 *     }
 *
 * A shortcut to perform this check is:
 *
 *     if (tiramisu.detect('isIE')) {
 *         console.log('IE');
 *     }
 *
 * The main difference between the first and the second example is that
 * *isIE* and, in general, *is(X)* methods doesn't check the browser for
 * a specific version.
 *
 * If you need to perform a check for a specific version you'll need to rely on *detect('browser')*;
 * the possible return values are:
 *
 * - *safarichrome*;
 * - *firefox3*;
 * - *firefox4*;
 * - *Opera10.4*;
 * - *Opera10.5+*;
 * - *IE_older* (For IE <= 6).
 * - *IE8*;
 * - *IE9+*;
 *
 * @param {String} key The test to perform (see the var tests below)
 * @returns {Boolean} The test result
 * @api public
 */
tiramisu.modules.detect = function(key) {

    // Each module within Tiramisu can to need inherit other modules.
    // The number of cups of coffee is identified for each module.
    var ingredients = [1],
        cups_of_coffee = 2;

    var nav_agent = navigator.userAgent,
        nav_name = navigator.appName;

    // Netscape includes Firefox, Safari or Chrome
    var tests = {

        'browser': function() {
            if (nav_name === 'Netscape') {
                var firefox = nav_agent.substring(nav_agent.indexOf('Firefox'));
                if (firefox.split('/')[0] !== 'Firefox') { // Case 1 - Safari or Chrome
                    return "webkit"
                } else {
                    firefox_version = parseInt(firefox.split('/')[1].split('.')[0]);
                    if (firefox_version > 3.8) { // Case 2 - Firefox 4
                        return 'f4+'
                    }
                    return 'f3'
                }
            } else if (nav_name == 'Opera') {
                var opera = nav_agent.substring(nav_agent.indexOf('Version')).split("/")[1]
                if (opera.split('.')[1] > 49) { // Case 4 - Opera 10.5+
                    return 'o10.5+'
                }
                return 'o10.4';
            } else if (/MSIE (\d+\.\d+);/.test(nav_agent)) { //test for MSIE x.x;
                var ie = new Number(RegExp.$1) // capture x.x portion and store as a number
                if (ie > 8) {
                    return 'ie9+';
                } else if (ie == 8) {
                    return 'ie8';
                }
                return 'ie7';
            } else { // Case 6 - IE or other
                return 'other';
            }
        },

        'isIE': function() {
            return this.browser() === 'ie9+' || this.browser() === 'ie8' || this.browser() === 'ie7';
        },

        'isIEolder': function() {
            return this.browser() === 'ie8' || this.browser() === 'ie7';
        },

        'isFirefox': function() {
            return this.browser() === "f3" || this.browser() === "f4+"
        },

        'isWebkit': function() {
            return this.browser() === 'webkit'
        },

        'color': function() {
            if (this.isIEolder()) {
                return false;
            }
            return true;
        }
    };
    return tests[key]();
};
/**
 * Event Selector methods
 * ======================
 *
 * Several methods for Events tasks:
 *
 * *  *On/Off*
 *
 */
// Keep in memory the events created
tiramisu.modules.local_event = {};
tiramisu.modules.get.methods.event = {

    // Each module within Tiramisu can to need inherit other modules.
    // The number of cups of coffee is identified for each module.
    'ingredients': [1],
    'cups_of_coffee': 5,

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
        // if this[0] === undefined : *SELECTOR* is not a valid CSS selector or not exist;
        for (var j = evt_len; j--;) {
            var cb = callback[j];
            for (i = this.length; i--;) {
                add_handler(this[i], ev[j], cb);
            }
            if (typeof selector === 'string') {
                t.local_event[selector] = {};
                t.local_event[selector] = {
                    'cb': cb,
                    'element': this
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
            if (t.local_event[selector] !== undefined) {
                var cb = t.local_event[selector]['cb'],
                    element = t.local_event[selector]['element'],
                    len = element.length;
                for (i = len; i--;) {
                    remove_handler(tiramisu.get.results[i], evt, cb);
                }
                delete t.local_event[selector];
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
