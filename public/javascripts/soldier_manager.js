var SoldierManager = function(){
	var self = this;
	var id = 0;
	var allSoldiersHash = {
		s: {},
		a: {}
	};
	var allSoldiersArrays = {
		s: [],
		a: []
	};
	
	var soldierTypes = [
		{
		 name: 'lightInfantry',
		 speed: 2,
		 health: 30,
		 size: 0.6,
		 bounty: 1,
		 type: Soldier,
		 sprite: 0
		},
		{
		 name: 'Infantry',
		 speed: 2,
		 health: 100,
		 size: 0.8,
		 bounty: 1,
 		 type: Soldier,
		 sprite: 20
		},
		{
		 name: 'heavyInfantry',
		 speed: 2,
		 health: 300,
		 size: 1,
		 bounty: 4,
 		 type: Soldier,
		 sprite: 40
		},
		{
		 name: 'MediumInfantry',
		 speed: 2,
		 health: 200,
		 size: 0.8,
		 bounty: 1,
 		 type: Soldier,
			sprite: 60
		},
		{
		 name: 'bike',
		 speed: 3,
		 health: 100,
		 size: 0.8,
		 bounty: 2,
 		 type: Soldier,
		sprite: 80
		},
		{
		 name: 'megatron',
		 speed: 2,
		 health: 1000,
		 size: 1.2,
		 bounty: 10,
 		 type: Soldier,
		 sprite: 100
		},
		{
		 name: 'helicopter',
		 speed: 2,
		 health: 100,
		 size: 1.2,
		 bounty: 1,
		 type: Helicopter,
		 sprite: 120
		}
	];
	
	this.allSoldiers = function(){
		return allSoldiersArrays['s'];
	};
	
	this.getAircraft = function(){
		return allSoldiersArrays['a'];
	}

	this.allUnits = function(ground, air){
		var s = []
		ground = (ground == undefined) ? true : ground
		air = (air == undefined) ? true : air
		if (air) 
			s = s.concat(allSoldiersArrays['a'])
		if (ground) 
			s = s.concat(allSoldiersArrays['s'])
		return s;
	};
	
	this.moveUnits = function(){
	  var a = self.allUnits()
		for (var i=0; i < a.length; i++) {
			a[i].move();
		};
	}
	
	var addSoldier = function(a){
		var key = keyFromSoldier(a)
		allSoldiersHash[key][a.id] = a;
		a.destC = function(){
			explosions.push( new Explosion(a.cX, a.cY, 1, frameNum, 0) );
			removeSoldier(a);
			loseLife();
		}
		a.dC = function(){
		  incrementKills(a.bounty);
			removeSoldier(a);
		}
		redoHash(key)
	}
	
	redoHash = function(key){
		allSoldiersArrays[key] = [];
		for( i in allSoldiersHash[key]){
			if(allSoldiersHash[key][i] != null){
				allSoldiersArrays[key].push(allSoldiersHash[key][i]);
			};
		}
	}
	
	var removeSoldier = function(s){
	  corpses.push( new Corpse( s.cX, s.cY ) )
		allSoldiersHash[keyFromSoldier(s)][s.id] = null;
		redoHash(keyFromSoldier(s))
	}
	
	this.createSoldier = function(typeIndex){
		var newId = id++;
		var template = soldierTypes[typeIndex]
		object = template['type'] // soldier or heli
		soldier = new object(startPoint, endPoint, grid, template, newId);
		addSoldier(soldier);
		return soldier;
	};
	
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