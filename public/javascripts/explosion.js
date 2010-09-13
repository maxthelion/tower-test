// var Explosion = function(x, y, radius, start, damage){
// 	var self = this;
// 	var range;
// 	var damage;
// 	var startFrame = start;
// 	this.
// 	var iradius = self.radius
// 	this.cX = x;
// 	this.cY = y;
// 	this.scale = 1
// 	var decay = 10
// 
// 	this.finished = function(){
// 		return 
// 	}
// }
// 
// var initialise = function() {
// 	unfortunates = mSM.withinRange(self.cX, self.cY, radius, true, true)
// 	for (var i=0; i < unfortunates.length; i++) {
// 		unfortunates[i].takeBullet(damage);
// 	};
// }


addExplosion = function(x, y,radius,start,damage){
	addSprite('ex', {
		type: 'Explosion',
		cX: x,
		cY: y,
		decay: 10,
		radius: radius,
		iradius: radius,
		color: 'rgba(255, 100, 0,1)',
		scale: 1,
		startFrame: frameNum,
		enterFrame: function(){
			if(frameNum - this.startFrame < this.decay){
				this.scale = (frameNum - this.startFrame) / this.decay;
				this.radius = this.iradius + (this.iradius * this.scale)
				opacity = 1 - (this.scale * .5)
				this.color = 'rgba(255, 100, 0, '+ opacity+')'
			} else {
				removeSprite('ex', this.id)
			}
		}
	})
}