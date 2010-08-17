var addCorpse = function(u){
	var i = 3 // create 3 splots
	while (i) {
		addSprite('bits', {
			speedX: 15 - (Math.random() * 30),
			speedY: 15 - (Math.random() * 30),
			cX: u.cX,
			cY: u.cY,
			spriteX: 0,
			color: 'rgb(255, 0, 0)',
			startTime: frameNum,
			enterFrame: function(){
				this.color = 'rgba(255, 0, 0, '+ (1 - ((frameNum - this.startTime) / 200)) +')'
				if (this.startTime > frameNum - 5) {
		  			this.cX += this.speedX
		  			this.cY += this.speedY
			  	} else if (this.startTime < frameNum - 200) {
			  		removeSprite('bits', this.id);
			  	}
			},
			bss: 2
		})
		i--;
	}
}
