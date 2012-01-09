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
tiramisu.modules.get.methods = (function () {
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