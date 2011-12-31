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