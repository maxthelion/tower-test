var SoldierManager = function(){
  var self = this;
  var id = 0;
  var soldiers = [];
  var soldierHash = {};
  var soldierTypes = [
		{
		 name: 'lightInfantry',
		 speed: 2,
		 color: '#8ae5f7',
		 health: 30,
		 size: 10,
		 bounty: 1
		},
		{
		 name: 'Infantry',
		 speed: 2,
		 color: 'cyan',
		 health: 100,
		 size: 10,
		 bounty: 1
		},
		{
		 name: 'heavyInfantry',
		 speed: 2,
		 color: 'grey',
		 health: 200,
		 size: 16,
		 bounty: 4
		},
		{
		 name: 'bike',
		 speed: 3,
		 color: 'blue',
		 health: 70,
		 size: 10,
		 bounty: 2
		},
		{
		 name: 'megatron',
		 speed: 2,
		 color: 'red',
		 health: 1000,
		 size: 22,
		 bounty: 100
		}
		// 2: 'bike',
		// 4: 'helicopter'
	];
	
  // probably needs optimising
  this.allSoldiers = function(){
    var myArray = [];
    for( i in soldierHash){
      if(soldierHash[i] != null){
        myArray.push(soldierHash[i]);
      };
    }
    return myArray;
  };
  
  this.createSoldier = function(typeIndex){
    var newId = id++;
    soldier = new Soldier(startPoint, endPoint, grid, soldierTypes[typeIndex], newId);
    soldier.onReachDestination(function(){
      soldierHash[newId] = null;
      AttemptToWinGame();
      loseLife();
    })
    soldier.onDie(function(){
      soldierHash[newId] = null;
    })
    soldierHash[newId] = soldier;
    return soldier;
  };
  

  this.withinRange = function(x, y, range){
    myArray = [];
    for (var i=0; i < mySoldierManager.allSoldiers().length; i++) {
      var soldier = mySoldierManager.allSoldiers()[i];
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
  currentSpeed = speed;
  
  this.move = function(){
    if(isSlowed()){
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
  
  var initialise = function(){
    myPath = AStar(grid, startPoint, endPoint, "Manhattan");
    currentPoint = myPath[pathIndex];
    nextPoint = myPath[pathIndex + 1];
    currentPosition =   mygrid.pointCenterXY(currentPoint[0], currentPoint[1]);
    nextPointPosition = mygrid.pointCenterXY(nextPoint[0], nextPoint[1]);
  }
  
  initialise();
}