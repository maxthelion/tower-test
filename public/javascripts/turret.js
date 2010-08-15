var Turret = function(position, template, id){
	var self = this;
	var position = position;
	this.id = id;
	var range = template['range'];
	this.radius = mygrid.radiusFromRange( range )
	var damage = template['damage'];
	var fireRate = template['fireRate'];
	var color = template['color'];
	this.cost = template['cost']
	var tSoldier;
	var firing = false;
	this.cX = mygrid.pointCenterXY( position[0], position[1] )[0]
	this.cY = mygrid.pointCenterXY( position[0], position[1] )[1]
	
	this.getPosition = function() {
		return position;
	};
	
	this.targettedSoldier = function() {
		return tSoldier;
	}
	
	this.getColor = function(){
		return color;
	}
	
	var setTargettedSoldier = function(){
		tSoldier = soldiersInRange()[0];
	}
	
	this.aimAndFire = function(){
		setTargettedSoldier();
		if (tSoldier && (frameNum % fireRate == 0)){
			firing = true;
			sounds['shot'] = true
			tSoldier.takeBullet(damage);
			if (template['hitCallback']){
				template['hitCallback'](tSoldier, frameNum)
			}
		} else {
			firing = false;
		}
	}
	
	this.isFiring = function(){
		return firing;
	}
	
	var soldiersInRange = function(){
		return mySoldierManager.withinRange(self.cX, self.cY, self.radius, true, template['attacks_air']);
	};
	
	this.sellCost = function(){
		return Math.floor(template['cost'] * 0.6)
	}
}