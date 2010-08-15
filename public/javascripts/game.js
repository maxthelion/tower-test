
var corpses = [];

var bits = [];
var Corpse = function(x, y) {
	var i = bloodSpatterNum
	while (i) {
		bits.push({
			speedX: 15 - (Math.random() * 30),
			speedY: 15 - (Math.random() * 30),
			cX: x,
			cY: y,
			startTime: frameNum
		})
		i--;
	}
};

function GridGenerator(width, height){
	var	floor = Math.floor,
		random = Math.random,
		result = new Array(height);
	for(var	j, i = 0; i < height; i++) {
		result[i] = new Array(width);
		for(j = 0; j < width; j++)
			result[i][j] = 0
	};
	return result;
};


var kills = 0;
var grid;	
var startLives = 20;
var lives = startLives;
var mySoldierManager;
var mygrid;
var regularity = 20; // the speed that new soldiers appear
var waveLength = 10; // the length of a wave - eg how many soldiers per round
var soldierCountDown = regularity;
var waveCountDown = waveLength;
var round = 0;
var money = 20;
var frameNum = 0;
var currentTurretIndex = 0;
var paused = false;
var playing =	false;
var explosions = [];
var sounds;
var muted = true;
var bloodSpatterSize = 2
var bloodSpatterNum = 3
var helis = [];

var incrementKills = function(bounty){			
	changeMoney(bounty);
	kills++;
	$('#kills').text(kills);
	attemptToWinGame();
};

function changeMoney(amount){
	money += amount;
	$('#money').text(money);
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

var loseLife = function(){
	lives--;
}

var frameFunction = function(){
	sounds = {}
	frameNum ++;
	checkDeath();
	aimAndFireTurrets();
	progressExplosions()
	attemptToWinGame();
	if( !gameWon() && !isDead()){
		if(soldierCountDown == 0) {
			if (waveCountDown == 0) {
				if (!anySoldiers() && round <= waves.length){
					progressRound()
				}
			} else {
				waveCountDown--;
				mySoldierManager.createSoldier(typeIndex);
				soldierCountDown = regularity;
			}
		} else {
			soldierCountDown--;
		}
		mySoldierManager.moveUnits();
	}
	for(s in sounds){
		playSound(s);
	}
	mygrid.public_draw();
}

var progressExplosions = function(){
	for (var i=0; i < explosions.length; i++) {
		explosions[i].progress()
	};
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
	return mySoldierManager.allUnits().length > 0
}

sprites_img = new Image(); 
sprites_img.src = 'soldier.png';
sprites_img.onload = function(){
	start();
}

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

$().ready(function(){			
	mySoldierManager = new SoldierManager();
	mygrid = new Grid('canvas', grid);
	drawTurretButtons();
	
	//$('#start').click(function(){
		$('#big_notice').hide()
		// start();
	//});
	
	$('#pause_button').click(function(evt){
		clearInterval(globalInterval);
		paused = true;
		$('#big_notice').show().html('<h2>Game paused</h2><p>click to resume</p>').click(function(){
			globalInterval = setInterval(frameFunction, 60);
			paused = false;
			$('#pause_button').show();
			$('#big_notice').hide()
		});
		$('#pause_button').hide();
	})

	$('#mute_button').click(function(evt){
		if(!muted){
			muted = true;
		} else {
			muted = false;
		}
	})
});

var drawTurretButtons = function(){
	$('#turret_choices').text('')
	for (var i=0; i < unitTypes.length; i++) {
		var t = unitTypes[i];
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
var aimAndFireTurrets = function(){
	// aim the turrets and fire if possible
	for(var i =0; i < units.length; i++){
		if (units[i].aimAndFire){ // if it quacks like a turret
			units[i].aimAndFire();
		}
	}
}

playSound = function(id) {
	if(!muted){
		x = $('#'+ id).clone();
		x[0].play();
	}
}