export function startTracking(sessionId, addData) {
	const time = Date.now();
	if ('LinearAccelerationSensor' in window && 'Gyroscope' in window) {
		let lastReadingTimestamp;
		let accelerometer = new LinearAccelerationSensor({frequency: 100});

		const handleAccelerometerReading = () => {
			if (lastReadingTimestamp) {
				intervalHandler(
					Math.round(accelerometer.timestamp - lastReadingTimestamp)
				);
			}
			lastReadingTimestamp = accelerometer.timestamp;
			accelerationHandler(accelerometer, 'acceleration');
		};

		accelerometer.addEventListener('reading', handleAccelerometerReading);
		accelerometer.start();

		// if ('GravitySensor' in window) {
		// 	let gravity = new GravitySensor();
		// 	gravity.addEventListener('reading', () => accelerationHandler(gravity, 'accelerationWithGravity'))
		// 	gravity.start()
		// }
	} else if ('DeviceMotionEvent' in window) {
		const onDeviceMotion = function (eventData) {
			accelerationHandler(eventData.acceleration, 'acceleration');
			accelerationHandler(
				eventData.accelerationIncludingGravity,
				'accelerationWithGravity'
			);
			intervalHandler(eventData.interval);
		};

		window.addEventListener('devicemotion', onDeviceMotion, false);
	} else {
		console.log('No device motion sensor available');
	}

	// Handler
	function accelerationHandler(acceleration, type) {
		const logKey = `${sessionId}_${type}_${time}`;
		const timestamp = Date.now();
		const x = acceleration.x && acceleration.x.toFixed(3);
		const y = acceleration.y && acceleration.y.toFixed(3);
		const z = acceleration.z && acceleration.z.toFixed(3);

		const record = {
			timestamp,
			x,
			y,
			z,
		};
		addData(record);
		const prevLog = localStorage.getItem(logKey);
		localStorage.setItem(logKey, '[', prevLog + JSON.stringify(record) + ']');
	}

	function intervalHandler(interval) {
		const logKey = `${sessionId}_interval_${time}`;
		const prevLog = localStorage.getItem(logKey);
		localStorage.setItem(logKey, prevLog + interval + '#');
	}

	return () => {
		accelerometer.removeEventListener('reading', handleAccelerometerReading);
		window.removeEventListener('devicemotion', onDeviceMotion, false);
		accelerometer.stop();
	};
}

export function getGeolocation() {
	function success(position) {
		return position;
	}

	function error(error) {
		console.log('fuck', error);
	}

	if ('geolocation' in navigator) {
		return navigator.geolocation.getCurrentPosition(success, error);
	}
}
