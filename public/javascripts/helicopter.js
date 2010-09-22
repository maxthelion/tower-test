function Helicopter(startPoint, gridManager, template) {
	var self = this;
	var currentPosition = gridManager.pointCenterXY(startPoint[0], startPoint[1])
	this.cX = currentPosition[0];
	this.cY = currentPosition[1];
	var nextPosition = gridManager.pointCenterXY(gridManager.endPoint[0], gridManager.endPoint[1])
	var currentSpeed = template['speed'];
	var initialHealth = template['health'];
	this.health = initialHealth;
	this.healthpercent = 1;
	this.bounty = template.bounty;
	this.spriteX = template.spriteX
	this.id = id;
	
	this.enterFrame = function(){
    getNewPos()
		var cell = gridManager.cellFromPosition( [self.cX, self.cY] );
		if ( cell[0] == gridManager.endPoint[0] && cell[1] == gridManager.endPoint[1]) {
			self.destC()
		}
	}
	
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
	
	this.takeBullet = function(damage) {
		self.health -= damage;
		self.healthpercent = self.health / initialHealth; 
		if ( self.health <= 0 ){
			self.dC();
		}
	}
	
	this.destC = function(){
		mSM.removeSoldier(self);
		myGame.loseLife();
	}
	
	this.dC = function(){
	  myGame.incrementKills(self.bounty);
		mSM.removeSoldier(self);
	}
}