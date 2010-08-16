function Helicopter(startPoint, endPoint, grid, template, id) {
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
	this.sprite = template['sprite']
	this.id = id;
	
	this.enterFrame = function(){
		// kludge
		if (endPosition[0] > self.cX){
			self.cX += currentSpeed;
		} else {
			self.cX -= currentSpeed;
		}
		if (endPosition[1] > self.cY){
			self.cY += currentSpeed;
		} else {
			self.cY -= currentSpeed;
		}
		var cell = mygrid.cellFromPosition( [self.cX, self.cY] );
		if ( cell[0] == endPoint[0] && cell[1] == endPoint[1]) {
			self.destC()
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
		explosions.push( new Explosion(self.cX, self.cY, 1, frameNum, 0) );
		mSM.removeSoldier(self.id);
		loseLife();
	}
	
	this.dC = function(){
	  incrementKills(self.bounty);
		mSM.removeSoldier(self.id);
	}
}