var unitTypes = [
	{
		name: 'machine gun',
		fireRate: 2,
		range: 1,
		damage: 1,
		cost: 5,
		type: Turret,
		attacks_air: true,
		spriteX: 200
	},
	{
		name: 'mortar',
		fireRate: 20,
		range: 2,
		damage: 15,
		cost: 10,
		type: Turret,
		spriteX: 240
	},
  // {
  //  name: 'sniper',
  //  fireRate: 100,
  //  range: 5,
  //  damage: 100,
  //  cost: 20,
  //  type: Turret
  // },
  // {
  //  name: 'heavy cannon',
  //  fireRate: 50,
  //  range: 4,
  //  damage: 30,
  //  cost: 20,
  //  hC: function(soldier, myFrameNum){
  //    explosions.push(new Explosion( soldier.cX, soldier.cY,1, myFrameNum,5) );
  //  },
  //  type: Turret
  // },
	{
		name: 'glue gun',
		fireRate: 20,
		range: 2,
		damage: 0,
		cost: 5,
		hC: function(soldier, myFrameNum){
			soldier.slow(myFrameNum + 30);
		},
		type: Turret,
		spriteX: 220
	},
  // {
  //  name: 'nuke',
  //  damage: 100,
  //  cost: 30,
  //  range: 3,
  //  type: Explosion
  // },
	{
		name: 'wall',
		cost: 2,
		type: Obstacle,
		spriteX: 260
	},
	{
		name: 'flamer',
		fireRate: 10,
		range: 1,
		damage: 2,
		cost: 3,
		hC: function(soldier, myFrameNum){
			soldier.setAlight(frameNum + 30);
		},
		type: Turret,
		spriteX: 280
	}
]

var currentUnit = function(){
	return unitTypes[currentTurretIndex]
};

sprites['t'] = {}
// var turrets = [];
var UnitManager = function(){
	var self = this;
	var positionHash = {};
	var turretHash = {}
	
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
		// if(template['type'] == Explosion){
		// 	explosions.push( new Explosion( 3, 4, template['range'], frameNum, template['damage']) );
		// 	changeMoney( template['cost'] * -1 );
		// 	return false;
		// };
		var unit = new template['type'](position, template);
		unit.spriteX = template.spriteX;
		addSprite('t', unit)
		addUnitAtPosition(position, unit);
		changeMoney( template['cost'] * -1 );
	};
	
	this.sell = function(u){
		changeMoney( u.sellCost() );
		removeSprite('t', u.id);
		// back to front x and y again
		grid[u.p[1]][u.p[0]] = 0
	}
}
mUM = new UnitManager();
