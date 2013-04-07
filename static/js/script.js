t.get(document).ready(function() {
    
    var customize = customize || {};
    
    t.ajax({
        url: "static/tiramisu.json",
        async: false,
        success: function(data) {
            customize = JSON.parse(data);
        }
    });
    
    function refreshSize() {
        var minified = (function() {
            var arr = [];
            
            t.get('input[type="checkbox"]:checked').each(function() { 
                arr.push(this.value); 
            });
            
            return arr;
        })().sort().join('');
        
        t.get('#custom_size').html(customize['custom_size'][customize['custom'][minified]]);
        //t.get('#custom_download').attr('href', '/static/js/tiramisu/min/tiramisu-' + customize['custom'][minified] + '-min.js.tar.gz');
        t.get('#custom_download').attr('href', '/static/js/tiramisu/min/tiramisu-' + customize['custom'][minified] + '.js');
    }
    
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
        refreshSize();
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
    refreshSize();
});