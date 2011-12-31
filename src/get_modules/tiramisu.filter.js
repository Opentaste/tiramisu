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
    if (results[0] === undefined) {
        return '';
    }

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