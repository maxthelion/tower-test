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
	$("#levelSubmit").attr('action', '/level/'+ levelID);
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
	drawGunMenu();
	drawWaveMenu();
  drawTerrainMenu();
}

var drawTerrainMenu = function(){
  $('#terrainSelect').empty();
	var currentTerrainSelector = {
		array: thisLevel.terrain,
		spriteX: 140
	}
	var button = function(text, array, spriteX){
		var li = $('<li>')
		var terrainButton = $('<a>', {href: '#',text: text}).click(function(){
			$('#terrainSelect .selected').removeClass('selected')
			$(this).addClass('selected')
		  currentTerrainSelector.array = array;
			currentTerrainSelector.spriteX = spriteX;
			return false;
		})
		terrainButton.append(spriteCanvas( {spriteX: spriteX}, 20));
		li.html(terrainButton);
		$('#terrainSelect').append( li );
	}
	button('terrain', thisLevel.terrain, 140);
	button('unbuildables', thisLevel.unbuildables, 320);
	button('start points', thisLevel.startPoints, 180);
	button('end point', thisLevel.startPoints, 160);
	$('#customcanvas').click(function(evt){
		var xIndex = MF( evt.offsetX/gridManager.cellWidth )
		var yIndex = MF( evt.offsetY/gridManager.cellHeight)
		if (gridManager.squareAvaliable(xIndex, yIndex)){
			currentTerrainSelector.array.push([xIndex, yIndex]);
			gridManager.addSpriteFromPoints(xIndex, yIndex, currentTerrainSelector.spriteX);
			gridManager.occupy(xIndex, yIndex);
			$('#custom_code').val(JSON.stringify(thisLevel))
		} else {
			console.log('occupied')
		}
		canvasManager.public_draw();
		return false;
	});
}

var drawWaveMenu = function(){
	$('#waveSelect').empty();
	for (var i=0; i < thisLevel.waves.length; i++) {
	  var wave = thisLevel.waves[i]
	  var li = $('<li>')
	  li.append('<span>'+wave[0][2]+'</span> x ')
	  li.append( spriteCanvas( soldierTypes[wave[0][0]], 20));
	 	$('#waveSelect').append(li)
	};
}

var drawGunMenu = function(){
	var gunButton = function(gun, i, callback){
		var btn = $('<a>').text(gun.name).data('id', i).click(callback)
		btn.append( spriteCanvas( gun, 20) )
		return btn; 
	}
	
	$('#availableGunSelect').empty();
	for (var i=0; i < thisLevel.availableUnitIds.length; i++) {
		var li = $('<li>').append(gunButton(unitTypes[thisLevel.availableUnitIds[i]], i, function(){
			thisLevel.availableUnitIds.splice(thisLevel.availableUnitIds.indexOf($(this).data('id')), 1)
			drawGunMenu();
			$('#custom_code').val(JSON.stringify(thisLevel))
			return false;
		}));
	 	$('#availableGunSelect').append(li);
	};
	$('#allGunSelect').empty();
	for (i in unitTypes) {
		if (thisLevel.availableUnitIds.indexOf(i) == -1){
			var li = $('<li>').append(gunButton(unitTypes[i], i, function(){
				thisLevel.availableUnitIds.push(1*$(this).data('id'));
				drawGunMenu();
				$('#custom_code').val(JSON.stringify(thisLevel))
				return false;
			}));
			$('#allGunSelect').append(li);
		}
	};
}