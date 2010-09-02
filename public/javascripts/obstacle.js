var Obstacle = function(position, template, gridManager){
	this.cX = gridManager.pointCenterXY( position[0], position[1] )[0]
	this.cY = gridManager.pointCenterXY( position[0], position[1] )[1]
	this.p = position
	
	this.sellCost = function(){
		return MF(template['cost'] * 0.6)
	}
}
