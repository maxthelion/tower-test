// configuration of the level
 // name: 'lightInfantry',
 // name: 'Infantry',
 // name: 'heavyInfantry',
 // name: 'MediumInfantry',
 // name: 'bike',
 // name: 'tank',
 // name: 'helicopter',
 
// wave looks like [soldierType, regularity, wavelength]
var waves = [
	[0, 30, 10],
	[0, 30, 10],
	[1, 30, 10],
	[1, 30, 10],
	[2, 30, 5],
	[0, 5, 10],
	[3, 50, 5],
	[1, 50, 5],
	[0, 5, 10],
	[2, 10, 5],
	[0, 15, 5],
	[5, 10, 1],
	[1, 15, 10],
	[1, 10, 10],
	[1, 30, 5],
	[2, 5, 10],
	[3, 50, 5],
	[3, 5, 10],
	[2, 10, 5],
	[5, 15, 5],
	[3, 10, 20],
	[4, 50, 2],
	[2, 15, 10],
	[3, 10, 10],
	[3, 30, 5],
	[3, 5, 10],
	[5, 50, 5],
	[5, 5, 10],
	[2, 10, 5],
	[3, 15, 5],
	[3, 15, 20],
	[4, 50, 4],
	[3, 10, 5],
	[3, 5, 10],
	[5, 50, 5],
	[3, 50, 5],
	[3, 5, 10],
	[2, 10, 5],
	[3, 15, 5],
	[5, 10, 1],
	[3, 15, 10],
	[3, 10, 10],
	[3, 30, 5],
	[2, 5, 10],
	[5, 20, 10],
	[2, 10, 5],
	[6, 15, 5],
	[3, 10, 20],
	[4, 50, 2],
	[2, 15, 10],
	[4, 10, 10],
	[3, 30, 5],
	[2, 5, 10],
	[4, 50, 5],
	[5, 5, 10],
	[2, 10, 5],
	[4, 15, 5],
	[3, 15, 20],
	[5, 10, 4]
];

var startPoint = [3, 0];
var endPoint = [5, 14];

var k = 10;
var terrain = [];
while(k > 0){
	var t = [MF(Math.random() * 15), MF(Math.random() * 15)]
	if (	(t[0] == startPoint[0] && t[1] == startPoint[1]) ||
				(t[0] == endPoint[0] && t[1] == endPoint[1])
		) {
		// console.log('clash')
	} else {
		terrain.push( t );
	}
	k--
}

grid = GridGenerator(15, 15);
//add terrain to grid
for (var i=0; i < terrain.length; i++) {
 grid[ terrain[i][1] ][terrain[i][0]] = 1;
};