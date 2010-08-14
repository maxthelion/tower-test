var Helicopter = function(startPoint, endPoint, grid, template, id){
	var self = this;
	var currentPosition = mygrid.pointCenterXY(startPoint[0], startPoint[1])
	var endPosition = mygrid.pointCenterXY(endPoint[0], endPoint[1])
	var currentSpeed = template['speed'];
	var deathCallback;
	var destinationCallback;
	var initialHealth = template['health'];
	this.health = initialHealth;
	this.healthpercent = 1;
	var bounty = template['bounty'];
	this.size = template['size'];
	var id
	
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