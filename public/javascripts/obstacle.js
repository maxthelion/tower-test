var Obstacle = function(position, template){
	this.cX = mygrid.pointCenterXY( position[0], position[1] )[0]
	this.cY = mygrid.pointCenterXY( position[0], position[1] )[1]
	this.p = position
	
	this.sellCost = function(){
		return MF(template['cost'] * 0.6)
	}
}

var Obstacle = function(position, template){
	this.cX = mygrid.pointCenterXY( position[0], position[1] )[0]
	this.cY = mygrid.pointCenterXY( position[0], position[1] )[1]
	this.p = position
	
	this.sellCost = function(){
		return MF(template['cost'] * 0.6)
	}
}