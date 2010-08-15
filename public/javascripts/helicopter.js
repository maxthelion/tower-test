Helicopter.prototype = EnemyUnit

function Helicopter(startPoint, endPoint, grid, template, id) {
	EnemyUnit.call(this, startPoint, endPoint, grid, template, id)
	
	this.move = function(){
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
			destinationCallback()
		}
	}

	this.getCurrentPoint = function(){
		return mygrid.cellFromPosition( [self.cX, self.cY] );
	}
	
	this.onReachDestination = function(callback){
		destinationCallback = callback;
	}
	
	this.onDie = function(callback){
		deathCallback = callback;
	}
	
	this.isOnFire = function(){
		return false;
	}
	
	this.takeBullet = function(damage) {
		self.health -= damage;
		self.healthpercent = self.health / initialHealth; 
		if ( self.health <= 0 ){
			deathCallback();
			incrementKills(bounty);
		}
	}
}