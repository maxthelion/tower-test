// configuration of the level

// wave looks like [soldierType, regularity, wavelength]
var waves = [
	[0, 30, 10],
	[0, 30, 10],
	[1, 15, 10],
	[1, 15, 10],
	[1, 30, 5],
	[0, 5, 10],
	[5, 10, 10],
	[1, 50, 5],
	[0, 5, 10],
	[2, 10, 5],
	[0, 15, 5],
	[4, 200, 1],
	[0, 15, 10],
	[1, 10, 10],
	[1, 30, 5],
	[0, 5, 10],
	[1, 50, 5],
	[1, 5, 10],
	[2, 10, 5],
	[1, 15, 5],
	[3, 15, 20],
	[4, 1000, 1]
];

var k = 10;
var terrain = [];
while(k > 0){
 terrain.push( [Math.floor(Math.random() * 15), Math.floor(Math.random() * 15)] );
 k--
}