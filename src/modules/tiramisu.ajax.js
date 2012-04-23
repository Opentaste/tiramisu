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
 * Example #9 (Ajax set data_format)
 * --------------------------------------------------------------
 *
 *     tiramisu.ajax({
 *        data_format: 'json',
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
    // The number of cups of coffee is identified for each module.
    var ingredients = [2, 7],
        cups_of_coffee = 4;

    var setting_input = setting_input || {},
        setting = {
            abort: false,
            async: true,
            content_type: '',
            connection: '',
            data_format: '',
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
        get_params = '',
        state = 0,
        response = '';

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

    // extend object
    for (var prop in setting_input) {
        setting[prop] = setting_input[prop];
    }

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
        state = xhr.readyState;

        if (state == 4) {
            // success!
            if (xhr.responseText) {
                // ~
                if (setting.data_format == 'json') {
                    response = t.json.decode(xhr.responseText);
                } else {
                    response = xhr.responseText;
                }

                // ~
                if (setting.successHTML) {
                    if (typeof(setting.successHTML) === 'string') {
                        t.d.getElementById(setting.successHTML).innerHTML = response;
                    } else if (typeof(setting.successHTML) === 'object') {
                        if (typeof(setting.successHTML.html) === 'function') {
                            setting.successHTML.html(response);
                        } else {
                            setting.successHTML.innerHTML = response;
                        }
                    }
                }

                setting.end_load();
                setting.success(response);


            } else if (state == 4 && xhr.status == 400) {
                // 400 Bad Request
                setting.end_load();
                setting.error('400 Bad Request');

            } else if (state == 4 && xhr.status != 200) {
                // fetched the wrong page or network error...
                setting.end_load();
                setting.error('Fetched the wrong page or network error');
            }

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
        // The mime type of the body of the request (used with POST and PUT requests)
        // Content-Type: application/x-www-form-urlencoded
        // http://en.wikipedia.org/wiki/Mime_type
        if (setting.data_format == 'json') {
            // JavaScript Object Notation JSON; Defined in RFC 4627
            setting.content_type = 'application/json; charset=UTF-8';
        }
        xhr.setRequestHeader('Content-type', setting.content_type);
    }
    if (setting.connection) {
        // What type of connection the user-agent would prefer
        // Connection: close
        xhr.setRequestHeader('Connection', setting.connection);
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
