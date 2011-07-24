/**
 *
 * Tiramisu - A JavaScript μFramework
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 * Copyright: (c) 2011 Owl Studios
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
     */
	function Tiramisu() {
		this.version = '0.0.5';
		this.d = document;
		this.requestAnimFrame = (function() {
			return window.requestAnimationFrame 
            || window.webkitRequestAnimationFrame 
            || window.mozRequestAnimationFrame 
            || window.oRequestAnimationFrame 
            || window.msRequestAnimationFrame 
            || function(callback, element) {
                   window.setTimeout(callback, 1000 / 60);
			};
		})();
	}

	// Exposing the framework
	window.tiramisu = new Tiramisu();

	// Extending object1 with object2's methods
	function extend(first, second) {
		for (var prop in second) {
			first[prop] = second[prop];
		}
	}

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
	Tiramisu.prototype.detect = function(key) {
		var nav_agent = navigator.userAgent,
		nav_name = navigator.appName,
		firefox = nav_agent.substring(nav_agent.indexOf('Firefox')),
		firefox_version = firefox.split('/')[1].split('.')[0],
		opera = nav_agent.substring(nav_agent.indexOf('Version')).split("/")[1];

		// Turns off querySelectorAll detection
		var USE_QSA = false;

		// Netscape includes Firefox, Safari or Chrome
		var tests = {

			'browser': function() {
				if (nav_name === 'Netscape') {
					if (firefox.split('/')[0] !== 'Firefox') { // Case 1 - Safari or Chrome
						return "safarichrome"
					} else {
						if (firefox_version === '4') { // Case 2 - Firefox 4
							return 'firefox4'
						}
						return 'firefox3'
					}
				} else if (nav_name == 'Opera') {
					if (opera.split('.')[1] > 49) { // Case 4 - Opera 10.5+
						return 'Opera10.5+'
					}
					return 'Opera10.4';
				} else if (/MSIE (\d+\.\d+);/.test(nav_agent)) { //test for MSIE x.x;
					var ie = new Number(RegExp.$1) // capture x.x portion and store as a number
					if (ie > 8) {
						return 'IE9+';
					} else if (ie === 8) {
						return 'IE8';
					}
					return 'IE_older';
				} else { // Case 6 - IE or other
					return 'IE';
				}
			},

			'isIE': function() {
				return this.browser() === 'IE9+' || this.browser() === 'IE8' || this.browser() === 'IE_older';
			},

			'isIEolder': function() {
				return this.browser() === 'IE8' || this.browser() === 'IE_older';
			},

			'isFirefox': function() {
				return this.browser() === "firefox3" || this.browser() === "firefox4"
			},

			'isChrome': function() {
				return this.browser() === 'safarichrome'
			},

			'querySelectorAll': function() {
				return (USE_QSA && typeof this.d.querySelectorAll !== 'undefined')
			},

			'opacity': function() {
				if (this.isIEolder()) {
					return false;
				}
				return true;
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
     *     $t(*SELECTOR*)
     *
     * where *SELECTOR* is a *valid* CSS selector (see examples below).
     *
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
	Tiramisu.prototype.get = window.$t = function(selector) {
		if (tiramisu.detect('querySelectorAll')) return this.d.querySelectorAll(selector);

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
		var parser = new Searcher(document, lexer.tokens),
		results = parser.parse();

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
             * --------------------------------------------------------
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
             * Event handler extension 
             * -----------------------
             *
             * **TODO:**
             *
             * - Write docs
             *
             * @param {event} evt An event listener
             * @param {function} cb The callback function to attach
             */
			'on': function(evt, cb) {
				var i;
				if (results[0].addEventListener) {
					for (i = 0; i < results.length; i++) {
						results[i].addEventListener(evt, cb, false);
					}
				}
				else if (results[0].attachEvent) {
					for (i = 0; i < results.length; i++) {
						results[i].attachEvent(evt, cb);
					}
				}
				return this;
			},
			/**
             * CSS handler extension
             * ---------------------
             *
             * **TODO:**
             *
             * - Write docs
             *
             *  @param {Object} obj An object containing CSS properties
             */
			'css': function(obj) {
				var i, key;
				for (i = 0; i < results.length; i++) {
					for (key in obj) {
						if (obj.hasOwnProperty(key)) {
							results[i].style.setProperty(key, obj[key], ''); // The third param is for firefox
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
				results[key] = methods[key];
			}
		})();
		return results;
	};

	/** 
     * Framework Ajax Module
     * =====================
     *
     * This module is mainly used to perform an Ajax request.
     *
	 *     tiramisu.ajax(settings);
     *
     *
     * Parameter settings
     * ------------------------
     *
	 * - async : Default true
	 * - content_type : In Post request default application/x-www-form-urlencoded
	 * - connection : 
	 * - error :
	 * - loader : 
	 * - method : Default GET
	 * - parameter : Default null
	 * - success : 
	 * - successHTML : 
	 * - url : 
	 *
     *
     * Example (Ajax request)
     * ------------------------
     *
     * - Example 1
     *
     *     tiramisu.ajax({ url : url });
     * 
     * - Example 2
     *
     *     tiramisu.ajax({ url : url,
	 *					   success : function (){ ... } });
     *         
     * - Example 3
     *
     *     tiramisu.ajax({ url : url,
	 *					   successHTML : 'list_ul' });
     *   
     * - Example 4
     *
     *     tiramisu.ajax({ method : 'POST',
     *					   loader : 'div_loader',
	 *					   successHTML : 'div_ul' });
     *
     * - Example 5
     *
     *     tiramisu.ajax({ method : 'POST',
     *					   loader : 'div_loader',
	 *					   parameter: {
	 *					   		param_1 : 'variable 1',
	 *							param_2 : 'variable 2'
	 *					   },
	 *					   url : url });
     *
     *
     * @param 
     * @returns 
     * @api public
     */
	Tiramisu.prototype.ajax = window.$t.ajax = function(setting_input) {
		var setting_input = setting_input || {},
            setting = {
				async: true,
				content_type: '',
				connection: '',
				error: '',
				loader: '',
                method: 'GET',
				parameter: null,
                success: function() {},
                successHTML: '',
				url: ''
            },
            xhr = null,
            parameter = null,
            parameter_count = 0;

		if (window.XMLHttpRequest) {
			xhr = new XMLHttpRequest();
		} else if (window.ActiveXObject) {
			xhr = new ActiveXObject("Microsoft.XMLHTTP");
		} else {
			console.log('Object Ajax Error!');
		}

		extend(setting, setting_input);

		if (tiramisu.detect('isIEolder')) {
			setting.method = 'POST';
		}
		// object "setting.parameter" I create a string with the parameters 
		// to be passed in request
		for (attrname in setting.parameter) {
			parameter += attrname + '=' + setting.parameter[attrname] + '&';
			parameter_count += 1;
		}
		if (parameter_count) {
			if (!setting.content_type) {
				setting.content_type = 'application/x-www-form-urlencoded';
			}
			setting.method = 'POST';
		}

		xhr.open(setting.method, setting.url, setting.async);

		if (setting.content_type) {
			xhr.setRequestHeader('Content-type', setting.content_type);
		}

		if (setting.connection) {
			xhr.setRequestHeader('Connection', setting.connection);
		}

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				if (setting.successHTML) {
					tiramisu.d.getElementById(setting.successHTML).innerHTML = xhr.responseText;
				} else {
					setting.success(xhr.responseText);
				}
			}
		};
		xhr.send(parameter);
		return this;
	};

	/** 
     * Task Engine Module
     * ==================
     *
     * **TODO:**
     *
     * - Write docs
     *
     * @param {integer} delay The total task delay(ms)
     * @param {integer} [interval] The interval of the repetitions(ms)
     * @param {Function} cb The callback function
     */
	Tiramisu.prototype['do'] = function(delay, cb) {
		// tiramisu.do(delay, [interval], callback) where “interval”
		// is an optional argument
		var interval;

		// Saving reference for nested function calling
		var requestAnimFrame = requestAnimFrame || this.requestAnimFrame;

		if (arguments.length > 2) {
			interval = arguments[1];
			cb = arguments[arguments.length - 1];
		}

		var start = + new Date(),
		pass = interval;

		function animate() {
			var progress = + new Date() - start;

			if (interval !== undefined) {
				if (progress > pass) {
					pass += interval;
					cb();
				}
			}

			if (progress < delay) {
				requestAnimFrame(animate);
			} else {
				if (interval === undefined) {
					cb();
				}
			}
		}
		animate();
	};
})(window);
