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
		drawStartAndEnd();
		drawTurrets();
		drawTerrain();
		drawSoldiers();
		drawExplosions();
		drawHelis();
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
				ctx.beginPath();
				ctx.fillStyle = 'rgba(255, 100, 0, '+ opacity+')';
				ctx.arc(
					bit.getX() * gridXInterval, 
					bit.getY() * gridYInterval,
					radius + (radius * scale),
					0,
					Math.PI*2,
					true
				);
				ctx.fill();
				ctx.beginPath();
			}
		};
	}
	
	var drawHighLight = function(){
		if(highLight){
			// check there is money
			if(money < currentUnit()['cost']){
				var color = '255, 0, 0';
			} else {
				var color = '0, 255, 0';
			}
			drawCircle( highLight[0], highLight[1], 'rgb(' + color +')');
			drawCircle( highLight[0], highLight[1], 'rgba('+ color +', 0.3)', radiusFromRange(currentUnit()['range']));
		} 
	};

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
			drawBarrel(unit);
		}
	}
	
	
	var drawHelis = function(){
		helis = mySoldierManager.getAircraft();
		for(var i =0; i < helis.length; i++){
			var unit = helis[i]
			drawCircleFromPosition(
				unit.getCurrentPosition(),
				unit.getColor(),
				gridXInterval * unit.getSize() / 2
			);
			drawHealth(unit)
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
	
	var drawStartAndEnd = function(){		
		drawPointSquare(startPoint, 'gray')
		drawPointSquare(endPoint, 'gray')
		drawHealth(pixel(endPoint[0]),pixel(endPoint[1]),20,lives/startLives)
	};

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
		for (var i=0; i < mySoldierManager.allSoldiers().length; i++) {
			drawSoldier(mySoldierManager.allSoldiers()[i]);
		};
	};
	
	var drawSoldier = function(s){
		x = s.getCurrentPosition()[0];
		y = s.getCurrentPosition()[1];
		w = s.getSize();
		if (s.isOnFire()){
			w2 = w * 1.5
			drawSquare(x-w2/2,y-w2/2,w2,'orange')
		}
		drawSquare(x-w/2,y-w/2,s.getSize(),s.getColor())
		drawHealth(x-w/2,y-w/2-15,20,s.getHealthPercentage());
	}
	
	var drawHealth = function(x,y,max,health){
		//background
		ctx.fillStyle = 'red'
		ctx.fillRect(x, y, max, 5)
		ctx.fillStyle = 'rgb(0,255, 0)'
		ctx.fillRect(x, y, max*health, 5)
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
		addUnit(u, xIndex, yIndex);
		draw();
	});
	
	$(canvas).mousemove(function(evt){
		var xIndex = Math.floor( evt.offsetX/gridXInterval )
		var yIndex = Math.floor( evt.offsetY/gridYInterval )
		highLight = [xIndex, yIndex];
	});
	
	$(canvas).mouseout(function(evt){
		highLight = null;
	});

};

var addUnit = function(u, x, y){
	// check there is money
	if(money < u['cost']){
		$('#notice').text('Not enough money, bozo!')
		return false
	}
	
	if (grid[y][x] == 1)
		return false // can't put things on top of each other
	
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
	
	var revertGridPoint = function(x, y){
		grid[y][x] = 0;
		result = AStar(grid, startPoint, endPoint, "Manhattan");
	}
	myUnitMangager.createUnit(u, [x, y]);
}
