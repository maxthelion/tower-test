var Obstacle = function(position, template){
	this.getColor = function(){
		return 'silver';
	};
	
	this.getPosition = function() {
		return position;
	};
	
	this.getSize = function() {
		return template['size']
	}
}

var unitTypes = [
	{
		name: 'machine gun',
		fireRate: 2,
		range: 1,
		color: '#555',
		damage: 2,
		cost: 5,
		size: 0.5,
		type: Turret,
		attacks_air: true
	},
	{
		name: 'mortar',
		fireRate: 20,
		range: 3,
		color: '#999',
		damage: 20,
		cost: 10,
		size: 0.8,
		type: Turret
	},
	{
		name: 'sniper',
		fireRate: 100,
		range: 5,
		color: '#000',
		damage: 100,
		cost: 20,
		size: 0.2,
		type: Turret
	},
	{
		name: 'heavy cannon',
		fireRate: 50,
		range: 4,
		color: '#999',
		damage: 30,
		cost: 20,
		size: 1,
		hitCallback: function(soldier, myFrameNum){
			explosions.push(
				new Explosion(
					soldier.getCurrentPoint(),
					1, 
					myFrameNum,
					5
				) 
			);
		},
		type: Turret
	},
	{
		name: 'glue gun',
		fireRate: 20,
		range: 2,
		color: 'green',
		damage: 0,
		cost: 5,
		hitCallback: function(soldier, myFrameNum){
			soldier.slow(myFrameNum + 30);
		},
		size: 0.4,
		type: Turret
	},
	{
		name: 'nuke',
		damage: 100,
		cost: 30,
		range: 3,
		type: Explosion
	},
	{
		name: 'wall',
		cost: 2,
		type: Obstacle,
		size: 0.6
	},
	{
		name: 'flamer',
		fireRate: 10,
		range: 1,
		color: 'orange',
		damage: 2,
		cost: 3,
		size: 0.5,
		hitCallback: function(soldier, myFrameNum){
			soldier.setAlight(frameNum + 30);
		},
		type: Turret
	},
]

var currentUnit = function(){
	return unitTypes[currentTurretIndex]
};

var units = [];
var turrets = [];
var UnitManager = function(){
	var self = this;
	var positionHash = {};
	
	var addUnitAtPosition = function(p, u){
		if (!positionHash[ p[0] ]){
			positionHash[ p[0] ] = {}
		}
		positionHash[ p[0] ][ p[1] ] = u
	};
	
	this.unitAt = function(p){
		if (!positionHash[p[0]])
			return null
		return positionHash[p[0]][p[1]]
	};
	
	this.createUnit = function(template, position){
		if(template['type'] == Explosion){
			explosions.push( new Explosion(position, template['range'], frameNum, template['damage']) );
			changeMoney( template['cost'] * -1 );
			return false;
		};
		
		var unit = new template['type'](position, template);
		units.push( unit );
		addUnitAtPosition(position, unit);
		changeMoney( template['cost'] * -1 );
		if (template['type'] == Turret) {
			turrets.push(unit)
		};
	};
	
	this.sell = function(unit){
		changeMoney( template['cost'] * -1 );
	}
}
myUnitMangager = new UnitManager();
