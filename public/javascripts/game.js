function GridGenerator(width, height){
	var	result = new Array(height);
	for(var	j, i = 0; i < height; i++) {
		result[i] = new Array(width);
		for(j = 0; j < width; j++)
			result[i][j] = 0
	};
	return result;
};
MF = Math.floor
MR = Math.random


var frameNum = 0;
var mSM;
var Game = function(){
	var level = levels[0]
	var waves = level.waves
	var startPoints = level.startPoints
	var endPoint = level.endPoint;
	var availableUnits = level.availableUnits;
	var kills = 0;
	var grid;	
	var startLives = 20;
	var lives = startLives;
	var gridManager;
	var regularity = 20; // the speed that new soldiers appear
	var waveLength; // the length of a wave - eg how many soldiers per round
	var soldierCountDown = regularity;
	var waveCountDown;
	var round = 0;
	var money = 20;
	var currentTurretIndex = 0;
	var playing =	false;
	var gridManager;
	var myBase;
	var selectedUnit;
	var currentUnit = availableUnits[0]
	var canvasManager;

	this.incrementKills = function(bounty){			
		changeMoney(bounty);
		kills++;
		attemptToWinGame();
	};

	function changeMoney(amount){
		money += amount;
		drawTurretButtons();
	}

	var gameWon = function(){
		return round == waves.length && waveCountDown == 0 && !anySoldiers()
	}

	var attemptToWinGame = function(){
		if ( gameWon() ){
			$('#big_notice').show().html('<h2>YOU WIN!</h2>')
			playing = false;
		}
	}

	this.loseLife = function(){
		myBase.healthPercent = lives/startLives
		lives--;
		addExplosion(myBase.cX, myBase.cY, 1, frameNum, 0);
	}

	var frameFunction = function(){
		sounds = {}
		frameNum ++;
		checkDeath();
		spritesProgress();
		attemptToWinGame();
		$('#kills').text(kills)
		$('#money').text(money)
		if(playing){
			if(soldierCountDown == 0) {
				if (waveCountDown == 0) {
					if (!anySoldiers() && round <= waves.length){
						progressRound()
					}
				} else {
					waveCountDown--;
					mSM.createSoldier(typeIndex, startPoints[wave[3]], endPoint, gridManager);
					soldierCountDown = regularity;
				}
			} else {
				soldierCountDown--;
			}
		}
		canvasManager.public_draw();
	}

	var isDead = function(){
		return lives == 0;
	}
	var checkDeath = function(){
		if (isDead()){
			$('#big_notice').show().html('<h2>death to you, sucker!!! you are teh suck!!!</h2>');
			playing = false;
		}
	}

	var anySoldiers = function(){
		return mSM.allUnits(true, true).length > 0
	}

	sprites_img = new Image(); 

	var start = function(){
		progressRound()	
		playing = true;
		//	global interval
		globalInterval = setInterval(frameFunction, 60);
	}

	var progressRound = function(){
		round++;
		$('#notice').text('Round ' + round + ' of ' + waves.length );
		// mark the round number
		$('#round').text(round);
		wave = waves[round - 1];
		waveCountDown = wave[2];
		regularity = wave[1];
		typeIndex = wave[0];
	}
	
	var initialise = function(){
		mSM = new SoldierManager();
		grid = GridGenerator(15, 15);
		var canvas = document.getElementById('canvas')
		gridManager = new GridManager(grid, 400, 400);
		myBase = {
			cX: gridManager.pixelC(endPoint[0]), 
			cY: gridManager.pixelC(endPoint[1]), 
			spriteX: 160,
			healthPercent: 1,
			base: true
		}
		generateTerrain();
		canvasManager = new CanvasManager(canvas, grid, startPoints, endPoint, gridManager);
		drawTurretButtons();

		sprites_img.src = 'soldier.png';
		sprites_img.onload = function(){
			canvasManager.public_draw();
			$('#kills').text(kills)
			$('#money').text(money)	
		}

		addEvents()
	}
	
	var addEvents = function(){
		$('#start').click(function(){
			$('#big_notice').hide()
			start();
		});

		$('#pause_button').click(function(evt){
			clearInterval(globalInterval);
			playing = false;
			$('#big_notice').show().html('<h2>Game paused</h2><p>click to resume</p>').click(function(){
				globalInterval = setInterval(frameFunction, 60);
				playing = true;
				$('#pause_button').show();
				$('#big_notice').hide()
			});
			$('#pause_button').hide();
		})
		
		
		$(canvas).click(function(evt){
			if (playing == false){
				return false;
			}
			var xIndex = MF( evt.offsetX/gridManager.cellWidth )
			var yIndex = MF( evt.offsetY/gridManager.cellHeight)
			if (selectedUnit){
				$('#fC').remove()
				selectedUnit = undefined;
			} else if (gridManager.squareAvaliable(xIndex, yIndex) && !selectedUnit){
				addUnit(xIndex, yIndex);
			} else if (mUM.unitAt([xIndex, yIndex])){
				t = mUM.unitAt([xIndex, yIndex])
				highLight = null;
				showTurretControl(t);
				selectedUnit = t;
			}
			canvasManager.public_draw();
		});

		$(canvas).mousemove(function(evt){
			if (!selectedUnit && playing) {
				var xIndex = MF( evt.offsetX/gridManager.cellWidth )
				var yIndex = MF( evt.offsetY/gridManager.cellWidth )
				canvasManager.highLight = [xIndex, yIndex];
				canvasManager.hlp = gridManager.pointCenterXY(xIndex, yIndex)
			}
		});

		$(canvas).mouseout(function(evt){
			canvasManager.highLight = null;
		});
	}
	
	
	var drawTurretButtons = function(){
		$('#turret_choices').text('')
		for (var i=0; i < availableUnits.length; i++) {
			var t = availableUnits[i];
			var tbutton = $('<a href="#">').text(t['name'] + ' ($'+ t['cost']+')' )
			tbutton.attr('id', 'button_'+i);
			if (i == currentTurretIndex)
				tbutton.addClass('selected');
			if (money >= t['cost']){
				tbutton.addClass('allowed');
			} else {
				tbutton.addClass('not_allowed')
			}
			(function(i){
				tbutton.click(function(){
					setCurrentUnit(i)
	 			});
			})(i);
			$('#turret_choices').append(tbutton);
		};
	}

	var setCurrentUnit = function(i){
		currentTurretIndex = i;
		$('.selected').removeClass('selected');
		$('#button_'+ i).addClass('selected');
	}

	var spritesProgress = function(){
		// aim the turrets and fire if possible
		for(var i =0; i < spritesArray.length; i++){
			if (spritesArray[i].enterFrame){ 
				spritesArray[i].enterFrame();
			}
		}
	}
	
	var showTurretControl = function(t){
		$('#fC').remove()
		var elem = $('<div id="fC"></div>')
		$('#cW').append(elem)
		
		w = elem.width()
		h = elem.height()
		coords = [ t.cX  - (w/2), t.cY  - (h/2) ]
		elem.css('left', coords[0])
		elem.css('top', coords[1])
		// sellAmount = 2
		// upgradeBtn = $('<a>').attr({
		// 	href: '#',
		// 	id: 'upgradeBtn'
		// }).html('<span>^</span><span class="amount">'+sellAmount+'</span>')
		
		sellBtn = $('<a>').attr({
			href: '#',
			id: 'sellBtn'
		}).html('<span>$</span><span class="amount">'+t.sellCost()+'</span>').
		click(function(){
			mUM.sell(t);
			elem.remove();
			selectedUnit = undefined;
			return false;
		})
		
		//elem.append(upgradeBtn)
		elem.append(sellBtn)
	}
	
	var generateTerrain = function(){
		var k = 10;
		var terrain = [];
		while(k > 0){
			var t = [MF(Math.random() * 15), MF(Math.random() * 15)]
			if (	
				(t[0] == startPoints[0][0] && t[1] == startPoints[0][1]) ||
				(startPoints[1] && t[0] == startPoints[1][0] && t[1] == startPoints[1][1]) ||
						(t[0] == endPoint[0] && t[1] == endPoint[1])
				) {
				// console.log('clash')
			} else {
				terrain.push( t );
			}
			k--
		}
		//add terrain to grid
		for (var i=0; i < terrain.length; i++) {
		 grid[ terrain[i][1] ][terrain[i][0]] = 1;
		};
		
		for (var i=0; i < terrain.length; i++) {
			addSprite('tn', {cX: gridManager.pixelC(terrain[i][0]), cY: gridManager.pixelC(terrain[i][1]), spriteX: 140})
		};
		addSprite('b', myBase)
		for (var i=0; i < startPoints.length; i++) {
			var startPoint = startPoints[i];
			addSprite('b', {cX: gridManager.pixelC(startPoint[0]), cY: gridManager.pixelC(startPoint[1]), spriteX: 180})
		};
	}
	
	initialise();
	
	var revertGridPoint = function(x, y){
		grid[y][x] = 0;
	}
	
	var checkPaths = function(){
		for (var i=0; i < startPoints.length; i++) {
			// check the global path
			var result = AStar(grid, startPoints[i], endPoint, "Manhattan");
			if (result.length == 0){ // fail to connect
				revertGridPoint(x, y);
				return false
			};
		};
	}

	var addUnit = function(x, y){
		// check there is money
		if(money < currentUnit['cost'])
			return false
		// if (u['type'] == Explosion)
		// 	return mUM.createUnit(u, [x, y]);
		grid[y][x] = 1;
		if (checkPaths() == false){
			return false
		}
		//check for all the soldiers
		for (var i=0; i < mSM.allSoldiers().length; i++) {
			if (!mSM.allSoldiers()[i].regeneratePath()) {
				return revertGridPoint(x, y);
			}
		};
		mUM.createUnit(currentUnit, [x, y], gridManager);
		changeMoney( currentUnit['cost'] * -1 );
	}
}
var myGame;

$().ready(function(){	
	myGame = new Game(0);
});

