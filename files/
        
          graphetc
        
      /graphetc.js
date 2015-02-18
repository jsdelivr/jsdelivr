/*
Graph&etc. (a.k.a Graph and et cetera or Graph-and-et-cetera)
Initial release 0.0.0.1a
Release under the MIT license. Copyright 2015 Dang C Pham

Github: https://github.com/dangcpham/Graph-and-et-cetera
Website: http://dangcpham.github.io/Graph-and-et-cetera/

The MIT License (MIT)

Copyright (c) 2015 Dang C Pham

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

function graph(param) {
    //required user config
    this.graphid = document.getElementById(param.graphid);
    this.minx = param.minx;
    this.miny = param.miny;
    this.maxx = param.maxx;
    this.maxy = param.maxy;
    this.gridwidth = param.gridwidth;
    this.marksize = param.marksize;
    this.tick = param.tick;
    this.xlabel = param.xlabel;
    this.ylabel = param.ylabel;
    //optional config    
    this.scalex = param.scalex || 1;
    this.scaley = param.scaley || 1;
    this.gridcolor = param.gridcolor || "#6a6a6a";
    this.font = param.font || "10pt Calibri";
    this.fontcolor = param.font || "#000";
    this.background = param.background || "#fff";
    this.color = param.color || "#000";
    this.axiswidth = param.axiswidth || 2;
    //init constants
    this.graphid.style.background = this.background;
    this.graphcanvas = this.graphid.getContext('2d');
    this.originx = Math.abs(this.minx / (this.maxx - this.minx)) * this.graphid.width;
    this.originy = this.graphid.height - Math.abs(this.miny / (this.maxy - this.miny)) * this.graphid.height;
    this.graphmaxx = this.graphid.width;
    this.graphmaxy = this.graphid.height;
    this.increasex = this.graphid.width / ((this.maxx - this.minx) / this.scalex);
    this.increasey = this.graphid.height / ((this.maxy - this.miny) / this.scaley);
    this.valperpixelx = (this.maxx - this.minx) / this.graphmaxx
    this.valperpixely = (this.maxy - this.miny) / this.graphmaxy
    //background fill
    this.graphcanvas.beginPath();
    this.graphcanvas.fillStyle = this.background;
    this.graphcanvas.fill();
    this.graphcanvas.stroke();

    this.AxisInit = function() {
        var graphcanvas = this.graphcanvas;

        //X-Axis
        graphcanvas.beginPath();
        graphcanvas.strokeStyle = this.color;
        graphcanvas.lineWidth = this.axiswidth;
        graphcanvas.moveTo(0, this.originy);
        graphcanvas.lineTo(this.graphmaxx, this.originy);
        //Y-Axis
        graphcanvas.moveTo(this.originx, 0);
        graphcanvas.lineTo(this.originx, this.graphmaxy);
        graphcanvas.stroke();

        //X-ticks and grid            
        var label = this.maxx;
        for (var xpos = this.graphmaxx; xpos >= 0; xpos -= this.increasex) {
            //grid
            if (xpos != this.originx && this.gridwidth > 0) {
                graphcanvas.beginPath();
                graphcanvas.strokeStyle = this.gridcolor;
                graphcanvas.lineWidth = this.gridwidth;
                graphcanvas.moveTo(xpos, 0);
                graphcanvas.lineTo(xpos, this.graphmaxy);
                graphcanvas.stroke();
                graphcanvas.save();
            }
            //tick
            if (this.tick) {
                graphcanvas.save();
                graphcanvas.beginPath();
                graphcanvas.font = this.font;
                graphcanvas.strokeStyle = this.color;
                graphcanvas.lineWidth = this.axiswidth;
                graphcanvas.moveTo(xpos, this.originy - this.marksize);
                graphcanvas.lineTo(xpos, this.originy + this.marksize);
                graphcanvas.stroke();
            }
            //label                
            if (label > this.minx && this.xlabel) {
                graphcanvas.beginPath()
                graphcanvas.textalign = "center";
                graphcanvas.textBaseline = "top";
                graphcanvas.font = this.font;
                graphcanvas.fillStyle = this.fontcolor;
                graphcanvas.fillText(label, xpos - 1, this.originy + this.marksize);
                graphcanvas.stroke()
                label -= this.scalex;
                label = label.toFixed(0);
            }
        }
        //Y-ticks and grid
        var label2 = this.miny;
        for (var ypos = this.graphmaxy; ypos >= 0; ypos -= this.increasey) {
            //grid
            if (ypos != this.originy && this.gridwidth > 0) {
                graphcanvas.beginPath();
                graphcanvas.strokeStyle = this.gridcolor;
                graphcanvas.lineWidth = this.gridwidth;
                graphcanvas.moveTo(0, ypos);
                graphcanvas.lineTo(this.graphmaxx, ypos);
                graphcanvas.stroke();
                graphcanvas.save();
            }
            //tick
            if (this.tick) {
                graphcanvas.save();
                graphcanvas.beginPath();
                graphcanvas.font = this.font;
                graphcanvas.strokeStyle = this.color;
                graphcanvas.lineWidth = this.axiswidth;
                graphcanvas.moveTo(this.originx - this.marksize, ypos);
                graphcanvas.lineTo(this.originx + this.marksize, ypos);
                graphcanvas.stroke();
            }
            //label                
            if (label2 <= this.maxy && label2 != 0 && this.ylabel) {
                graphcanvas.beginPath()
                graphcanvas.textalign = "right";
                graphcanvas.textBaseline = "middle";
                graphcanvas.font = this.font;
                graphcanvas.fillStyle = this.fontcolor;
                graphcanvas.fillText(label2, this.originx + this.marksize + 5, ypos);
                graphcanvas.stroke()
            }
            label2 += this.scaley;
        }
    }
    this.transformx = function(x) {
        return (this.originx + (x * (1 / this.valperpixelx)));
    }
    this.transformy = function(y) {
        return (this.originy - (y * (1 / this.valperpixely)));
    }

    this.reversetransformx = function(x) {
        return (x - this.originx) * this.valperpixelx;
    }

    //this.reversetransformy = function(y) {
    //    return (y + this.originy)*this.valperpixely;
    //}

    this.point = function(x, y, size, color) {
        var graphcanvas = this.graphcanvas,
            color = color || "#000",
            size = size || 5,
            y = this.transformy(y),
            x = this.transformx(x);
        graphcanvas.strokeStyle = color;
        if (x > this.graphmaxx || y > this.graphmaxy) {
            return "Error: Out of bound";
        } else {
            graphcanvas.beginPath()
            graphcanvas.fillStyle = color;
            graphcanvas.arc(x, y, size, 0, 2 * Math.PI, false);
            graphcanvas.fill();
            graphcanvas.stroke();
        }
    }
    this.line = function(x1, y1, x2, y2, returnlength, drawendpoints, linewidth, linecolor) {
        var graphcanvas = this.graphcanvas,
            width = linewidth || "2",
            color = linecolor || "#000";
        graphcanvas.beginPath()
        graphcanvas.lineWidth = width;
        graphcanvas.strokeStyle = color;
        graphcanvas.moveTo(this.transformx(x1), this.transformy(y1));
        graphcanvas.lineTo(this.transformx(x2), this.transformy(y2));
        graphcanvas.stroke();
        if (drawendpoints) {
            this.point(x1, y1);
            this.point(x2, y2);
        }
        if (returnlength) {
            return Math.sqrt(((x2 - x1) ^ 2) - (y2 - y1) ^ 2)
        } else {
            return "Did not ask for length"
        }
    }
    this.plotEquation = function(equation, xstep, showstepppoints, color, linewidth, lowerxboundary, upperxboundary) {
        if (!lowerxboundary) {
            lowerxboundary = this.minx;
        }
        if (!upperxboundary) {
            upperxboundary = this.maxx;
        }
        var xpos = lowerxboundary;
        while (xpos <= upperxboundary) {
            var x1 = xpos,
                x2 = xpos + xstep,
                y1 = equation(xpos),
                y2 = equation(xpos + xstep);
            this.line(x1, y1, x2, y2, false, showstepppoints, linewidth, color)
            xpos += xstep;
        }
    }
    this.rootsearch = function(equation, xstep, guessmin, guessmax) {
        var xpos = guessmin,
            xstep = xstep,
            result = [];
        var storeminx,
            storeminy = -1;
        while (xpos <= guessmax) {
            var x1 = xpos,
                y1 = equation(xpos);

            if (y1 < 0.001 && y1 > -0.001) {
                var tempmin = Math.min(Math.abs(y1), Math.abs(storeminy))
                if (tempmin == Math.abs(y1)) {
                    if (y1 < 0.00000000000002 && y1 > -0.00000000000002) {
                        storeminy = 0;
                    } else {
                        storeminy = y1
                    };
                    if (x1 < 0.000000002 && x1 > -0.000000002) {
                        storeminx = 0;
                    } else {
                        storeminx = x1
                    };
                }
            }
            xpos += xstep;
        }
        if (storeminx == undefined) {
            return "No solution found on the set boundaries";
        } else {
            return [storeminx, storeminy];
        }

    }
    this.areaundercurve = function(equation, iteration, x1, x2) {
        var n = iteration;
        var storeval = 0;
        storeval += equation(x1) / 2
        storeval += equation(x2) / 2
        for (var k = 1; k <= n - 1; k++) {
            storeval += equation(x1 + (k * ((x2 - x1) / n)));
        }
        storeval *= ((x2 - x1) / n);
        return storeval;
    }

    this.export = function() {
        var image = this.graphid.toDataURL("image/png");

        window.open(image, '_blank');
    }
    //draw axis, ticks, grids, and labels 
    this.AxisInit();
}
