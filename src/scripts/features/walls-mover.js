"use strict";

var WallsMover = function (walle) {
  this.walle = walle;
  this.paper = walle.paper;

  walle.model.walls = walle.model.walls || [];

  this.movingWall = null;
  this.status = null;
};


/**
 * start
 */
WallsMover.prototype.start = function () {
  console.log("start edges mover mode");

  let paper = this.paper;
  let walle = this.walle;

  this.status = WallsMover.statusWaiting;

  /** click handler **/
  this.clickHandler = (event) => {

    if (this.status === WallsMover.statusWaiting) {
      let wall = walle.nearestWall(event.offsetX, event.offsetY, 5);
      if (Wall.isWall(wall)) {
        this.beginMoving(wall);
        event.stopPropagation();
        return;
      }
    }

    if (this.status === WallsMover.statusWorking) {
      this.endMovingWithPoint(event.offsetX, event.offsetY);
      event.stopPropagation();
    }
  };

  /** move handler **/
  this.moveHandler = (event) => {
    if (this.status === WallsMover.statusWorking) {
      this.updateMovingWithPoint(event.offsetX, event.offsetY);
    }
  };

  this.abortHandler = (event) => {
    if (this.status === WallsMover.statusWorking) {
      this.abortMoving();
    }
  };

  paper.click(this.clickHandler, this);
  paper.mousemove(this.moveHandler, this);
  walle.onAbort(this.abortHandler, this);

};


/**
 * begin moving
 * @param wall
 */
WallsMover.prototype.beginMoving = function (wall) {

  console.log("begin moving");

  let paper = this.paper;
  let width = this.walle.width, height = this.walle.height;

  let center = Utils.centerPoint(wall.edges[0].x, wall.edges[0].y, wall.edges[1].x, wall.edges[1].y);

  let centerPoint = paper.circle(center.x, center.y, 5).attr({fill: "green"});
  let horizontalLine = paper.line(0, center.y, width, center.y).attr({strokeWidth: 1, stroke: "green"});
  let verticalLine = paper.line(center.x, 0, center.x, height).attr({strokeWidth: 1, stroke: "green"});

  this.movingWall = {
    wall,
    centerPoint,
    horizontalLine,
    verticalLine,
    originalPosition: {x1: wall.edges[0].x, y1: wall.edges[0].y, x2: wall.edges[1].x, y2: wall.edges[1].y}
  };

  this.status = WallsMover.statusWorking;
};


/**
 * update moving
 * @param x
 * @param y
 */
WallsMover.prototype.updateMovingWithPoint = function (x, y) {

  console.log("update moving");

  let paper = this.paper;
  let width = this.walle.width, height = this.walle.height;

  let movingWall = this.movingWall;
  let ox1 = movingWall.originalPosition.x1, oy1 = movingWall.originalPosition.y1,
    ox2 = movingWall.originalPosition.x2, oy2 = movingWall.originalPosition.y2;
  let edge0 = movingWall.wall.edges[0], edge1 = movingWall.wall.edges[1];

  let center = Utils.centerPoint(edge0.x, edge0.y, edge1.x, edge1.y);

  movingWall.centerPoint.attr({cx: center.x, cy: center.y});
  movingWall.horizontalLine.attr({x1: 0, y1: center.y, x2: width, y2: center.y});
  movingWall.verticalLine.attr({x1: center.x, y1: 0, x2: center.x, y2: height});

  let translationVector = Utils.translationVector(ox1, oy1, ox2, oy2, x, y);
  let vx = translationVector.vx, vy = translationVector.vy;

  edge0.move(ox1 + vx, oy1 + vy);
  edge1.move(ox2 + vx, oy2 + vy);
};

/**
 * abort moving
 */
WallsMover.prototype.abortMoving = function () {

  console.log("abort moving");

  let paper = this.paper;
  let wall = this.movingWall.wall;
  let movingWall = this.movingWall;
  let edge0 = wall.edges[0], edge1 = wall.edges[1];
  let ox1 = movingWall.originalPosition.x1, oy1 = movingWall.originalPosition.y1,
    ox2 = movingWall.originalPosition.x2, oy2 = movingWall.originalPosition.y2;

  edge0.move(ox1, oy1);
  edge1.move(ox2, oy2);

  movingWall.centerPoint.remove();
  movingWall.horizontalLine.remove();
  movingWall.verticalLine.remove();
  this.movingWall = null;

  this.start();

};

/**
 * end moving
 * @param x
 * @param y
 */
WallsMover.prototype.endMovingWithPoint = function (x, y) {

  console.log("end moving");

  let paper = this.paper;
  let wall = this.movingWall.wall;

  this.updateMovingWithPoint(x, y);

  let movingWall = this.movingWall;
  movingWall.centerPoint.remove();
  movingWall.horizontalLine.remove();
  movingWall.verticalLine.remove();
  this.movingWall = null;

  this.start();

};

/**
 * stop
 */
WallsMover.prototype.stop = function () {
  console.log("stop edges mover mode");

  let paper = this.paper;
  let walle = this.walle;

  paper.unclick(this.clickHandler, this);
  paper.unmousemove(this.moveHandler, this);
  walle.offAbort(this.abortHandler, this);
};


WallsMover.statusWaiting = 0;
WallsMover.statusWorking = 1;
