
var corpses = [];

var bits = [];
var Corpse = function(position) {
  var startPosition = position;
  var i = bloodSpatterNum
  while (i) {
    bits.push({
      speedX: 15 - (Math.random() * 30),
      speedY: 15 - (Math.random() * 30),
      cX: position[0],
      cY: position[1],
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
var speed = 2;
var health = 100;
var round = 1;
var money = 20;
var frameNum = 0;
var startPoint =  [3, 0];
var	endPoint =    [5, 14];
var currentTurretIndex = 0;
var paused = false;
var playing =  false;
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
	AttemptToWinGame();
};

function changeMoney(amount){
	money += amount;
	$('#money').text(money);
	drawTurretButtons();
}

var AttemptToWinGame = function(){
  if (round == waves.length && waveCountDown == 0 && mySoldierManager.allSoldiers().length == 0){
    $('#notice').text('YOU WIN!')
		clearInterval(globalInterval);
		playing = false;
	}
}

var loseLife = function(){
  lives--;
  $('#lives').text(lives);
}


var frameFunction = function(){
	sounds = {}
  frameNum ++;
  checkDeath();
	aimAndFireTurrets()
	
  for (var i=0; i < mySoldierManager.getAircraft().length; i++) {
  	mySoldierManager.getAircraft()[i].move();
  };

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
	moveSoldiers();
  for(s in sounds){
		playSound(s);
	}
  mygrid.public_draw();
}

var moveSoldiers = function(){
	// move the soldiers
  for (var i=0; i < mySoldierManager.allSoldiers().length; i++) {
    mySoldierManager.allSoldiers()[i].move();
  };
}

var checkDeath = function(){
	if (lives == 0){
    $('#notice').text('death to you, sucker!!! you are teh suck!!!');
    clearInterval(globalInterval);
    playing = false;
  }
}

var anySoldiers = function(){
	return mySoldierManager.allUnits().length > 0
}

var progressRound = function(){
	round++;
	$('#notice').text('Round ' + round );
	// mark the round number
  $('#round').text(round);
	wave = waves[round - 1];
	waveCountDown = wave[2];
	regularity = wave[1];
	typeIndex = wave[0];
}

$().ready(function(){	    
  mySoldierManager = new SoldierManager();
  grid = GridGenerator(15, 15);
	//add terrain to grid
	for (var i=0; i < terrain.length; i++) {
   grid[ terrain[i][1] ][terrain[i][0]] = 1;
  };
  mygrid = new Grid('canvas', grid);
  drawTurretButtons();
  
  wave = waves[0];
	waveCountDown = wave[2];
	regularity = wave[1];
	typeIndex = wave[0];
	
	$('#notice').text('RELEASE THE HORDES!!!!');
	playing = true;
  //  global interval
  globalInterval = setInterval(frameFunction, 60);
	
  $('#pause_button').click(function(evt){
		if(!paused){
    	clearInterval(globalInterval);
			paused = true;
			$('#pause_button').text('Play');
		} else {
			globalInterval = setInterval(frameFunction, 60);
			paused = false;
			$('#pause_button').text('Pause');
		}
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
  for(var i =0; i < turrets.length; i++){
    turrets[i].aimAndFire();
  }
}

playSound = function(id) {
	if(!muted){
  	x = $('#'+ id).clone();
  	x[0].play();
	}
}