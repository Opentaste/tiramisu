(function() {
    function setCoffeeLevel() {
    	var numOfChecks = t.get('input[type="checkbox"]:checked').length;
    	var height = (32.5 * numOfChecks);

        t.get('#percent').html(Math.round(height / 1.95));

    	t.get('.coffee_level').css({
    		'height': height + 'px'
    	});
    }

  	t.get('input[type="checkbox"]').on('click', function() {
  		setCoffeeLevel();
  	});

  	t.get('.button.customize').on('click', function() {
  		var showDiv = function() {
            t.get('#arrow_1').css({
                'visibility': 'visible',
                'height': '339px'
            });

  			t.get('#customize').css({
  				'visibility': 'visible',
  				'height': '550px',
  				'padding': '50px'
  			});
  		};

  		var showForm = function() {
  			t.get('#customize .custom_left').css({
  				'opacity': 1
  			});
  		};

        var showArrow = function() {
            t.get('#arrow_2').css({
                'visibility': 'visible',
                'height': '187px'
            })
        }

  		t.task(100, showDiv);
  		t.task(400, showForm);
        t.task(600, showArrow);

  		return false;
	});

    setCoffeeLevel();
})();