/**
 * Graham's Scan Convex Hull Algorithm
 * Author: Brian Barnett, brian@3kb.co.uk, http://brianbar.net/ || http://3kb.co.uk/
 * Date: 14/06/13
 * Description: An implementation of the Graham's Scan Convex Hull algorithm in Javascript, outlined with the following
 * formal algorithm:
 *
 * GRAHAM_SCAN(Q)
 *
 * 1.         Find p0 in Q with minimum y-coordinate (and minimum x-coordinate if there are ties).
 * 2.         Sort the remaining points of Q (that is, Q − {p0}) by polar angle in counterclockwise order with respect to p0.
 * 3.         TOP [S] = 0                ▷ Lines 3-6 initialize the stack to contain, from bottom to top, first three points.
 * 4.         PUSH (p0, S)
 * 5.         PUSH (p1, S)
 * 6.         PUSH (p2, S)
 * 7.         for i = 3 to m             ▷ Perform test for each point p3, ..., pm.
 * 8.             do while the angle between NEXT_TO_TOP[S], TOP[S], and pi makes a non-left turn  ▷ remove if not a vertex
 * 9.                         do POP(S)
 * 10.                 PUSH (S, pi)
 * 11.       return S
 *
 *
 * Source: http://www.personal.kent.edu/~rmuhamma/Compgeometry/MyCG/ConvexHull/GrahamScan/grahamScan.htm
 *
 * Usage:
 *
 * //Create a new instance.
 * var convexHull = new ConvexHullGrahamScan();
 *
 * //add points (needs to be done for each point, a foreach loop on the input array can be used.
 * convexHull.addPoint(item.lon, item.lat);
 *
 * //getHull() returns the array of points that make up the convex hull.
 * var hullPoints = convexHull.getHull();
 */

function ConvexHullGrahamScan() {

    this.anchorPoint = undefined;

    this.points = [];
}


ConvexHullGrahamScan.prototype = {

    constructor: ConvexHullGrahamScan,

    Point: function (x, y) {
        this.x = x;
        this.y = y;
    },

    _findPolarAngle: function (a, b) {
        var ONE_RADIAN = 57.295779513082;
        var deltaX = (b.x - a.x);
        var deltaY = (b.y - a.y);

        if (deltaX == 0 && deltaY == 0) {
            return 0;
        }

        var angle = Math.atan2(deltaY, deltaX) * ONE_RADIAN;

        if (angle > 0) {
            angle += 360;
        }

        return angle;
    },

    addPoint: function (x, y) {
        //Check to see if anchorPoint has been defined yet.
        if (this.anchorPoint === undefined) {
            //Create new anchorPoint.
            this.anchorPoint = new this.Point(x, y);

            // Sets anchorPoint if point being added is further left.
        } else if (this.anchorPoint.y > y || (this.anchorPoint.y == y && this.anchorPoint.x > x)) {
            this.anchorPoint.y = y;
            this.anchorPoint.x = x;
            this.points.unshift(new this.Point(x, y));
            return;
        }

        this.points.push(new this.Point(x, y));
    },

    _sortPoints: function () {
        var self = this;

        return this.points.sort(function (a, b) {
            var polarA = self._findPolarAngle(self.anchorPoint, a);
            var polarB = self._findPolarAngle(self.anchorPoint, b);

            if (polarA < polarB) {
                return -1;
            }
            if (polarA > polarB) {
                return 1;
            }

            return 0;
        });
    },

    _checkPoints: function (p0, p1, p2) {
        var difAngle;
        var cwAngle = this._findPolarAngle(p0, p1);
        var ccwAngle = this._findPolarAngle(p0, p2);

        if (cwAngle > ccwAngle) {

            difAngle = cwAngle - ccwAngle;

            return !(difAngle > 180);

        } else if (cwAngle < ccwAngle) {

            difAngle = ccwAngle - cwAngle;

            return (difAngle > 180);

        }

        return false;
    },

    getHull: function () {
        var hullPoints = [];
        var points = this._sortPoints();
        var pointsLength = points.length;

        //If there are less than 4 points, joining these points creates a correct hull.
        if (pointsLength < 4) {
            return points;
        }

        //move first two points to output array
        hullPoints.push(points.shift(), points.shift());

        //scan is repeated until no concave points are present.
        while (true) {
            var p0,
                p1,
                p2;

            hullPoints.push(points.shift());

            p0 = hullPoints[hullPoints.length - 3];
            p1 = hullPoints[hullPoints.length - 2];
            p2 = hullPoints[hullPoints.length - 1];

            if (this._checkPoints(p0, p1, p2)) {
                hullPoints.splice(hullPoints.length - 2, 1);
            }

            if (points.length == 0) {
                if (pointsLength == hullPoints.length) {
                    return hullPoints;
                }
                points = hullPoints;
                pointsLength = points.length;
                hullPoints = [];
                hullPoints.push(points.shift(), points.shift());
            }
        }
    }
};