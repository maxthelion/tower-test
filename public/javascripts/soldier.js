var SoldierManager = function(){
  var self = this;
  var id = 0;
  var allSoldiersHash = {
    s: {},
    a: {}
  };
  var allSoldiersArrays = {
    s: [],
    a: []
  };
  
  var soldierTypes = [
		{
		 name: 'lightInfantry',
		 speed: 2,
		 color: '#bbb',
		 health: 30,
		 size: 10,
		 bounty: 1,
		 type: Soldier
		},
		{
		 name: 'Infantry',
		 speed: 2,
		 color: 'cyan',
		 health: 100,
		 size: 10,
		 bounty: 1,
 		 type: Soldier
		},
		{
		 name: 'heavyInfantry',
		 speed: 2,
		 color: 'grey',
		 health: 200,
		 size: 16,
		 bounty: 4,
 		 type: Soldier
		},
		{
		 name: 'bike',
		 speed: 3,
		 color: 'blue',
		 health: 70,
		 size: 10,
		 bounty: 2,
 		 type: Soldier
		},
		{
		 name: 'megatron',
		 speed: 2,
		 color: 'red',
		 health: 1000,
		 size: 22,
		 bounty: 50,
 		 type: Soldier
		},
		{
  	 name: 'helicopter',
  	 speed: 2,
  	 color: '#bbb',
  	 health: 100,
  	 size: 10,
  	 bounty: 1,
  	 type: Helicopter
  	}
	];
	
  // probably needs optimising
  this.allSoldiers = function(){
    return allSoldiersArrays['s'];
  };
  
  var addSoldier = function(a){
    var key = keyFromSoldier(a)
    allSoldiersHash[key][a.getId()] = a;
    soldier.onReachDestination(function(){
	    loseLife();
      removeSoldier(a);
    })
    soldier.onDie(function(){
      removeSoldier(a);
    })
    redoHash(key)
  }
  
  redoHash = function(key){
    allSoldiersArrays[key] = [];
    for( i in allSoldiersHash[key]){
      if(allSoldiersHash[key][i] != null){
        allSoldiersArrays[key].push(allSoldiersHash[key][i]);
      };
    }
  }
  
  var removeSoldier = function(s){
    AttemptToWinGame();
    allSoldiersHash[keyFromSoldier(s)][s.getId()] = null;
    redoHash(keyFromSoldier(s))
  }
  
  this.createSoldier = function(typeIndex){
    var newId = id++;
    var template = soldierTypes[typeIndex]
    object = template['type'] // soldier or heli
    soldier = new object(startPoint, endPoint, grid, template, newId);
    addSoldier(soldier);
    return soldier;
  };
  
  var keyFromSoldier = function(soldier){
     return (object == Soldier) ? 's' : 'a'
  }
  
  this.getAircraft = function(){
    return allSoldiersArrays['a'];
  }
  

  this.withinRange = function(x, y, range, ground, air){
    var myArray = []
    var soldiers = []
    if (air) 
      soldiers = soldiers.concat(allSoldiersArrays['a'])
    if (ground) 
      soldiers = soldiers.concat(allSoldiersArrays['s'])
      
    for (var i=0; i < soldiers.length; i++) {
      var soldier = soldiers[i];
      if (soldier.getCurrentPoint()[0] >= x-range && 
            soldier.getCurrentPoint()[0] <= x+range &&
          soldier.getCurrentPoint()[1] >= y-range && 
            soldier.getCurrentPoint()[1] <= y+range ){
        myArray.push(soldier);
      }
    };
    return myArray;
  }
};

var Soldier = function(startPoint, endPoint, grid, template, id){
  var self = this;
  // this.xPos;
  // this.yPos;
  var initialHealth = template['health'];
  var health = initialHealth;
  var myPath;
  var pathIndex = 0;
  var currentPoint;
  var currentPosition;
  var id;
  var deathCallback;
  var destinationCallback;
  var nextPoint;
  var nextPointPosition;
  var speed = template['speed'];
  var color = template['color'];
  var size = template['size'];
	var bounty = template['bounty']
	var template = template;
  var slowedUntil;
  var startFlameNum;
  currentSpeed = speed;
  
  this.move = function(){
    if(self.isOnFire()){
      health -= 0.5;
      currentSpeed = speed * 2
    } else if(isSlowed()){
      currentSpeed = speed / 2;
    } else {
      currentSpeed = speed;
    }
    // kludge
    if (nextPointPosition[0] > currentPosition[0]){
      currentPosition[0] += currentSpeed;
    } else {
      currentPosition[0] -= currentSpeed;
    }
    if (nextPointPosition[1] > currentPosition[1]){
      currentPosition[1] += currentSpeed;
    } else {
      currentPosition[1] -= currentSpeed;
    }
    var cell = mygrid.cellFromPosition( currentPosition );
    if (nextPoint == undefined){
      destinationCallback();
      return false
    } else if ( cell[0] == nextPoint[0] && cell[1] == nextPoint[1]) {
      pathIndex++
      if (pathIndex < myPath.length){
        currentPoint = myPath[pathIndex];
        nextPoint    = myPath[pathIndex + 1];
        if (nextPoint)
	        nextPointPosition = mygrid.pointCenterXY(nextPoint[0], nextPoint[1]);
      } 
    }
  }
  
  this.slow = function(myFrameNum){
    slowedUntil = myFrameNum;
  }
  
  var isSlowed = function(){
    return slowedUntil && slowedUntil > frameNum
  }
  
  this.isOnFire = function(){
    return startFlameNum && startFlameNum > frameNum
  }
  
  this.getCurrentPosition = function(){
    return currentPosition;
  }
  
  this.regeneratePath = function(){
    var newPath = AStar(grid, currentPoint, endPoint, "Manhattan");
    if (newPath.length == 0){
      return false;
    } else {
      pathIndex = 0;
      myPath = newPath;
      return true;      
    };
  }

	this.getColor = function(){
		return isSlowed() ? 'green' : color;
	}
  
  // this is the grid coordinate for the soldier
  this.getCurrentPoint = function(){
    return currentPoint;
  }
  
  this.onReachDestination = function(callback){
    destinationCallback = callback;
  }
  
  this.onDie = function(callback){
    deathCallback = callback;
  }
  
  this.getSize = function(){
    return size;
  };
  
  this.takeBullet = function(damage) {
    health -= damage;
    if ( health <= 0 ){
      corpses.push(
        new Corpse(self.getCurrentPosition())
      )
      deathCallback();
			incrementKills(bounty);
    }
  }
  
  this.getHealthPercentage = function(){
    return health / initialHealth;
  }
  
  this.setAlight = function(sfn){
    startFlameNum = sfn
  }
  
  this.getId = function(){
    return id;
  };
  
  var initialise = function(){
    myPath = AStar(grid, startPoint, endPoint, "Manhattan");
    currentPoint = myPath[pathIndex];
    nextPoint = myPath[pathIndex + 1];
    currentPosition =   mygrid.pointCenterXY(currentPoint[0], currentPoint[1]);
    nextPointPosition = mygrid.pointCenterXY(nextPoint[0], nextPoint[1]);
  }
  
  initialise();
}

var Helicopter = function(startPoint, endPoint, grid, template, id){
  var currentPosition = mygrid.pointCenterXY(startPoint[0], startPoint[1])
  var endPosition = mygrid.pointCenterXY(endPoint[0], endPoint[1])
  var currentSpeed = template['speed'];
  var deathCallback;
  var destinationCallback;
  var initialHealth = template['health'];
  var health = initialHealth;
  var bounty = template['bounty'];
  var id = id
  
  this.move = function(){
    // kludge
    if (endPosition[0] > currentPosition[0]){
      currentPosition[0] += currentSpeed;
    } else {
      currentPosition[0] -= currentSpeed;
    }
    if (endPosition[1] > currentPosition[1]){
      currentPosition[1] += currentSpeed;
    } else {
      currentPosition[1] -= currentSpeed;
    }
    var cell = mygrid.cellFromPosition( currentPosition );
    if ( cell[0] == endPoint[0] && cell[1] == endPoint[1]) {
      destinationCallback()
    }
  }
  
  this.getCurrentPosition = function(){
    return currentPosition;
  }
  this.getColor = function(){
    return 'blue'
  }
  this.getSize = function(){
    return 1
  }
  
  this.getCurrentPoint = function(){
    return mygrid.cellFromPosition( currentPosition );
  }
  
  this.onReachDestination = function(callback){
    destinationCallback = callback;
  }
  
  this.onDie = function(callback){
    deathCallback = callback;
  }
  
  this.getId = function(){
    return id;
  };
  
  this.getHealthPercentage = function(){
    return health / initialHealth;
  }
  
  this.takeBullet = function(damage) {
    health -= damage;
    if ( health <= 0 ){
      // corpses.push(
      //   new Corpse(self.getCurrentPosition())
      // )
      deathCallback();
			incrementKills(bounty);
    }
  }
}