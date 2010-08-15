var selectedUnit;
var Grid = function(canvas_id, grid) {
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
		drawPointSquare(startPoint, 'gray')
		drawPointSquare(endPoint, 'gray')
		drawTurrets();
		drawTerrain();
		drawSoldiers();
		drawExplosions();
		drawHealth(	pixel(endPoint[0])+gridXInterval/2, pixel(endPoint[1])-15,50,10,lives/startLives)
		drawHighLight();
	};
	
	// called from the setinterval
	this.public_draw = function(){
		draw();
	}
	
	var drawExplosions = function(){
		for (var i=0; i < explosions.length; i++) {
			var bit = explosions[i]
			if (bit == null)
				continue
			decay = 10
			if (frameNum - bit.getStartFrame() < decay){
				var scale =	(frameNum - bit.getStartFrame()) / decay;
				var opacity = 1 - (scale * .5)
				radius = radiusFromRange( bit.getRadius() ) * gridXInterval / 2
				drawCircleFromPosition(
					[ bit.getX() * gridXInterval +(gridXInterval /2 ), bit.getY() * gridYInterval+(gridXInterval /2 ) ],
					'rgba(255, 100, 0, '+ opacity+')',
					radius +(radius * scale)
				)
			}
		};
	}
	
	var drawHighLight = function(){
		if(selectedUnit){
			drawCircle( selectedUnit.getPosition()[0], selectedUnit.getPosition()[1], 'rgba(255, 255, 255, 0.5)', 5);
		}
		
		if(highLight && squareAvaliable(highLight[0], highLight[1] )){
			// check there is money
			var color = (money < currentUnit()['cost']) ? '255, 0, 0' : '0, 255, 0';
			drawCircle( highLight[0], highLight[1], 'rgb(' + color +')');
			drawCircle( highLight[0], highLight[1], 'rgba('+ color +', 0.3)', radiusFromRange(currentUnit()['range']));
		} else if(highLight){
			if (myUnitMangager.unitAt(highLight)){
				var u = myUnitMangager.unitAt(highLight);
				drawCircle( highLight[0], highLight[1], 'rgba(255, 200, 0, 0.5)');
			}
		}
	};

	var squareAvaliable = function(x, y){
		return grid[y][x] != 1;
	}
	
	var radiusFromRange = function(range){
		return range * 2 + 1
	}
	
	var drawCircle = function(x, y, mycolor, radius){
		radius = radius ? radius : 1
		drawCircleFromPosition(
			[
				x * gridXInterval + gridXInterval / 2,
				y * gridYInterval + gridXInterval / 2
			],
			mycolor,
			radius * gridXInterval / 2
		);
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
			drawCircle(
				unit.getPosition()[0],
				unit.getPosition()[1],
				unit.getColor(),
				unit.getSize()
			);
			// see if they are a turret
			if (unit.targettedSoldier)
				drawBarrel(unit);
		}
	}
	
	var drawBarrel = function(turret){
		var soldier = turret.targettedSoldier();
		if (soldier){
			ctx.beginPath()
			tx = pixel(turret.getPosition()[0]) + gridXInterval/2
			ty = pixel(turret.getPosition()[1]) + gridYInterval/2
			ctx.moveTo(tx, ty )
			sx = soldier.getCurrentPosition()[0]
			sy = soldier.getCurrentPosition()[1]
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
	
	// takes point values
 	var drawPointSquare = function(p, c){
		ctx.fillStyle = 'gray';
		ctx.fillRect(
			p[0]* gridXInterval, 
			p[1]* gridYInterval, 
			gridXInterval, 
			gridYInterval
		);
	};
	
	// takes pixels
	var drawSquare = function(x, y, w, c){
		ctx.fillStyle=c;
		ctx.fillRect(x,y,w,w);
	}
	
	var drawPath = function(){
		for(var x, y, i = 0, j = result.length; i < j; i++) {
			x = result[i][0];
			y = result[i][1];
			ctx.fillStyle = 'white';
			ctx.fillRect(x* gridXInterval, y*gridYInterval, gridXInterval, gridYInterval);
		}
	};
	
	var drawSoldiers = function() {
		us = mySoldierManager.allUnits();
		for (var i=0; i < us.length; i++) {
			drawSoldier(us[i]);
		};
		for (var i=0; i < us.length; i++) {
			s= us[i]
			x = s.getCurrentPosition()[0];
			y = s.getCurrentPosition()[1];
			drawHealth(x,y-20,20,5,s.healthpercent);
		};
	};
	
	var drawSoldier = function(s){
		x = s.getCurrentPosition()[0];
		y = s.getCurrentPosition()[1];
		w = s.size * gridXInterval;
		if (s.isOnFire()){
			drawCircleFromPosition(s.getCurrentPosition(),'orange',w/(1 + Math.random()))
		}
		drawCircleFromPosition( s.getCurrentPosition(), s.getColor(), w/2);
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
			drawCircleFromPosition([bit.cX, bit.cY], 'rgba(255, 0, 0, '+ opacity+')',bloodSpatterSize);
		};
	}
	
	var drawTerrain = function(){
		for (var i=0; i < terrain.length; i++) {
			drawCircle(
				terrain[i][0],
				terrain[i][1],
				'brown'
			);
		};
	}
	
	this.pointCenterXY = function(x, y){
		return [
			x * gridXInterval + (gridXInterval/2), 
			y * gridYInterval + (gridXInterval/2)
		]
	};
	
	this.cellFromPosition = function(position){
		var xIndex = Math.floor( position[0] / gridXInterval )
		var yIndex = Math.floor( position[1] / gridYInterval )
		return [xIndex, yIndex];
	};
	
	draw();
	
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
		coords = [
			t.getPosition()[0] * gridXInterval - (w/2) + (gridXInterval /2),
			t.getPosition()[1] * gridYInterval - (h/2) + (gridYInterval /2)
		]
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

