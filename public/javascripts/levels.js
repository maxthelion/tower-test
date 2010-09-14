// configuration of the level
 // name: 'lightInfantry',
 // name: 'Infantry',
 // name: 'heavyInfantry',
 // name: 'MediumInfantry',
 // name: 'bike',
 // name: 'tank',
 // name: 'helicopter',
var lightInf1 = [0, 30, 7]
var lightInf2 = [0, 10, 8]
var inf1 = [1, 30, 7]
var inf2 = [1, 10, 9]
var mediumInf1 = [3, 30, 9]
var mediumInf2 = [3, 10, 11]
var heavyInf1 = [2, 50, 5]
var heavyInf2 = [2, 30, 12]
var bike1 = [4, 20, 12]
var bike2 = [4, 20, 24]
var tank1 = [5, 10, 1]
var tank2 = [5, 10, 5]
var helicopter1 = [6, 20, 10]
var helicopter2 = [6, 20, 20]



var easyPeasy = {	
  waves: [
		[lightInf1, 0],
    [lightInf1, 0],
    [inf1, 0],
    [lightInf2, 0],
    [inf1, 0],
    [inf2, 0],
    [mediumInf1, 0],
    [inf2, 0],
    [mediumInf1, 0],
    [inf2, 0],
    [mediumInf2, 0],
    [inf2, 0],
    [bike1, 0],
    [heavyInf1, 0]
	],
	startPoints: [[2, 0]],
	endPoint: [5, 14],
	availableUnits: [
	  unitTypes[0], // machine gun
	  unitTypes[5] // wall
	],
	terrain: [],
	unbuildables: []
};

levels = [
  easyPeasy,
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