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
		if(
			startSelectionX &&
			startSelectionY &&
			endSelectionX &&
			endSelectionY
			){
				console.log('aa')
			ctx.fillStyle = 'yellow'
			ctx.fillRect(startSelectionX,endSelectionY,
				endSelectionX - startSelectionX, 
				startSelectionY - endSelectionY);	
		}
		// draw turrets
		for(var i =0; i < spritesArray.length; i++){
			u = spritesArray[i]
			if (u.selected) {
				ctx.fillStyle = 'yellow'
				ctx.fillRect(u.cX - 20,u.cY - 20,40, 40);
			}
			drawSprite(u.spriteX, u.cX, u.cY)
		}
	};
	
	// called from the setinterval
	this.public_draw = function(){
		draw();
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
	
	var startSelectionX,
	    startSelectionY,
		endSelectionX,
		endSelectionY
	$(canvas).mousedown(function(evt){
		startSelectionX = evt.offsetX
		startSelectionY = evt.offsetY
		selecting = true
	})
	
	
	$(canvas).mousemove(function(evt){
		endSelectionX = evt.offsetX
		endSelectionY = evt.offsetY
		selecting = true
	})
	
	
	$(canvas).mouseup(function(evt){
		selecting = false;
		startSelectionX = null
		startSelectionY = null
		endSelectionX = null
		endSelectionY = null
		// var xIndex = MF( evt.offsetX/gridXInterval )
		// var yIndex = MF( evt.offsetY/gridYInterval )
		var x = evt.offsetX
		var y = evt.offsetY
		// check if there is a soldier here already
		// s = checkSoldierAtLocation(x,y)
		soldiers = checkSoldiersWithinSelection(startSelectionX, startSelectionY, x,y)
		// if nothing selected
		if (soldiers){
			// currentSoldier = s;
			// s.selected = true;
			showActionsForSoldier(soldiers[0])
			for (i in soldiers){
				soldiers[i].selected
				currentSoldiers.push(soldiers[i])
			}
			
		} else if ( currentSoldiers && currentAction){
			// currentSoldier.currentAction(x,y)
		} else {
			addSoldier(
				evt.offsetX,
				evt.offsetY
			);
		}
		draw();
	});
	
	// $(canvas).mousemove(function(evt){
	// 	if (!selectedUnit && playing) {
	// 		var xIndex = MF( evt.offsetX/gridXInterval )
	// 		var yIndex = MF( evt.offsetY/gridYInterval )
	// 		highLight = [xIndex, yIndex];
	// 		hlp = self.pointCenterXY(xIndex, yIndex)
	// 	}
	// });
	// 
	// $(canvas).mouseout(function(evt){
	// 	highLight = null;
	// });

	// var showTurretControl = function(t){
	// 	$('#fC').remove()
	// 	var elem = $('<div id="fC"></div>')
	// 	$('#cW').append(elem)
	// 	
	// 	w = elem.width()
	// 	h = elem.height()
	// 	coords = [ t.cX  - (w/2), t.cY  - (h/2) ]
	// 	elem.css('left', coords[0])
	// 	elem.css('top', coords[1])
	// 	// sellAmount = 2
	// 	// upgradeBtn = $('<a>').attr({
	// 	// 	href: '#',
	// 	// 	id: 'upgradeBtn'
	// 	// }).html('<span>^</span><span class="amount">'+sellAmount+'</span>')
	// 	
	// 	sellBtn = $('<a>').attr({
	// 		href: '#',
	// 		id: 'sellBtn'
	// 	}).html('<span>$</span><span class="amount">'+t.sellCost()+'</span>').
	// 	click(function(){
	// 		mUM.sell(t);
	// 		elem.remove();
	// 		selectedUnit = undefined;
	// 		return false;
	// 	})
	// 	
	// 	//elem.append(upgradeBtn)
	// 	elem.append(sellBtn)
	// }
};
