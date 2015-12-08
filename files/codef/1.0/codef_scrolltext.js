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

function ltrobj(posx,posy,ltr){
	this.posx=posx;
	this.posy=posy;
	this.ltr=ltr;
	return this;
}

function sortPosx(a, b) {
        var x = a.posx;
        var y = b.posx;
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}

function sortPosy(a, b) {
        var x = a.posy;
        var y = b.posy;
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}

function scrolltext_horizontal(){
	this.scroffset=0;
	this.oldspeed=0;
	this.speed=1;
	this.font;
	this.letters = new Object();
	this.scrtxt=" ";
	this.pausetimer=0;
	this.pausedelay=0;
 
	this.init = function(dst, font,speed,sinparam,type){
		this.speed=speed;
		this.dst=dst;
		this.font=font;
		this.fontw = this.font.tilew;
		this.fonth = this.font.tileh;
		this.fontstart = this.font.tilestart;
		this.wide=Math.ceil(this.dst.canvas.width/this.fontw)+1;
		for(i=0;i<=this.wide;i++){
			this.letters[i]=new ltrobj(Math.ceil((this.wide*this.fontw)+i*this.fontw),0,this.scrtxt.charCodeAt(this.scroffset));
			this.scroffset++;
		}
		if(typeof(sinparam)!='undefined')
                        this.sinparam=sinparam;
		if(typeof(type)=='undefined')
                        this.type=0;
		else
			this.type=type;
	}
 
	this.draw = function(posy){
		var prov = 0;
		var temp = new Array();
		var tmp=this.dst.contex.globalAlpha;
		this.dst.contex.globalAlpha=1;
		var oldvalue=new Array();
		var i;
		if(typeof(this.sinparam)!='undefined'){
			for(var j=0;j<this.sinparam.length;j++){
				oldvalue[j]=this.sinparam[j].myvalue;
			}
		}
		if(this.speed==0){
			this.pausetimer+=1;
			if(this.pausetimer==60*this.pausedelay){
				this.speed=this.oldspeed;
			}
		}
		var speed=this.speed;
		for(i=0;i<=this.wide;i++){
			this.letters[i].posx-=speed;
			if(this.letters[i].posx<=-this.fontw){
				if(this.scrtxt.charAt(this.scroffset) =="^"){
					if(this.scrtxt.charAt(this.scroffset+1) =="P"){
						this.pausedelay=this.scrtxt.charAt(this.scroffset+2);
						this.pausetimer=0;
						this.oldspeed=this.speed;
						this.speed=0;
						this.scroffset+=3;
					}
					else if(this.scrtxt.charAt(this.scroffset+1) =="S"){
						this.speed=this.scrtxt.charAt(this.scroffset+2);
						this.scroffset+=3;
					}
					//
					// ADDON by Robert Annett
					//
					else if(this.scrtxt.charAt(this.scroffset+1) =="C"){
						var end = this.scrtxt.indexOf(';', this.scroffset+2);
						var functionName = this.scrtxt.substring(this.scroffset+2, end);			
						window[functionName]();
						this.scroffset+=(end-this.scroffset)+1;
					}
				}else{
					this.letters[i].posx=this.wide*this.fontw+(this.letters[i].posx+this.fontw);
					if(typeof(this.sinparam)!='undefined'){
						for(var j=0;j<this.sinparam.length;j++){
							oldvalue[j]+=this.sinparam[j].inc;
						}
					}
					this.letters[i].ltr=this.scrtxt.charCodeAt(this.scroffset);
					this.scroffset++;
					if(this.scroffset> this.scrtxt.length-1)
						this.scroffset=0;
				}
			}
		}
		if(typeof(this.sinparam)!='undefined'){
			for(var j=0;j<this.sinparam.length;j++){
					this.sinparam[j].myvalue=oldvalue[j];
			}
		}
		
		for(j=0;j<=this.wide;j++){
			temp[j]={indice:j, posx:this.letters[j].posx};
		}
		temp.sort(sortPosx);
		for(i=0;i<=this.wide;i++){
			if(typeof(this.sinparam)!='undefined'){
				prov = 0;
				for(var j=0;j<this.sinparam.length;j++){
					if(this.type==0)
						prov += Math.sin(this.sinparam[j].myvalue)*this.sinparam[j].amp;
					if(this.type==1)
						prov += -Math.abs(Math.sin(this.sinparam[j].myvalue)*this.sinparam[j].amp);
					if(this.type==2)
						prov += Math.abs(Math.sin(this.sinparam[j].myvalue)*this.sinparam[j].amp);

				}
			}
			this.font.drawTile(this.dst,this.letters[temp[i].indice].ltr-this.fontstart,this.letters[temp[i].indice].posx,prov+posy);
			
			if(typeof(this.sinparam)!='undefined'){
				for(var j=0;j<this.sinparam.length;j++){
					this.sinparam[j].myvalue+=this.sinparam[j].inc;
				}
			}
		}
		if(typeof(this.sinparam)!='undefined'){
			for(var j=0;j<this.sinparam.length;j++){
					this.sinparam[j].myvalue=oldvalue[j]+this.sinparam[j].offset;
			}
		}
		this.dst.contex.globalAlpha=tmp;
	}
	return this;
}


function scrolltext_vertical(){
	this.scroffset=0;
	this.oldspeed=0;
	this.speed=1;
	this.font;
	this.letters = new Object();
	this.scrtxt=" ";
	this.pausetimer=0;
	this.pausedelay=0;
 
	this.init = function(dst, font,speed,sinparam,type){
		this.speed=speed;
		this.dst=dst;
		this.font=font;
		this.fontw = this.font.tilew;
		this.fonth = this.font.tileh;
		this.fontstart = this.font.tilestart;
		this.wide=Math.ceil(this.dst.canvas.height/this.fonth)+1;
		for(i=0;i<=this.wide;i++){
			this.letters[i]=new ltrobj(0,Math.ceil((this.wide*this.fonth)+i*this.fonth),this.scrtxt.charCodeAt(this.scroffset));
			this.scroffset++;
		}
		if(typeof(sinparam)!='undefined')
                        this.sinparam=sinparam;
		if(typeof(type)=='undefined')
                        this.type=0;
		else
			this.type=type;
	}
 
	this.draw = function(posx){
		var prov = 0;
		var temp = new Array();
		var tmp=this.dst.contex.globalAlpha;
		this.dst.contex.globalAlpha=1;
		var oldvalue=new Array();
		var i;
		if(typeof(this.sinparam)!='undefined'){
			for(var j=0;j<this.sinparam.length;j++){
				oldvalue[j]=this.sinparam[j].myvalue;
			}
		}
		if(this.speed==0){
			this.pausetimer+=1;
			if(this.pausetimer==60*this.pausedelay){
				this.speed=this.oldspeed;
			}
		}
		var speed=this.speed;
		for(i=0;i<=this.wide;i++){
			this.letters[i].posy-=speed;
			if(this.letters[i].posy<=-this.fonth){
				if(this.scrtxt.charAt(this.scroffset) =="^"){
					if(this.scrtxt.charAt(this.scroffset+1) =="P"){
						this.pausedelay=this.scrtxt.charAt(this.scroffset+2);
						this.pausetimer=0;
						this.oldspeed=this.speed;
						this.speed=0;
						this.scroffset+=3;
					}
					else if(this.scrtxt.charAt(this.scroffset+1) =="S"){
						this.speed=this.scrtxt.charAt(this.scroffset+2);
						this.scroffset+=3;
					}
					//
					// ADDON by Robert Annett
					//
					else if(this.scrtxt.charAt(this.scroffset+1) =="C"){
						var end = this.scrtxt.indexOf(';', this.scroffset+2);
						var functionName = this.scrtxt.substring(this.scroffset+2, end);			
						window[functionName]();
						this.scroffset+=(end-this.scroffset)+1;
					}
				}else{
					this.letters[i].posy=this.wide*this.fonth+(this.letters[i].posy+this.fonth);
					if(typeof(this.sinparam)!='undefined'){
						for(var j=0;j<this.sinparam.length;j++){
							oldvalue[j]+=this.sinparam[j].inc;
						}
					}
					this.letters[i].ltr=this.scrtxt.charCodeAt(this.scroffset);
					this.scroffset++;
					if(this.scroffset> this.scrtxt.length-1)
						this.scroffset=0;
				}
			}
		}
		if(typeof(this.sinparam)!='undefined'){
			for(var j=0;j<this.sinparam.length;j++){
					this.sinparam[j].myvalue=oldvalue[j];
			}
		}
		
		for(j=0;j<=this.wide;j++){
			temp[j]={indice:j, posy:this.letters[j].posy};
		}
		temp.sort(sortPosy);
		for(i=0;i<=this.wide;i++){
			if(typeof(this.sinparam)!='undefined'){
				prov = 0;
				for(var j=0;j<this.sinparam.length;j++){
					if(this.type==0)
						prov += Math.sin(this.sinparam[j].myvalue)*this.sinparam[j].amp;
					if(this.type==1)
						prov += -Math.abs(Math.sin(this.sinparam[j].myvalue)*this.sinparam[j].amp);
					if(this.type==2)
						prov += Math.abs(Math.sin(this.sinparam[j].myvalue)*this.sinparam[j].amp);
				}
			}
			this.font.drawTile(this.dst,this.letters[temp[i].indice].ltr-this.fontstart,prov+posx,this.letters[temp[i].indice].posy);
			
			if(typeof(this.sinparam)!='undefined'){
				for(var j=0;j<this.sinparam.length;j++){
					this.sinparam[j].myvalue+=this.sinparam[j].inc;
				}
			}
		}
		if(typeof(this.sinparam)!='undefined'){
			for(var j=0;j<this.sinparam.length;j++){
					this.sinparam[j].myvalue=oldvalue[j]+this.sinparam[j].offset;
			}
		}
		this.dst.contex.globalAlpha=tmp;
	}
	return this;
}

