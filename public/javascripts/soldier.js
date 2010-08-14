var Soldier = function(startPoint, endPoint, grid, template, id){	
	var self = this;
	var initialHealth = template['health'];
	this.health = initialHealth;
	this.healthpercent = 1;
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
	this.size = template['size'];
	var bounty = template['bounty']
	var template = template;
	var slowedUntil;
	var startFlameNum;
	currentSpeed = speed;
	
	this.move = function(){
		if(self.isOnFire()){
			self.health -= 0.5;
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
				nextPoint		= myPath[pathIndex + 1];
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
	
	this.takeBullet = function(damage) {
		self.health -= damage;
		this.healthpercent = self.health / initialHealth;
		if ( self.health <= 0 ){
			corpses.push( new Corpse( self.getCurrentPosition()) )
			deathCallback();
			incrementKills(bounty);
		}
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
		currentPosition =	 mygrid.pointCenterXY(currentPoint[0], currentPoint[1]);
		nextPointPosition = mygrid.pointCenterXY(nextPoint[0], nextPoint[1]);
	}
	
	initialise();
}