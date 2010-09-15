var GridManager = function(canvasWidth, canvasHeight){
	var self = this;
	var grid = GridGenerator(15, 15);
	var width = grid[0].length;
	var height = grid.length;
	var unbuildableGrid = GridGenerator(15, 15);
	this.cellWidth = canvasWidth / width;
	this.cellHeight = canvasHeight / height;

	this.pointCenterXY = function(x, y){
		return [ self.pixelC(x), self.pixelC(y) ]
	};
	
	this.cellFromPosition = function(position){
		var xIndex = MF( position[0] / self.cellWidth )
		var yIndex = MF( position[1] / self.cellHeight )
		return [xIndex, yIndex];
	};
	
	this.targetAtPos = function(x, y){
		// if there is something here
		return cellPointFromXY(x, y);
	};
	
	this.squareAvaliable = function(x, y){
		return grid[y][x] != 1 && unbuildableGrid[y][x] != 1;
	}
	
	this.getPath = function(startPoint, endPoint){
		return AStar(grid, startPoint, endPoint, "Manhattan");
	}
	
	this.pathExists = function(startPoint){
	  return self.getPath(startPoint, self.endPoint).length  > 0
	}
	
	this.radiusFromRange = function(range){
		return ((range * 2 + 1 ) / 2) * self.cellWidth;
	}
	
	this.clearCell = function(x, y){
		// back to front x and y again
		grid[y][x] = 0
	}
	
	this.occupy = function(x, y){
	  grid[y][x] = 1;
	}
	
	var makeUnbuildable = function(x, y){
	  unbuildableGrid[y][x] = 1;
	}
	
	this.generateTerrain = function(terrain){
		//add terrain to grid
		for (var i=0; i < terrain.length; i++) {
		  var x = terrain[i][0];
		  var y = terrain[i][1];
		  if(self.squareAvaliable(x, y)){
		 	  self.occupy(x, y);
		 	  self.addSpriteFromPoints(x, y, 140);
		  }
		};
	}
	
	this.addBases = function(startPoints, endPoint){
	  self.endPoint = endPoint;
	  self.startPoints = startPoints;
		myBase = {
			cX: self.pixelC(endPoint[0]), 
			cY: self.pixelC(endPoint[1]), 
			spriteX: 160,
			healthpercent: 1,
			base: true
		}
		addSprite('b', myBase)
		for (var i=0; i < startPoints.length; i++) {
			var startPoint = startPoints[i];
			addSprite('b', {cX: self.pixelC(startPoint[0]), cY: self.pixelC(startPoint[1]), spriteX: 180})
		};
	}
	
	
	this.addUnbuildables = function(unbuildables){
	  if (unbuildables && unbuildables.length > 0){
	    for (var i=0; i < unbuildables.length; i++) {
	      var x = unbuildables[i][0]
	      var y = unbuildables[i][1]
	      makeUnbuildable(x, y)   
		 	  self.addSpriteFromPoints(x, y, 320);
	    };
	  }
	}
	
	this.addSpriteFromPoints = function(x, y, spriteX){
	  addSprite('tn', {cX: self.pixelC(x), cY: self.pixelC(y), spriteX: 320})
	}
	
	var units = function(x, y){ 
		if(startSelectionX ==  x && startSelectionY == y){
			soldiers = checkSoldierAtLocation(x,y)
		} else {
			soldiers = checkSoldiersWithinSelection(startSelectionX, startSelectionY, x,y)
		}
	}	
	
	var cellPointFromXY = function(x, y){
		px = Math.floor(x/self.cellWidth)
		py = Math.floor(y/self.cellHeight)
		return {
			cX: self.cellWidth  * px + ( self.cellWidth / 2) ,
			cY: self.cellHeight * py + ( self.cellHeight / 2),
			pX: px,
			pY: py
		}
	};
	
	this.pixelC = function(p){
		return p * self.cellWidth + (self.cellWidth / 2);
	}
}