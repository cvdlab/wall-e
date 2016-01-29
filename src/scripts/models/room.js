"use strict";

var Room = function (paper, edges, color) {

  this.paper = paper;
  this.events = new Events();

  this.edges = edges;

  let pathString = Room.edgesToPath(edges);

  this.path = paper.path(pathString)
    .attr({fill: color})
    .addClass('room');
  paper.prepend(this.path);

  this.moveEdgeHandler = (event) => {
    this.redraw();
  };

  edges.forEach((edge)=>{
    edge.onMove(this.moveEdgeHandler);
  });

};

Room.prototype.setId = function(id){
  this.id = id;
  this.path.attr({id:id});
};

Room.prototype.remove = function(){
  this.path.remove();
};

Room.prototype.toJson = function(){
  return {
    type: "room",
    edges: this.edges.map(function(edge){return edge.toJson()})
  };
};

Room.prototype.redraw = function () {
  let pathString = Room.edgesToPath(this.edges);
  this.path.attr({d: pathString});
};


Room.edgesToPath = function (edges) {
  let path = "";
  let first = true;

  edges.forEach(function (edge) {
    let command = first ? 'M' : 'L';
    first = false;
    path += command + edge.x + ' ' + edge.y + ' ';
  });
  path += ' z';
  return path;
};

Room.isRoom = function (room) {
  return (room instanceof Room);
};

