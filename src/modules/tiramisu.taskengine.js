/** 
 * Task Engine Module
 * ==================
 *
 * This module is used to perform a function at a particular amount of time
 * or perform the same function several times in that time frame.
 *
 * Usage
 * -----
 *
 *     tiramisu.task(delay, [interval], callback);
 *
 * where “interval” is an optional argument
 *
 *
 * Example #1 (The callback is executed after 2000 ms)
 * -----------------------------
 *
 *     tiramisu.task(2000, callback)
 *
 *
 * Example #2 (The callback is executed every 100 ms in a period of 2000ms)
 * -----------------------------------------------------
 *
 *     tiramisu.task(2000, 100, callback)
 *
 *
 * Example #3 (The callback is executed every 500 ms in loop.)
 * -----------------------------------------------------
 *
 *     tiramisu.task('loop', 500, callback)
 *
 *
 * @param {integer} delay The total task delay(ms)
 * @param {integer} [interval] The interval of the repetitions(ms)
 * @param {Function} cb The callback function
 */
tiramisu.modules.task = function(delay, cb) {

    // Each module within Tiramisu can to need inherit other modules.
    var ingredients = {
        dependencies: []
    }

    var interval, requestAnimFrame = t.requestAnimFrame;

    if (arguments.length > 2) {
        interval = arguments[1];
        cb = arguments[2];
    }

    var start = +new Date(),
        pass = interval;

    function animate() {
        var progress = +new Date() - start;

        if (interval !== undefined) {
            if (progress > pass) {
                pass += interval;
                cb();
            }
        }

        // The recursion continues only in two cases:
        // - The elapsed time is less than the total time;
        // - The total time is infinite (so a loop) but there 
        //   is an interval of time between repetitions of the callback.
        if (progress < delay || (delay == 'loop' && interval !== undefined)) {
            requestAnimFrame(animate);
        } else {
            if (interval === undefined) {
                cb();
            }
        }
    }
    animate();
};
