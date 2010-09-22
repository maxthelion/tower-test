function addProjectile(turret, soldier){
	addSprite( 'pr', {
		cX: turret.cX,
		cY: turret.cY,
		target: soldier,
		projectileSize: 2,
		speed: 5,
		damage: 10,
		enterFrame: function(){
			var newCoords = this.getNewCoords(this.cX, this.cY, this.target.cX, this.target.cY, this.speed);
			this.cX = newCoords[0]
			this.cY = newCoords[1]
			if (this.withinRange()){
				this.remove();
				addExplosion(this.target.cX, this.target.cY, 10, frameNum, this.damage);
				this.target.takeBullet(10);
			}
		},
		withinRange: function(){
			return (distance(this, this.target) < 10)
		},
		getNewCoords: function(x1, y1, x2, y2, radius){
			var dx = x2 - x1;
			var dy = y2 - y1;
			var theta = Math.atan2(dy, dx);
			return [
				x1 + (Math.cos(theta) * radius),
				y1 + (Math.sin(theta) * radius)
			]
		}
	});
}

var distance = function(p1,p2){
 var dist,dx,dy;
 dx = p2.cX-p1.cX;
 dy = p2.cY-p1.cY;
 dist = Math.sqrt(dx*dx + dy*dy);
 return dist
}