var unitTypes = {
  0: {
		name: 'machine gun',
		fireRate: 2,
		range: 1,
		damage: 2,
		cost: 5,
		type: Turret,
		attacks_air: true,
		spriteX: 200,
		upgrade_id: 7
	},
	1: {
		name: 'mortar',
		fireRate: 18,
		range: 3,
		damage: 15,
		cost: 15,
		type: Turret,
		spriteX: 240
	},
	2: {
	   name: 'sniper',
	   fireRate: 100,
	   range: 5,
	   damage: 100,
	   cost: 20,
	   type: Turret
	},
	3: {
	   name: 'heavy cannon',
	   fireRate: 50,
	   range: 4,
	   damage: 30,
	   cost: 20,
	   hC: function(soldier, myFrameNum){
	     explosions.push(new Explosion( soldier.cX, soldier.cY,1, myFrameNum,5) );
	   },
	   type: Turret
	},
	4: {
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
	5: {
		name: 'wall',
		cost: 2,
		type: Obstacle,
		spriteX: 260
	},
	6: {
		name: 'flamer',
		fireRate: 4,
		range: 1,
		damage: 8,
		cost: 7,
		hC: function(soldier, myFrameNum){
			soldier.setAlight(frameNum + 30);
		},
		type: Turret,
		spriteX: 280
	},
	7: {
		name: 'heavy machine gun',
		fireRate: 2,
		range: 1,
		damage: 5,
		cost: 10,
		type: Turret,
		attacks_air: true,
		spriteX: 300
	},
	8: {
		name: 'heavy glue gun',
		fireRate: 10,
		range: 2,
		damage: 0,
		cost: 10,
		hC: function(soldier, myFrameNum){
			soldier.slow(myFrameNum + 50);
		},
		type: Turret,
		spriteX: 220
	},
}

var UnitManager = function(){
	var self = this;
	
	this.createUnit = function(template, position, gridManager){
		// if(template['type'] == Explosion){
		// 	explosions.push( new Explosion( 3, 4, template['range'], frameNum, template['damage']) );
		// 	changeMoney( template['cost'] * -1 );
		// 	return false;
		// };
		var unit = new template['type'](position, template, gridManager);
		var sprite = addSprite('t', unit)
		gridManager.addToSpriteGrid(position[0], position[1], sprite);
	};
	
	this.sell = function(u){
		gridManager.clearCell( t.p[0], t.p[1] );
	}
}
