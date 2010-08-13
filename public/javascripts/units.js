var unitTypes = [
  {
    name: 'machine gun',
    fireRate: 2,
    range: 1,
    color: '#555',
    damage: 2,
		cost: 5,
		type: Turret
  },
  {
    name: 'mortar',
    fireRate: 20,
    range: 2,
    color: '#999',
    damage: 20,
		cost: 15,
		type: Turret
  },
  {
    name: 'heavy cannon',
    fireRate: 50,
    range: 4,
    color: '#999',
    damage: 100,
		cost: 15,
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
		type: Turret
  },
  {
    name: 'nuke',
    damage: 100,
    cost: 30,
    range: 3,
    type: Explosion
  },
]

var currentUnit = function(){
  return unitTypes[currentTurretIndex]
};
