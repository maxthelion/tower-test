function Soldier(startPoint, endPoint, grid, template, id) {
	var self = this;
	var currentPosition = mygrid.pointCenterXY(startPoint[0], startPoint[1])
	this.cX = currentPosition[0];
	this.cY = currentPosition[1];
	var endPosition = mygrid.pointCenterXY(endPoint[0], endPoint[1])
	var currentSpeed = template['speed'];
	var initialHealth = template['health'];
	this.health = initialHealth;
	this.healthpercent = 1;
	this.bounty = template['bounty'];
	this.size = template['size'];
	this.sprite = template['sprite']
	this.id = id;
	
	var myPath;
	var pathIndex = 0;
	var currentPoint;
	var nextPoint;
	var nextPointPosition;
	var slowedUntil;
	var startFlameNum;
	var speed = currentSpeed
	
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
		if (nextPointPosition[0] > self.cX){
			self.cX += currentSpeed;
		} else {
			self.cX -= currentSpeed;
		}
		if (nextPointPosition[1] > self.cY){
			self.cY += currentSpeed;
		} else {
			self.cY -= currentSpeed;
		}
		var cell = mygrid.cellFromPosition( [self.cX, self.cY] );
		if (nextPoint == undefined){
			self.destC();
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
	
	this.takeBullet = function(damage) {
		self.health -= damage;
		this.healthpercent = self.health / initialHealth;
		if ( self.health <= 0 ){
			self.dC();
		}
	}
	
	this.setAlight = function(sfn){
		startFlameNum = sfn
	}

	var initialise = function(){
		myPath = AStar(grid, startPoint, endPoint, "Manhattan");
		currentPoint = myPath[pathIndex];
		nextPoint = myPath[pathIndex + 1];
		var currentPosition = mygrid.pointCenterXY(currentPoint[0], currentPoint[1]);
		self.cX = currentPosition[0];
		self.cY = currentPosition[1];
		nextPointPosition = mygrid.pointCenterXY(nextPoint[0], nextPoint[1]);
	}
	
	initialise();
}