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
    ctx.beginPath();
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 1;
    for (var i = 0; i < width; i++) {
      ctx.moveTo(i* gridXInterval, 0);
      ctx.lineTo(i* gridXInterval, gridHeight)
    };
    for (var i = 0; i < height; i++) {
      ctx.moveTo(0, i*gridYInterval);
      ctx.lineTo(gridWidth, i*gridYInterval);
    };
    ctx.stroke();
    drawCorpses();
    drawStartAndEnd();
    drawTurrets();
    // drawPath();
    drawSoldiers();
    drawHighLight();
    drawBits();
    drawTerrain();
  };
  
  // called from the setinterval
  this.public_draw = function(){
    draw();
  }
  
  var drawHighLight = function(){
    if(highLight && !nuking){
      // check there is money
	    if(money < myTurretManager.cost(currentTurretIndex)){
	      var color = '255, 0, 0';
	    } else {
	      var color = '0, 255, 0';
	    }
      drawCircle(
        highLight[0],
        highLight[1],
        'rgb(' + color +')'
      );
      r = myTurretManager.getTurretTypes()[currentTurretIndex]['range'] * 2 + 1
      drawCircle(
        highLight[0],
        highLight[1],
        'rgba('+color+', 0.3)',
        r
      );
    } else if (highLight && nuking){
      var color = '255, 255, 0';
      drawCircle(
        highLight[0],
        highLight[1],
        'rgba('+color+', 0.3)',
        nukeRadius * 2 + 1
      );
    }
  };
  
  var drawCircle = function(x, y, mycolor, radius){
    radius = radius ? radius : 1
    ctx.beginPath();
    ctx.fillStyle = mycolor;
    ctx.arc(
      x * gridXInterval + gridXInterval / 2, 
      y * gridYInterval + gridXInterval / 2,
      radius * gridXInterval / 2,
      0,
      Math.PI*2,
      true
    );
    ctx.fill();
  }
  
  var drawTurrets = function(){
    for(var i =0; i < myTurretManager.allTurrets().length; i++){
      var turret = myTurretManager.allTurrets()[i]
      drawCircle(
        turret.getPosition()[0],
        turret.getPosition()[1],
        turret.getColor()
      );
    }
    // gonna do this in 2 loops for now - wasteful
    for(var i =0; i < myTurretManager.allTurrets().length; i++){
      var turret = myTurretManager.allTurrets()[i]
      connectTarget(turret);
    }
  }
  
  var connectTarget = function(turret){
    var soldier = turret.targettedSoldier();
    if (soldier){
      ctx.beginPath()
      tx = turret.getPosition()[0] * gridXInterval + gridXInterval/2
      ty = turret.getPosition()[1] * gridYInterval + gridYInterval/2
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
        ctx.beginPath()
        radius = 5
        // flame
		    ctx.fillStyle = 'orange';
        ctx.arc(
          coords[0], 
          coords[1],
          radius,
          0,
          Math.PI*2,
          true
        );
        ctx.fill();
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
    ctx.fillStyle = 'yellow';
    ctx.fillRect(startPoint[0]* gridXInterval, startPoint[1]*gridYInterval, gridXInterval, gridYInterval);
    ctx.fillRect(endPoint[0]* gridXInterval, endPoint[1]*gridYInterval, gridXInterval, gridYInterval);
  }
  
  var drawPath = function(){
    for(var x, y, i = 0, j = result.length; i < j; i++) {
			x = result[i][0];
			y = result[i][1];
			ctx.fillStyle = 'blue';
	    ctx.fillRect(x* gridXInterval, y*gridYInterval, gridXInterval, gridYInterval);
		}
  };
  
  var drawSoldiers = function() {
    for (var i=0; i < mySoldierManager.allSoldiers().length; i++) {
      drawSoldier(mySoldierManager.allSoldiers()[i]);
    };
  };
  
  var drawSoldier = function(soldier){
    x = soldier.getCurrentPosition()[0];
		y = soldier.getCurrentPosition()[1];
		ctx.fillStyle = soldier.getColor();
    ctx.fillRect(
      x - soldier.getSize()/2, 
      y - soldier.getSize()/2, 
      soldier.getSize(), 
      soldier.getSize()
    );
    // draw the health

    var barLength = 20
    //background
    ctx.fillStyle = 'red'
    ctx.fillRect(
      x - barLength / 2,
      y - 15,
      barLength,
      5
    )
    ctx.fillStyle = 'rgb(0,255, 0)'
    ctx.fillRect(
      x - barLength / 2,
      y - 15,
      barLength * soldier.getHealthPercentage(),
      5
    )
  }
  
  var drawCorpses = function() {
    for (var i=0; i < corpses.length; i++) {
      drawCorpse(corpses[i]);
    };
  };
  
  var drawBits = function(){
    for (var i=0; i < bits.length; i++) {
      var bit = bits[i]
      if (bit == null)
        continue
        
      if (bit.startTime > frameNum - 5) {
	      bit.cX += bit.speedX
	      bit.cY += bit.speedY
      } else if (bit.startTime < frameNum - 100) {
        bit = null
        continue
      }
      var opacity =  1 - (frameNum - bit.startTime) / 100;
      ctx.beginPath();
	    ctx.fillStyle = 'rgba(255, 0, 0, '+ opacity+')';
      ctx.arc(
        bit.cX, 
        bit.cY,
        2,
        0,
        Math.PI*2,
        true
      );
      ctx.fill();
    };
  }
  
  var drawCorpse = function(corpse){
    drawCircle(
      corpse[0],
      corpse[1],
      'rgba(255,0,0,0.1)'
    );
  };
  
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
    
    if(nuking){
      unfortunates = mySoldierManager.withinRange(xIndex, yIndex, nukeRadius)
      for (var i=0; i < unfortunates.length; i++) {
        unfortunates[i].takeBullet(100);
      };
      return false;
    };
    
    if (grid[yIndex][xIndex] == 1)
      return false // can't put things on top of each other
      
    // check there is money
    if(money < myTurretManager.cost(currentTurretIndex)){
			$('#notice').text('Not enough money, bozo!')
      // no money
      return false
    }
    grid[yIndex][xIndex] = 1;
    // check the global path
    result = AStar(grid, startPoint, endPoint, "Manhattan");
    if (result.length == 0){ // fail to connect
      grid[yIndex][xIndex] = 0;
	    result = AStar(grid, startPoint, endPoint, "Manhattan");
	    return false
    };
    //check for all the soldiers
    for (var i=0; i < mySoldierManager.allSoldiers().length; i++) {
      if (!mySoldierManager.allSoldiers()[i].regeneratePath()) {
        grid[yIndex][xIndex] = 0;
		    result = AStar(grid, startPoint, endPoint, "Manhattan");
        return false;
      }
    };
    highLight = null;
    myTurretManager.createTurret([xIndex, yIndex]);
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
