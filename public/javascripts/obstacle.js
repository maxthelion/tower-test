var Obstacle = function(position, template){
	this.cX = mygrid.pointCenterXY( position[0], position[1] )[0]
	this.cY = mygrid.pointCenterXY( position[0], position[1] )[1]
	
	this.getPosition = function() {
		return position;
	};
	
	this.sellCost = function(){
		return Math.floor(template['cost'] * 0.6)
	}
}