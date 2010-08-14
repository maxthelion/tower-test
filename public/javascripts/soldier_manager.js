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
		 type: Soldier
		},
		{
		 name: 'Infantry',
		 speed: 2,
		 color: 'cyan',
		 health: 100,
		 size: 0.8,
		 bounty: 1,
 		 type: Soldier
		},
		{
		 name: 'heavyInfantry',
		 speed: 2,
		 color: 'grey',
		 health: 300,
		 size: 1,
		 bounty: 4,
 		 type: Soldier
		},
		{
		 name: 'bike',
		 speed: 3,
		 color: 'blue',
		 health: 100,
		 size: 0.8,
		 bounty: 2,
 		 type: Soldier
		},
		{
		 name: 'megatron',
		 speed: 2,
		 color: 'red',
		 health: 1000,
		 size: 1.2,
		 bounty: 10,
 		 type: Soldier
		},
		{
		 name: 'helicopter',
		 speed: 2,
		 color: '#bbb',
		 health: 100,
		 size: 1.2,
		 bounty: 1,
		 type: Helicopter
		},
		{
		 name: 'MediumInfantry',
		 speed: 2,
		 color: 'cyan',
		 health: 200,
		 size: 0.8,
		 bounty: 1,
 		 type: Soldier
		},
	];
	
	this.allSoldiers = function(){
		return allSoldiersArrays['s'];
	};

	this.allUnits = function(){
		var soldiers = []
		soldiers = soldiers.concat(allSoldiersArrays['a'])
		soldiers = soldiers.concat(allSoldiersArrays['s'])
		return soldiers;
	};
	
	this.moveUnits = function(){
		for (var i=0; i < self.allUnits().length; i++) {
			self.allUnits()[i].move();
		};
	}
	
	var addSoldier = function(a){
		var key = keyFromSoldier(a)
		allSoldiersHash[key][a.getId()] = a;
		soldier.onReachDestination(function(){
			explosions.push( new Explosion(a.getCurrentPoint(), 1, frameNum, 0) );
			corpses.push( new Corpse( a.getCurrentPosition()) )
			removeSoldier(a);
			loseLife();
		})
		soldier.onDie(function(){
			removeSoldier(a);
			corpses.push( new Corpse( a.getCurrentPosition()) )
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
		allSoldiersHash[keyFromSoldier(s)][s.getId()] = null;
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
	
	this.getAircraft = function(){
		return allSoldiersArrays['a'];
	}
	

	this.withinRange = function(x, y, range, ground, air){
		var myArray = []
		var soldiers = []
		if (air) 
			soldiers = soldiers.concat(allSoldiersArrays['a'])
		if (ground) 
			soldiers = soldiers.concat(allSoldiersArrays['s'])
			
		for (var i=0; i < soldiers.length; i++) {
			var soldier = soldiers[i];
			if (soldier.getCurrentPoint()[0] >= x-range && 
						soldier.getCurrentPoint()[0] <= x+range &&
					soldier.getCurrentPoint()[1] >= y-range && 
						soldier.getCurrentPoint()[1] <= y+range ){
				myArray.push(soldier);
			}
		};
		return myArray;
	}
};