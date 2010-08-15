var Sprite = function(x, y, frameNum) {
	
}

var EnemyUnit = function(startPoint, endPoint, grid, template, id){
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
	this.id = id;
	
	
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
			deathCallback();
			incrementKills(bounty);
		}
	}
	
}