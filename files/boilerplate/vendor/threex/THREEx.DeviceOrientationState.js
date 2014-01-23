/** @namespace */
var THREEx	= THREEx 		|| {};

THREEx.DeviceOrientationState	= function()
{
	// to store the current state
	this._state	= { x: 0, y: 0, z: 0 };

	this._$callback	= function(event){ this._onDeviceOrientation(event); }.bind(this);
	
	// bind events
	// - spec http://dev.w3.org/geo/api/spec-source-orientation.html
	window.addEventListener('deviceorientation', this._$callback);
}

/**
 * To stop listening of the keyboard events
*/
THREEx.DeviceOrientationState.prototype.destroy	= function()
{
	// unbind events
	window.removeEventListener('deviceorientation', this._$callback);
}

/**
 * to process the keyboard dom event
*/
THREEx.DeviceOrientationState.prototype._onDeviceOrientation	= function(event)
{
	this._state.x	= (!event.alpha ? 0 : event.alpha) * Math.PI / 180;
	this._state.y	= (!event.beta  ? 0 : event.beta ) * Math.PI / 180;
	this._state.z	= (!event.gamma ? 0 : event.gamma) * Math.PI / 180;
}


THREEx.DeviceOrientationState.prototype.angleX	= function()
{
	return this._state.x;
}

THREEx.DeviceOrientationState.prototype.angleY	= function()
{
	return this._state.y;
}

THREEx.DeviceOrientationState.prototype.angleZ	= function()
{
	return this._state.z;
}

