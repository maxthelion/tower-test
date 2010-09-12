// configuration of the level
 // name: 'lightInfantry',
 // name: 'Infantry',
 // name: 'heavyInfantry',
 // name: 'MediumInfantry',
 // name: 'bike',
 // name: 'tank',
 // name: 'helicopter',
var lightInf1 = [0, 30, 10]
var lightInf2 = [0, 10, 10]
var inf1 = [1, 30, 10]
var inf2 = [1, 10, 10]
var mediumInf1 = [3, 30, 10]
var mediumInf2 = [3, 10, 10]
var heavyInf1 = [2, 50, 5]
var heavyInf2 = [2, 30, 10]
var bike1 = [4, 20, 10]
var bike2 = [4, 20, 20]
var tank1 = [5, 10, 1]
var tank2 = [5, 10, 5]
var helicopter1 = [6, 20, 10]
var helicopter2 = [6, 20, 20]


levels = [
	{	
	waves: [
			[lightInf1, 0]//,
      // [lightInf1, 0],
      // [inf1, 0],
      // [lightInf2, 0],
      // [lightInf1, 0],
      // [inf1, 0],
      // [inf2, 0],
      // [mediumInf1, 0],
      // [inf2, 0]
		],
		startPoints: [[2, 0]],
		endPoint: [5, 14],
		availableUnits: [
		  unitTypes[0], // machine gun
		  unitTypes[5] // wall
		],
		terrain: []
	},
	{
		waves: [
			[lightInf1, 0],
			[lightInf1, 1],
			[inf1, 0],
			[inf1, 1],
			[lightInf1, 1],
			[mediumInf1, 1],
			[inf1, 0],
			[inf2, 1],
			[heavyInf1, 0]
		],
		startPoints: [
			[2, 0],
			[10, 0]
		],
		endPoint: [5, 14],
		availableUnits: [
		  unitTypes[0], // machine gun
		  unitTypes[5], // wall
		  unitTypes[6] // flamer
		],
		newUnits: [6],
		terrain: []
	},
	{
		waves: [
			[lightInf1, 0],
			[lightInf1, 1],
			[inf1, 0],
			[inf1, 1],
			[lightInf1, 1],
			[mediumInf1, 1],
			[inf1, 0],
			[inf2, 1],
			[heavyInf1, 0]
		],
		startPoints: [
			[2, 0],
			[10, 0]
		],
		endPoint: [5, 14],
		availableUnits: [
		  unitTypes[0], // machine gun
		  unitTypes[5], // wall
		  unitTypes[6], // flamer
		  unitTypes[4] // gluegun
		],
		newUnits: [4],
		terrain: []
	},
	{
		waves: [
			[lightInf1, 0],
			[lightInf1, 1],
			[inf1, 0],
			[inf1, 1],
			[lightInf1, 1],
			[mediumInf1, 1],
			[inf1, 0],
			[inf2, 1],
			[heavyInf1, 0]
		],
		startPoints: [
			[2, 0],
			[10, 0]
		],
		endPoint: [5, 14],
		availableUnits: [
		  unitTypes[0], // machine gun
		  unitTypes[5], // wall
		  unitTypes[6], // flamer
		  unitTypes[4], // gluegun
		  unitTypes[1]
		],
		newUnits: [1],
		terrain: []
	}
]

var addRandomTerrain = function(){
	var terrain = []
	while(k > 0){
		var t = [MF(Math.random() * 15), MF(Math.random() * 15)]
		if (	
			(t[0] == startPoints[0][0] && t[1] == startPoints[0][1]) ||
			(startPoints[1] && t[0] == startPoints[1][0] && t[1] == startPoints[1][1]) ||
					(t[0] == endPoint[0] && t[1] == endPoint[1])
			) {
			// console.log('clash')
		} else {
			terrain.push( t );
		}
		k--
	}
	return terrain;
}