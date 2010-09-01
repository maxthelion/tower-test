var Turret = function(position, template, gridManager){
	var self = this;
	this.p = position;
	this.id = id;
	var range = template['range'];
	this.radius = gridManager.radiusFromRange( range )
	var damage = template['damage'];
	var fireRate = template['fireRate'];
	this.cost = template['cost']
	this.tSoldier;
	this.firing = false;
	this.cX = gridManager.pointCenterXY( this.p[0], this.p[1] )[0]
	this.cY = gridManager.pointCenterXY( this.p[0], this.p[1] )[1]
	this.hC = template['hC']; // hit callback
	
	this.enterFrame = function(){
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
		return MF(template['cost'] * 0.6)
	}
}