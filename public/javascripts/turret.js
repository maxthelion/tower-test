var TurretManager = function(){
  var self = this;
  var id = 0;
  var turretHash = {};
  var turretTypes = [
    {
      name: 'machine gun',
      fireRate: 2,
      range: 1,
      color: '#555',
      damage: 2,
			cost: 5
    },
    {
      name: 'mortar',
      fireRate: 20,
      range: 2,
      color: '#999',
      damage: 20,
			cost: 15
    },
    {
      name: 'heavy cannon',
      fireRate: 50,
      range: 4,
      color: '#999',
      damage: 100,
			cost: 15
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
			}
    }
  ]
  
  // probably needs optimising
  this.allTurrets = function(){
    var myArray = [];
    for( i in turretHash){
      if(turretHash[i] != null){
        myArray.push(turretHash[i]);
      };
    }
    return myArray;
  };
  
  this.createTurret = function(position){
    var newId = id++;
    var myTurret = new Turret(position, turretTypes[currentTurretIndex], newId);
    turretHash[newId] = myTurret;
    money -= myTurretManager.cost(currentTurretIndex);
    return myTurret;
  };

	this.cost = function(index) {
		return turretTypes[index]['cost']
	};
	
	this.getTurretTypes = function(){
	  return turretTypes;
	}
}

var Turret = function(position, template, id){
  var position = position;
  var id = id;
  var range = template['range'];
  var damage = template['damage'];
  var fireRate = template['fireRate'];
  var color = template['color'];
  var tSoldier;
	var firing = false;
  
  this.getPosition = function() {
    return position;
  };
  
  this.targettedSoldier = function() {
    return tSoldier;
  }
  
  this.getColor = function(){
		return color;
	}
  
  var setTargettedSoldier = function(){
    tSoldier = soldiersInRange()[0];
  }
  
  this.aimAndFire = function(){
    setTargettedSoldier();
    if (tSoldier && (frameNum % fireRate == 0)){
      firing = true;
      tSoldier.takeBullet(damage);
      if (template['hitCallback']){
        template['hitCallback'](tSoldier, frameNum)
      }
    } else {
      firing = false;
    }
  }
  
  this.isFiring = function(){
    return firing;
  }
  
  var soldiersInRange = function(){
    return mySoldierManager.withinRange(position[0], position[1], range);
  };
  
  this.getDamage = function(){
    return damage;
  };
}