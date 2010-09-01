function Soldier(startPoint, endPoint, gridManager, template, id) {
	var self = this;
	var currentPosition = gridManager.pointCenterXY(startPoint[0], startPoint[1])
	this.cX = currentPosition[0];
	this.cY = currentPosition[1];
	var endPosition = gridManager.pointCenterXY(endPoint[0], endPoint[1])
	var currentSpeed = template['speed'];
	var initialHealth = template['health'];
	this.health = initialHealth;
	this.healthpercent = 1;
	this.bounty = template['bounty'];
	this.sprite = template['sprite']
	this.id = id;
	
	var myPath;
	var pathIndex = 0;
	var currentPoint;
	var nextPoint;
	var nextPosition;
	var slowedUntil;
	var startFlameNum;
	var speed = currentSpeed
	
	this.enterFrame = function(){
		if(self.isOnFire()){
			self.health -= 0.5;
			currentSpeed = speed * 2
		} else if(isSlowed()){
			currentSpeed = speed / 2;
		} else {
			currentSpeed = speed;
		}
		var cell = gridManager.cellFromPosition( [self.cX, self.cY] );
		getNewPos()
		if (nextPoint == undefined){
			self.destC();
			return false
		} else if ( cell[0] == nextPoint[0] && cell[1] == nextPoint[1]) {
			pathIndex++
			if (pathIndex < myPath.length){
				currentPoint = myPath[pathIndex];
				nextPoint	 = myPath[pathIndex + 1];
				if (nextPoint)
					nextPosition = gridManager.pointCenterXY(nextPoint[0], nextPoint[1]);
			} 
		}
	}
	
	// var getNewPos = function(){
  //     if(nextPoint){
  //    xSpeed = (nextPoint[0] == currentPoint[0]) ? currentSpeed : currentSpeed * (nextPoint[0] - currentPoint[0])
  //   if (Math.abs(nextPosition[0] - self.cX) >= currentSpeed){
  //     self.cX += xSpeed;
  //   } else {
  //     self.cX = nextPosition[0];
  //   }
  //    ySpeed = (nextPoint[1] == currentPoint[1]) ? currentSpeed : currentSpeed * (nextPoint[1] - currentPoint[1])
  //   if (Math.abs(nextPosition[1] - self.cY) >= currentSpeed){
  //     self.cY += ySpeed;
  //   } else {
  //     self.cY = nextPosition[1];
  //   }
  //  }
	// }
	
	var getNewPos = function(){
	  // kludge
		if (nextPosition[0] > self.cX){
			self.cX += currentSpeed;
		} else {
			self.cX -= currentSpeed;
		}
		if (nextPosition[1] > self.cY){
			self.cY += currentSpeed;
		} else {
			self.cY -= currentSpeed;
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
		var newPath = gridManager.getPath(currentPoint, endPoint);
		if (newPath.length == 0){
			return false;
		} else {
			pathIndex = 0;
			myPath = newPath;
			return true;			
		};
	}
	
	this.destC = function(){
		mSM.removeSoldier(self);
		myGame.loseLife();
	}
	
	this.dC = function(){
	  myGame.incrementKills(self.bounty);
	  mSM.removeSoldier(self);
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
		myPath = gridManager.getPath(startPoint, endPoint);
		currentPoint = myPath[pathIndex];
		nextPoint = myPath[pathIndex + 1];
		var currentPosition = gridManager.pointCenterXY(currentPoint[0], currentPoint[1]);
		self.cX = currentPosition[0];
		self.cY = currentPosition[1];
		nextPosition = gridManager.pointCenterXY(nextPoint[0], nextPoint[1]);
	}
	
	initialise();
}