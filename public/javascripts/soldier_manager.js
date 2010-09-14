var SoldierManager = function(){
	var self = this;
	var asa = {
		s: [],
		a: []
	};
	
	var soldierTypes = [
		{
		 name: 'lightInfantry',
		 speed: 2,
		 health: 60,
		 bounty: 1,
		 type: Soldier,
		 sprite: 0
		},
		{
		 name: 'Infantry',
		 speed: 2,
		 health: 100,
		 bounty: 1,
		 type: Soldier,
		 sprite: 20
		},
		{
		 name: 'heavyInfantry',
		 speed: 2,
		 health: 500,
		 bounty: 2,
 		 type: Soldier,
		 sprite: 40
		},
		{
		 name: 'MediumInfantry',
		 speed: 2,
		 health: 300,
		 bounty: 1,
 		 type: Soldier,
			sprite: 80
		},
		{
		 name: 'bike',
		 speed: 4,
		 health: 150,
		 bounty: 1,
 		 type: Soldier,
		sprite: 60
		},
		{
		 name: 'megatron',
		 speed: 2,
		 health: 1000,
		 bounty: 10,
 		 type: Soldier,
		 sprite: 100
		},
		{
		 name: 'helicopter',
		 speed: 2,
		 health: 100,
		 bounty: 1,
		 type: Helicopter,
		 sprite: 120
		}
	];
	
	this.allSoldiers = function(){
		return asa['s'];
	};

	this.allUnits = function(ground, air){
		var s = []
		air = (air == undefined) ? false : air
		if (air) 
			s = s.concat(asa['a'])
		if (ground) 
			s = s.concat(asa['s'])
		return s;
	};
	
	this.removeSoldier = function(s){
	  addCorpse(s);
		removeSprite(s.key, s.id);
		redoArrays();
	}
	
	this.createSoldier = function(typeIndex, startPoint, endPoint, grid){
		var template = soldierTypes[typeIndex]
		object = template['type'] // soldier or heli
		var a = new object(startPoint, endPoint, grid, template);
		a.spriteX = template.sprite
		a.key = keyFromSoldier(a)
		addSprite(a.key, a);
		redoArrays()
		return a;
	};
	
	var redoArrays = function(){
		asa['s'] = []
		for (i in sprites['s']){
			asa['s'].push(sprites['s'][i])			
		}
		asa['a'] = []
		for (i in sprites['a']){
			asa['a'].push(sprites['a'][i])
		}
	}
	
	var keyFromSoldier = function(soldier){
		 return (object == Soldier) ? 's' : 'a'
	}

	this.withinRange = function(x, y, range, ground, air){
		var myArray = []
		var soldiers = this.allUnits(ground, air)
			
		for (var i=0; i < soldiers.length; i++) {
			var s = soldiers[i];
			if (s.cX >= x - range && s.cX <= x + range &&
					s.cY >= y - range && s.cY <= y + range ){
				myArray.push(s);
			}
		};
		return myArray;
	}
};