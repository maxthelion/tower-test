var CanvasManager = function(canvas, gridManager) {
	var self = this;
	var canvas =  canvas;
	var ctx = canvas.getContext('2d');
	var gridHeight = canvas.height;
	var gridWidth = canvas.width;
	var highLight;
	this.selectedUnit;
	
	var draw = function(){
		ctx.clearRect(0,0,gridWidth, gridHeight);
		ctx.fillStyle = '#e3d19b'
		ctx.fillRect(0,0,gridWidth, gridHeight);
		// draw turrets
		for(var i =0; i < spritesArray.length; i++){
			var u = spritesArray[i]
			if (u.bss){ // blood spatter
				dCircle(u.cX, u.cY, u.color, u.bss);
				continue
			}
			if (u.type == 'Explosion'){
				dCircle( u.cX, u.cY ,u.color, u.radius)
				continue
			}
			if (u.isOnFire && u.isOnFire()){
				w = gridManager.cellWidth;
				dCircle(u.cX, u.cY,'orange',w/(1 + Math.random()))
			}
			if (u.spriteX != undefined)
				drawSprite(u.spriteX, u.cX, u.cY)
			// see if they are a turret
			if (u.tSoldier)
				drawBarrel(u);
			if (u.healthpercent)
				drawHealth(u.cX,u.cY-20,20,5,u.healthpercent);
			// if(u.base)
			// 	drawHealth(u.cX, u.cY-30,50,10,u.healthpercent);
			if(u.projectileSize){
				dCircle( u.cX, u.cY, 'black', u.projectileSize);
			}
		}
		// draw highlight
		if(self.selectedUnit){
			dCircle( selectedUnit.cX, selectedUnit.cY, 'rgba(255, 255, 255, 0.5)', 50);
		}
		if(self.highLight){
			if (self.highLight.unit)
				drawSprite(self.highLight.unit.spriteX, self.highLight.cX, self.highLight.cY)
			dCircle( self.highLight.cX, self.highLight.cY, 'rgba('+ self.highLight.haloColor +', 0.3)', self.highLight.range);
		} 
	};
	
	// called from the setinterval
	this.public_draw = function(){
		draw();
	}

	var squareAvaliable = function(x, y){
		return grid[y][x] != 1;
	}
	
	this.radiusFromRange = function(range){
		return ((range * 2 + 1 ) / 2) * gridXInterval;
	}
	
	var dCircle = function(x, y, mycolor, radius){
		ctx.beginPath();
		ctx.fillStyle = mycolor;
		ctx.arc(
		  x,
		  y,
			radius,
			0,
			Math.PI*2,
			true
		);
		ctx.fill();
	}
	
	var drawBarrel = function(t){
		var s = t.tSoldier;
		if (s){
			ctx.beginPath()
			ctx.moveTo( t.cX,  t.cY )
			var c = getNewCoords( t.cX,  t.cY, s.cX, s.cY, 15);
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 2;
			ctx.lineTo(c[0], c[1]);
			ctx.stroke()
			// draw the fire
			if(t.firing){
				dCircle(c[0], c[1], 'orange', 5);
			};
		}
	}
	
	var getNewCoords = function(x1, y1, x2, y2, radius){
		var dx = x2 - x1;
		var dy = y2 - y1;
		var theta = Math.atan2(dy, dx);
		return [
			x1 + (Math.cos(theta) * radius),
			y1 + (Math.sin(theta) * radius)
		]
	}
	
	var pixelC = function(p){
		return gridManager.pixelC(p)
	}
	
	var drawHealth = function(x,y,w,h,health){
		//background
		ctx.fillStyle = 'red'
		ctx.fillRect(x-w/2, y, w, h)
		ctx.fillStyle = 'rgb(0,255, 0)'
		ctx.fillRect(x-w/2, y, w*health, h)
	}
  
	var drawSprite = function(sx, x, y){
		cw = 20
		ch = 20
		ctx.drawImage(sprites_img, sx, 0, cw, ch, x - cw/2, y - cw/2, cw, ch)
	}
	
	this.pointCenterXY = function(x, y){
		return [ pixelC(x), pixelC(y) ]
	};
	
	this.cellFromPosition = function(position){
		var xIndex = MF( position[0] / gridXInterval )
		var yIndex = MF( position[1] / gridYInterval )
		return [xIndex, yIndex];
	};
};



