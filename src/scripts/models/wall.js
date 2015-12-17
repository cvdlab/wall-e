"use strict";


var Wall = function (paper, edge0, edge1) {

  this.colors = {
    strokeNormal: "#8E9BA2",
    strokeSelected: "#445964"
  };

  this.paper = paper;
  this.edges = [edge0, edge1];

  let line = paper.line(edge0.x, edge0.y, edge1.x, edge1.y);
  line.attr({strokeWidth: 4, stroke: this.colors.strokeNormal});
  this.line = line;

  edge0.emitter.addListener("move", (x, y)=> {
    line.attr({x1: x, y1: y});
    this.updateDistance();
  });

  edge1.emitter.addListener("move", (x, y)=> {
    line.attr({x2: x, y2: y});
    this.updateDistance();
  });

  this.distanceText = this.paper.text(0, 0, "")
    .attr({"text-anchor": "middle", "font-family": "monospace"});
  this.distanceGroup = this.paper.g(this.distanceText);
  this.updateDistance();
};


Wall.prototype.remove = function () {
  this.line.remove();
};

Wall.prototype.selected = function (isSelected) {
  this.line.attr({stroke: isSelected ? this.colors.strokeSelected : this.colors.strokeNormal});
};

Wall.prototype.toString = function () {
  return {
    type: "wall",
    edge0: this.edges[0].toString(),
    edge1: this.edges[1].toString()
  };
};

Wall.prototype.updateDistance = function () {

  let x1 = this.edges[0].x;
  let y1 = this.edges[0].y;
  let x2 = this.edges[1].x;
  let y2 = this.edges[1].y;

  let group = this.distanceGroup;
  let text = this.distanceText;


  let distance = Utils.twoPointsDistance(x1, y1, x2, y2);
  let angle = Utils.angleBetweenTwoPoints(x1, y1, x2, y2);
  let westside = 180 < angle && angle < 360;


  let matrix = Snap.matrix()
    .translate(x1, y1)
    .rotate(90, 0, 0)
    .rotate(-angle, 0, 0);

  let unit = 60;

  group.transform(matrix);
  text.attr({text: (distance / unit).toFixed(2) + "m"});

  if (westside) {
    text.attr({x: -distance / 2}); //align center
    text.transform(Snap.matrix().rotate(180));
  } else {
    text.attr({x: distance / 2, y: -5}); //align center
    text.transform("");
  }


};

Wall.isWall = function(wall){
  return (wall instanceof Wall);
};
