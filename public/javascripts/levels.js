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
	[0, 30, 10]
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

grid = GridGenerator(50, 30);
//add terrain to grid
for (var i=0; i < terrain.length; i++) {
 grid[ terrain[i][1] ][terrain[i][0]] = 1;
};