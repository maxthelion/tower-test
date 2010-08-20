function Soldier(x, y) {
	var self = this;
	this.cX = x;
	this.cY = y;
	this.spriteType = Soldier
	var myPath;
	var pathIndex = 0;
	var currentPoint;
	var nextPoint;
	var target;
	this.actions = [ 'move', 'stop' ]
	
	this.enterFrame = function(){
		currentSpeed = self.speed;
		getNewPos()
		// if (nextPoint == undefined){
		// 	self.destC();
		// 	return false
		// } else if ( cell[0] == nextPoint[0] && cell[1] == nextPoint[1]) {
		// 	pathIndex++
		// 	if (pathIndex < myPath.length){
		// 		currentPoint = myPath[pathIndex];
		// 		nextPoint		= myPath[pathIndex + 1];
		// 		if (nextPoint)
		// 			nextPosition = mygrid.pointCenterXY(nextPoint[0], nextPoint[1]);
		// 	} 
		// }
	}
	
	this.doCurrentAction = function(action, x, y){
		if (action == 'move') {			
			target = {
				cX: x,
				cY: y
			}
		}
	}
	
	this.stop = function(){
		target = null
	}
	
	// var getNewPos = function(){
  //     if(nextPoint){
  //    xSpeed = (nextPoint[0] == currentPoint[0]) ? currentSpeed : currentSpeed * (nextPoint[0] - currentPoint[0])
  //   if (Math.abs(nextPosition[0] - self.cX) >= currentSpeed){
  //     self.cX += xSpeed;
  //   } else {
  //     self.cX = nextPosition[0];
  //   }
  //    ySpeed = (nextPoint[1] == currentPoint[1]) ? currentSpeed : currentSpeed * (nextPoint[1] - currentPoint[1])
  //   if (Math.abs(nextPosition[1] - self.cY) >= currentSpeed){
  //     self.cY += ySpeed;
  //   } else {
  //     self.cY = nextPosition[1];
  //   }
  //  }
	// }
	
	var getNewPos = function(){
		if (target){
			if (target.cX > self.cX){
				self.cX += currentSpeed;
			} else {
				self.cX -= currentSpeed;
			}
			if (target.cY > self.cY){
				self.cY += currentSpeed;
			} else {
				self.cY -= currentSpeed;
			}
		}
	}
	
	// this.regeneratePath = function(){
	// 	var newPath = AStar(grid, currentPoint, endPoint, "Manhattan");
	// 	if (newPath.length == 0){
	// 		return false;
	// 	} else {
	// 		pathIndex = 0;
	// 		myPath = newPath;
	// 		return true;			
	// 	};
	// }

	// var initialise = function(){
	// 	myPath = AStar(grid, startPoint, endPoint, "Manhattan");
	// 	currentPoint = myPath[pathIndex];
	// 	nextPoint = myPath[pathIndex + 1];
	// }
	// 
	// initialise();
}