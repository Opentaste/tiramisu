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