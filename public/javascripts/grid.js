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
	var result = AStar(grid, startPoint, endPoint, "Manhattan");
	
	var draw = function(){
		ctx.clearRect(0,0,gridWidth, gridHeight);
		ctx.fillStyle = '#e3d19b'
		ctx.fillRect(0,0,gridWidth, gridHeight);
		drawBits();
		drawSprite(160, pixelC(endPoint[0]), pixelC(endPoint[1]))
		drawSprite(180, pixelC(startPoint[0]), pixelC(startPoint[1]))
		drawTurrets();
		drawTerrain();
		drawSoldiers();
		drawExplosions();
		// would normally do pixelC on the y as welll
		drawHealth(	pixelC(endPoint[0]), pixel(endPoint[1])-15,50,10,lives/startLives)
		drawHighLight();
	};
	
	// called from the setinterval
	this.public_draw = function(){
		draw();
	}
	
	var drawExplosions = function(){
		for (var i=0; i < explosions.length; i++) {
			var e = explosions[i]
			if (e.finished())
				continue
			decay = 10
			var opacity = 1 - (e.scale * .5)
			drawCircleFromPosition(
				[ e.cX, e.cY ],
				'rgba(255, 100, 0, '+ opacity+')',
				e.radius +(e.radius * e.scale)
			)
		};
	}
	
	var drawHighLight = function(){
		if(selectedUnit){
			drawCircleFromPosition( [selectedUnit.cX, selectedUnit.cY], 'rgba(255, 255, 255, 0.5)', 50);
		}
		
		if(highLight && squareAvaliable(highLight[0], highLight[1] )){
			// check there is money
			var color = (money < currentUnit()['cost']) ? '255, 0, 0' : '0, 255, 0';
			drawCircleFromPosition( [pixelC(highLight[0]), pixelC(highLight[1])], 'rgb(' + color +')', gridXInterval/2);
			drawCircleFromPosition( [pixelC(highLight[0]), pixelC(highLight[1])], 'rgba('+ color +', 0.3)', self.radiusFromRange(currentUnit()['range']));
		} else if(highLight){
			if (myUnitMangager.unitAt(highLight)){
				var u = myUnitMangager.unitAt(highLight);
				drawCircleFromPosition( [pixelC(highLight[0]), pixelC(highLight[1])], 'rgba(255, 200, 0, 0.5)', gridXInterval/2);
			}
		}
	};

	var squareAvaliable = function(x, y){
		return grid[y][x] != 1;
	}
	
	this.radiusFromRange = function(range){
		return ((range * 2 + 1 ) / 2) * gridXInterval;
	}
	
	var drawCircleFromPosition = function(position, mycolor, radius){
		ctx.beginPath();
		ctx.fillStyle = mycolor;
		ctx.arc(		
			position[0],
			position[1],
			radius,
			0,
			Math.PI*2,
			true
		);
		ctx.fill();
	}
	
	var drawTurrets = function(){
		for(var i =0; i < units.length; i++){
			var unit = units[i]
			// drawCircleFromPosition(
			// 	[
			// 		unit.cX,
			// 		unit.cY
			// 	],
			// 	unit.getColor(),
			// 	unit.size * gridXInterval / 2
			// );
			drawSprite(200, unit.cX, unit.cY)
			// see if they are a turret
			if (unit.targettedSoldier)
				drawBarrel(unit);
		}
	}
	
	var drawBarrel = function(turret){
		var soldier = turret.targettedSoldier();
		if (soldier){
			ctx.beginPath()
			tx = turret.cX
			ty = turret.cY
			ctx.moveTo(tx, ty )
			sx = soldier.cX
			sy = soldier.cY
			var coords = getNewCoords(tx, ty, sx, sy, 15);
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 2;
			ctx.lineTo(coords[0], coords[1]);
			ctx.stroke()
			// draw the fire
			if(turret.isFiring()){
				drawCircleFromPosition(coords, 'orange', 5);
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
	
	var pixel = function(p){
		return p * gridXInterval;
	}
	
	var pixelC = function(p){
		return p * gridXInterval + (gridXInterval / 2);
	}
		
	var drawSoldiers = function() {
		us = mySoldierManager.allUnits();
		for (var i=0; i < us.length; i++) {
			drawSoldier(us[i]);
		};
		for (var i=0; i < us.length; i++) {
			s = us[i]
			drawHealth(s.cX,s.cY-20,20,5,s.healthpercent);
		};
	};
	
	var drawSoldier = function(s){
		w = s.size * gridXInterval;
		if (s.isOnFire()){
			drawCircleFromPosition([s.cX, s.cY],'orange',w/(1 + Math.random()))
		}
		drawSprite(s.sprite, s.cX, s.cY)
	}
	
	var drawHealth = function(x,y,w,h,health){
		//background
		ctx.fillStyle = 'red'
		ctx.fillRect(x-w/2, y, w, h)
		ctx.fillStyle = 'rgb(0,255, 0)'
		ctx.fillRect(x-w/2, y, w*health, h)
	}
	
	var drawBits = function(){
		for (var i=0; i < bits.length; i++) {
			var bit = bits[i]
			if (bit == null)
				continue
				
			if (bit.startTime > frameNum - 5) {
				bit.cX += bit.speedX
				bit.cY += bit.speedY
			} else if (bit.startTime < frameNum - 200) {
				bit = null
				continue
			}
			var opacity =	1 - (frameNum - bit.startTime) / 200;
			drawCircleFromPosition([bit.cX, bit.cY], 'rgba(255, 0, 0, '+ opacity+')', bloodSpatterSize);
		};
	}
	
	var drawSprite = function(sIndex, x, y){
		cw = 20
		ch = 20
		sy = 0 
		ctx.drawImage(sprites_img, sIndex, sy, cw, ch, x - cw/2, y - cw/2, cw, ch)
	}
	
	var drawTerrain = function(){
		for (var i=0; i < terrain.length; i++) {
			drawSprite(140, pixelC(terrain[i][0]), pixelC(terrain[i][1]) )
		};
	}
	
	this.pointCenterXY = function(x, y){
		return [
			pixelC(x), 
			pixelC(y)
		]
	};
	
	this.cellFromPosition = function(position){
		var xIndex = Math.floor( position[0] / gridXInterval )
		var yIndex = Math.floor( position[1] / gridYInterval )
		return [xIndex, yIndex];
	};
	
	$(canvas).click(function(evt){
		if (playing == false || paused == true){
			return false;
		}
		var xIndex = Math.floor( evt.offsetX/gridXInterval )
		var yIndex = Math.floor( evt.offsetY/gridYInterval )
		u = currentUnit();
		if (selectedUnit){
			$('#floatControl').remove()
			selectedUnit = undefined;
		} else if (squareAvaliable(xIndex, yIndex) && !selectedUnit){
			addUnit(u, xIndex, yIndex);
		} else if (myUnitMangager.unitAt([xIndex, yIndex])){
			t = myUnitMangager.unitAt([xIndex, yIndex])
			highLight = null;
			showTurretControl(t);
			selectedUnit = t;
		}
		draw();
	});
	
	$(canvas).mousemove(function(evt){
		if (!selectedUnit) {
			var xIndex = Math.floor( evt.offsetX/gridXInterval )
			var yIndex = Math.floor( evt.offsetY/gridYInterval )
			highLight = [xIndex, yIndex];
		}
	});
	
	$(canvas).mouseout(function(evt){
		highLight = null;
	});

	var showTurretControl = function(t){
		$('#floatControl').remove()
		var elem = $('<div id="floatControl"></div>')
		$('#canvas_wrapper').append(elem)
		
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
			myUnitMangager.sell(t);
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
	result = AStar(grid, startPoint, endPoint, "Manhattan");
}

var addUnit = function(u, x, y){
	// check there is money
	if(money < u['cost']){
		$('#notice').text('Not enough money, bozo!')
		return false
	}
	if (u['type'] == Explosion){
		return myUnitMangager.createUnit(u, [x, y]);
	}
	
	grid[y][x] = 1;
	// check the global path
	result = AStar(grid, startPoint, endPoint, "Manhattan");
	if (result.length == 0){ // fail to connect
		return revertGridPoint(x, y);
	};
	//check for all the soldiers
	for (var i=0; i < mySoldierManager.allSoldiers().length; i++) {
		if (!mySoldierManager.allSoldiers()[i].regeneratePath()) {
			return revertGridPoint(x, y);
		}
	};
	myUnitMangager.createUnit(u, [x, y]);
}

