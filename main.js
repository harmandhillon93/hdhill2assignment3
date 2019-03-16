var Animation = function(canvasId) {
  this.canvas = document.getElementById(canvasId);
  this.context = this.canvas.getContext("2d");
  this.t = 0;
  this.timeInterval = 0;
  this.startTime = 0;
  this.lastTime = 0;
  this.frame = 0;
  this.animating = false;
  

  window.requestAnimFrame = (function(callback){
    return window.requestAnimationFrame || 
      window.webkitRequestAnimationFrame ||
      function(callback){
      window.setTimeout(callback, 1000 / 60);
    };
  })();
};

Animation.prototype.getContext = function getContext(){
  return this.context;
};

Animation.prototype.getCanvas = function(){
  return this.canvas;
};

Animation.prototype.clear = function(){
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

Animation.prototype.setStage = function(func){
  this.stage = func;
};

Animation.prototype.isAnimating = function(){
  return this.animating;
};

Animation.prototype.getFrame = function(){
  return this.frame;
};

Animation.prototype.start = function(){
  this.animating = true;
  var date = new Date();
  this.startTime = date.getTime();
  this.lastTime = this.startTime;
  
  if (this.stage !== undefined){
    this.stage();
  }
  
  this.animationLoop();
};

Animation.prototype.stop = function(){
  this.animating = false;
};

Animation.prototype.getTimeInterval = function(){
  return this.timeInterval;
};

Animation.prototype.getTime = function(){
  return this.t;
};

Animation.prototype.getFps = function(){
  return this.timeInterval > 0 ? 1000 / this.timeInterval : 0;
};

Animation.prototype.animationLoop = function(){
  var that = this;
  
  this.frame++;
  var date = new Date();
  var thisTime = date.getTime();
  this.timeInterval = thisTime - this.lastTime;
  this.t += this.timeInterval;
  this.lastTime = thisTime;
  
  if (this.stage !== undefined){
    this.stage();
  }
  
  if (this.animating){
    window.requestAnimFrame(function(){
      that.animationLoop();
    });
  }
  
};

window.onload = function (){

  // instantiate new Animation object
  var anim = new Animation("myCanvas");
  var context = anim.getContext();
  var canvas = anim.getCanvas();
  
  // var amplitude = (Math.PI / 4); // 45 degrees
  var vel = 0.0;
  var acc = 0.0;
  var theta = (Math.PI / 4);
  var pendulumLength = canvas.width / 2;
  var pendulumWidth = 0;
  var rotationPointX = canvas.width / 2;
  var rotationPointY = 20;
  
  var endpointvalue = function(){
    this.acc1;
    this.vel1; 
    this.theta1;
  }

  var gamerestore = function(endpointvalue){
    gameboolean.restoreboolean = true;

    endpoint.acc1 = endpointvalue[0];
    endpoint.vel1 = endpointvalue[1];
    endpoint.theta1 = endpointvalue[2];
   
  }
  var gameboolean = {
    restoreboolean: 'false'
// var restore
  };

  var endpoint = {
    acc1:'',
    vel1:'',
    theta1:''
  };
  var endpointvalue = new endpointvalue();
  anim.setStage(function(){
    //update
    if(gameboolean.restoreboolean==true){
      acc = endpoint.acc1;
      vel= endpoint.vel1;
      theta= endpoint.theta1;
      console.log("----here----");
      gameboolean.restoreboolean=false;
    }
    //update
    acc = - 0.01 * Math.sin(theta);
    theta += vel;
    vel += acc;
    vel = vel * 0.985;

    endpointvalue.acc1 = acc;
    endpointvalue.vel1 = vel;
    endpointvalue.theta1 = theta;
    //clear
    this.clear();
    
    //draw top circle
    context.beginPath();
    context.arc(rotationPointX, rotationPointY, 15, 0, 2 * Math.PI, false);
    context.fillStyle = "green";
    context.fill();
    
    //draw shaft
    context.beginPath();
    var endPointX = rotationPointX + pendulumLength * Math.sin(theta);
    var endPointY = rotationPointY + pendulumLength * Math.cos(theta);
    context.beginPath();
    context.moveTo(rotationPointX, rotationPointY);
    context.lineTo(endPointX, endPointY);
    context.lineWidth = pendulumWidth;
    context.lineCap = "round";
    context.strokeStyle = "#555";
    context.stroke();
    
    //draw bottom circle
    context.beginPath();
    context.fillStyle = "blue";
    context.arc(endPointX, endPointY, 40, 0, 2 * Math.PI, false);
    context.fill();
  });
  anim.start();
      var socket = io.connect("http://24.16.255.56:8888");

  socket.on("load", function (data) {
      console.log(data);
  });

  var text = document.getElementById("text");
  var saveButton = document.getElementById("save");
  var loadButton = document.getElementById("load");

  saveButton.onclick = function () {
    console.log("save");
    text.innerHTML = "Saved."
    
    var arr1 = [endpointvalue.acc1, endpointvalue.vel1, endpointvalue.theta1];
    var endpoints = arr1;
    arr1 = [];
    socket.emit("save", { studentname: "Harman", statename: "Pendulum", data: "Goodbye World", endpoints:endpoints });
  };

  loadButton.onclick = function () {
    console.log("load");
    text.innerHTML = "Loaded."
    socket.emit("load", { studentname: "Harman", statename: "Pendulum" });
    socket.on("load", function(data){
    gamerestore(data.endpoints);
    });
  };
};