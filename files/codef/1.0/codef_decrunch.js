/*------------------------------------------------------------------------------
Copyright (c) 2011 Antoine Santo Aka NoNameNo

This File is part of the CODEF project.

More info : http://codef.santo.fr
Demo gallery http://www.wab.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
------------------------------------------------------------------------------*/
/*
This file is done by TotorMan... ;)
*/

// Animation library for
// main
// Amiga and Atari, and ... decrunchers

function AmigaDecrunch(DType, MaxBarHeight, StartDecrunchAt, DecrunchMaxVBL) {

        function get_random_color() {
            var letters = '0123456789ABCDEF'.split('');
            var color ='';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.round(Math.random() * 15)];
            }
            return '#'+color;
        }

    // Amiga shell window
    this.amigashell = new Image() ;
    // base64 encoded PNG
    this.amigashell.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAGQCAMAAAAJLSEXAAAABGdBTUEAALGPC/xhBQAAAwBQTFRFAAAA////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZ3bsYwAAAQB0Uk5T////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AFP3ByUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAACT1JREFUeF7t14t227YWRdHm/z+6Jd6gRNmxo2g30ZyjIcEDyG7MNa5v//l38wO+71FAH84FyLM8P8APktw/cF49/gx/t/LqawHT53MB8jTl1dcCps/npwDb+Ce1r3q/mkveSn/z7e03Y93mt/q+AHmK/ubb22/Gus1v9f3bX8HrUj9U7/XTY2cM+2NfzN2yLupB3kd95+PPbp+1NooxFyDPUd/5+LPbZ62NYszPAR6T/qcd3W99fWirOdwey63deUOjhtLPss/6wcOYC5CnGTWUfpZ91g8exrwFePpMmdetfqLf5rocGc/lsj22xVjxZkYNtZFpn/WDhzEXIE8zaqiNTPusHzyM+Y9/xmM7UfTtdWt7bTEu9Xq1mkveSn/z/Wmzz0sZzZgLkOfob74/bfZ5KaMZ8xXgOFO05zoo92oblWVZjN3zqi3rivdR33l99Tfvfp+3ezHnAuQp6juvr/7m3e/zdi/mvAXYjU/ceDCGk9FI62X4ZC5AnuXD0B7NTwGus/Blj+L5cC5AnuUZAcJrCZCoI8D+fwrh5QRI1Aqw/s9hXf20u/Pnr3D31eq3mN+u3vrwvKqL05c6XIw+9eVPXJ3/+tf4xr/p2xLgydX5r3+Nb/ybvq0ZYL3+8s9t/wJ3X6wP+nfqu/3pwWW5mn3uix94UjlP+SJvQoA7Ab7cCHD/mZXX0Gdr1a/luc3aeizKtK723bHflcd6YDzM+82lWqtifxpf+eqydsvidtZGN+c2Y9QPl+U83zb7zhxe2j/R12vFiQB3Y9QPl+U83zb7zhxe2j/R12vFyUWA63le2m5/nM+nW1tf7C7HYG3P3fpq+qgvirWqtse6LJdyun1k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";
    // Mouse, Cursor, black parts of shell window
    this.amigashelltop = new Image() ;
    // base64 encoded PNG
    this.amigashelltop.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAABhCAYAAABGShAtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjEwMPRyoQAAAy5JREFUeF7t1tFtGzEURcEtJW43vaSVlJBWFMkAbeHxSmCwgGI+j4CRoWOS3/e4/P51WXEcx7vr5/YFAMCmDEAAgG/m+PPj7fKMAQgA8DrH8Xb9+nf1nWcMQACALySNuxX1nWceDkDDDwDg9c4Mu1UGIADAF/JfB+BgCAIAPFYH26r6zrB67gwDEADghDrYVtV3htVzZ0wDcAy92g1BAIBZHWyr6jvD6rkzDEAAgBPqYFtV3xlWz51x+9y+P9z94/23IQgA8FgdbKvqO8PquTNun9v3h7t/vP82AAEAHquDbVV9Z1g9d0aM98bQMwQBAGZ1sK2q7wyr586I8d4YeAYgAMCsDrZV9Z1h9dwZMSZj6BmCAACf6mBbVd95pRiTMfAMQACAT2ncrajvvFKMz4yhNwbg+F3PAQB8B2ncrajvvFKMz4zBZwACANxm0DzuVtR3XinGFYYfAMCeYlxhAAIA7ClGAAD6ihEAgL5iBACgrxgBAOgrRgAA+ooRAIC+YgQAoK8YAQDoK0YAAPqKEQCAvmIEAKCvGAEA6CtGAAD6ihEAgL5iBACgrxgBAOgrRgAA+ooRAIC+YgQAoK8YAQDoK0YAAPqKEQCAvmIEAKCvGAEA6CtGAAD6ihEAgL5iBACgrxgBAOgrRgAA+ooRAIC+YgQAoK8YAQDoK0YAAPqKEQCAvmIEAKCvGAEA6CtGAAD6ihEAgL5iBACgrxgBAOgrRgAA+ooRAIC+YgQAoK8YAQDoK0YAAPqKEQCAvmIEAKCvGAEA6CtGAAD6ihEAgL5iBACgrxgBAOgrRgAA+ooRAIC+YgQAoK8YAQDoK0YAAPqKEQCAvub48/pnRb0HAMAW5pjGXlLvAQCwhTmmsZfUewAAbGGOaewl9R4AAFuYYxp7Sb0HAMAW5pjGXlLvAQCwhTmmsZfUewAAbGGOaewl9R4AAFuYYxp7Sb0HAMAW5pjGXlLvAQCwhTmmsZfUewAAbGGOaewl9R4AAFuYYxp7Sb0HAMAW5pjGXlLvAQCwhTmmsZfUewAAbGGOaewl9R4AAFuYYxp7Sb0HAMAW5pjGXlLvAQCwhRgBAOjqcvwF2cEL76GgH5kAAAAASUVORK5CYII=";

    // Total time for the decrunch effect
    this.DecrunchMaxVBL=DecrunchMaxVBL;
    // Current decrunch vbl counter
    this.DecrunchVBLs=0;
    // Before that point, only shell window, after that point, decrunch visible
    this.StartDecrunchAt=StartDecrunchAt;

    // Decrunch types
    this.NoAmigaShell=0 ;    // bars are full screen
    this.AmigaShellBlink=1 ; // bars are on the Amiga Shell white lines
    this.AmigaShellOver=2 ;  // bars are behind the Amiga Shell white lines
    this.AmigaShellOverPalette=3 ; // bars are behind the Amiga Shell and uses a custom Palette
    this.NoAmigaShellPalette=4 ; // bars are full screen and uses a custom Palette

    // user choice decrunch type
    this.DType = DType ;
    this.palette = new Array() ;

    // base siez of decruch bar
    this.MaxBarHeight = MaxBarHeight ;

    // working canvas
    this.mycanvas_temp = new canvas(720,512)

    // = 1 when all is done
    this.finished = 0 ;

    this.doDecrunch=function(dest) {

        // working canvas sizes
        var W = this.mycanvas_temp.contex.canvas.width ;
        var H = this.mycanvas_temp.contex.canvas.height ;
        // images sizes
        var w1 = this.amigashell.width;
        var h1 = this.amigashell.height;
        var w2 = this.amigashelltop.width;
        var h2 = this.amigashelltop.height;
        // Before decrunch we only draw the Amiga shell window
        if (this.DecrunchVBLs<this.StartDecrunchAt) {
            this.mycanvas_temp.contex.drawImage(this.amigashell,40,16,w1,h1) ;
            this.mycanvas_temp.contex.drawImage(this.amigashelltop,40,16,w2,h2);
        } else {
            // We will parse y
            var y=0 ;
            // While not parsed all height of working canvas
            while (y<=H) {
                // calculate color bar height
                var barh = (1+Math.random())*this.MaxBarHeight ;
                // draws the bar
                var mycolor ;
                if ( ((this.DType==this.AmigaShellOverPalette) || (this.DType==this.NoAmigaShellPalette)) && (this.palette.length >0) ) {
                    mycolor = this.palette[Math.round(Math.random()*this.palette.length)];
                } else {
                    mycolor = get_random_color() ;
                }
                this.mycanvas_temp.contex.fillStyle = mycolor ;
                this.mycanvas_temp.contex.fillRect(0,y,W,barh) ;
                // next bar
                y += barh;
            }

            // if Amiga shell window is the only thing that must blink
            if (this.DType==this.AmigaShellBlink) {
                // set destination-in canvas mode
                this.mycanvas_temp.contex.globalCompositeOperation='destination-in';
                // draw the Amiga shell window
                this.mycanvas_temp.contex.drawImage(this.amigashell,40,16,w1,h1) ;
                // back to normal mode
                this.mycanvas_temp.contex.globalCompositeOperation='source-over';
                // draw front things (mouse, cursor, ...)
                this.mycanvas_temp.contex.drawImage(this.amigashelltop,40,16,w2,h2);
            }
            // if bars must appear behind the amiga shell window
            if ( (this.DType==this.AmigaShellOver) || (this.DType==this.AmigaShellOverPalette) ) {
                // draw the images over the bars
                this.mycanvas_temp.contex.drawImage(this.amigashell,40,16,w1,h1) ;
                this.mycanvas_temp.contex.drawImage(this.amigashelltop,40,16,w2,h2);
            }
        }
        // put destination canvas into no AA mode
        dest.contex.ImageSmoothingEnabled=false;
        dest.contex.webkitImageSmoothingEnabled=false;
        dest.contex.mozImageSmoothingEnabled=false;
        dest.contex.oImageSmoothingEnabled=false;

        // the famous Amiga background blue color
        dest.fill('#0055AD');

        // calculate the destination scale
        var scx = dest.contex.canvas.width/W  ;
        var scy = dest.contex.canvas.height/H  ;

        // draw that decrunch
        this.mycanvas_temp.draw(dest,0,0,1,0,scx,scy);

        // next frame please
        this.DecrunchVBLs++;

        // are we finished ?
        if (this.DecrunchVBLs >= this.DecrunchMaxVBL) { this.finished = 1 ; }
    }

    return this ;
}

function AtariDecrunch(DType, MaxBarHeight, StartDecrunchAt, DecrunchMaxVBL) {

    // Automation logo
    this.automation = new Image() ;
    // base64 encoded PNG
    this.automation.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWwAAAAOAQMAAAAxGrQfAAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAAKBJREFUKM+d0kEKxCAMBdAPPYAXGvDqgdnOYT64LWT+j7XQpd0YG58YbdBAJvs32KAYPUggo8GzZAYkusZUHpvcSW0ZQ6lWm09OQI4gWF8ej9jnnppnxVnazBKJxTXRmgp7yX8PnmF+Ks6rupDDj7DJ8+IhNvnw8c5XMaN4Q10Tu5w3X8VUtuJ6yB6fufKCdzE3gflqAl4/Ksu4Paopdvkf8tdqMpbdgqgAAAAASUVORK5CYII=";
    // the famous bee mouse cursor
    this.bee = new Image() ;
    // base64 encoded PNG
    this.bee.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAkElEQVRYw+2WSwrAMAhEtfT+V7abblvHH3WgQhaBkODLjCrih91rJA75OM6BOz1auoqADmauzjml08BThlahuoKANelCQYI8LvDIpFRP7QLUDeierxKidSB0N5ULsn/++tZKAlH/l95cRSDaE1J/TjETdmUOzYaUE1HrvEBBwKt4aE+w9RpAVa3FzrqrEv5xAY+XJkrEQi77AAAAAElFTkSuQmCC";

    // Total time for the decrunch effect
    this.DecrunchMaxVBL=DecrunchMaxVBL;
    // Current decrunch vbl counter
    this.DecrunchVBLs=0;
    // Before that point, only shell window, after that point, decrunch visible
    this.StartDecrunchAt=StartDecrunchAt;

    // Decrunch types
    this.AtariAutomation=0 ;    // Automation Packer v2.3r
    this.AtariPalette=1 ;       // user gives its own palette

    this.palette = new Array();

    // user choice decrunch type
    this.DType = DType ;

    // base size of decruch bar
    this.MaxBarHeight = MaxBarHeight ;

    // working canvas
    this.mycanvas_temp = new canvas(640,480)

    // = 1 when all is done
    this.finished = 0 ;


    this.doDecrunch=function(dest) {

        // working canvas sizes
        var W = this.mycanvas_temp.contex.canvas.width ;
        var H = this.mycanvas_temp.contex.canvas.height ;

        // We will parse y
        var y=0 ;

        // if Atari Automation Packer is selected
        if ((this.DType==this.AtariAutomation) || (this.DType==this.AtariPalette) ){
            // images sizes
            var w1 = this.automation.width;
            var h1 = this.automation.height;
            var w2 = this.bee.width;
            var h2 = this.bee.height;

            if ( (this.DType==this.AtariAutomation) || (this.palette.length==0)) { this.palette = Array('#a0b000','#a0a000','#a02010','#a02090','#a0c030','#a0d0a0','#a04000','#a080a0','#a08000','#a000f0','#a0d060','#a0a0a0'); }

            var tmp1=10+Math.round(Math.random()*this.MaxBarHeight);
            // While not parsed all height of working canvas
            while (y<=H) {
                // calculate color bar height
                var barh=Math.round(Math.random()*tmp1);
                var col = Math.round(Math.random()*12);
                // draws the bar
                this.mycanvas_temp.contex.fillStyle = this.palette[col] ;
                this.mycanvas_temp.contex.fillRect(0,y,W,barh) ;
                // next bar
                y += barh;
            }
            // draw the images over the bars
            this.mycanvas_temp.contex.drawImage(this.automation,320-w1/2,7,w1,h1) ;
            this.mycanvas_temp.contex.drawImage(this.bee,320,50,w2,h2);
        }

        // put destination canvas into no AA mode
        dest.contex.ImageSmoothingEnabled=false;
        dest.contex.webkitImageSmoothingEnabled=false;
        dest.contex.mozImageSmoothingEnabled=false;
        dest.contex.oImageSmoothingEnabled=false;

        // calculate the destination scale
        var scx = dest.contex.canvas.width/W  ;
        var scy = dest.contex.canvas.height/H  ;

        // draw that decrunch
        this.mycanvas_temp.draw(dest,0,0,1,0,scx,scy);

        // next frame please
        this.DecrunchVBLs++;

        // are we finished ?
        if (this.DecrunchVBLs >= this.DecrunchMaxVBL) { this.finished = 1 ; }
    }

    return this ;
}

function DOSDecrunch(DType, MaxBarHeight, StartDecrunchAt, DecrunchMaxVBL) {

        function get_random_color() {
            var letters = '0123456789ABCDEF'.split('');
            var color ='';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.round(Math.random() * 15)];
            }
            return '#'+color;
        }

    // DOS shell window
    this.DOSshell = new Image() ;
    // base64 encoded PNG
    this.DOSshell.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgCAYAAAA10dzkAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTAw9HKhAABFOklEQVR4Xu3deZQlV33g+eTPmdNzZnrap7vP6Rlo2yOWtrGZZhhsy22bY49ZDG60SxRuy20jZES7MUINMgYaBBIISUhCssa4NGZRgZbSLlTaVaWl1qxdlbWo9i2z9r0Qgqw7v1+8uC9/cd8v3nuZFZGV6fjecz56L27EW7IqX8RX8V5mDcyfP3/gscceG/je9743cNNNNw187nOfGzjrV98ZAAAAMP198pOfHPjSl740cMcddwz88Ic/HHj00UcHsv/MnDlz4Jvf/GYWfm97+78P3/nHWeH4T09lTv4snL7XEZ2YQo6X+en4HavQ0W5eq8YRAP8kePuQlLfPmlK8/fAEePv5uvzs56fCf/6Ly8LPf/7zSXPb7X/nztfhjr/6mDs/Hcx47++Hn422Gk5p02nbaeNdeeWVA9/61rcGvv/97w8MfPe7383i71/9mzeFmd/7Ydh/4lTYeOBUeGVPy+rTsGqkt9U18R5rQoaLVp6GFd3sblnexTLPrpaljkHHkp2p0bDY2jEaFhkLU9tHwwJjfrSt5WXjJePFxAvW1pZ5ibnWltHwvOM5a3PLs108Y23q9HQfnuplY3dPNtGrnZ4AKqD7F7vfcck+ytPef3Vh93cLZB84Hh37zxJ2n7tI9sO9FPbZsh8fjyV6HJigeBzR48sBaYVzP3pZOHjiZ2HnwZ+Oz6Fyu0ocOP6z8M2b/y4ce23UXV+lg/JYt//ln4X969aHrY88lNnx6ENh52Mtw2Ik82DYnzsoDmfuD0fFMXG8D952Oqf3ofd1+McPhkPioNgv9omRzENht9iZ2yHPZ6s8x70rV4RL/p/fC4d+MtZx2nTadtp42noxAttn/mZ+d1bYeUTiyQTc6UhDqiPSku3jEz1d6f1OWPJ8069nPFb2IgHYLRCXl/GCMLc0ZV68LaPygk7IzsQq7GSSnVR75yU7xdIoVM7OuB2GEnbqxUQMwr7CUEn8lQVi5IWi5cWiVQjHbiQAPV5INopEYGkIy0GcKMREtfcnXaT7oDbZR3kK+7ASdp/nxV/KBl+/vPjrprDPduIvVTgZIMeFfukx5LQCUElodZNG2WQH4G2XXRr2D60NWx+4r2272PmguicMixGxV+x/qOWQOJw7epri/ahDD8v9i31iryyPiN1ip9ghz2e72JobWbo0XPj7rQBMu0YbT1svngkcuOKKKwb01KDWYbrxRMXwKURUvs7G2ppob8vQaYr3c9rscxP2OY+X/XPpYP58bDBabjAqCcAyhYCU+EvPLC7bPVqwVOLP0ji00lBcHOU7mrjzWWjJzivdAc6P8h1oqrATlp2ztyMvnEmU+POC0SrEo8RfKsZjN15QFkj4deMFZ9O0Q1pisBDFXYLQO9gDqcI+wfD2H6ojAqN0H5Tz9lXdjDcMVRp+vdjo64cXf6lCDFpJ/HUEoMSSG3j9kuAqY6NMA/DrN902aQF463+eEfa+siZsvHtWZovYKrbfOyvsEDvFsBi5766wV+zPHZp9Vzic+UE42ocjOTunt9X70Ps6mN/vPrk+khu+Tx5f7BDb75HnJbaIjWJk0aJwwXt+2w1Apa2nzXfeeecNDLzzne/M3h9+9YC/8XjEaLFho/M2iGJkxWhbq/a1rJsK5PlY2fObIBunZQrhmXjFI3+G6Z97tCqV/32MGZV4NIZHJRLHLE90hGIk8ZeGYiESZYdTeiZRpDsnG47ezlG141HlO9puCjtxZ2fvHRhS3kGlQKKyFy9Km8TGdzumbRQ6MUgIYjzc12bCe32nvP1EJt2f5Lz9Tjfefq0XL/5S9p2ZdN/qKe6P/Ri0vBi0Abj/2Oth676ftOzvtO00bc/tO/rTcO0N3w6HT7zenkvddNv3wnkXXtaXm27/Xth+QG7n0Me69T9dEEZWrAzrvn9n2CA2qh/cGbaIrWL7XXeGnbmR3D6x/66Z4aA4JA7nbvvs5wuPrcvd5pXeh97XfrnPvfn9D4uds1q2i62yvFlsVPKcNoidL78czvud3ywNQG09bT5tv+zt3/hesbdxv2JkeOEXz/LF6LGxt17tPxU2GPoE+7WhSsnzOB36NZXKv+5CeCZiFFs2HHspnsUclb+HMasTqywJw1RZMKbRmAZjqh2QuUErjchceraxm46dXbpzFN4O1PJ2wh10Z96Ft/NvqniwjAfZGMUahTEIYwy6ISgHeCIQ3aT/0xF5IZiyAdiPOsJQFfYh3j4n4e27uunYNzqK+1M/BiONwBiAe468Fl4dPt62cWR8NvVpz+HXwjXX3xIOHX/dXa80ovoduu3mPcdd+jXdcvGHw/DgYBj6h9vDWrEut3FmyxaxVewQO8VuMTLztrBX7BP7Z367LX1eunzrlZ9z58du17ovvc9hoY+htoutd94eNouN4lVZXpdbK3bMmxvO+a13lQagNpmu0/bLAlB/UtfbsF+F+Mvn2vFnokQjRuNG4yeGkkacfkBRbVIHWzb3IW572uJj5+LzqVMaslFZmLoh6UhDUrUj0vxdeOzZx6jnmcf87z1+D6j0rerCW9KO9LONy1LZ29blvM87psY+++iL/2fble740LfWwaJ1cNGDkB649GCnB0k9mGoMdoSgOSNYeGvYOfADyou/lD0rX6Dfh440/Dx1xaCVhp8njb1eCv9TnL8+U8UYtMYCUN9KPEcCcNeB42H11gMFr6ht/VvThx37joUvXntj2Hv4pLtepUHVbei2Q9sPuHbsPxZuOOe9YceC+WHZTd8IK8TKb30jrBJrbv5GGLr562Gd2HDzdWHTLdeFzWKb2C52id2Za8NI7pb/+mk39uzQZd1Otx8Weh96X3qfaqvQx9ko9HHX3fL1MCTWyHNanT+3FWLLU0+EP/6/fr00AJU2XyUBWBZ/9qxft/DTAItBt+XQqbD1DNPnMFGbuzFfp6cjSpX++eR/Tv0ojcn8z9wLRlUajI4hI43FtvzvP/5PQGS/b2I4WjYirUJQlpFQTHmxmUrj0yVRifFrx3ke0Hrg0IOLHoT0wKUHSD2Q6oG4HYLJ2cB2BMqBngiEp/0xg4QXgt14IZhKIzAqxKAl3+P98OKvmzQCPWn4eQoxaMnr1BND0Abgdgmz5Zv2dlgxTiutzZ227jka/varN4Q9h06465WNKr3uiUOvr5LbeLbJY33zQ78ftr/0Yhj8+jWZZWKFWHX9NeGV67+cWSc2fPPLYaPYfMOXw1axQ+zM7TZu/i+fKjy+HTqv6+O28fZ6X3qfaqOSx9HH08fVx18t11d9Q56XWCYGxcY5Pw4f/D9/pd4AtAfo9kFc5kvjT0LDCz8Npxhf2w6fCttzO46U214V83hKH78W+rWZr7NfaWCqfsIyjcg0FK1e0ejGo/59GuMKyPz7wuoIyB7Sz0RORPr97LLf2yXs6wCdNM5jaGsQxrOtehDRA5AezPRAqQdXPQiXRSBnAVEm+4Eu+d7pVxp+nn7OElpeFKqOIIz0+75EGnu91PH2ca8Y1P+ZiwG4dc+RsGTDSGbQsVS92r9lJTYPHw6fv+b6MHzguLteaUgdPnw4o9d7rV8uc8s3dtoycjhc//7fDVtfmBsWXfOFzBKxVCz/2hfCyq99PqwSa8S6az8fNoiN130+bBbbxPbczsS3rvirwnOIz0Pn7Xbx9npfep9qg5LH0ccbyh9fn8fy/Hnp81ssXn304fBHv/bWagPwW7fecVps/GmkbBExdDSS0ujTH1dO2fWnRR+rImlElumIwjL5n0lf8j/HMaPyZ1tuk3Wg00bjVc/+Ufl7LLFvVGKwaF0f1kZ7exuqwJp+7OnOfp4S3WX7j5IQ1IOIHmz0oKQHPj2Q6sG3HYESf1kExrOARCAc+v3isT/t74VgKo1AT+1hqOS1MJVi0OoIwBmXhcH1u8K9z60q9Ym//koWOf244tNfCbOfXxXuj+aOWbhmW/j4lV8M67btbc89kND7GBkZyej1ca2fN2aRPNbf/vK/CKtn/SDcJyH4gHjwA78bHhGPicc/8DvhqQ/+Tnj2g/8hzPvg2eHlD50d5v/x2WGxWCZWiFWOr593XuE5xOeh8+m2K4Xe16DQ+9X7f0EeZ648nj6uPv4ceR6PyvN5WOjz0+e5+OYbwtm/8M+qD8DV67f2dPnVt3Rc6m1j/Nkzf9mZMYme7YdHwv0fHQgDM+aFFRJoGnu7ElkEbnohXDRwaXhg41gU9jYSHkju27c23PgG2e62tc46nxuXkXxd4wlE1RGDZWwEZkYLNAQtjb9nvv2GMDAgX584/8fDxTDcMC+cL3+ud683QbhoZnjDwMzwlFyPUfjUrXofM8OTcr0VhCPhRx8ZCOc9NhwWPnaprLs0/GhdZxyu72LBo3K7S+aF+SYKS0mcpbxQjF5+pHXfLzvrJsILyqr8+ObW303LzPDj9rqh8NX2vJCv56V87qvzi/dRtew53TzkruvHWDC39iF6RjBGoL41bCNQD1568NODph6M9QAePxPIWUB0k4afpxCDZeT7zuOFYKqfMPRC0NMRhJG+RnJp+PVSdRjqGfwYgIvX7gg/fHpF+OEznX4kNHD6HbrtPc+uaLvXeHn1lvCxv/5CGNq6pzBv6e137NiR0eseu/4+uU3Bcy0L5LH+5k3/c1j1/e+Gu3//N8N9YvYf/GZ4UDwiHvuD3whP/OFvhKf/8N3h+T98V3jxve8KL73vXWGhGBTLxIrEdeecU3h8S+d1vd1+udD7Wiz0fvX+58rjPCePp4+rj6/P4yF5Pg8IfX73iYU3fiP81j//H6oPwMWDSydEb5vGn4aLxoyGz44s7PQA14q7LPqOOmIAbnLW9UPv1/CirqvBO7Momuets+RrUmNnCluBe+GcETNXlMZgmfh2cstoJg3AaEtmJNw7Q/9sZ4ZnJfa2HMyXPzIvLDERqIEYwzA7Q5hF4UD4+qIYhUPhGxrIMnedzGVnCde3ttHl9GxhGoEdJOhUDMAFcj09g9iNG4gdhsLX5Ptl1lpvXU5CpZc0BKsOy7V7h8Ndjwzl1/U5t8JLl/Wxzn1kuLBOl7PnkG9Tl8fzAPTW9cOGYBaB5kxg9vnA/O1gPaOgBx09UOkBUA+oetC2bwXbzwJ6EYDmav8+zkQagb1UFYOWF4KeNAI9ZTFopeHXSxp+vcQA1Nfs/hOjEoAfywNwZeZHz3TSuDl48GBfdNt7nl1ZcG9u/uqt4bJPxwAcm1f35fT2mzdv7otuq7eZnXpupQTgVgnA/yWs+sF3w71/cLaE1dnh/j88OzwoHnnv2eGx9/5WeOJ9vxWeft9vhOff/+7w4gfeHV4Wi/7o3WFQLBMrjOvOPbfjuXnLul28zXKh97VELJT7fknMlcd67n3vzh5XH1+fx8PyfPR56fObLc9z0U0SgP/r/1hdAOr/uWvEjZ2hGJ9eAbjiiT/LzrzNu/0N4SKJJI213Wm8qdMJQAmz09ZvAHZonYXMAlCWvTOFqTT8Oo1mtikJvVSMwKWPSyho/Mn1VhAaJgA3L54Z3mCicNOBkXDPR+Tv79ahVgDmsad/n3rGTwNw0Y9b923PEm6UuNO3inuJIZidOZTHXZAvF84QSqBNhA28ObdIMD06XJg7XfPHc9ZyAvQ5D9wy1H3d2nnhXPmzn+NsU5Vuz6MfMQLj2+ZxX5KdBdQAFOnnAfVAp2dR9GCrB3E9C1h4G9gJADSb/o9CGn/dePHXDWHYST8b2A7AoZ0Seqva7k5o2OzcubMvuu29z65yvawBeOWXwtpt+8J9z61y6e03bNjQF912ttwmut+Y/8rWcPUv/0JY/aNZYfYH3xNm//F7woPiIfHYf3xPmPPh94SnxDNirnhJzBcLz31PGDz398Ky834vrDjvd9vS56XL111wgTsfb7Nc7mNQLJb71PvVx3hBPC/0cZ8Qjwt9Pvq89Pnp81zy7RvDb/7C/1RNAMYPc1cVgPGzf+2zf3kc3TAooaSBNWNeWCXBpgGoVj0pcRjva8alWQA+KAG4++jacNMbBsKNt2uUtdZf9MRI2C2ReHG+fONS2U4i60UJSw1Mvf5Cdv3O1tu92XYzwwsyv0uex4PyPLIA1eUs9vJt5DmttMtCt1up4TpjZrhR32LW+9kYz2Tmsred87eg2/N5QC4p3t8NSzT80jOFY8v6NvlsuX6BPPcL9Ta3DbUiUEJum1imoSchtVSu27OAz90mX++3h9rLMfxahsL18ufwjUUafa0zfK3rLUvyeHxari/W2JP7v1vfBpbLxRJ7T+fXF2n42beM8+vXZW8Zt76+6xbG+Gu9bRznz/tIMQCfvHVsnbpWbrdh/1C4tn1ddkDZ280zw5PZbYbDD+X+dN36dRpF8bYzwxOyfv3CmWPXJUpUdtYxbieB03EWMour1plDd9u4LK5doLdpPT+7XXY/C1qPfa2GVLYuvU95XvEx2/KvNbvf1HCYdUkraIvXx7Z5ov1YIvua8vu7RZ9Laz67TfY1tpbHHst+HZeGc+X+21+LZW7bvr/8tvH5tL7GmeFxjcD5Y4+tvvyy/1lAPfDoQUwPfHpQ1YNv+21gAhAl9HvEk4VhJN9LnjT2einEoCXfrx4v/npJIzDy4i9ViEFLX1u5NPbGIwagvl41AD8sATi4bne457k14e5nx9wTyfwnP/PVLGz6odve9/yazOzEgle2h8uv/O9h7dZ9YfZcmXN87iut37nXD932frmN9UBu4Zrt4eo3/+vwyux7woMXfSg8dPGHwiPiMTFHPHHxB8Mz4vkZfxTmfvT94SWxQCz5T+8Pg2KZWGFc95FLCo+ty93m1XKh96UWyn3PFy+KuTPeH577yB+Fp+Xx9Xk8nj8vfX76PAf/39vD2f/yn4dDJ/2mU30FYIy/NADjsDv1OJ/OqRiA7tu/5qzaruxzeDHwxFJdN7achVwSgHqQebEQiq312XIek9ntbl+bnQnMAlC20zjcJfehIajhuOtoHoB6vexMY/Z8JPTy5fiYGoMdZ/3yt7WzsDVnALN1WSheGu5/tXW2b0cWgzPDXCcAs+gzAahf32zZ6WVn/yTmohiAy/LlVvCNhPtmyO0fH24H4NZ2/BUDUJez4Lt1qB2A2VlBebx71g+PnQ3M4k4/L9gKxvPzs4E2AF/Nrre21+jLPjsoMbIwuf5qHnYxAIthJ7J4uzT8cF0rDPXMYww+/XMfiz4NvDx0dE5uO0ZCSQMxRk4eZcXwym+bb5PFi4aPu22+vh2MaYiZ+8puL881i6jWdtlydtvkdnFb8zxSxccVehuznMWfXZ/J/4zzr2MsPk2MmufTDr4YeR0BWPyzsrHc/vMyc2uH5oVz5Pr31+RvA798p2xzZ3hwnAEY3wbWzwF6EYDmSsOvl37C0Eoj0ONGoZLvY48Xfp6qPltYFoNWGnvd6Ot1nwTgRX/+V2Hxmm3h/hc2hPvmrpcIK7pfzSt6oMwLnR40Fg3tCpd/5ith/bYD4SFZ7ubh07RYHusL/+6NYeiRB8Ojf3FJeEw8Lp4Qz1wmPn5JmCteuPzi8JJYIBZfcXEYvOKisOKKC8KKT14QVolX+rC6ZE7vQ+l9qoWfuDjMzx9vrnheHl+fx9PyfObkz+/xy/8kLPvBP4bf/df/MgtAbTev7boGoA2/KAagjbx4Pb1MdQvAufnZOQ0jPfOWBZrEWjv48uuZ7OxeMQCzs34d60QeaxqH8T7bAZhfLy6bANR1WcCNxV7GC8DCD5ekZ/ucAJSvecWcGKuWBmExANtn/UwAXjBnuBB+nnbs2QBsR1+ndvBtmBcukK/vmbicf+7v/Ftnjn0eMH8r+Hw9cyfP+Ufr87d+8wDMfkAkXpcAy876SchlcSiRdp3cn54NzAJPZNGXBWAr7FqRF9ebOY1B3U6C7zy5r2slCM+V+bHbS4BkESjhIcFo30JuB12MmCScVBZPJtQKwZhsWwix5GxYlIVdFkR5HKW3E2OPOXbf7WDzHlO+7s5wjfefhFlhGxOaNth02Ym2eFv3+WXbj32dUXzceAZSH0/fBs4+q5hsq38m/99qAhDVyP5JQUcafr30E4Zp+PXSTwwqL/66SSPQ44VgaqJhGAPwL/76C2H+ig1hzuJt4ZH5W1yPRgvGPOb4cQ9L1+8NV3z22rBx55H23OMLy805DfpYX/j1s8KGJ+aEpz79l+Fp8cyVLXM/c3l4Qbwk5v+3j4fFn/t4GBTLP/exsOJvPhZWf/5j4RX1tx8La/swVDKnt9f70ftUy/LH0cfTx9XH1+ei4nN7/m+vCoOz7w//8S2/1A7AyDZeaQDaG1heAKbiSOdjAHa+Bbw23CBBkG6vByQNt34CMHub167bKNclxnbnZxb17d0s8iQy24GZXy8uJ28Bq/i2r74F3F5u3aeub70FPBaA+hnGseXW2cUsACXeYgBq2GUBqNvJ9daZvqgVgK3gswE43Lqex5wfe5307d7B/G3c1g+AmNhzbDo4Eu6Rx9CzevGngbO3efO/k9Zn/UbC3fkZuDiX/eCHjb48+MoCML6VO64AzMJPAuUxCZBbJUryIJyVh2D7jF/7bWATS07ctIJKtouBE0MoXsbbOtt2BmDxvtuS++ovAIV3u+Q5RWP30T0A3TN2uhwfa1wB6D8X5QagfM0v5D8IovsS/UEQ3gJGVfT7wwvAMmn49VJ7GCr5fvd48ddNGoEeLwRVIQYtfV3mYgDq28D6GfYbZ94Xrrnx78KKTQfDcyuGw5NLd4cnBne5nlRLxzzVy7KiVZsPhk99/vqwZeR4eFqWo2dqsHrLwfDl//vfhY3PPRvmfvGzYe6XPhte+NJV4aX/flWYLxZ+5aqwRAxec1VY8dWrwqqvfia8cu1nwtB1nwnrvn5l5tWv/3XYeBrWZa6U+7wyvCL3u1oeY0Wm9bj6+Avluehzeumaq8OC668Jq390V7jn7+8M13x0RkcAqq4BmG5s9XMGML0e2QAsnAWMb33KN1L8oYj41qmGXest1vhWbP5rWpLl1lu5IrudrIs/RXyaAdg6oxefT+t+058CLgagiTxZbr21XfLZvvyzgmOhN2aufmZP7nO5XF8+pxUerbN+xQBMYy8LPQmiQble/CGP/Kd3ZV37p371zJ4sL87P8I39pG9+Jk/WZZ/rE60f9JDby0G89bZt/oMbOidx0PpcXzH69Gxd+7pZfiIPOr0v/QGKVky0ljWKWqGTxklreZ15C/VrEjOtn/DV5bjeaq1rbdfi/jBIHjOtH6QYu/+O7ZJtiz8Ekt+uvezfRpfTHx4p+yGLbD7fLruNuY8OWbi11me369g2+bMwoZctt59j/ueZP5/W444tjz3X4nYF8b7yx7hraDQMZW8BD4QPPzLc3sfwQyCokn5/ZBHYjXwf9ZKGXy91hKGqKgz7efvYSoMw8mJQf52M/tvx+hO55//pX4YvfuPWsHDl+rBl70/CxpGTYdMe6yddbe5G7s/63DU3h0PHf5Y9Tt2u/w/vCHs3bAwb5zwWNostcx4NW59o2S52iJ1PtYw883Bmr9iX218BvR+9z3j/w08/3HrM/PHj89n6zJNh8LFHw13fvj186O1vCxu275XjebHhos4AfD24G1oxAFUccdmK83Ho9bIAfF5jR+JL/1WOdgCK7Eyafcs2v++Lbr+zFWN9BKCNtez+5HHa951fLy6bt2nzCI2P23obtxV5GnI6p9t1nsnrPKOpAZjFXfuHPmaG57O407g120p0LdMofvWF1g95ZHMzw/XxLdz87dzz5boNvCgGoP3VLq2zemNn9uzjafRtlAD8ujzf9q91yehZutZbu9lyduatdZatfWYuC7p8Tg782S+BloN/Fnnp9Y7l1hmp1vO4NHztFieK2uuLEVeMIRNee2U5/vqUnP6qlMKvctEfRJBtXy78QEIrUuKvLWm9XWnmSrcde6yvzZdliZzi28D5ttntWz8I0b5/fQ75cvvXrHTcPt6m+DW1FX41y3C4S/4csueRX29vlz1W6z5a60X2WOnXmD9e4XnMDF8zvwam8CthCn8urW0fz28bHyfbXub19xm+mL4NfPEL4RkNQIm/br8GRg+yemCOb/8SgPDo90cvbhSq/HusmzT8eqkyDAsxaMlrxJNGoKeKMIxnApfueE3C7Hi4bdbj4eP/7Zrsh0I8+vsCO3y06Nw+nDfjL8L53Xy0On/2lv8tfPj/GHPOWeLN/3s4781vDOe95U3h/Le+KVzwtn8bLviVXwoX/sovh4t+Vbz9rHDxr50VPvJrbw4f+fW35N4aZgi9bHvH2PVLnLmLcxfJ7S/8tbeEC97+5nD+r54VzpPHOVec87ZfCh9+6y+GP37Lvw0fkuejPvbOt4Vb/2xG2LH/RFg78lO34yJtvgkH4Hjpbb1fBG0/CxgDMEbgmWCfg8eeqetJv7Y+6J9B0dhZPRt4yoadVfave2SfzSuRxZ3EXEoDLzvDd8vQ2NuqHokw1T77U0YCIJVFxCSIv4euZTj8QOKo2y9PfikPtJecdVOaBtkUfN7xX1Xp+xdBCz3g6IFMD356MNWDN78IGt2ksTcebhQq+d7rJQ2/XrwQ9KQR6HGjUMlrZzwxaPUThjEA7dvBq0ZGw64jrc8EevSnhce0/gWRMgfKnOzfwWlI366tijZW2m+pSQ9A+0/BeRGYhaATXV3JbariRlwf4nNv06+nHXPd6dc/RiIvVxp4SsKtV+S1zuTlJNbaZ+4SbtgpJ+T6/SfbvBDoV8c/yeaRoKjHULhGvlevedlbh4no55+C098npmf/YvzpgUgPcHrA1IOsHqT5p+DQjf4PQhp2E+GGYCr/vkylsddL4Syhku95Txp+vbhRqOR1NZ4w7BWD8a3gGIEq/VdG9H/sLD3Tr/QjH/raj5ao/N2ASPcPlr5bkMk/OhLpvsSjHzHRfU0Z3RdN1MpUvn87XV531WVCAXg61ksAagRukADMQlACMAvBPIA0iGJEZXElgddV3C5XiLAKpdHWj2LYtb7GgjyAI/1zyOSBXEb/3CL9c8zEP9ec/jln9hWtM9aW2XtKQmzMmnF4JZID/nhkgdCLfP/1w/u+7cfch/O3KL+11l2PidMdm+40daerO2bdmce3fdMzf3rg0YOYHhD1oKoHZc7+oRf9HwT9Pukmjb2JcqNQ5d+z3Xgh6Kk9DOV15kkj0BOjMP1MYCEE5XVdFoL6P3xjIVhvBKo0/Kw07MZjukfguAOwl+wgnB+w9cC+RkkQaEhoXMT4iCEYQ6YdgkriKEaTF1YeG1oT0RFnVnxejna0Rfq19MFGnOoZcsr8+ZUF3FAkf95pnGXyv5N+42uVJX+33jdrQfKC8F40lveC7KAvYExbugPOdtKy08526rKTj+GnZwv0wKFvJ+kBRQ9AeqDy4i9+9o8AhCcLwF7y76dUGngTVVcMWlWFYSEGrfx12E8Mtt8KLotApa/zXHkETjAE474ll4af5R5bct6xaTwKxz3vuDgBaVvVofIAVGkEZiGYB0h2VimPFRuC8YygyiLJi6tI1ltpXFXJRprVDrYo/zoKwebJv+6OiJM/l1Q8A+fFXHqWzUZbehYs+4ZKv0mF/QZOXxDLLOfFFLVffPEFmUtfrKn0xe2KOwJMa62demtHn0Wf0IODG35CD3J6ANUDqh6c2/GnnAM/oPR7xI2+fuTfa6k08CZqvGGo0vDr5UyEYXwrOA1BG4FpCHZEoGqH4AQiUNljkfCOVSr7n9L8GOexx8Tx6jjGxmPvabLH8qrVEoAqvh0XI7AdgyZiYghmMShxpGIoxSgsC60qFMIsYSMt1Y62SL+WPo1F3Kj8WeSyz0iN0R+rbxspWhkNj8o3XcvyaHfRMmOpMRjtGpUXVQl5MarW/5l1ii/Y9gvYsC/wVNwJlIo7C/yTEWMvBl8WfUIPIO3wyw9ieuDTA2Z2AJYDczv8lHPQB6L4Pwqpjtgbj/i9mEgDb6IKYZjKXw+pNPx6qSUM89eu/WxgGoFuCJp9vT0uZMeO/JjSOsaYCExCMI3AdghK3PUTgcqLv8iLu35NtwisLQBVjMD4FmI8QxVDsBCDyomrQnzJNlZ6xmw80jCzxiKtU3zebebrKmX+TFrGIs6GXBpzbsBJnGm4pWKwpeHWDrXcwkhecPbFWOC8cKP4wm5/9iMXX/yeuIPoKu5Muoj/14npJx4w9OChB5PswJMfoLIDmxzw9ICYHWDlwBsP3jH8iD/0YqNvvDrCr5f4vZpIA+909BODVhp+nqpiMIqvb7svj/v9shDM/scwP9Z0RKCS45ONwHGdDZS46zsClUSax4u7fk2nCKw1AN0nLkFkY1BlQajyqPLCK352Lf382njZx+2QPtceOv6iReGbQb7B1NjnoUqiTrTPyikNutziKH9ReCFnlUWcDTcbZyqNMHvgjuwB3PJ2Cpa3gylId0oOb0eG6SkerOyBLjt4ykE1HoztGT/CD/2yQVeVjvDrJX4/J+z3+0QUYtAyrynLe+11U9jnevtp4e3f7TEiO37kx5J4bGmfJMiPP14EuiGYH+dsCPZ9NlCOtf2G4KS9Jay9UBGvRSaqtgD0nnjU3k6iyyqLMss+xnh5z6Ut/0vzdHxjJN9ELv1GLGiFXbezdYvjN3+u/aKIL5j8xZOxLy7hBp14IdJ4S8yN8hez96J/Lsp3FJG307Ge6UV2Xr14O1JMc3KQ9A60RB9Ol37/eN9bdegIv16814Lw9nvj4Uahkn2sJ92P99IrDOOxpK8QlOOWjcA0BG0EKi8CvbOBbgQqOQ5PqQhUXntMgNc3E1FLAHpPuBfvflbJH5hd9m7XrxVl5DG8v/So8MMQIv2mUoMp+eYb+wZtncmLn6trx56I3+Aq/ebPXhTJiyW+gNzgS16E7dCTF6n9P7ZC6OUvbO+F395pJDsWbydkeTu5Am/naHg7W0x/7cBTerA2vIM5MF6F77ES3vdmlbx9WlfePjLn7V/7le632+y+3fCOAd3EY4ceT7J3g8yxR3kRqGII2uOaihGYhmDxLWHV/1vCKj1WewEYdQvBNOzGYypH4LgCcOTYqbDveLm9U9SeMvL1dKNf73gNH7VG23aX0N+c3svOEjvU4U7b+3FoNGwbB/svk4zbwd7Sf+0EAMbD3fdMEd4+9UzQ/X6bd1wYp47jT3KMsrxjW8o7Rip7LLXHWO8Y3It3rC/wWkF4bTEVeC0W6dfrtVzUdwDqHf3j3Q+HP/nk3wAAAGAK02brFoF9B6DWpN6hjAH9T34Z6ei2fKbF4a3rh47xLPdLhzdfBzu89XXS4c1XJQ5vnUeHN5/yhrfem9Nh5+M6by6OdB2AcWBM7vD+DlCN1157LezYsSMMDw+HAwcOhEOHDhUcPny4fWkdOXIkHD16NOzduzdrNm03r+nU6QSgjvT6VKRjPPMeHd2WJ0qHN18HHd78dKfDmy8Th7euFx3e9bI5Hfa6Drve0uHNAwAaZqoHoHcZ6bDLcS4OO2fXxXk7p+N05+1ynLMjXZ/S4V2m6+1yHHY+XafDm7dz8Xq6bIfdpoyOXnM67PU40vVxxHk7p8POx3XeXBzd5rrR4c33osOb70aHd93SYa/rKFuf0uHNAwAaZjoEYKRjoss60uvxstd8pMNbToe3TT90eJfpem9Zh3fdLsfLic73Q0evOR3d5suux8syOvpZjpfp9TLp8Lbx6PDmy+hIl+1It0sv0/UeHd48AKBh/ikHoKWj15wOez0Ob326rMOu6zXv0eFdpuu9ZR3edbscL8vm08t4PY44142OXnM64qUd3jYpO7x1/SzHy/R6GR3dlsvo8OY9OnrN6YiXOtL5smVLhzcPAGiYKRWA+uPGf3JF7WcAy+Z02OV0Pl6m8966dD5edqPDu0zXe8s6vOt2OV568+mw20U6vHlLR7f5eJleT+nw5i0dE1mOl+n1MjrKluOw6+06b06HN99rTke3+bJlS4c3DwBomEoCUJpN281rOtVXAOovHZxAAOrw5nR0m+u1zo5+5+2ypcOb9+iwl+k6HXbZux6X7fDm0+3tpZ2Pw86XscNb583F0W1uPOu8OR12zrvejR3evJ2z8zq8eTsX59O5OB9HHfMAgIbqFYDHjh0LJ06cyC57BWDZL47uGYDxt04nAQgAAIAadAtADTyNv7e//e0dEVgWgF4Edg3AeKOSALSj8MQngQ5vPqXDm58oHd68R4c3X8aOOuY9OsazfKbF4a3rlx3e+ulAhzdfF29429VNhzffLx3e/GSIw1tXpzi8dQCmqLIAjPH3xje+MbzrXe8KM2bMKERgtwBUtvHcALQbR0kAxstIh12eKnR480qHN19GhzffjQ5vPqXDW46XpztfJo70+lSkYzzzHh3dlqcSHd78maTDm58sOrz506HDmweAM8YLwBh/v/iLvxje//73h6uvvjrccMMN4dprr21HYK8AjNwA9DZUeicfLQ9Ayw5vToed73Y9jjifrk/n7Ejnem3bi46y+Ti8delcP3TYy3hdR7/z3nJKh3eZrk/n4rBzdl2ct3M6TnfeLsc5O9L1KR3evLLDztl13rY64ny6zs7ZdXHezunw5nTY7eN6by6ObnOnQ4c3F4ed867H5TjsfJl0xDm7rmx7Ox/Xpct2lK2z8x4d8VJHui6Oic7rsOvSeW/ZjnSbOOw8gCnEC0CNvAsuuCB89rOfDXfeeWd44IEHwpw5c8Lzzz8fHn/88Wx9vwGoqg5AHd5yvOw2ryNeH8+6bsvxMr3uLfeio9ecjm7LvcRhl8dzGa/bEec9Oqpa1pFej5e95iMd3nI6vG36oaOfeR3drsfLfue7Xbd0eNdTOvpZjpfp9YnS0c9yvOx2vR86ypZ1pNfjZTpftjyeuV50pNfjZa/5SEfZso70eryc6DyAKarbGcAy4zkDqKZLAKZ09LMcL9Pr3nIvOvqZs3R48x4d3pwOu9xtPqXDm490nM6ypaPXnA57PQ5vfbqsw67rNe/R0c+8jrJ13pyObvPeOjtvh52321k6+lmOl+n1idLRz3K8TK/H5TjsvEdH2bIOu86b09FtuWwuzsfhrU/p8ObsKFvX7/Z22ZvTES/tSLeJw84DmEK6/RCI0s/7xUurEICfnJwA1DGR+Xg9jrJtUjq8OTvS7XTE63Y5Xvaio9ecjm7LZXT0M6+j23yvuZSOqpZ12HXenA67nM7Hy3TeW5fOx8tudHjL8TKd99Z5czq6zXvrvDkd6fV4aenoZzleptfjsg4714uOfpbtpQ67jaXDm490lC3rsOu8OR3dlu1cvPTo8OYtHf3MeXTYS4+ObvPxMr3ejQ57XYddD+AMmcoBqOywT9wOb06H3T6uT5fjsPPpem+d0mEv0+vd5rrR4c3Fkc7b5W684a0ru403b+fK6Oi1rMOb09Ftrtc6O/qdt8uWDm/eY0eveTvKttVRtq7bnLdOR7rOLtt5Hd6cDjvnXY/LOuxcLzq8uTjSeXtp5+Ow82XSkc51275snTfvzcWRrkvZ0e86O3rN22G3teu9uTjGM2/nAJwhUz0Ax0NH2bwOb9142eGtB6qiw5sHAOC0/VMKQAAAAPSBAAQAAGgYAhAAAKBhNACXLFkSZs+eHf7+7/++w3e+8532pXXvvfeGZcuWEYAAAADTjQagxt/OnTvDyZMn2+Lv/NOzgvv2HZDQ2xf27Nkbdu8eDlu3bgsrVqwK999/f4UBOEwAAgAATAYNwDvuuKMQfkePHguHjxwJhw4dDjt27JLg2x42bd4aNmzYFFaueiW8+NKCsHr1mnD7391eDEBpOK/tegeg3pAABAAAmBQxAO2/8nH48JFw8OChsH//gbBp09awfv3GMLR2vUTfUFi4aDDMm/dydgbQDUAnArsHYLwRAQgAADApbAAeP348HDlytB1/e/bsC+s3bAxr1qwLK1e+EpYuXRkWLFgS5s59KSxfvrI8AJVpPD8A7cZihSAAAQAA6ldlAGrDpV3nB2Cykd6wJADtKDzxcdDRbXmyecPbbirT4c0DAIBpoOoA9CKwawDGGzkBGC8jHXY5paOfeR12uS46vPlIhzfv0eHNn0k6vHkAADDF1RGAyjaeG4B246hHAFpxePO95nTY63Gk28Rh5+y6OG/ndKTzdtnS4c3F4c3p6Gd7uy7d1m6TrtPRbS6lI70eR7dt4vU44lw/61JxxOveOh12vowdds67HpfjsPMAAExpdQVg5Aagt6GqIADjun6W42VKR9myjvR6vCyjo595HWXLOuw6b05Ht+tllykd9jK9ntLR7Xq8nMh1bzmlo9tlpMMup3R4y/Gy23VvGQCAKavuAFR1BGAvOrzr3ro4vDkdcT6us8t2Po6y9b3mdJQt67DrvDkdZevsXHoZr9vhrY/XLR3dltM5Hf1ctyPOl9FRdmlH3L5MOrx13lwcdh0AAFPadApAHfa6Drs+pcNepvMpHfbSo8Obt3T0M6+j32UdZXPesg67zpvT0e+8jnh9onNxpPPdrvdDh7ccLz1xpHN22ZvX4V0HAGBasQEYfwegxp/+yx8jI3vC2rUbst//t3z5qrBkybLw8vxF4bnnX6gpAI8VAlDZYZ94HHauGzsmOm+H3bbXujI6vLk4vHXeXBzd5uJ82XI6vPXxurcc5+Lw1tnLbtfjchx23qOjbNmOdBsdds7O67Bz3vW4HEe6bIe9DQAAZ1wMQD37F+NP/8m34eE9Ydeu4exf/NDYWzK4LCxYsDi88OL88Oxz8yYtAAFVNrxtz6Sy4W0LAMAZowF49913Z/8W8JEj8V8A2R/27dufnQXctGlz2LBhY1i/4dWwbt36MDS0LrzyylBYtGhJmDVrFgEIAAAw3WgALliwIItAPaPXL42/p59+mgAEAACYbjQAd+zYEYaHh8OBAwfCoUOHCg4fPty+tPRs4dGjR6sNwD0EIAAAQO2qCsA9pxuAywUBCAAAUL8qA1Abzmu7ngGoNyQAAQAAJkfVAehFYGkAxhtEBCAAAED96gjAqGsAphsrAhAAAKB+dQagcgPQ21ARgAAAAPWrOwBVIQBPEIAAAABn1GQEoDYfAQgAADBFEIAAAAANU1kASrt5Tad6B+DuFgIQAACgfpUGYN5xad91D8D8RssIQAAAgElRZQBqw3kRWAjA+GtgMrKhijciAAEAAOpXxxnA2HWx8zp+DUx7AxFvRAACAABMjlreAha28dwAtBtHBCAAAED96grAyA1Ab0NFAAIAANSv7gBUhQDMfgjE2YgfAgEAAJgctf0QiNH5U8DJBnpDAhAAAGByVB2AXgSWBmC8QUQAAgAA1K+OAIy6BmC6sSIAAQAA6ldnACo3AL0Nl+06FUYIQAAAgNpVFYDabtpwXtv1FYBLBQEIAABQvyoDUBvOa7vOAByWFZFsoDckAAEAACZH1QHYjkDTeH4A5hvGGxGAAAAAk6OOAFSx7/wAzFfaGygCEAAAoH51BaCKnecGYLqxIgABAADqV2cAKjcAvQ0HBQEIAABQvyoDUBvOazv3DKAVNyQAAQAA6lfbD4EYXQMw3ogABAAAmBy1/xCIKA1Ae4Ol/CJoAACASVFpAErD2abrGoB2w+yGGoBHCUAAAIC6VR6ATgR2BKDdQG8wmCMAAQAA6lfpD4HkHZdGYHkA5jcYC8BRAhAAAKBm1QXgaKHlbASWBqC9weCuUQIQAABgElQbgEkElgag2ahlNCwhAAEAACZFZQEo7aYN1xGBwg3AqHUDsZMABAAAmAxVBqA2XOw523ilAWjjbwkBCAAAMCkqPQOoAehEoBuA7fgTekMCEAAAYHJUHYBZBJq2KwlAE3/GMAEIAABQu6oCcPhYseXGAnC0MwAHd8tKYW+wWBCAAAAA9asyALXhbNPFznMD0G6oNyQAAQAAJkdlASjtFjvOtp0fgLoi1954JwEIAAAwGaoMwOwzgHnP2cYrDUAbf4sJQAAAgElR6RlADUAnAt0ATOOPAAQAAJgcVQegF4EdAdiOPxFvRAACAABMjjoCUNnGKw3AuPGiHAEIAABQvyoDMHZcGoFuAMaN2gG4QwLwCAEIAABQt0oDUBrOBqDyA1BX5LIN9YYagJwBBAAAqF3VAagtl4Wf4Z8BjGSDeOpwNwEIAABQu6oCUNstdlx2Ui/vu/K3gJP4WygIQAAAgPpVGYDacGkEugEY488GoOItYAAAgPrV8UMgKvadtp57BjB+/q99ox2jYTc/BAIAAFC7St8C1p/lyHtO2y77DKAbgPkGNv4WEoAAAACTotK3gDUAnQgsBOBxWSjEn9AbEoAAAACTo+oAzCLQtJ22njZfRwBmdOMcAQgAADA5KgtAabcs/nLx18F0BKCeDvTijwAEAACYHLWcAczFCOz9FrCSjQlAAACA+lUegEnbdZwB1AW7QYy/BQQgAADApKgyALXhvAgsDcAYfxEBCAAAUL863gLO5I3nngFsvwVsbyAIQAAAgPrVFYDZ5wDLAjCNPz11yFvAAAAAk6OyAJR2ix2XRmBnAOYr44aZ7QQgAADAZKgyALXhCk0ntPM6AtB7C5gzgAAAAJOjlh8CEfEkn/4qmM4zgHkA2p8AJgABAAAmR9UB2I7AeJJPlAZgFoH5DQhAAACAyVHbGUDTeOUBaG5AAAIAAEyOqn8IpB2AqmsAmo0jAhAAAKB+lf4QSNJzMQI7AzCuzDeMCEAAAID6VfkWsG0523j+GUCR/RCIko14CxgAAGBy1PIZwLzrYueVBmAm3ogABAAAmBR1nAHMzvyZxusIQPt7AAlAAACAyVVbACppvPJ/Ci4PwHgjAhAAAGBy1PoZwLzz/DOAcaNcFoByJwQgAABAvaoOwLTrygPQiD8IwhlAAACA+lV+BjBpu+5vAVty42ECEAAAoHZVBeCwBGA845dyzwAWzgLqDTkDCAAAMCmqPAMYOy52Xey87gGY34jPAAIAAEyO2j4DmDdeaQDa+Iv0NCIBCAAAUK/K3wK2vAA8Yc4ARlkMCgIQAACgfpUGYN5xad9p8xUDcFfnRooABAAAqF+VAeg1nbZeRwAukRWR3ZgABAAAqF9dAWgbrzQA7Q0UAQgAAFC/Os8AlgbgoFkZEYAAAACTo+oATLtOW6/zDOCuUwWLc8NHTxGAAAAANassAI+NdVzad51nAGUyshuOEIAAAAC1qyoARyQAbcvZxisNQHsDRQACAADUr7IAlHZLe640AJealRYBCAAAUL8qzwB6Tac6A3C3rEjJhgQgAABA/SoPwKTrtPXcACyQGyoCEAAAoH5VBmDsuLTvugdgvJEGoNwJAQgAAFCvWgJQmcbrfQYwRwACAADUr9IAdJpOdQTgMpn0EIAAAAD1qzIAvaZTnQE47G+4hwAEAACoXe0BKK3XEYDLZYUVNyYAAQAA6ldVAGq7xY5L+65rAMYbEYAAAACTo44AVLbxOgNwWFY4CEAAAID6VRaAx/2mUydtAOrCCplU6YYEIAAAQP3qDMDYeaUBmNpLAAIAANSuqgDcKwHoNZ3qPwDlTghAAACAep2RAFwpkyrdkAAEAACoX5UBWNZ1nQE4Ihs6CEAAAID6VRqATtMpAhAAAGAKOSMBuEomPfsIQAAAgNpVFYDabl7TKQIQAABgCpn8APxZCKv3nHIRgAAAAPWrLABP+E2ntPkIQAAAgCnijATgKzLp0TshAAEAAOpVZQB6TacIQAAAgClk0gPwJ7KwZu8p134CEAAAoHZVBaC2m9d0SpuPAAQAAJgizkgADsmkhwAEAACoX5UB6DWd6gjAtTKp4gbZ8r5T4QABCAAAULsqA7Cs6zoDUCY9BCAAAED9qgpAbTev6VRHAK6TSQ8BCAAAUL8qA9BrOtURgOtl0nOQAAQAAKhdVQGo7eY1neoMwP2ywkEAAgAA1K+yADzpN50qBOBrsrBBJj16JwQgAABAvaoMQK/plDYfAQgAADBFnJEAfPXAKRcBCAAAUL8qA9BrOkUAAgAATCFnKABHXQdPjhKAAAAANasuAP2mUx0BuFEmo1f3t+j1QwQgAABA7aoKQG23sq7rGoAWAQgAAFC/ugLQ6gjATTLpIQABAADqV2UAek2negbg5oMtBCAAAED96gzA2HXFAPx5aK9IHSYAAQAAaldVAB7+id90SpuvHYA/lYUtMunROyEAAQAA6lVlAHpNpwhAAACAKWQyAlCbzw3ArYeKjhCAAAAAtasqALXdyrquIwDTDSICEAAAoH5VBqDXdKojALfJpIcABAAAqF+VAeg1neoMwMOywkEAAgAA1K+yAHzNbzrVEYDbZdJDAAIAANSvygD0mk71H4ByJwQgAABAvc5IAO6QSc9RAhAAAKB2VQWgtpvXdIoABAAAmEImPQBfl4WdR0ZdBCAAAED9qgxAr+mUNh8BCAAAMEWckQDcJZOeYwQgAABA7aoKQG03r+kUAQgAADCFnJEA3H101EUAAgAA1K/KAPSaTnUE4PDRU67jr50iAAEAAGpWVQBqu3lNp4oBOCoBeExWOI7/lAAEAACoW2UBKO3mNZ3S5usvADkDCAAAULszFICjruN8BhAAAKB21QWg33SqIwBHZNJDAAIAANSvygD0mk71H4ByJwQgAABAvc54AO7J6XUCEAAAoH51BaDtukIA/kwW4srUCQIQAACgdlUFoLab13RKm48ABAAAmCLOSADuPT7qIgABAADqV2UAek2nCEAAAIAphAAEAABoGAIQAACgYc5IAO6TSQ8BCAAAUL8qA9BrOkUAAgAATCFnJgBPyAoHAQgAAFC/ygLwdb/pVEcA7nc20rmTBCAAAEDtqgrAkxKAZV3nBqCHAAQAAKhf1QHo6T8A5U4IQAAAgHqdkQA8cOKU6+TrpwhAAACAmlUXgH7Tqc4APOkjAAEAAOpXaQA6Tac6AnC/VKGHAAQAAKhflQHoNZ3qCMC9x0/l9DdFx+unwomfEoAAAAB1qyoAtd3Kuq4QgK//PITdR08Zo+3rx14jAAEAAOpWVQAee22s49Ku0+ZrB+CJ10NYuutUp92nwsgxAhAAAKBuVQWgtltZ12nztQPwyGshPLlxtOCp3NaD/BoYAACAulUVgFsPFZvOdp02XyEAn3h11LWFAAQAAKhdVQGo7eY1nSIAAQAAphACEAAAoGEIQAAAgIYhAAEAABqGAAQAAGgYAhAAAKBhCEAAAICGIQABAAAahgAEAABoGAIQAACgYQhAAACAhiEAAQAAGoYABAAAaBgCEAAAoGEIQAAAgIYhAAEAABqGAAQAAGgYAhAAAKBhCEAAAICGIQABAAAahgAEAABoGAIQAACgYQhAAACAhiEAAQAAGoYABAAAaBgCEAAAoGEIQAAAgIYhAAEAABqGAAQAAGgYAhAAAKBhCEAAAICGIQABAAAahgAEAABoGAIQAACgYQhAAACAhiEAAQAAGoYABAAAaBgCEAAAoGEIQAAAgIYhAAEAABqGAAQAAGgYAhAAAKBhCEAAAICGIQABAAAahgAEAABoGAIQAACgYQhAAACAhiEAAQAAGoYABAAAaBgCEAAAoGEIQAAAgIYhAAEAABqGAAQAAGgYAhAAAKBhCEAAAICGIQABAAAahgAEAABoGAIQAACgYQhAAACAhiEAAQAAGoYABAAAaBgCEAAAoGEIQAAAgIYhAAEAABqGAAQAAGgYAhAAAKBhCEAAAICGIQABAAAahgAEAABoGAIQAACgYQhAAACAhiEAAQAAGoYABAAAaBgCEAAAoGEIQAAAgIYhAAEAABqGAAQAAGgYAhAAAKBhCEAAAICGIQABAAAahgAEAABoGAIQAACgYQhAAACAhiEAAQAAGoYABAAAaBgCEAAAoGEIQAAAgIYhAAEAABqGAAQAAGgYAhAAAKBhCEAAAICGIQABAAAahgAEAABoGAIQAACgYQhAAACAhiEAAQAAGoYABAAAaBgCEAAAoGEIQAAAgIYhAAEAABqGAAQAAGgYAhAAAKBhCEAAAICGIQABAAAahgAEAABoGAIQAACgYQhAAACAhiEAAQAAGoYABAAAaBgCEAAAoGEIQAAAgIYhAAEAABqGAAQAAGgYAhAAAKBhCEAAAICGIQABAAAahgAEAABoGAIQAACgYQhAAACAhiEAAQAAGoYABAAAaBgCEAAAoGEIQAAAgIYhAAEAABqGAAQAAGgYAhAAAKBhCEAAAICGIQABAAAahgAEAABoGAIQAACgYQhAAACAhiEAAQAAGoYABAAAaBgCEAAAoGEIQAAAgIYhAAEAABqGAAQAAGgYAhAAAKBhCEAAAICGIQABAAAahgAEAABoGAIQAACgYQhAAACAhiEAAQAAGoYABAAAaBgCEAAAoGEIQAAAgIYhAAEAABqGAAQAAGgYAhAAAKBhCEAAAICGIQABAAAahgAEAABoGAIQAACgYQhAAACAhiEAAQAAGoYABAAAaBgCEAAAoGEIQAAAgIYhAAEAABqGAAQAAGgYAhAAAKBhCEAAAICGIQABAAAahgAEAABoGAIQAACgYQhAAACAhiEAAQAAGoYABAAAaBgCEAAAoGEIQAAAgIYhAAEAABqGAAQAAGgYAhAAAKBhCEAAAICGIQABAAAahgAEAABoGAIQAACgYQhAAACAhiEAAQAAGoYABAAAaBgCEAAAoGEIQAAAgIYhAAEAABqGAAQAAGgYAhAAAKBhCEAAAICGIQABAAAahgAEAABoGAIQAACgYQhAAACAhiEAAQAAGoYABAAAaBgCEAAAoGEIQAAAgIYhAAEAABqGAAQAAGgYAhAAAKBhCEAAAICGIQABAAAahgAEAABoGAIQAACgYQhAAACAhiEAAQAAGoYABAAAaBgCEAAAoGEIQAAAgIYhAAEAABqGAAQAAGgYAhAAAKBhCEAAAICGIQABAAAahgAEAABoGAIQAACgYQhAAACAhiEAAQAAGoYABAAAaBgCEAAAoGEIQAAAgIYhAAEAABqGAAQAAGgYAhAAAKBhCEAAAICGIQABAAAahgAEAABoGAIQAACgYQhAAACAhvECUMPuxIkTpY4dO1YMQGk2AhAAAGCa8AJQI+8d73hHOOusszJvfetbw2//9m+Hyy67LNxwww3ZegIQAABgmup2BvCCCy4If/qnfxquvvrqMGvWrPD888/XfwZQ7yx9kgAAAKhO2WcAYwReddVV4Z577gmDg4Pt+Ov4DCABCAAAMH3EABwZGQkHDx4s/KCHxp5G3+zZswvx1xGAVf4QCAEIAABQrxiA+/bty878adhZx48fDydPnswu7bzGnwZh9QEod5Y+SQAAAFQnBqCe/Yth1w+NPwIQAABgGooBqG/rloVevPQQgAAAANNMDMCyyNO3fuOlhwAEAACYZmIAenHXDwIQAABgmokBqCE3UZUF4Ib9p8Jt338ou0MAAABMXdps2m5e06m+A3DxzlPZHWlNAgAAYOrSZtN285pOFQLw4MlT4cmN/oYAAACY/p6W1jtw4hQBCAAA0BSFAHznO98ZvvPdWeHl7f7GAAAAmP609bT5tP0G/vzP/3zgbW//92HbIX9jAAAATH/aetp8H/jABwYGrrzyyuxt4JlShKv3lH9oEAAAANOTNp62njbfxRdfPDBw4403DnziE58Y+Ff/5k3ZCq3D+bwdDAAAMO3p277adtp42nrnnHNOdvJv4B/+4R8GrrvuuiwCtQr11OB3/nFW9mPCAAAAmL606bTttPE0/j71qU8NfPGLXxwYuPvuuwfuuOOOLAIvv/zygUsuuSQLQQAAAEx/73vf+wYuvPDCgU9/+tNZ/F1//fUD/z9CZMHgW7qLmQAAAABJRU5ErkJggg==";

    // Total time for the decrunch effect
    this.DecrunchMaxVBL=DecrunchMaxVBL;
    // Current decrunch vbl counter
    this.DecrunchVBLs=0;
    // Before that point, only shell window, after that point, decrunch visible
    this.StartDecrunchAt=StartDecrunchAt;

    // Decrunch types
    this.NoDOSShell=0 ;    // bars are full screen
    this.DOSShellBlink=1 ; // bars are on the DOS Shell white lines
    this.NoDOSShellPalette=2;

    // user choice decrunch type
    this.DType = DType ;
    this.palette = new Array() ;

    // base size of decruch bar
    this.MaxBarHeight = MaxBarHeight ;

    // working canvas
    this.mycanvas_temp = new canvas(640,480)

    // = 1 when all is done
    this.finished = 0 ;

    this.doDecrunch=function(dest) {

        // working canvas sizes
        var W = this.mycanvas_temp.contex.canvas.width ;
        var H = this.mycanvas_temp.contex.canvas.height ;
        // images sizes
        var w1 = this.DOSshell.width;
        var h1 = this.DOSshell.height;

        // Before decrunch we only draw the DOS shell window
        if (this.DecrunchVBLs<this.StartDecrunchAt) {
            this.mycanvas_temp.contex.drawImage(this.DOSshell,0,0,w1,h1) ;
        } else {
            // We will parse y
            var y=0 ;
            // While not parsed all height of working canvas
            while (y<=H) {
                // calculate color bar height
                var barh = (1+Math.random())*this.MaxBarHeight ;
                // draws the bar
                var mycolor ;
                if ( (this.DType==this.NoDOSShellPalette) && (this.palette.length >0) ) {
                    mycolor = this.palette[Math.round(Math.random()*this.palette.length)];
                } else {
                    mycolor = get_random_color() ;
                }
                this.mycanvas_temp.contex.fillStyle = mycolor ;
                this.mycanvas_temp.contex.fillRect(0,y,W,barh) ;
                // next bar
                y += barh;
            }

            // if DOS shell window is the only thing that must blink
            if (this.DType==this.DOSShellBlink) {
                // set destination-in canvas mode
                this.mycanvas_temp.contex.globalCompositeOperation='destination-in';
                // draw the DOS shell window
                this.mycanvas_temp.contex.drawImage(this.DOSshell,0,0,w1,h1) ;
                // back to normal mode
                this.mycanvas_temp.contex.globalCompositeOperation='source-over';
            }
        }
        // put destination canvas into no AA mode
        dest.contex.ImageSmoothingEnabled=false;
        dest.contex.webkitImageSmoothingEnabled=false;
        dest.contex.mozImageSmoothingEnabled=false;
        dest.contex.oImageSmoothingEnabled=false;

        // Black Shell background color
        dest.fill('#000000');

        // calculate the destination scale
        var scx = dest.contex.canvas.width/W  ;
        var scy = dest.contex.canvas.height/H  ;

        // draw that decrunch
        this.mycanvas_temp.draw(dest,0,0,1,0,scx,scy);

        // next frame please
        this.DecrunchVBLs++;

        // are we finished ?
        if (this.DecrunchVBLs >= this.DecrunchMaxVBL) { this.finished = 1 ; }
    }

    return this ;
}
