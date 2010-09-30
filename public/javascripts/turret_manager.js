var unitTypes = {
  0: {
		name: 'machine gun',
		fireRate: 2,
		range: 1,
		damage: 2,
		cost: 4,
		type: Turret,
		attacks_air: true,
		spriteX: 200,
		upgrade_id: 7,
		description: "Short range, all-purpose gun. Cheap and cheerful. Attacks land and air."
	},
	1: {
		name: 'mortar',
		fireRate: 18,
		range: 3,
		damage: 20,
		cost: 12,
		type: Turret,
		spriteX: 240,
		upgrade_id: 3,
		description: "Longer range weapon. High damage, low fire rate. Attacks ground units."
	},
	2: {
	   name: 'sniper',
	   fireRate: 100,
	   range: 5,
	   damage: 100,
	   cost: 20,
	   type: Turret,
		 description: "One man and his gun. Slow fire rate, but high damage. Attacks ground units."
	},
	3: {
	   name: 'heavy cannon',
	   fireRate: 50,
	   range: 4,
	   damage: 30,
	   cost: 20,
	   hC: function(soldier, myFrameNum){
			 addExplosion(soldier.cX, soldier.cY, 30, myFrameNum, 5);
	   },
		spriteX: 240,
	  type: Turret,
		upgrade: true,
		description: "Upgrade from mortar. Increases damage and range. Causes collateral damage to other soldiers. Attacks ground units."
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
		spriteX: 220,
		upgrade_id: 8,
		description: "Slows enemy soldiers for a short period of time. Attacks ground units."
	},
	5: {
		name: 'wall',
		cost: 2,
		type: Obstacle,
		spriteX: 260,
		description: "Stops units from moving, but does no damage to them. Affects ground units."
	},
	6: {
		name: 'flamer',
		fireRate: 4,
		range: 1,
		damage: 8,
		cost: 9,
		hC: function(soldier, myFrameNum){
			soldier.setAlight(frameNum + 30);
		},
		type: Turret,
		spriteX: 280,
		description: "Causes high damage at close range. Continues affecting units for a short period after they have been hit. Attacks ground units."
	},
	7: {
		name: 'heavy machine gun',
		fireRate: 2,
		range: 1,
		damage: 5,
		cost: 10,
		type: Turret,
		attacks_air: true,
		spriteX: 300,
		upgrade: true,
		description: "Upgrade from machine gun. Increases damage. Attacks land and air units."
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
		spriteX: 220,
		upgrade: true,
		description: "Upgrade from glue gun. Extends time that units are sticky. Attacks ground units."
	},
	9: {
		name: 'missile launcher',
		fireRate: 20,
		range: 6,
		damage: 0,
		cost: 7,
		fireFunction: function(turret, soldier){
			addProjectile(turret, soldier)
		}, 
		type: Turret,
		spriteX: 280,
		attacks_air: true,
		description: "Long range weapon that fires slow projectiles. Attacks land and air units."
	},
	10: {
   name: 'nuke',
   damage: 100,
   cost: 20,
   range: 3,
   type: 'Explosion',
		description: "One-shot weapon that affects all units in the blast range. Useful for geting out of a bind. Attacks ground units."
  },
	11: {
   name: 'mine',
	 fireRate: 1,
   damage: 1000,
   cost: 5,
   range: 0,
	 fireFunction: function(turret, soldier){
		 addExplosion(turret.cX, turret.cY, 30, frameNum, 5);
		 turret.clearGrid();
		 turret.remove();
	 },
   type: Turret,
	 spriteX: 0,
	 offGrid: true,
	 description: "Explodes when units walk on it. Attacks ground units."
  }
}

var UnitManager = function(){
	var self = this;
	
	this.createUnit = function(template, position, gridManager){
		if(template['type'] == 'Explosion'){
			addExplosion(gridManager.pixelC(position[0]), gridManager.pixelC(position[1]), gridManager.radiusFromRange(template.range), frameNum, template['damage']);
			return false;
		};
		var unit = new template['type'](position, template, gridManager);
		var sprite = addSprite('t', unit)
		gridManager.addToSpriteGrid(position[0], position[1], sprite);
		sprite.clearGrid = function(){
			gridManager.clearCell( position[0], position[1] );
		}
	};
	
	this.sell = function(u){
		gridManager.clearCell( t.p[0], t.p[1] );
	}
}
