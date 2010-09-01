// configuration of the level
 // name: 'lightInfantry',
 // name: 'Infantry',
 // name: 'heavyInfantry',
 // name: 'MediumInfantry',
 // name: 'bike',
 // name: 'tank',
 // name: 'helicopter',
levels = [
	{	
	waves: [
		[0, 30, 10, 0],
		[0, 30, 10, 0],
		[1, 30, 10, 0],
		[1, 30, 10, 0],
		[1, 30, 5, 0],
		[0, 5, 10, 0],
		[3, 50, 5, 0],
		[1, 50, 5, 0],
		[1, 5, 20, 0],
		[2, 10, 3, 0],
		[1, 15, 5, 0],
		[5, 10, 1, 0],
		[1, 15, 10, 0],
		[1, 10, 10, 0],
		[1, 30, 5, 0],
		[2, 5, 10, 0],
		[3, 10, 5, 0],
		[6, 10, 10, 0],
		[2, 20, 5, 0],
		[5, 15, 5, 0],
		[3, 10, 20, 0],
		[4, 5, 10, 0],
		[2, 15, 10, 0],
		[6, 10, 10, 0],
		[3, 30, 5, 0],
		[4, 5, 10, 0],
		[5, 50, 5, 0],
		[5, 5, 10, 0],
		[4, 10, 5, 0],
		[3, 15, 5, 0],
		[3, 15, 20, 0],
		[4, 5, 20, 0],
		[6, 10, 5, 0],
		[5, 10, 1, 0]
		],
		startPoints: [[2, 0]],
		endPoint: [5, 14],
		availableUnits: [
		unitTypes[0], // machine gun
		unitTypes[1], // mortar
		unitTypes[5], // wall
		unitTypes[4] // glue gun
		]
	},
	{
		waves: [
			[0, 10, 2, 0],
			[0, 10, 2, 1]
		],
		startPoints: [
			[2, 0],
			[10, 0]
		],
		endPoint: [5, 14],
		availableUnits: [
		unitTypes[0], // machine gun
		unitTypes[1], // mortar
		unitTypes[5], // wall
		unitTypes[4], // glue gun
		unitTypes[6] // flamer
		]
	}
]
