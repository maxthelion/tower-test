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
var positionHash;

var Game = function(){
	var level = 0;
	var waves;
	var startPoints;
	var endPoint;
	var availableUnits;
	var kills;
	var grid;	
	var startLives;
	var lives;
	var gridManager;
	var regularity; // the speed that new soldiers appear
	var waveLength; // the length of a wave - eg how many soldiers per round
	var soldierCountDown;
	var waveCountDown;
	var round;
	var money;
	var playing;
	var gridManager;
	var myBase;
	var selectedUnit;
	var currentUnit;
	var canvasManager;
	var emergencePoint;
	sprites_img = new Image(); 
	
	var resumeBtn = function(){
	 	return $('<a href="#">Resume</a>').click(function(){
			globalInterval = setInterval(frameFunction, 60);
			playing = true;
			$('#pause_button').show();
			$('#big_notice').hide()
			return false;
		});
	}
	
	var restartBtn = function(){
		return $('<a href="#">Restart</a>').click(function(){
			restart();
			$('#pause_button').show();
			$('#big_notice').hide()
			return false;
		});
	}
	
	var progressLevelBtn = function(){
		return $('<a href="#">Next level</a>').click(function(){
			level++;
			restart();
			$('#pause_button').show();
			$('#big_notice').hide()
			return false;
		});
	}

	this.incrementKills = function(bounty){			
		changeMoney(bounty);
		kills++;
		attemptToWinGame();
	};

	function changeMoney(amount){
		money += amount;
		drawTurretButtons();
		if (canvasManager.highLight)
		  canvasManager.highLight.haloColor = (money < currentUnit.cost) ? '255, 0, 0' : '0, 255, 0';
	}

	var gameWon = function(){
		return round == waves.length && waveCountDown == 0 && !anySoldiers()
	}

	var attemptToWinGame = function(){
		if ( gameWon() ){
			$('#big_notice').show().html('<h2>YOU WIN!</h2>');
			$('#big_notice').append(progressLevelBtn());
			$('#big_notice').append(restartBtn());
			clearInterval(globalInterval);
			playing = false;
		}
	}

	this.loseLife = function(){
		myBase.healthpercent = lives/startLives
		lives--;
		addExplosion(myBase.cX, myBase.cY, gridManager.radiusFromRange( 1 ), frameNum, 0);
	}

	var frameFunction = function(){
		sounds = {}
		frameNum ++;
		checkDeath();
		spritesProgress();
		attemptToWinGame();
		$('#kills').text(kills)
		$('#money').text(money)
		renderTurretControl();
		if(playing){
			if(soldierCountDown == 0) {
				if (waveCountDown == 0) {
					if (!anySoldiers() && round <= waves.length){
						progressRound()
					}
				} else {
					waveCountDown--;
					mSM.createSoldier(typeIndex, emergencePoint, endPoint, gridManager);
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
			$('#big_notice').append(restartBtn());
			clearInterval(globalInterval);
			playing = false;
		}
	}

	var anySoldiers = function(){
		return mSM.allUnits(true, true).length > 0
	}

	var start = function(){
		progressRound()	
		playing = true;
		globalInterval = setInterval(frameFunction, 60);
	}
	
	var restart = function(){
		initialise();
		start();
	}

	var progressRound = function(){
		round++;
		$('#notice').text('Round ' + round + ' of ' + waves.length );
		// mark the round number
		$('#round').text(round);
		wave = waves[round - 1];
		waveCountDown = wave[0][2];
		regularity = wave[0][1];
		soldierCountDown = regularity;
		typeIndex = wave[0][0];
		emergencePoint = startPoints[wave[1]]
	}
	
	var initialise = function(){
		positionHash = {}
		var thisLevel = levels[level]
		waves = thisLevel.waves
		startPoints = thisLevel.startPoints
		endPoint = thisLevel.endPoint;
		availableUnits = thisLevel.availableUnits;
		kills = 0;
		startLives = 20;
		lives = startLives;
		round = 0;
		money = 20;
		currentUnit = availableUnits[0]
		initSprites();
		selectedUnit = undefined;
		mSM = new SoldierManager();
		grid = GridGenerator(15, 15);
		var canvas = document.getElementById('canvas')
		gridManager = new GridManager(grid, 400, 400);
		addBases();
		generateTerrain(thisLevel.terrain);
		canvasManager = new CanvasManager(canvas, grid, startPoints, endPoint, gridManager);
		canvasManager.highLight = null;
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
			$('#big_notice').show().html('<h2>Game paused</h2>')
			$('#big_notice').append(resumeBtn());
			$('#big_notice').append(restartBtn())
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
				return false;
			} else if (gridManager.squareAvaliable(xIndex, yIndex) && !selectedUnit){
				addUnit(xIndex, yIndex);
				selectedUnit = undefined;
			} else if (mUM.unitAt([xIndex, yIndex])){
				t = mUM.unitAt([xIndex, yIndex])
				highLight = null;
				selectedUnit = t;
			}
			canvasManager.public_draw();
		});

		$(canvas).mousemove(function(evt){
			if (!selectedUnit && playing) {
				var xIndex = MF( evt.offsetX/gridManager.cellWidth )
				var yIndex = MF( evt.offsetY/gridManager.cellWidth )
				var u = mUM.unitAt([xIndex, yIndex]);
				if (gridManager.squareAvaliable( xIndex, yIndex ) || u){
					canvasManager.highLight = {
						x: xIndex,
						y: yIndex,
						cX: gridManager.pointCenterXY(xIndex, yIndex)[0],
						cY: gridManager.pointCenterXY(xIndex, yIndex)[1]
					}
					if (u){
						canvasManager.highLight.haloColor = '255, 255, 0'
						canvasManager.highLight.range = gridManager.cellWidth / 2
					} else {
						canvasManager.highLight.unit = currentUnit,
						canvasManager.highLight.haloColor = (money < currentUnit['cost']) ? '255, 0, 0' : '0, 255, 0';
						canvasManager.highLight.range = gridManager.radiusFromRange(currentUnit.range)
					}
				} else {
					canvasManager.highLight = null
				}

			}
		});

		$(canvas).mouseout(function(evt){
			canvasManager.highLight = null;
		});
	}
	var canAfford = function(num){
	  return money >= num;
	}
	
	var drawTurretButtons = function(){
		$('#turret_choices').text('')
		for (var i=0; i < availableUnits.length; i++) {
			var t = availableUnits[i];
			var tbutton = $('<a href="#">').text(t.name + ' ($'+ t.cost+')' )
			tbutton.attr('id', 'button_'+t.name);
			if (t == currentUnit)
				tbutton.addClass('selected');
			if (money >= t['cost']){
				tbutton.addClass('allowed');
			} else {
				tbutton.addClass('not_allowed')
			}
			(function(t){
				tbutton.click(function(){
					setCurrentUnit(t)
	 			});
			})(t);
			$('#turret_choices').append(tbutton);
		};
	}

	var setCurrentUnit = function(t){
		currentUnit = t;
		$('.selected').removeClass('selected');
		$('#button_'+ t.name).addClass('selected');
	}

	var spritesProgress = function(){
		// aim the turrets and fire if possible
		for(var i =0; i < spritesArray.length; i++){
			if (spritesArray[i].enterFrame){ 
				spritesArray[i].enterFrame();
			}
		}
	}
	
	var elem;
	var renderTurretControl = function(){
	  if (selectedUnit && (!elem || elem.data('id') != selectedUnit.id)){
	    addTurretControl(selectedUnit);
	  } else if( !selectedUnit ) {
	    $('#fC').remove();
	  }
	}
	
	
	var addTurretControl = function(t){
	  $('#fC').remove();
		elem = $('<div id="fC"></div>');
		elem.data('id', t.id)
		$('#cW').append(elem);
		w = elem.width();
		h = elem.height();
		coords = [ t.cX  - (w/2), t.cY  - (h/2) ]
		elem.css('left', coords[0])
		elem.css('top', coords[1])
		if (t.upgrade_id) {
		  var upgradeBtn = $('<a>').attr({
  		 	href: '#',
  		 	id: 'upgradeBtn'
  		}).html('<span class="label">upgrade</span><span class="amount">$'+unitTypes[t.upgrade_id].cost+'</span>').
  		click(function(){
  		  if (!canAfford(unitTypes[t.upgrade_id].cost)){
  		    $(this).addClass('unavailable')
  		    return false;
		    }
  		  changeMoney(-unitTypes[t.upgrade_id].cost);
  		  t.upgrade();
  		  elem.remove();
  		  selectedUnit = undefined;
  		  return false;
  		});
		}
		
		sellBtn = $('<a>').attr({
			href: '#',
			id: 'sellBtn'
		}).html('<span class="label">sell</span><span class="amount">$'+t.sellCost()+'</span>').
		click(function(){
			mUM.sell(t);
			changeMoney( t.sellCost() );
			gridManager.clearCell( t.p[0], t.p[1] )
			elem.remove();
			selectedUnit = undefined;
			return false;
		})
		
		closeBtn = $('<a>').attr({
			href: '#',
			id: 'closeBtn'
		}).html('<span>x</span>').
		click(function(){
			elem.remove();
			selectedUnit = undefined;
			return false;
		})
		
		if (upgradeBtn)
		  elem.append(upgradeBtn);
		elem.append(sellBtn);
		elem.append(closeBtn);
  }
  
	var showTurretControl = function(t){

	}
	
	var generateTerrain = function(terrain){
		var k = 10;
		//add terrain to grid
		for (var i=0; i < terrain.length; i++) {
		 	grid[ terrain[i][1] ][terrain[i][0]] = 1;
		};
		
		for (var i=0; i < terrain.length; i++) {
			addSprite('tn', {cX: gridManager.pixelC(terrain[i][0]), cY: gridManager.pixelC(terrain[i][1]), spriteX: 140})
		};
	}
	
	var addBases = function(){
		myBase = {
			cX: gridManager.pixelC(endPoint[0]), 
			cY: gridManager.pixelC(endPoint[1]), 
			spriteX: 160,
			healthpercent: 1,
			base: true
		}
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

