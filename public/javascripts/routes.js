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

function drawNewUnits(level){
	$('#newUnitsContainer').empty();
	if (level.newUnits.length > 0){
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
};

function renderWeaponList(){
	$('#weaponList').html('yur weapons');
};

var sprites_img;
function showBigNotice(id){
	$('#big_notice').show();
  $('.mMenu').hide();
	$(id).show();
};

function checkStarted(s){
	if(!myGame.started){
		s.redirect('#/')
		return false
	} else {
		return true;
	}
};
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
		  if ( myGame && myGame.started){
				$('#menu .resume').show();
		  } else {
				$('#menu .resume').hide();
		  }
    });
    
    this.get('#/instructions', function() {
      hideMenus();
      $('#instructions').show();
			$('#instructions #backBtn').attr('href','#/' +(this.params.back || ''))
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
    
    this.get('#/weapons', function() {
			hideMenus();
    	$('#weapons').show();
			renderWeaponList();
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
				if (i <= userGame.maxLevel){
			 		$('#levelList').append('<li><a class="button" href="#/start/'+i+'">Level '+(i+1)+'</a></li>');
				} else {
					$('#levelList').append('<li><a class="button">?</a></li>');
				}
			};
    });

    this.get('#/start/:level', function() {
			var level = levels[this.params.level];
	  	myGame = new Game(level);
			myGame.startGame();
			showBigNotice('#start_menu');
			this.redirect('#/game_menu');
    });

    this.get('#/level/complete', function() {
			var nextLevel = levelManager.progressLevel( myGame.getCurrentLevel() );
			// extract the level out of it and establish where to go from here
      hideMenus();
			$('#winMenu').show();
			// todo - check the level id
			if (levelManager.maxLevelID == levels.length){
				alert('you\'ve finished')
			} else if(nextLevel) {				
				$('#levelNum').text(nextLevel.name);
				$('.levelStart').attr('href', '#/start/'+nextLevel.id);
	  		drawNewUnits(nextLevel);
			}
			this.redirect('#/');
    });

  });
  
  sprites_img = new Image(); 
  sprites_img.src = 'soldier.png';
	sprites_img.onload = function(){
    app.run('#/');
	}
});

