var GridManager = function(grid, canvasWidth, canvasHeight){
	var self = this;
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
	
	this.makeUnbuildable = function(x, y){
	  unbuildableGrid[y][x] = 1;
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