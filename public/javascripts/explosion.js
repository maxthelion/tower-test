explosions = [];
var Explosion = function(x, y, radius, start, damage){
	var self = this;
	var range;
	var damage;
	var impactPosition;
	var startFrame = start;
	this.radius = mygrid.radiusFromRange( radius )
	var iradius = self.radius
	this.cX = x;
	this.cY = y;
	this.scale = 1
	var decay = 10
	
	var initialise = function() {
		detonate();
	}
	
	var detonate = function(){
		unfortunates = mySoldierManager.withinRange(self.cX, self.cY, radius, true, true)
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

	this.finished = function(){
		return frameNum - startFrame > decay
	}
	
	this.progress = function(){
		if (!self.finished()){
			self.scale = (frameNum - startFrame) / decay;
			self.radius = iradius + (iradius * self.scale)
		} 
	}
	
	this.getX = function(){
		return position[0]
	}
	
	this.getY = function(){
		return position[1]
	}
	initialise();
}