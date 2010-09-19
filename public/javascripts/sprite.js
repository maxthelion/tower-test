var id;
var sprites;
var spritesArray;

var initSprites = function(){
	id = 0;
	sprites = {}
	spritesArray = []
	sprites.tn = {} // terrain
	sprites.b = {} // bases
	sprites.bits = {} // bases
	sprites.ex = {} // explosions
	sprites.t = {} // turrets
	sprites.s = {} // ground units
	sprites.a = {} // air units
}

var redoSprites = function(){
	spritesArray = []
	for (i in sprites){
		for(j in sprites[i]){
			spritesArray.push(sprites[i][j])
		}
	}
}

var getSprite = function(key, id){
	return sprites[key][id];
}

var removeSprite = function(key, id){
	delete sprites[key][id];
	redoSprites();
}

var addSprite = function(k, sprite) {
	id++;
	sprites[k][id] = sprite;
	sprite.remove = function(){
		removeSprite(k, this.id)
	}
	redoSprites();
	sprite.id = id;
	return sprite;
}