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
 *     t.json.parse('{ "age" : {"today": 24 }, "name" : "leo" }', function (key, value) {
 *         if (value && typeof value === 'object') {
 *             return value;
 *         }
 *         var text = value + "_tiramisu";
 *         return text;
 *     })
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