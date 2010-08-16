var Turret = function(position, template, id){
	var self = this;
	var position = position;
	this.id = id;
	var range = template['range'];
	this.radius = mygrid.radiusFromRange( range )
	var damage = template['damage'];
	var fireRate = template['fireRate'];
	this.cost = template['cost']
	this.tSoldier;
	this.firing = false;
	this.cX = mygrid.pointCenterXY( position[0], position[1] )[0]
	this.cY = mygrid.pointCenterXY( position[0], position[1] )[1]
	this.hC = template['hC']; // hit callback
	
	this.getPosition = function() {
		return position;
	};
	
	this.aimAndFire = function(){
		self.tSoldier = soldiersInRange()[0];
		if (self.tSoldier && (frameNum % fireRate == 0)){
			self.firing = true;
			self.tSoldier.takeBullet(damage);
			if (self.hC)
				template['hC'](self.tSoldier, frameNum)
		} else {
			self.firing = false;
		}
	}
	
	var soldiersInRange = function(){
		return mSM.withinRange(self.cX, self.cY, self.radius, true, template['attacks_air']);
	};
	
	this.sellCost = function(){
		return Math.floor(template['cost'] * 0.6)
	}
}