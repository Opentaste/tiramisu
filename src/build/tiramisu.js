/**
 *
 * Tiramisu - A JavaScript μFramework
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
     * - *requestAnimFrame* (used for handling tasks).
     * - A *Module Container* (TODO: Write detailed docs about it)
     */

    function Tiramisu() {
        this.version = '0.1.5-b1';
        this.d = document;
        this.selector = 'QSA'
        this.requestAnimFrame = (function() {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function(callback, element) {
                window.setTimeout(callback, 1000 / 60);
            };
        })();

        // Tiramisu modules
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

    // Keep in memory the events created
    var local_event = {};

    /**
     * Make Module
     * =========================
     *
     */
    tiramisu.modules.make = function(element) {
        return t.get(t.d.createElement(element));
    }

})(window);
/** 
 * Task Engine Module
 * ==================
 *
 * This module is used to perform a function at a particular amount of time
 * or perform the same function several times in that time frame.
 *
 * Usage
 * -----
 *
 *     tiramisu.task(delay, [interval], callback);
 *
 * where “interval” is an optional argument
 *
 *
 * Example #1 (The callback is executed after 2000 ms)
 * -----------------------------
 *
 *     tiramisu.task(2000, callback)
 *
 *
 * Example #2 (The callback is executed every 100 ms in a period of 2000ms)
 * -----------------------------------------------------
 *
 *     tiramisu.task(2000, 100, callback)
 *
 *
 * Example #3 (The callback is executed every 500 ms in loop.)
 * -----------------------------------------------------
 *
 *     tiramisu.task('loop', 500, callback)
 *
 *
 * @param {integer} delay The total task delay(ms)
 * @param {integer} [interval] The interval of the repetitions(ms)
 * @param {Function} cb The callback function
 */
tiramisu.modules.task = function(delay, cb) {

    // Each module within Tiramisu can to need inherit other modules.
    var ingredients = {
        dependencies: null
    }

    var interval, requestAnimFrame = t.requestAnimFrame;

    if (arguments.length > 2) {
        interval = arguments[1];
        cb = arguments[2];
    }

    var start = +new Date(),
        pass = interval;

    function animate() {
        var progress = +new Date() - start;

        if (interval !== undefined) {
            if (progress > pass) {
                pass += interval;
                cb();
            }
        }

        // The recursion continues only in two cases:
        // - The elapsed time is less than the total time;
        // - The total time is infinite (so a loop) but there 
        //   is an interval of time between repetitions of the callback.
        if (progress < delay || (delay == 'loop' && interval !== undefined)) {
            requestAnimFrame(animate);
        } else {
            if (interval === undefined) {
                cb();
            }
        }
    }
    animate();
};
/**
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
tiramisu.modules.get = function(selector) {

    // DOM Node insertion generic utility

    function insert_content(html, before, append) {
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

    function toArray(obj) {
        var array = [];
        // Zero-fill right shift to ensure that length is an UInt32
        for (var i = obj.length; i--;) {
            array[i] = obj[i];
        }
        return array;
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

        if (t.modules.detect('querySelectorAll')) {
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
    var methods = this.modules.get.methods.list();

    // Append methods to the result object
    (function append_methods() {
        var key;

        for (key in methods) {
            results[key] = methods[key];
        }
        console.log(methods);
    })();
    return results;
};

// Exposing methods
tiramisu.modules.get.methods = (function() {
    this.obj = this.obj || {};

    return {
        'list': function() {
            return obj;
        },
        'add': function(name, method) {
            obj[name] = method;
        }
    };
})();
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
    var ingredients = {
        dependencies: null
    }

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

        'querySelectorAll': function() {
            return (tiramisu.selector === 'QSA' && typeof tiramisu.d.querySelectorAll !== 'undefined')
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
 * Framework Ajax Module
 * =====================
 *
 * This module is mainly used to perform Ajax requests.
 *
 * Usage
 * -----
 *
 *     tiramisu.ajax(SETTINGS);
 *
 * where the *SETTINGS* object can contain the following:
 *
 * - *async* (default is “true”);
 * - *content_type* (in POST requests default is “application/x-www-form-urlencoded”);
 * - *connection*;
 * - *error* (a callback function);
 * - *start_load* (a callback function);
 * - *end_load* (a callback function);
 * - *loader*  (a url loader image);
 * - *method*  (default is “GET”)
 * - *parameter*;
 * - *success* (a callback function);
 * - *successHTML* (a div id);
 * - *url* (this is the only **mandatory** field);
 *
 * Example #1 (Ajax GET request)
 * -----------------------------
 *
 *     tiramisu.ajax({
 *         url : 'http://www.example.com'
 *     });
 *
 * Example #2 (Ajax GET request with a success callback)
 * -----------------------------------------------------
 *
 *     tiramisu.ajax({
 *         url : 'http://www.example.com',
 *         success : function(data) {
 *             alert(data);
 *         }
 *     });
 *
 * Example #3 (Ajax GET request loaded into a div with an id)
 * ----------------------------------------------------------
 *
 *     tiramisu.ajax({
 *         url : 'http://www.example.com',
 *         successHTML : 'responseWrapper'
 *     });
 *
 * Example #4 (Ajax POST request displaying a loader html)
 * --------------------------------------------------
 *
 *     tiramisu.ajax({
 *          url: 'www.example.com',
 *          method : 'POST',
 *          loader : '<img src="http://www.mysite.com/url_image_loader.jpg" alt="" />',
 *          successHTML : 'responseWrapper'
 *     });
 *
 * Example #5 (Ajax GET request with parameters)
 * ----------------------------------------------
 *
 *     tiramisu.ajax({
 *         parameter: {
 *             param_1 : 'variable 1',
 *             param_2 : 'variable 2'
 *         },
 *         successHTML : 'responseWrapper'
 *         url : 'http://www.example.com');
 *     });
 *
 * Example #6 (Ajax POST request with parameters)
 * ----------------------------------------------
 *
 *     tiramisu.ajax({
 *         method : 'POST',
 *         parameter: {
 *             param_1 : 'variable 1',
 *             param_2 : 'variable 2'
 *         },
 *         successHTML : 'responseWrapper'
 *         url : 'http://www.example.com');
 *     });
 *
 * Example #7 (Ajax GET request with success and error callbacks)
 * --------------------------------------------------------------
 *
 *     tiramisu.ajax({
 *         url: 'http://www.example.com',
 *         success: function() {
 *             console.log('Ok');
 *         },
 *         error: function() {
 *             console.log('Error');
 *         }
 *     });
 *
 * Example #8 (Ajax POST request with successHTML and success callbacks)
 * --------------------------------------------------------------
 *
 *     tiramisu.ajax({
 *        method : 'POST',
 *        parameter: {
 *             param_1 : 'variable 1',
 *             param_2 : 'variable 2'
 *         },
 *        success: function(){ ... },
 *        successHTML: 'responseWrapper',
 *        url : 'http://www.example.com');
 *    });
 *
 * Example #9 (Ajax set content_type, connection, data_type)
 * --------------------------------------------------------------
 *
 *     tiramisu.ajax({
 *        content_type : '',
 *        connection: '',
 *        data_type: '',
 *        successHTML: 'responseWrapper',
 *        url : 'http://www.example.com');
 *    });
 *
 * Example #10 (Ajax with start_load and end_load)
 * --------------------------------------------------------------
 *
 *     tiramisu.ajax({
 *        start_load: function() {
 *
 *        },
 *        end_load: function() {
 *
 *        },
 *        successHTML: 'responseWrapper',
 *        url : 'http://www.example.com');
 *    });
 *
 * Example #11 (Ajax with time stop)
 * --------------------------------------------------------------
 *
 *     tiramisu.ajax({
 *        stop : 2000,
 *        successHTML: 'responseWrapper',
 *        url : 'http://www.example.com');
 *    });
 *
 * Example #12 (If there is new request then to abort the past requests.)
 * --------------------------------------------------------------
 *
 *     tiramisu.ajax({
 *        abort : true,
 *        successHTML: 'responseWrapper',
 *        url : 'http://www.example.com');
 *    });
 *
 * Error
 * -----
 * - #1 : Object Ajax Error!;
 *
 * @param {Object} settings An object containing the Ajax call parameters
 * @api public
 */
tiramisu.modules.ajax = function(setting_input) {

    // Each module within Tiramisu can to need inherit other modules.
    var ingredients = {
        dependencies: ['browserdetect', 'taskengine']
    }

    // Extending object1 with object2's methods


    function extend(first, second) {
        for (var prop in second) {
            first[prop] = second[prop];
        }
    }

    var setting_input = setting_input || {},
        setting = {
            abort: false,
            async: true,
            content_type: '',
            connection: '',
            data_type: '',
            error: function(res) {
                try {
                    console.log(res)
                } catch (e) {}
            },
            start_load: function() {},
            end_load: function() {},
            loader: null,
            method: 'GET',
            parameter: '',
            success: function() {},
            successHTML: '',
            stop: '',
            url: ''
        },
        xhr = null,
        parameter = '',
        // Is very important that parameter dafualt value is ''
        parameter_count = 0,
        url_cache = '',
        get_params = '';

    if (setting.abort) {
        if (xhr && xhr.readyState != 0 && xhr.readyState != 4) {
            xhr.abort()
        }
    }

    try {
        xhr = new ActiveXObject("Msxml2.XMLHTTP")
    } catch (err) {
        try {
            xhr = new ActiveXObject("Microsoft.XMLHTTP")
        } catch (error) {
            xhr = null
        }
    }
    if (!xhr && typeof XMLHttpRequest != "undefined") {
        xhr = new XMLHttpRequest
    }

    extend(setting, setting_input);

    // object "setting.parameter" I create a string with the parameters 
    // to be passed in request
    if (setting.parameter != '') {
        for (attrname in setting.parameter) {
            parameter += attrname + '=' + setting.parameter[attrname] + '&';
        }
        parameter = parameter.substring(0, parameter.length - 1);
        if (setting.method === 'POST') {
            if (!setting.content_type) {
                setting.content_type = 'application/x-www-form-urlencoded';
            }
        } else {
            get_params = '?' + parameter;
        }
    } else {
        parameter = null;
    }

    if (t.detect('isIE') && setting.method === 'POST') {
        // Easy Solution for Internet Explorer
        url_cache = '?' + (('' + Math.random()).replace(/\D/g, ''));
    }

    xhr.onreadystatechange = function() {
        var state = xhr.readyState;
        if (state == 4 && xhr.responseText) {
            // success!
            if (setting.successHTML) {
                if (typeof(setting.successHTML) === 'string') {
                    t.d.getElementById(setting.successHTML).innerHTML = xhr.responseText;
                } else if (typeof(setting.successHTML) === 'object') {
                    if (typeof(setting.successHTML.html) === 'function') {
                        setting.successHTML.html(xhr.responseText);
                    } else {
                        setting.successHTML.innerHTML = xhr.responseText;
                    }
                }
            }
            setting.end_load();
            setting.success(xhr.responseText);
        } else if (state == 4 && xhr.status == 400) {
            // 400 Bad Request
            setting.end_load();
            setting.error('400 Bad Request');
        } else if (state == 4 && xhr.status != 200) {
            // fetched the wrong page or network error...
            setting.end_load();
            setting.error('Fetched the wrong page or network error');
        } else {
            if (setting.successHTML && setting.loader) {
                if (typeof(setting.successHTML) === 'string') {
                    t.d.getElementById(setting.successHTML).innerHTML = setting.loader;
                } else if (typeof(setting.successHTML) === 'object') {
                    if (typeof(setting.successHTML.html) === 'function') {
                        setting.successHTML.html(setting.loader);
                    } else {
                        setting.successHTML.innerHTML = setting.loader;
                    }
                }
            }
        }
    };


    xhr.open(setting.method, setting.url + get_params + url_cache, setting.async);

    if (setting.content_type) {
        xhr.setRequestHeader('Content-type', setting.content_type);
    }
    if (setting.connection) {
        xhr.setRequestHeader('Connection', setting.connection);
    }
    if (setting.data_type) {
        xhr.setRequestHeader('dataType', setting.data_type);
    }

    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); // Set a request
    // Set start load
    setting.start_load();

    if (setting.stop) {
        t.task(setting.stop, function() {
            xhr.abort();
        })
    }

    xhr.send(parameter);
    return this;
};
