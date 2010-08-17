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
var kills = 0;
var grid;	
var startLives = 20;
var lives = startLives;
var mSM;
var mygrid;
var regularity = 20; // the speed that new soldiers appear
var waveLength; // the length of a wave - eg how many soldiers per round
var soldierCountDown = regularity;
var waveCountDown;
var round = 0;
var money = 20;
var frameNum = 0;
var currentTurretIndex = 0;
var playing =	false;

var incrementKills = function(bounty){			
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

var loseLife = function(){
	lives--;
}

var frameFunction = function(){
	sounds = {}
	frameNum ++;
	checkDeath();
	spritesProgress();
	attemptToWinGame();
	$('#kills').text(kills)
	$('#money').text(money)
	if( !gameWon() && !isDead()){
		if(soldierCountDown == 0) {
			if (waveCountDown == 0) {
				if (!anySoldiers() && round <= waves.length){
					progressRound()
				}
			} else {
				waveCountDown--;
				mSM.createSoldier(typeIndex);
				soldierCountDown = regularity;
			}
		} else {
			soldierCountDown--;
		}
	}
	mygrid.public_draw();
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
	return mSM.allUnits().length > 0
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
	mSM = new SoldierManager();
	mygrid = new Grid('canvas', grid);
	drawTurretButtons();
	
	//$('#start').click(function(){
		$('#big_notice').hide()
		// start();
	//});
	
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

var spritesProgress = function(){
	// aim the turrets and fire if possible
	for(var i =0; i < spritesArray.length; i++){
		if (spritesArray[i].enterFrame){ 
			spritesArray[i].enterFrame();
		}
	}
}
