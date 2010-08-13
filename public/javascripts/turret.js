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
      sounds['shot'] = true
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
    return mySoldierManager.withinRange(position[0], position[1], range, true, template['attacks_air']);
  };
  
  this.getDamage = function(){
    return damage;
  };
  
  this.getSize = function() {
    return template['size']
  }
}