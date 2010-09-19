function GridGenerator(width, height){
	var	result = new Array(height);
	for(var	j, i = 0; i < height; i++) {
		result[i] = new Array(width);
		for(j = 0; j < width; j++)
			result[i][j] = 0
	};
	return result;
};
MF = Math.floor
MR = Math.random

var GridManager = function(canvasWidth, canvasHeight){
	var self = this;
	var grid = GridGenerator(15, 15);
	var width = grid[0].length;
	var height = grid.length;
	var unbuildableGrid = GridGenerator(15, 15);
	this.cellWidth = canvasWidth / width;
	this.cellHeight = canvasHeight / height;
	var endSprite;

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
		return grid[y][x] != 1 && !unbuildableGrid[y][x];
	}
	
	this.spriteAt = function(x, y){
		return unbuildableGrid[y][x];
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
		if(self.spriteAt(x, y)){
			self.spriteAt(x, y).remove();
			unbuildableGrid[y][x] = null
		}
		// back to front x and y again
		grid[y][x] = 0
	}
	
	this.occupy = function(x, y){
	  grid[y][x] = 1;
	}
	
	this.addToSpriteGrid = function(x, y, sprite){
		unbuildableGrid[y][x] = sprite;
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
	
	this.setEndPoint = function(endPoint){
		if(self.endPoint){
			self.clearCell(self.endPoint[0], self.endPoint[1])
		}
		self.endPoint = endPoint;
		if(endSprite && getSprite('b', endSprite.id)){
			removeSprite('b', endSprite.id)
		}
	  endSprite = myBase = {
			cX: self.pixelC(endPoint[0]), 
			cY: self.pixelC(endPoint[1]), 
			spriteX: 160,
			healthpercent: 1,
			base: true
		};
		var sprite = addSprite('b', myBase);
		self.addToSpriteGrid(endPoint[0], endPoint[1], sprite);
	}
	
	this.addBases = function(startPoints, endPoint){
	  self.startPoints = startPoints;
		if (endPoint){
			self.setEndPoint(endPoint)
		}
		if (startPoints.length > 0){
			for (var i=0; i < startPoints.length; i++) {
				var startPoint = startPoints[i];
				self.addSpriteFromPoints(startPoint[0], startPoint[1], 180)
			};
		};
	}
	
	
	this.addUnbuildables = function(unbuildables){
	  if (unbuildables && unbuildables.length > 0){
	    for (var i=0; i < unbuildables.length; i++) {
	      var x = unbuildables[i][0]
	      var y = unbuildables[i][1]
		 	  self.addSpriteFromPoints(x, y, 320);
	    };
	  }
	}
	
	this.addSpriteFromPoints = function(x, y, spriteX){
	  var sprite = addSprite('tn', {cX: self.pixelC(x), cY: self.pixelC(y), spriteX: spriteX})
		self.addToSpriteGrid(x, y, sprite);
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