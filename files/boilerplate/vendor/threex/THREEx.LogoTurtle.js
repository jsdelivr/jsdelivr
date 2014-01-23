/** @namespace */
var THREEx	= THREEx	|| {};

// TODO should those relative polar coord function be INSIDE path already ?

THREEx.LogoTurtle	= function()
{
	this._penX	= 0;
	this._penY	= 0;
	this._angle	= 0;
	this._vectors	= [];
}

THREEx.LogoTurtle.create	= function()
{
	return new THREEx.LogoTurtle()
}

THREEx.LogoTurtle.prototype.turn	= function(rotation)
{
	this._angle	+= rotation;
	return this;	
}

THREEx.LogoTurtle.prototype.moveTo	= function(x, y)
{
	this._penX	= x * Math.cos(this._angle) - y * Math.sin(this._angle);
	this._penY	= x * Math.sin(this._angle) + y * Math.cos(this._angle);
	this._vectors.push( new THREE.Vector2(this._penX, this._penY) );
	return this;
}

THREEx.LogoTurtle.prototype.forward	= function(distance)
{
	this._penX	+= Math.cos(this._angle) * distance;
	this._penY	+= Math.sin(this._angle) * distance;

	this._vectors.push( new THREE.Vector2(this._penX, this._penY) );	
	
	return this;
}

THREEx.LogoTurtle.prototype.points	= function()
{
	return this._vectors;
}
