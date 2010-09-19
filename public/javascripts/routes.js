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
var sprites_img;
$().ready(function(){	
    $.sammy.raise_errors = true;
    var app = $.sammy(function() {

      this.raise_errors = true;
    
    var hideMenus = function(){
      $('.tab').hide();
    }
    
    this.get('#/', function() {
      myGame.pause();
      hideMenus();
      $('#menu').show();
		  if (myGame.started){
				$('#menu .resume').show();
		  } else {
				$('#menu .resume').hide();
		  }
    });

    this.get('#/start', function() {
      hideMenus();
      $('#game').show();
      $('#big_notice').show();
      $('#pause_menu').hide();
      $('#death_menu').hide();
      $('#start_menu').show();
    });
    
    this.get('#/instructions', function() {
      hideMenus();
      myGame.pause();
      $('#instructions').show();
    });
    
    this.get('#/play', function() {
      hideMenus();
      $('.tab').hide();
      $('#game').show();
      $('#big_notice').hide();
      myGame.play();
    });
    
    this.get('#/restart', function() {
      hideMenus();
      $('.tab').hide();
      $('#game').show();
      $('#big_notice').hide();
      myGame.restart();
    });
    
    this.get('#/pause', function() {
      hideMenus();
      $('#game').show();
      myGame.pause();
      $('#big_notice').show();
      $('#pause_menu').show();
      $('#death_menu').hide();
      $('#start_menu').hide();
    });

    this.get('#/death', function() {
      hideMenus();
      $('#game').show();
      $('#big_notice').show();
      $('#pause_menu').hide();
      $('#death_menu').show();
      $('#start_menu').hide();
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
      hideMenus();
      $('#game').show();
      $('#big_notice').show();
      $('#pause_menu').hide();
      $('#start_menu').show();
      $('#death_menu').hide();
    });

    this.get('#/level/:level/complete', function() {
      hideMenus();
			$('#winMenu').show();
			$('#levelNum').text(myGame.getCurrentLevel());
			if (myGame.getCurrentLevel() == levels.length - 1){
			  this.redirect('#/')
			} else {
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
    });

  });
  
  sprites_img = new Image(); 
  sprites_img.src = 'soldier.png';
	sprites_img.onload = function(){
		myGame = new Game(0);
    app.run('#/');
	}
});

