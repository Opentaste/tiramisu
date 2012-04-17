/** 
 * Framework Json Module
 * =====================
 *
 * This module is mainly used to 
 *
 * Usage
 * -----
 *
 *     tiramisu.json(my_json_text, reviver);
 *
 * .....
 *
 *
 * Example #1 (...)
 * -----------------------------
 *
 *     var json_object = tiramisu.json.parse(' ... ');
 *
 *
 * Example #2 (...)
 * -----------------------------
 *
 *     tiramisu.json.parse(text, function (key, value) {
 *         var type;
 *         if (value && typeof value === 'object') {
 *             type = value.type;
 *             if (typeof type === 'string' && typeof window[type] === 'function') {
 *                 return new (window[type])(value);
 *             }
 *         }
 *         return value;
 *     });
 *
 *
 * @api public
 */
tiramisu.modules.json =  {

    // Each module within Tiramisu can to need inherit other modules.
    // The number of cups of coffee is identified for each module.
    'ingredients': [2],
    'cups_of_coffee': 1,
     
    parse : function(my_json_text, reviver) {
        // JSON in JavaScript
        // by http://www.json.org/js.html
        try {
            return JSON.parse(my_json_text, reviver);
        } catch (e) {
            // Input is not a valid JSON, you can check it on http://jsonlint.com/
            return '';
        }
        
    }
};