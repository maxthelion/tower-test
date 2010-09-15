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
  var app = $.sammy(function() {

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
    
    this.get('#/customise', function(){
      hideMenus();
      addLevelSelect()
      $('#customise').show();
      $('#levelPane').hide();
    });
    
    this.get('#/levels/:id/customise', function(){
      hideMenus();
      addLevelSelect();
      setLevel(this.params.id);
      $('#levelPane').show();
      $('#customise').show();
    });
    
    this.get('#/levels/:id/customise/terrainPaneScreen', function(){
      hideMenus();
      addLevelSelect();
      setLevel(this.params.id);
      $('#levelPane').show();
      $('.pane').hide();
      $('#terrainPane').show();
      $('#customise').show();
    });
    
    this.get('#/levels/:id/customise/gunsPaneScreen', function(){
      hideMenus();
      addLevelSelect();
      setLevel(this.params.id);
      $('#levelPane').show();
      $('.pane').hide();
      $('#gunsPane').show();
      $('#customise').show();
    });
    
    this.get('#/levels/:id/customise/wavePaneScreen', function(){
      hideMenus();
      addLevelSelect();
      setLevel(this.params.id);
      $('#levelPane').show();
      $('.pane').hide();
      $('#wavePane').show();
      $('#customise').show();
    });

  });
  
  sprites_img = new Image(); 
  sprites_img.src = 'soldier.png';
	sprites_img.onload = function(){
		myGame = new Game(0);
    app.run('#/');
	}
});

var addLevelSelect = function(){
  $('#level_selector').empty();
  for (var i=0; i < levels.length; i++) {
    levels[i]
    $('#level_selector').append('<option name="'+i+'">'+i+'</option>')
  };
  $('#level_selector').change(function(){
    window.location = '#/levels/'+$(this).val()+'/customise'
  })
}

var setLevel = function(levelID){
  thisLevel = levels[levelID]
  initSprites();
  $('#levelPane h3').click(function(){
    window.location = '#/levels/'+levelID+'/customise/'+$(this).attr('id')
  })
  var canvas = document.getElementById('customcanvas')
  gridManager = new GridManager(400, 400);
	gridManager.addBases(thisLevel.startPoints, thisLevel.endPoint);
	gridManager.generateTerrain(thisLevel.terrain);
	gridManager.addUnbuildables(thisLevel.unbuildables)
  canvasManager = new CanvasManager(canvas, gridManager);
  canvasManager.public_draw();
	$('#custom_code').val(JSON.stringify(thisLevel))
	$('#availableGunSelect').empty();
	for (var i=0; i < thisLevel.availableUnits.length; i++) {
	 	$('#availableGunSelect').append('<li>'+thisLevel.availableUnits[i].name +'</li>');
	};
	$('#waveSelect').empty();
	for (var i=0; i < thisLevel.waves.length; i++) {
	  var wave = thisLevel.waves[i]
	  var li = $('<li>')
	  li.append('<span>'+wave[0][2]+'</span> x ')
	  li.append( spriteCanvas( mSM.templateFromId(wave[0][0]), 20));
	 	$('#waveSelect').append(li)
	};
	$('#customcanvas').click(function(evt){
		var xIndex = MF( evt.offsetX/gridManager.cellWidth )
		var yIndex = MF( evt.offsetY/gridManager.cellHeight)
		if (gridManager.squareAvaliable(xIndex, yIndex)){
			thisLevel.terrain.push([xIndex, yIndex]);
			gridManager.addSpriteFromPoints(xIndex, yIndex, 140);
			gridManager.occupy(xIndex, yIndex);
			$('#custom_code').val(JSON.stringify(thisLevel))
		}
		canvasManager.public_draw();
	});
	$('#terrainSelect').empty();
	var terrainButton = $('<li>').text('terrain').click(function(){
	  console.log('terrain')
	})
	$('#terrainSelect').append(terrainButton)
	var bogButton = $('<li>').text('bog').click(function(){
	  console.log('bog')
	})
	$('#terrainSelect').append(bogButton)
}