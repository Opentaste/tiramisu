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
        dependencies: []
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

        'color': function() {
            if (this.isIEolder()) {
                return false;
            }
            return true;
        }
    };
    return tests[key]();
};
