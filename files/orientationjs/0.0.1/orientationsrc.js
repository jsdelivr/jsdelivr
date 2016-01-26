		var Supported = true;
		var OrientationFunction = null;
		function InitializeOrientation(OrientationEventHandler) {
			if (OrientationEventHandler != null) {
				OrientationFunction = OrientationEventHandler;
			}
			if (window.DeviceOrientationEvent) {
				window.addEventListener('deviceorientation', function(eventData) {
					// Tilt Left/Right in degrees, where right is positive
					var tiltLR = eventData.gamma;
					// Tilt Foreward/Backward in degrees, where front is positive
					var tiltFB = eventData.beta;
					// Compass direction the device is facing in degrees
					var dir = eventData.alpha
					// The vertical acceleration of the device, not supported by DeviceOrientation
					var motUD = null;
					Orientation(tiltLR, tiltFB, dir, motUD);
				}, false);
			} else if (window.OrientationEvent) {
				window.addEventListener('MozOrientation', function(eventData) {
					// Tilt Left/Right in degrees, where right is positive
					var tiltLR = eventData.x * 90;
					// Tilt Foreward/Backward in degrees, where front is positive
					var tiltFB = eventData.y * -90;
					// Compass direction the device is facing in degrees, not supported by MozOrientation
					var dir = null;
					// z is the vertical acceleration of the device
					var motUD = eventData.z;
					Orientation(tiltLR, tiltFB, dir, motUD);
				}, false);
			} else {
				Supported = false;
			}
		}
		function Orientation(tiltLR, tiltFB, dir, motUD) {
			this.tiltLR = tiltLR;
			this.tiltFB = tiltFB;
			this.dir = dir;
			this.motionUD = motUD;
			this.supported = Supported;
			OrientationFunction();
		}