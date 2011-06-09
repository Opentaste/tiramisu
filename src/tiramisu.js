/**
 *
 * Tiramisu - A JavaScript μFramework
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 * Copyright: (c) 2011 Owl Studios
 * License: BSD (See LICENSE for details)
 *
 **/
(function(window) {

    // Constructor
    function Tiramisu() {
        this.version = '0.0.1a';
    }

    // Exposing the framework
    window.tiramisu = new Tiramisu();

    // Framework Detection Module 
    Tiramisu.prototype.detect = function(key) {
        var nav_agent = navigator.userAgent, 
            nav_name  = navigator.appName, 
            firefox = nav_agent.substring(nav_agent.indexOf('Firefox')), 
            firefox_version = firefox.split('/')[1].split('.')[0], 
            opera = nav_agent.substring(nav_agent.indexOf('Version')).split("/")[1];
        
        // Turns off querySelectorAll detection
        var USE_QSA = false;
        
        // Netscape includes Firefox, Safari or Chrome
        var tests = {
            'browser': function() {
                if (nav_name === 'Netscape'){ 
                    if (firefox.split("/")[0] !== 'Firefox') { // Case 1 - Safari or Chrome
                        return "safarichrome"
                    } 
                    else { 
                        if (firefox_version ==="4") { // Case 2 - Firefox 4
                            return "firefox4"
                        } 
                        else { // Case 3 - Firefox 3
                            return "firefox3"
                        }
                    }
                } 
                else if (nav_name == 'Opera') {
                    if (opera.split(".")[1] > 49) { // Case 4 - Opera 10.5+
                        return "Opera10.5+"
                    } 
                    else { // Case 5 - Opera 10.4-
                        return "Opera10.4"
                    }
                } 
                else { // Case 6 - IE or other
                    return "IE"
                }
            }
            , 'isIE': function() { return this.browser() === "IE"; }
            , 'isFirefox': function() { return this.browser() === "firefox3" || this.browser() === "firefox4" }
            , 'isChrome': function() { return this.browser() === 'safarichrome'}
            , 'querySelectorAll': function() { return (USE_QSA && typeof document.querySelectorAll !== 'undefined') }
        };
        return tests[key]();
    };

    Tiramisu.prototype.get = window.$t = function(selector) {
        if (tiramisu.detect('querySelectorAll')) return document.querySelectorAll(selector);

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
                var key, pattern, results = {};
                var patterns, source;

                if (arguments.length === 2) {
                    source = arguments[0];
                    patterns = arguments[1]
                }
                else {
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
                var results = [];
                var key;

                for (key in regexps) {
                    results.push(regexps[key]);
                }

                return new RegExp(results.join('|'), 'g');
            }

            return joinPatterns(convertPatterns(convertPatterns(macros), rules));
        };

        var filter = {
            'byAttr': function(elements, attribute, value) {
                var key;
                var results = [];
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
                var i;
                var results = [];
                var nodes = root.getElementsByTagName(tagName);

                for (i = 0; i < nodes.length; i++) {
                    results.push(nodes[i]);
                }
                return results;
            },

            'byClassName': function(root, className) {
                if (root === null) return [];
                var i;
                var results = [];
                var nodes = root.getElementsByTagName('*');

                for (i = 0; i < nodes.length; i++) {
                    if (nodes[i].className.match('\\b' + className + '\\b')) {
                        results.push(nodes[i]);
                    }
                }
                return results;
            }
        };

//        // Use native getElementsByClassName if exists
//        if (typeof document.getElementsByClassName !== 'undefined') {
//            find.byClassName = function(root, className) {
//                return root.getElementsByClassName(className);
//            }
//        }

        var findMap = {
            'id': function(root, selector) {
                selector = selector.split('#')[1];
                return find.byId(root, selector);
            },

            'name and id': function(root, selector) {
                var matches = selector.split('#');
                var name = matches[0];
                var id = matches[1];
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
                var matches = selector.split('\.');
                var name = matches[0];
                var className = matches[1];
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
         * @identity {String} The original selector rule;
         * @finder {String} The category of the selector;
         **/

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
         * @selector {String} A CSS selector;
         **/

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
                }
                else if (match[1]) {
                    finder = 'name and id';
                }
                else if (match[15]) {
                    finder = 'class';
                }
                else if (match[20]) {
                    finder = 'name and class';
                }
                else if (match[29]) {
                    finder = 'name';
                }

                this.tokens.push(new Token(match[0], finder));
            }
            return this.tokens;
        };

        /**
         * Uses an array of tokens to perform DOM operations.
         *
         * @root {HTMLNode} The starting DOM node;
         * @tokens {Array} An array containing tokens;
         *
         **/

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
            var i, element;
            var elements = this.find(this.key_selector);
            var results = [];

            // Each element that matches the key selector is used as a 
            // starting point. Its ancestors are analysed to see 
            // if they match all of the selector’s rules.
            for (i = 0; i < elements.length; i++) {
                element = elements[i];
                if (this.tokens.length > 0) {
                    if (this.matchesAllRules(element.parentNode)) {
                        results.push(element);
                    }
                }
                else {
                    if (this.matchesToken(element, this.key_selector)) {
                        results.push(element);
                    }
                }
            }
            return results;
        };

        var lexer = new Tokenizer(selector);

        // Exposing lexer for testing purposes
        Tiramisu.prototype.tokenize = new Tokenizer(selector);
        var parser = new Searcher(document, lexer.tokens);
        return parser.parse();
    };
})(window);
