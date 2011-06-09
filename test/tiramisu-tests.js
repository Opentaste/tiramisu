module('Generic tests');

test('Should pass', function() {
    ok( true, "Ok");
});

test('1 plus 2', function() {
    equal(1 + 2, 3, 'equals 3');
});

test('[1, 2, 3] + [4, 5, 6]', function() {
    var a = [1, 2, 3];
    var b = [4, 5, 6];
    var sum = function(a, b) {
        var i, c = [];
        for (i = 0; i < a.length; i++) {
            c[i] = a[i] + b[i];
        }
        return c;
    }
    deepEqual(sum(a, b), [5, 7, 9], '= [5, 7, 9]');
});

module('Selector Tests');

test('Selecting “#headline”', function() {
    var rs = tiramisu.get('#headline');
    ok(rs, 'Should not be empty');
    equal(rs[0].id, "headline", "Should have an element node with id “headline”");
    equal(rs[0].innerHTML, "Tiramisu Tests", "Should contain “Tiramisu Tests”");
});

test('Selecting “h3 .red”', function() {
    var rs = tiramisu.get('h3 .red');
    ok(rs, 'Should not be empty');
    equal(rs[0].className, "red", "Should have an element node with class “red”");
    equal(rs[0].innerHTML, "tiramisu", "Should contain “tiramisu”");
});

module('Browser detection tests');

test('Detect check', function() {
    var browser = tiramisu.detect('browser');
    ok(browser, 'Ok result : '+browser);
	//equal(tiramisu.detect('isChrome'), true, "We are into Chrome");
	//equal(tiramisu.detect('isFirefox'), true, "We are into Firefox");
	//equal(tiramisu.detect('isIE'), true, "We are into IE 'BOOOO'");
});
