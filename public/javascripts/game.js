var frameNum = 0;
var mSM;
var positionHash;
var myBase;


var Game = function(){
	var level = localStorage.getItem('level') || 0;
	level = level * 1;
	var elem;
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
	var selectedUnit;
	var currentUnit;
	var canvasManager;
	var emergencePoint;
	var initFrameSpeed = 60;
	var highSpeed = 10;
	var frameSpeed;
	var mUM;

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
			progressLevel();
			clearInterval(globalInterval);
			playing = false;
			window.location = '#/level/'+level+'/complete';
		}
	}
	
	var progressLevel = function(){
	  if ((levels.length -1)  > level) {
			level++;
		  localStorage.setItem('level', level);
			initialise();
			progressRound();
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
					mSM.createSoldier(typeIndex, emergencePoint, gridManager);
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
			window.location = "#/death"
			clearInterval(globalInterval);
			playing = false;
		}
	}

	var anySoldiers = function(){
		return mSM.allUnits(true, true).length > 0
	}

	var start = function(){
		progressRound();
		playing = true;
		globalInterval = setInterval(frameFunction, frameSpeed);
	}
	
	var restart = function(){
		initialise();
		start();
	}

	var progressRound = function(){
		round++;
		$('#notice').text('Round ' + round + ' of ' + waves.length + ' (level ' + (level + 1) +')' );
		// mark the round number
		$('#round').text(round);
		wave = waves[round - 1];
		waveCountDown = wave[0][2];
		regularity = wave[0][1];
		soldierCountDown = regularity;
		typeIndex = wave[0][0];
		emergencePoint = gridManager.startPoints[wave[1]]
	}
	
	var initialise = function(){
	  elem = undefined;
		positionHash = {};
		var thisLevel = levels[level];
		waves = thisLevel.waves;
		availableUnits = []
    for (var i=0; i < thisLevel.availableUnitIds.length; i++) {
      availableUnits.push(unitTypes[thisLevel.availableUnitIds[i]]);
    };
		frameSpeed = initFrameSpeed;
		kills = 0;
		startLives = 10;
		lives = startLives;
		round = 0;
		money = 20;
		currentUnit = availableUnits[0]
		initSprites();
		selectedUnit = undefined;
		mSM = new SoldierManager();
		mUM = new UnitManager();
		var canvas = document.getElementById('canvas')
		gridManager = new GridManager(400, 400);
		gridManager.addBases(thisLevel.startPoints, thisLevel.endPoint);
		gridManager.generateTerrain(thisLevel.terrain);
		gridManager.addUnbuildables(thisLevel.unbuildables)
		canvasManager = new CanvasManager(canvas, gridManager);
		canvasManager.highLight = null;
		drawTurretButtons();
		$('#speed_button').text('Speed up');
		$('#kills').text(kills)
		$('#money').text(money)
	}
	
	var addEvents = function(){		
		$('#speed_button').click(function(evt){
			clearInterval(globalInterval);
			if (frameSpeed == initFrameSpeed ) {
			  frameSpeed = highSpeed;
			  $(this).text('Slow down');
			} else {
			  frameSpeed = initFrameSpeed;
			  $(this).text('Speed up');
			}
			globalInterval = setInterval(frameFunction, frameSpeed);
			playing = true;
			return false;
		})
		
		$('#info').click(function(evt){
		  var info = $('#instructions').clone();
			$('#big_notice').show().html(info);
			return false;
		})
		
		
		$(canvas).click(function(evt){
			if (playing == false || selectedUnit)
				return false;
			var xIndex = MF( evt.offsetX/gridManager.cellWidth )
			var yIndex = MF( evt.offsetY/gridManager.cellHeight)
			var u = gridManager.spriteAt(xIndex, yIndex);
			if (!u){
				addUnit(xIndex, yIndex);
			} else if (u instanceof Turret){
        selectedUnit = u;
			}
			canvasManager.public_draw();
		});

		$(canvas).mousemove(function(evt){
			if (!selectedUnit && playing) {
				var xIndex = MF( evt.offsetX/gridManager.cellWidth )
				var yIndex = MF( evt.offsetY/gridManager.cellWidth )
				var u = gridManager.spriteAt(xIndex, yIndex);
				canvasManager.highLight = {
					x: xIndex,
					y: yIndex,
					cX: gridManager.pointCenterXY(xIndex, yIndex)[0],
					cY: gridManager.pointCenterXY(xIndex, yIndex)[1]
				}
				if (gridManager.squareAvaliable( xIndex, yIndex ) ){
					canvasManager.highLight.unit = currentUnit;
					canvasManager.highLight.haloColor = (money < currentUnit['cost']) ? '255, 0, 0' : '0, 255, 0';
					canvasManager.highLight.range = gridManager.radiusFromRange(currentUnit.range)
				} else if (u && u instanceof Turret){
					canvasManager.highLight.haloColor = '255, 255, 0'
					canvasManager.highLight.range = gridManager.cellWidth / 2
				} else {
					canvasManager.highLight.unit = currentUnit;
					canvasManager.highLight.haloColor = '255, 0, 0'
					canvasManager.highLight.range = gridManager.radiusFromRange(currentUnit.range)
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
					setCurrentUnit(t);
					return false;
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
	
	addEvents();
	
	var revertGridPoint = function(x, y){
		grid[y][x] = 0;
	}
	
	var checkPaths = function(x, y){
		for (var i=0; i < gridManager.startPoints.length; i++) {
			// check the global path
			if (!gridManager.pathExists(gridManager.startPoints[i])){ // fail to connect
				revertGridPoint(x, y);
				return false
			};
		};
		return true
	}

	var addUnit = function(x, y){
		// check there is money
		if(money < currentUnit['cost'])
			return false
		// if (u['type'] == Explosion)
		// 	return mUM.createUnit(u, [x, y]);
		gridManager.occupy(x, y);
		if (!checkPaths(x, y)){
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
	
	this.pause = function(){
	  if (playing){
	    clearInterval(globalInterval);
		  playing = false;
	  }
	}
	
	this.play = function(){
		if (!self.started) {
			initialise();
			start();
			self.started = true;
		} else {
			globalInterval = setInterval(frameFunction, frameSpeed);
			playing = true;
		};		
	}
	
	this.restart = function(){
	  restart();
	}
	
	this.getCurrentLevel = function(){
		return level;
	}
	
	this.setLevel = function(newLevel){
		level = newLevel;
		initialise();
		progressRound();
		canvasManager.public_draw();
	}
}


