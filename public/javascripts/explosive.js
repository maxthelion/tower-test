var Explosion = function(position, radius, start, damage){
	var range;
	var damage;
	var impactPosition;
	var startFrame = start;
	
	var initialise = function() {
		detonate();
	}
	
	var detonate = function(){
		unfortunates = mySoldierManager.withinRange(position[0], position[1], radius, true, true)
		for (var i=0; i < unfortunates.length; i++) {
			unfortunates[i].takeBullet(damage);
		};
	}
	
	this.getRadius = function(){
		return radius;
	}
	
	this.getStartFrame = function(){
		return startFrame;
	}

	this.getX = function(){
		return position[0]
	}
	
	this.getY = function(){
		return position[1]
	}
	initialise();
}