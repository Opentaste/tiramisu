/** 
 * 
 * Tiramisu Unit Tests 
 * ~~~~~~~~~~~~~~~~~~~
 *
 * Use the online version for working AJAX tests:
 * http://dl.dropbox.com/u/2060843/tiramisu/test/runtests.html
 *
 **/

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

test('Selecting #headline', function() {
    var rs = tiramisu.get('#headline');
    ok(rs, 'Should not be empty');
    equal(rs[0].id, "headline", "Should have an element node with id headline");
    equal(rs[0].innerHTML, "Tiramisu Tests", "Should contain Tiramisu Tests");
});

test('Selecting h3 .red', function() {
    var rs = tiramisu.get('h3 .red');
    ok(rs, 'Should not be empty');
    equal(rs[0].className, "red", "Should have an element node with class red");
    equal(rs[0].innerHTML, "tiramisu", "Should contain tiramisu");
});

test('Selecting p.underlined', function() {
    var rs = tiramisu.get('p.underlined');
    ok(rs, 'Should not be empty');
    equal(rs[0].className, "underlined", "Should have an element node with class underlined");
    equal(rs[0].nodeName, "P", "Should be a P node");
    equal(rs[0].innerHTML, "This text is underlined", "Should contain This text is underlined");
});

test('Selecting h1#headline', function() {
    var rs = tiramisu.get('h1#headline');
    ok(rs, 'Should not be empty');
    equal(rs[0].id, "headline", "Should have an element node with id headline");
    equal(rs[0].nodeName, "H1", "Should be an H1 node")
    equal(rs[0].innerHTML, "Tiramisu Tests", "Should contain Tiramisu Tests");
});

module('Browser detection tests');

test('Detect check', function() {
    var browser = tiramisu.detect('browser');
    ok(browser, 'Ok result : '+browser);
	//equal(tiramisu.detect('isChrome'), true, "We are into Chrome");
	//equal(tiramisu.detect('isFirefox'), true, "We are into Firefox");
	//equal(tiramisu.detect('isIE'), true, "We are into IE 'BOOOO'");
});

module('Selector list methods tests');

test('Calling t.get("h2").each(function() { this.innerHTML = "Test"; })', function() {
    var i;

    t.get('#qunit-fixture h2').each(function() {
        this.innerHTML = "Test";
    });

    var rs = t.get('#qunit-fixture h2');

    var all = true;
    for (i = 0; i < rs.length; i++) {
        if (rs[i].innerHTML !== "Test") { all = false; break; }
    }

    ok(all, "Should set all H2's content to Test");

});

test('Calling t.get("ul li").each(function() { return this.innerHTML; })', function() {
    t.get('ul#selector_test li').each(function() {
        t.get('#append-here')[0].innerHTML += this.innerHTML;
    });

    equal(t.get("#append-here")[0].innerHTML, '<p class=\"underlined\">This text is underlined</p>Another lineOki-Doki.');
});


test('Calling t.get("#qunit-fixture h2 .red").html()', function() {
    var rs = t.get('#qunit-fixture h2 .red').html();
    equal(rs, 'good', 'should return good');
});

test('Calling t.get("#qunit-fixture h2 .red").html("bad")', function() {
    t.get('#qunit-fixture h2 .red').html('bad');
    var rs = t.get('#qunit-fixture h2 .red').html();
    equal(rs, 'bad', 'should set element\'s HTML value to bad');
});

test('Calling t.get("#qunit-fixture select").value()', function() {
    var rs = t.get('#qunit-fixture select').value();
    equal(rs, 'First.', 'should return First.');
});

test('Calling t.get("#hola_id").value()', function() {
    var rs = t.get('#hola_id').value();
    equal(rs, 'hola', 'should return hola');
});

test('Calling t.get("#qunit-fixture select").value("Second.")', function() {
    t.get('#qunit-fixture select').value("Second.");
    var rs = t.get('#qunit-fixture select').value();
    equal(rs, 'Second.', 'should set element\'s HTML value to Second');
});

test('Calling t.get("#hola_id").focus()', function() {
    t.get('#hola_id').focus();
    rs = document.activeElement.id;
    equal(rs, 'hola_id', 'should return hola_id');
});

test('Element Index (Found)', function() {
    var el = t.get('#selector_test li')[2];
    var rs = t.get('#selector_test li').index(el);
    equal(rs, 2);
});

test('Element Index (Not Found)', function() {
    var rs = t.get('#selector_test li').index('<li>Does not exist</li>');
    equal(rs, -1);
});

module('DOM Manipulation tests');

test('Single after', function() {
    t.get('#after_test h1').after('<p>new</p>');
    var rs = t.get('#after_test')[0].innerHTML;
    var attended = '\n      <h1>Hello Tiramisu</h1><p>new</p>\n      <div class=\"inner\">ciao</div>\n      <div class=\"inner\">mondo</div>\n    ';
    equal(rs, attended);
});

test('Multiple after', function() {
    t.get('#after_test .inner').after('<p>ciccio</p>')
    var rs = t.get('#after_test')[0].innerHTML;
    var attended = '\n      <h1>Hello Tiramisu</h1>\n      <div class=\"inner\">ciao</div><p>ciccio</p>\n      <div class=\"inner\">mondo</div><p>ciccio</p>\n    ';
    equal(rs, attended);
});

test('Single before', function() {
    t.get('#after_test h1').before('<p>new</p>');
    var rs = t.get('#after_test')[0].innerHTML;
    var attended = '\n      <p>new</p><h1>Hello Tiramisu</h1>\n      <div class=\"inner\">ciao</div>\n      <div class=\"inner\">mondo</div>\n    ';
    equal(rs, attended);
});

test('Multiple before', function() {
    t.get('#after_test .inner').before('<p>ciccio</p>')
    var rs = t.get('#after_test')[0].innerHTML;
    var attended = '\n      <h1>Hello Tiramisu</h1>\n      <p>ciccio</p><div class=\"inner\">ciao</div>\n      <p>ciccio</p><div class=\"inner\">mondo</div>\n    ';
    equal(rs, attended);
});

test('Single append', function() {
    t.get('#append_test').append('<li>Three</li>')
    var rs = t.get('#append_test')[0].innerHTML;
    var attended = '\n      <li>One</li>\n      <li>Two</li>\n    <li>Three</li>'
    equal(rs, attended);
});

test('Multiple append', function() {
    t.get('#append_test2 li').append('<p>ciccio</p>')
    var rs = t.get('#append_test2')[0].innerHTML;
    var attended ='\n      <li><p>First</p><p>ciccio</p></li>\n      <li><p>First</p><p>ciccio</p></li>\n    ';
    equal(rs, attended);
});

test('Single prepend', function() {
    t.get('#append_test').prepend('<li>Zero</li>')
    var rs = t.get('#append_test')[0].innerHTML;
    var attended = '<li>Zero</li>\n      <li>One</li>\n      <li>Two</li>\n    '
    equal(rs, attended);
});

test('Multiple prepend', function() {
    t.get('#append_test2 li').prepend('<p>ciccio</p>')
    var rs = t.get('#append_test2')[0].innerHTML;
    var attended ='\n      <li><p>ciccio</p><p>First</p></li>\n      <li><p>ciccio</p><p>First</p></li>\n    ';
    equal(rs, attended);
});

test('Empty childrens (single element)', function() {
    t.get('#selector_test').empty();
    var rs1 = t.get('#selector_test')[0].innerHTML,
        rs2 = t.get('#selector_test li').length;

    equal(rs1, "");
    equal(rs2, 0);
});

test('Filter function using :even', function() {
    var rs = t.get('#selector_test li').filter(':even');

    equal(rs[0].innerHTML, '<p class=\"underlined\">This text is underlined</p>');
    equal(rs[1].innerHTML, 'Oki-Doki.');
    equal(rs.length, 2);
});

test('Filter function using :odd', function() {
    var rs = t.get('#selector_test li').filter(':odd');

    equal(rs[0].innerHTML, 'Another line');
    equal(rs.length, 1)
});

test('Empty childrens (multiple elements)', function() {
    t.get('#selector_test li').empty();
    var rs = t.get('#selector_test')[0].innerHTML;
    var attended = '\n      <li></li>\n      <li></li>\n      <li></li>\n    ';

    equal(rs, attended);
});

test('Destroy all element child (Example #1)', function() {
    t.get('#myList').destroy('.tasty')
    var rs = t.get('#myList')[0].innerHTML;
    var attended = '\n            <li>This is my </li>\n            <li>I love  chips!</li>\n        ';
    equal(rs, attended);
});

test('Destroy element and child (Example #2)', function() {
    t.get('#myList').destroy()
    var rs = t.get('#myDestroyList').html();
    var attended = '\n        \n    ';
    equal(rs, attended);
});

module('CSS Manipulation tests');

test('Setting the color of a node to #f6f6f6', function() {
    t.get('#headline').css({
        'color': '#f6f6f6'
    });

    equal(t.get('#headline')[0].style['color'], 'rgb(246, 246, 246)');
});

test('Setting the opacity of a node to 0.45', function() {
    t.get('#headline').css({
        'opacity': '0.45'
    });

    equal(t.get('#headline').css('opacity'), '0.45');
});

module('AJAX module tests');

asyncTest('Calling a basic AJAX GET', function() {
    var success = function(result) {
        ok(true);
        ok(result, "the result is not undefined/null");
        equal(result, '<p>Hello GET</p>\n');
        start();
    };

    var error = function(errorType, message) {
        ok(false, "error called");
        start();
    }

    expect(3);

    tiramisu.ajax({
        'method': 'GET',
        'url': 'data/async.html',
        'success': success,
        'error': error
    });
});

asyncTest('Calling a basic AJAX POST', function() {
    var success = function(result) {
        ok(true);
        ok(result, "the result is not undefined/null");
        equal(result, '<p>Hello GET</p>\n');
        start();
    };

    var error = function(errorType, message) {
        ok(false, "error called");
        start();
    }

    expect(3);

    tiramisu.ajax({
        'method': 'POST',
        'url': 'data/async.html',
        'success': success,
        'error': error
    });
});

module('Event tests');

test('Pressing any key on the keyboard', function() {
    var event = document.createEvent('HTMLEvents');
    event.initEvent('keydown', true, true);

    t.get(document).on('keydown', function() {
        t.get('#headline').html('A key was pressed.');
    });

    document.dispatchEvent(event);

    equal(t.get('#headline').html(), 'A key was pressed.');
});

module('Attribute tests');

test('Getting the attribute "id" of "#headline"', function() {
    var rs = t.get('#headline').attr('id');
    equals(rs, 'headline', 'should equal to "headline"');
});

test('Setting the attribute "id" of "#hola_id"', function() {
    t.get('#hola_id').attr('id', 'new_id');
    var rs = t.get('#new_id')[0].name;
    equals(rs, 'hola_name', 'should equal to "hola_name"');
});

test('Getting the attribute "class" of "#headline"', function() {
    var rs = t.get('#headline').attr('class');
    equals(rs, 'class_leo', 'should equal to "class_leo"');
});

test('Setting the attribute "class" of "#class_leo class_gianluca"', function() {
    t.get('#headline').attr('class', 'class_leo class_gianluca');
    var rs = t.get('#headline').attr('class');
    equals(rs, 'class_leo class_gianluca', 'should equal to "class_leo class_gianluca"');
});

test('Remove class of the element and child (Example #1)', function() {
    t.get('#tasty').removeClass('my_class_two');
    var rs = t.get('#tasty').attr('class');
    equals(rs, 'my_class', 'should equal to "my_class"');
});

test('Remove all class of the element and child (Example #2)', function() {
    t.get('#tasty').removeClass(':all');
    var rs = t.get('#tasty').attr('class');
    var one = t.get('#tasty_one').attr('class');
    var two = t.get('#tasty_two').attr('class');
    rs = rs + one + two
    equals(rs, '', 'should equal to ""');
});