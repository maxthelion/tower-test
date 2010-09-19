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
  thisLevel = levels[levelID];
	$("#levelSubmit").attr('action', '/level/'+ levelID);
  initSprites();
  var canvas = document.getElementById('customcanvas')
  gridManager = new GridManager(400, 400);
	gridManager.addBases(thisLevel.startPoints, thisLevel.endPoint);
	gridManager.generateTerrain(thisLevel.terrain);
	gridManager.addUnbuildables(thisLevel.unbuildables)
	canvasManager = new CanvasManager(canvas, gridManager);
	canvasManager.public_draw();
	$('#custom_code').val(JSON.stringify(thisLevel))
	drawGunMenu(thisLevel);
	drawWaveMenu(levelID);
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
		var terrainButton = $('<a>', {href: '#'}).click(function(){
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
	button('end point', thisLevel.endPoint, 160);
	$('#customcanvas').click(function(evt){
		var xIndex = MF( evt.offsetX/gridManager.cellWidth )
		var yIndex = MF( evt.offsetY/gridManager.cellHeight)
		
		if (gridManager.squareAvaliable(xIndex, yIndex)){
			if (currentTerrainSelector.array == thisLevel.endPoint){
				currentTerrainSelector.array = thisLevel.endPoint = [xIndex, yIndex];
				gridManager.setEndPoint(thisLevel.endPoint);
			} else {
				currentTerrainSelector.array.push([xIndex, yIndex]);
				gridManager.addSpriteFromPoints(xIndex, yIndex, currentTerrainSelector.spriteX);
			}
			gridManager.occupy(xIndex, yIndex);
			$('#custom_code').val(JSON.stringify(thisLevel))
		} else {
			removeDataAt(xIndex, yIndex, thisLevel)
			gridManager.clearCell(xIndex, yIndex);
		}
		canvasManager.public_draw();
		return false;
	});
}

var removeDataAt = function(x, y, thisLevel){
	for(i in thisLevel.terrain){
		if (thisLevel.terrain[i][0] == x && thisLevel.terrain[i][1] == y){
			thisLevel.terrain.splice(i, 1);
		}
	}
	for(i in thisLevel.unbuildables){
		if (thisLevel.unbuildables[i][0] == x && thisLevel.unbuildables[i][1] == y){
			thisLevel.unbuildables.splice(i, 1);
		}
	}
	for(i in thisLevel.startPoints){
		if (thisLevel.startPoints[i][0] == x && thisLevel.startPoints[i][1] == y){
			thisLevel.startPoints.splice(i, 1);
		}
	}
	if (thisLevel.endPoint && thisLevel.endPoint[0] == x && thisLevel.endPoint[1] == y){
		thisLevel.endPoint = null;
	}
	$('#custom_code').val(JSON.stringify(thisLevel))
}
var drawWaveMenu = function(levelID){
	drawWaves(thisLevel)
	$('#waveEdit').attr('action',  '#/levels/'+levelID+'/waves')
	$('#waveEdit').attr('method',  'post')
	$('#unitNumber').val(9)
	$('#unitFrequency').val(20)
	$('#unitSelect').empty();
	for (i in soldierTypes){
		$('#unitSelect').append($('<option>', {value: i, text: soldierTypes[i].name} ));
	}
}
var drawWaves = function(thisLevel){
	$('#waveSelect').empty();
	if(thisLevel.waves.length > 0 ){
		for (var i=0; i < thisLevel.waves.length; i++) {
		  var wave = thisLevel.waves[i]
		  var li = $('<li>')
		  li.append('<span>'+wave[0][2]+'</span> x ')
			li.data("id", i);
		  li.append( spriteCanvas( soldierTypes[wave[0][0]], 20));
			li.click(function(){
				thisLevel.waves.splice($(this).data('id'), 1);
				drawWaves(thisLevel);
				generateCode(thisLevel);
				return false;
			})
		 	$('#waveSelect').append(li)
		};
	};
}

var generateCode = function(thisLevel){
	$('#custom_code').val(JSON.stringify(thisLevel));
}
var drawGunMenu = function(thisLevel){
	var gunButton = function(gun, i, callback){
		var btn = $('<a>', {href: "#", title: gun.name}).data('id', i).click(callback)
		btn.append( spriteCanvas( gun, 20) )
		return btn; 
	}
	
	$('#availableGunSelect').empty();
	var au = thisLevel.availableUnitIds;
	for (var i=0; i < au.length; i++) {
		var id = au[i];
		var li = $('<li>').append(gunButton(unitTypes[au[i]], id, function(){
			au.splice(au.indexOf($(this).data('id')), 1)
			drawGunMenu(thisLevel);
			$('#custom_code').val(JSON.stringify(thisLevel))
			return false;
		}));
	 	$('#availableGunSelect').append(li);
	};
	$('#allGunSelect').empty();
	for (i in unitTypes) {
		if (au.indexOf(i*1) == -1){
			var li = $('<li>').append(gunButton(unitTypes[i], i, function(){
				au.push(1*$(this).data('id'));
				drawGunMenu(thisLevel);
				$('#custom_code').val(JSON.stringify(thisLevel))
				return false;
			}));
			$('#allGunSelect').append(li);
		}
	};
}