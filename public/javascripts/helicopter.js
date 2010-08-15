var Helicopter = function(startPoint, endPoint, grid, template, id){
	var self = this;
	var currentPosition = mygrid.pointCenterXY(startPoint[0], startPoint[1])
	this.cX = currentPosition[0];
	this.cY = currentPosition[1];
	var endPosition = mygrid.pointCenterXY(endPoint[0], endPoint[1])
	var currentSpeed = template['speed'];
	var deathCallback;
	var destinationCallback;
	var initialHealth = template['health'];
	this.health = initialHealth;
	this.healthpercent = 1;
	var bounty = template['bounty'];
	this.size = template['size'];
	this.sprite = template['sprite']
	var id
	
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

	this.getColor = function(){
		return 'blue'
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
	
	this.getId = function(){
		return id;
	};
	
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