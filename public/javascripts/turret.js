var Turret = function(position, template, gridManager){
	var self = this;
	this.p = position;
	this.id = id;
	var range = template.range;
	this.radius = gridManager.radiusFromRange( range )
	var damage = template.damage;
	var fireRate = template.fireRate;
	this.upgrade_id = template.upgrade_id;
	this.cost = template.cost
	this.tSoldier;
	this.firing = false;
	this.cX = gridManager.pointCenterXY( this.p[0], this.p[1] )[0]
	this.cY = gridManager.pointCenterXY( this.p[0], this.p[1] )[1]
	this.hC = template.hC; // hit callback
	this.spriteX = template.spriteX;
	this.fireFunction = template.fireFunction;
	
	this.enterFrame = function(){
		self.tSoldier = soldiersInRange()[0];
		if (self.tSoldier && (frameNum % fireRate == 0)){
			self.firing = true;
			self.tSoldier.takeBullet(damage);
			if (self.hC){
				self.hC(self.tSoldier, frameNum)
			}
			if (self.fireFunction){
				self.fireFunction(self, self.tSoldier);
			}
		} else {
			self.firing = false;
		}
	}
	
	var soldiersInRange = function(){
		return mSM.withinRange(self.cX, self.cY, self.radius, true, template.attacks_air);
	};
	
	this.sellCost = function(){
		return MF(template.cost * 0.2)
	}
	
	this.upgrade = function(){
	  template = unitTypes[self.upgrade_id]
	  range = template.range;
  	self.radius = gridManager.radiusFromRange( range )
  	damage = template.damage;
  	fireRate = template.fireRate;
  	self.upgrade_id = template.upgrade_id;
  	self.cost = template.cost;
  	self.spriteX = template.spriteX;
	}
}