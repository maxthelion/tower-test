var myGame;


var createCompatibleCanvas = function(id, width, height){
  var canvas = document.createElement('canvas');
  canvas.setAttribute('id', id);
  canvas.setAttribute('class', 'canvasIcon');
  canvas.setAttribute('height', height);
  canvas.setAttribute('width', width);
  return canvas;
}

function spriteCanvas(sprite, size){
 	canvas = createCompatibleCanvas('foof', size, size);
	var ctx = canvas.getContext('2d');
	cw = 20
	ch = 20
	x = 10
	y = 10
	ctx.drawImage(sprites_img, sprite.spriteX, 0, cw, ch, x - cw/2, y - cw/2, size, size)
	return canvas;
}
function drawNewUnits(){
	$('#newUnitsContainer').empty();
	if (levels[myGame.getCurrentLevel()].newUnits.length > 0){
		var level = levels[myGame.getCurrentLevel()];
		$('#newUnitsContainer').append('<h3>New units available!</h3>')
		for (var i=0; i < level.newUnits.length; i++) {
			var unit = unitTypes[ level.newUnits[i] ];
			var e = $('#newUnitTemplate').clone();
			e.find('.unitName').text(unit.name);
			e.find('.unitIcon').html( spriteCanvas( unit, 100 ) );
			e.find('.info').html( unit.name );
			$('#newUnitsContainer').append(e);
		};
	};
}
var sprites_img;
function showBigNotice(id){
	$('#big_notice').show();
  $('.mMenu').hide();
	$(id).show();
}
function checkStarted(s){
	if(!myGame.started){
		s.redirect('#/')
		return false
	} else {
		return true;
	}
}
$().ready(function(){	
    $.sammy.raise_errors = true;
    var app = $.sammy(function() {

      this.raise_errors = true;
    
    var hideMenus = function(){
      $('.tab').hide();
    }
    
    this.get('#/', function() {
      hideMenus();
      $('#menu').show();
		  if (myGame.started){
				$('#menu .resume').show();
		  } else {
				$('#menu .resume').hide();
		  }
    });

    this.get('#/start', function() {
			showBigNotice('#start_menu');
			this.redirect('#/game_menu');
    });
    
    this.get('#/instructions', function() {
      hideMenus();
      $('#instructions').show();
    });
    
    this.get('#/play', function() {
			if (!myGame.started) {
				this.redirect('#/')
			}else {
      	hideMenus();
      	$('#game').show();
      	$('#big_notice').hide();
      	myGame.play();
			}
    });
    
    this.get('#/restart', function() {
			myGame.startGame();
      this.redirect('#/play');
    });
    
    this.get('#/pause', function() {
		  if (!myGame.started) {
				this.redirect('#/')
			} else {
      	myGame.pause();
      	showBigNotice('#pause_menu');
				this.redirect('#/game_menu');
			}
    });

		this.get('#/game_menu', function(){
			if(!myGame.started){
				this.redirect('#/')
				return false
			}
			hideMenus();
      $('#game').show();
		})

    this.get('#/death', function() {
			showBigNotice('#death_menu');
			this.redirect('#/game_menu');
    });
    
    this.get('#/levels', function() {
      hideMenus();
      $('#levels').show();
			$('#levelList').empty();
			for (var i=0; i < levels.length; i++) {
			 	$('#levelList').append('<li><a class="button" href="#/start/'+i+'">Level '+(i+1)+'</a></li>');
			};
    });

    this.get('#/start/:level', function() {
	  	myGame.setLevel(this.params.level)
			showBigNotice('#start_menu');
			this.redirect('#/game_menu');
    });

    this.get('#/level/:level/complete', function() {
      hideMenus();
			$('#winMenu').show();
			$('#levelNum').text(myGame.getCurrentLevel() + 1);
			$('.levelStart').attr('href', '#/start/'+myGame.getCurrentLevel());
			if (myGame.getCurrentLevel() == levels.length){
			  this.redirect('#/')
			} else {
	  		drawNewUnits();
			}
    });

  });
  
  sprites_img = new Image(); 
  sprites_img.src = 'soldier.png';
	sprites_img.onload = function(){
		myGame = new Game(0);
    app.run('#/');
	}
});

