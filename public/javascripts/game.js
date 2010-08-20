function GridGenerator(width, height){
	var	result = new Array(height);
	for(var	j, i = 0; i < height; i++) {
		result[i] = new Array(width);
		for(j = 0; j < width; j++)
			result[i][j] = 0
	};
	return result;
};

var currentSoldiers = [];
var frameNum = 0;
var currentAction;

var frameFunction = function(){
	frameNum ++;
	spritesProgress();
	mygrid.public_draw();
}

sprites_img = new Image(); 

var start = function(){
	playing = true;
	globalInterval = setInterval(frameFunction, 60);
}

$().ready(function(){	
	grid = GridGenerator(50, 30);		
	mygrid = new Grid('canvas', grid);
	
	sprites_img.src = 'soldier.png';
	sprites_img.onload = function(){
		mygrid.public_draw();
		start()
	}
	
	addSoldier(200, 300);
});

var addSoldier = function(x, y){
	var s = new Soldier(x, y);
	attrs = {
		 name: 'lightInfantry',
		 speed: 2,
		 health: 30,
		 bounty: 1,
		 type: Soldier,
		 spriteX: 0
	}
	for (i in attrs) {
		s[i] = attrs[i]
	};
	addSprite('s', s)
}
var checkSoldiersWithinSelection = function(x1, y1, x, y){
	for (var i=0; i < spritesArray.length; i++) {
		u = spritesArray[i]
		if ( Math.abs(u.cX - x) < 20 && Math.abs(u.cY - y) < 20 ){
			return u
		}
	};
	return false;
}
var checkSoldierAtLocation = function(x, y){
	var soldiers = []
	for (var i=0; i < spritesArray.length; i++) {
		u = spritesArray[i]
		if ( Math.abs(u.cX - x) < 20 && Math.abs(u.cY - y) < 20 ){
			soldiers.push(u)
		}
	};
	return soldiers;
}


showActionsForSoldier = function(s){
	$('#tools').empty()
	for (i in s.actions){
		var button = $('<a href="#"></a>').text(s.actions[i])
		button.data('foo', s.actions[i])
		button.click(function(){
			setCurrentAction($(this).data('foo'))
		})
		$('#tools').append(button)
	}
}

var setCurrentAction = function(){
	
}
var spritesProgress = function(){
	// aim the turrets and fire if possible
	for(var i =0; i < spritesArray.length; i++){
		if (spritesArray[i].enterFrame){ 
			spritesArray[i].enterFrame();
		}
	}
}
