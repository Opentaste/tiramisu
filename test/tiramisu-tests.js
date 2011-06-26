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

test('Selecting “p.underlined”', function() {
    var rs = tiramisu.get('p.underlined');
    ok(rs, 'Should not be empty');
    equal(rs[0].className, "underlined", "Should have an element node with class “underlined”");
    equal(rs[0].nodeName, "P", "Should be a P node");
    equal(rs[0].innerHTML, "This text is underlined", "Should contain “This text is underlined”");
});

test('Selecting “h1#headline”', function() {
    var rs = tiramisu.get('h1#headline');
    ok(rs, 'Should not be empty');
    equal(rs[0].id, "headline", "Should have an element node with id “headline”");
    equal(rs[0].nodeName, "H1", "Should be an H1 node")
    equal(rs[0].innerHTML, "Tiramisu Tests", "Should contain “Tiramisu Tests”");
});

module('Browser detection tests');

test('Detect check', function() {
    var browser = tiramisu.detect('browser');
    ok(browser, 'Ok result : '+browser);
	//equal(tiramisu.detect('isChrome'), true, "We are into Chrome");
	//equal(tiramisu.detect('isFirefox'), true, "We are into Firefox");
	//equal(tiramisu.detect('isIE'), true, "We are into IE 'BOOOO'");
});

module('Each tests');

test('Calling “$t("h2").each(function() { this.innerHTML = "Test"; });”', function() {
    var i;

    $t('#qunit-fixture h2').each(function() {
        this.innerHTML = "Test";
    });

    var rs = $t('#qunit-fixture h2');

    var all = true;
    for (i = 0; i < rs.length; i++) {
        if (rs[i].innerHTML !== "Test") { all = false; break; }
    }

    ok(all, "Should set all H2's content to “Test”");

});

test('Calling “$t("ul li").each(function() { return this.innerHTML; });”', function() {
    $t('ul li').each(function() {
        $t('#append-here')[0].innerHTML += this.innerHTML;
    });

    equal($t("#append-here")[0].innerHTML, '<p class=\"underlined\">This text is underlined</p>Another lineOki-Doki.');
});

module('CSS Manipulation tests');

test('Setting the color of a node to #f6f6f6', function() {
    $t('#headline').css({
        'color': '#f6f6f6'
    });

    equal($t('#headline')[0].style['color'], 'rgb(246, 246, 246)');
});
