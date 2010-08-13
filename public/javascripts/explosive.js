var Explosion = function(x, y, radius, start){
  var range;
  var damage;
  var impactPosition;
  var startFrame = start;
  
  var initialise = function() {
    detonate();
  }
  
  var detonate = function(){
    unfortunates = mySoldierManager.withinRange(x, y, radius)
    for (var i=0; i < unfortunates.length; i++) {
      unfortunates[i].takeBullet(100);
    };
  }
  
  this.getRadius = function(){
    return radius;
  }
  
  this.getStartFrame = function(){
    return startFrame;
  }

  this.getX = function(){
    return x
  }
  
  this.getY = function(){
    return y
  }
  initialise();
}