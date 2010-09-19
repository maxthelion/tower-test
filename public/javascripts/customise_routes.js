var myGame;
var createCompatibleCanvas = function(id, width, height){
  var canvas = document.createElement('canvas');
  canvas.setAttribute('id', id);
  canvas.setAttribute('class', 'canvasIcon');
  canvas.setAttribute('height', height);
  canvas.setAttribute('width', width);
  return canvas;
}

function spriteCanvas(sprite, size){
 	canvas = createCompatibleCanvas('foof', size, size);
	var ctx = canvas.getContext('2d');
	cw = 20
	ch = 20
	x = 10
	y = 10
	ctx.drawImage(sprites_img, sprite.spriteX, 0, cw, ch, x - cw/2, y - cw/2, size, size)
	return canvas;
}
var sprites_img;
$().ready(function(){	
    $.sammy.raise_errors = true;
    var app = $.sammy(function() {

    this.raise_errors = true;
    
    this.get('#/', function(){
      addLevelSelect()
      $('#customise').show();
      
    });
    
    this.get('#/levels/:id/customise', function(){
      addLevelSelect();
			if(levels[this.params.id]){
				setLevel(this.params.id);
	      $('#levelPane').show();
	      $('#customise').show();
			} else {
				this.redirect('#/')
			}
    });

    this.get('#/levels/new', function(){
			var newLevel = {
				startPoints: [],
				endPoint: null,
				waves: [],
				terrain: [],
				unbuildables: [],
				availableUnitIds: []
			}
			levels.push(newLevel);
      this.redirect('#/levels/'+(levels.length - 1)+'/customise')
    });

    this.post('#/levels/:id/waves', function(){
      var level = levels[this.params.id];
			var newWave = [[
				this.params.unitId,
				this.params.frequency,
				this.params.number
				], 0
			]
			level.waves.push(newWave)
			this.redirect('#/levels/'+this.params.id+'/customise')
    });

  });
  
  sprites_img = new Image(); 
  sprites_img.src = 'soldier.png';
	sprites_img.onload = function(){
    app.run('#/');
	}
});

