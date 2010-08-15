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
		 color: '#bbb',
		 health: 30,
		 size: 0.6,
		 bounty: 1,
		 type: Soldier,
		 sprite: 0
		},
		{
		 name: 'Infantry',
		 speed: 2,
		 color: 'cyan',
		 health: 100,
		 size: 0.8,
		 bounty: 1,
 		 type: Soldier,
		 sprite: 20
		},
		{
		 name: 'heavyInfantry',
		 speed: 2,
		 color: 'grey',
		 health: 300,
		 size: 1,
		 bounty: 4,
 		 type: Soldier,
		 sprite: 40
		},
		{
		 name: 'MediumInfantry',
		 speed: 2,
		 color: 'cyan',
		 health: 200,
		 size: 0.8,
		 bounty: 1,
 		 type: Soldier,
			sprite: 60
		},
		{
		 name: 'bike',
		 speed: 3,
		 color: 'blue',
		 health: 100,
		 size: 0.8,
		 bounty: 2,
 		 type: Soldier,
		sprite: 80
		},
		{
		 name: 'megatron',
		 speed: 2,
		 color: 'red',
		 health: 1000,
		 size: 1.2,
		 bounty: 10,
 		 type: Soldier,
		sprite: 100
		},
		{
		 name: 'helicopter',
		 speed: 2,
		 color: '#bbb',
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

	this.allUnits = function(){
		var s = []
		s = s.concat(allSoldiersArrays['a'])
		s = s.concat(allSoldiersArrays['s'])
		return s;
	};
	
	this.moveUnits = function(){
		for (var i=0; i < self.allUnits().length; i++) {
			self.allUnits()[i].move();
		};
	}
	
	var addSoldier = function(a){
		var key = keyFromSoldier(a)
		allSoldiersHash[key][a.id] = a;
		soldier.onReachDestination(function(){
			explosions.push( new Explosion(a.cX, a.cY, 1, frameNum, 0) );
			corpses.push( new Corpse( a.cX, a.cY ) )
			removeSoldier(a);
			loseLife();
		})
		soldier.onDie(function(){
			removeSoldier(a);
			corpses.push( new Corpse( a.cX, a.cY ) )
		})
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
		var soldiers = []
		if (air) 
			soldiers = soldiers.concat(allSoldiersArrays['a'])
		if (ground) 
			soldiers = soldiers.concat(allSoldiersArrays['s'])
			
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