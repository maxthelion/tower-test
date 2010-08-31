var selectedUnit;
var Grid = function(canvas_id, grid) {
	var self = this;
	var canvas = document.getElementById(canvas_id)
	var ctx = canvas.getContext('2d'); 
	var width = grid[0].length;
	var height = grid.length;
	var gridXInterval = canvas.width / width;
	var gridYInterval = canvas.height / height;
	var gridHeight = canvas.height;
	var gridWidth = canvas.width;
	var highLight;
	
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
				w = gridXInterval;
				dCircle(u.cX, u.cY,'orange',w/(1 + Math.random()))
			}
			drawSprite(u.spriteX, u.cX, u.cY)
			// see if they are a turret
			if (u.tSoldier)
				drawBarrel(u);
			if (u.healthpercent){
				drawHealth(u.cX,u.cY-20,20,5,u.healthpercent);
			}
		}
		// would normally do pixelC on the y as welll
		drawHealth(pixelC(endPoint[0]), pixelC(endPoint[1])-30,50,10,lives/startLives)
		// draw highlight
		if(selectedUnit){
			dCircle( selectedUnit.cX, selectedUnit.cY, 'rgba(255, 255, 255, 0.5)', 50);
		}
		if(highLight && squareAvaliable( highLight[0], highLight[1] )){
			// check there is money
			var color = (money < currentUnit()['cost']) ? '255, 0, 0' : '0, 255, 0';
			drawSprite(currentUnit().spriteX, hlp[0], hlp[1])
			dCircle( hlp[0], hlp[1], 'rgba('+ color +', 0.3)', self.radiusFromRange(currentUnit()['range']));
		} else if(highLight){
			if (mUM.unitAt(highLight)){
				var u = mUM.unitAt(highLight);
				dCircle( hlp[0], hlp[1], 'rgba(255, 200, 0, 0.5)', gridXInterval/2);
			}
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
		return p * gridXInterval + (gridXInterval / 2);
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
	
	for (var i=0; i < terrain.length; i++) {
		addSprite('tn', {cX: pixelC(terrain[i][0]), cY: pixelC(terrain[i][1]), spriteX: 140})
	};
	addSprite('b', {cX: pixelC(endPoint[0]), cY: pixelC(endPoint[1]), spriteX: 160})
	for (var i=0; i < startPoints.length; i++) {
		var startPoint = startPoints[i];
		addSprite('b', {cX: pixelC(startPoint[0]), cY: pixelC(startPoint[1]), spriteX: 180})
	};
	
	$(canvas).click(function(evt){
		if (playing == false){
			return false;
		}
		var xIndex = MF( evt.offsetX/gridXInterval )
		var yIndex = MF( evt.offsetY/gridYInterval )
		u = currentUnit();
		if (selectedUnit){
			$('#fC').remove()
			selectedUnit = undefined;
		} else if (squareAvaliable(xIndex, yIndex) && !selectedUnit){
			addUnit(u, xIndex, yIndex);
		} else if (mUM.unitAt([xIndex, yIndex])){
			t = mUM.unitAt([xIndex, yIndex])
			highLight = null;
			showTurretControl(t);
			selectedUnit = t;
		}
		draw();
	});
	
	$(canvas).mousemove(function(evt){
		if (!selectedUnit && playing) {
			var xIndex = MF( evt.offsetX/gridXInterval )
			var yIndex = MF( evt.offsetY/gridYInterval )
			highLight = [xIndex, yIndex];
			hlp = self.pointCenterXY(xIndex, yIndex)
		}
	});
	
	$(canvas).mouseout(function(evt){
		highLight = null;
	});

	var showTurretControl = function(t){
		$('#fC').remove()
		var elem = $('<div id="fC"></div>')
		$('#cW').append(elem)
		
		w = elem.width()
		h = elem.height()
		coords = [ t.cX  - (w/2), t.cY  - (h/2) ]
		elem.css('left', coords[0])
		elem.css('top', coords[1])
		// sellAmount = 2
		// upgradeBtn = $('<a>').attr({
		// 	href: '#',
		// 	id: 'upgradeBtn'
		// }).html('<span>^</span><span class="amount">'+sellAmount+'</span>')
		
		sellBtn = $('<a>').attr({
			href: '#',
			id: 'sellBtn'
		}).html('<span>$</span><span class="amount">'+t.sellCost()+'</span>').
		click(function(){
			mUM.sell(t);
			elem.remove();
			selectedUnit = undefined;
			return false;
		})
		
		//elem.append(upgradeBtn)
		elem.append(sellBtn)
	}
};

var revertGridPoint = function(x, y){
	grid[y][x] = 0;
}
var checkPaths = function(){
	for (var i=0; i < startPoints.length; i++) {
		// check the global path
		var result = AStar(grid, startPoints[i], endPoint, "Manhattan");
		if (result.length == 0){ // fail to connect
			revertGridPoint(x, y);
			return false
		};
	};
}

var addUnit = function(u, x, y){
	// check there is money
	if(money < u['cost'])
		return false
	// if (u['type'] == Explosion)
	// 	return mUM.createUnit(u, [x, y]);
	grid[y][x] = 1;
	if (checkPaths() == false){
		return false
	}
	//check for all the soldiers
	for (var i=0; i < mSM.allSoldiers().length; i++) {
		if (!mSM.allSoldiers()[i].regeneratePath()) {
			return revertGridPoint(x, y);
		}
	};
	mUM.createUnit(u, [x, y]);
}

