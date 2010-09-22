addExplosion = function(x, y,radius,start,damage){
	unfortunates = mSM.withinRange(x, y, radius, true, true)
	for (var i=0; i < unfortunates.length; i++) {
		unfortunates[i].takeBullet(damage);
	};
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