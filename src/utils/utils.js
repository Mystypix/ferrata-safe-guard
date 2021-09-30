export function startTracking(sessionId, addData) {
	const time = Date.now();
	let accelerometer, handleAccelerometerReading, onDeviceMotion, dummyInterval;
	if (
		window.innerWidth < 1000 &&
		'LinearAccelerationSensor' in window &&
		'Gyroscope' in window
	) {
		let lastReadingTimestamp;
		accelerometer = new LinearAccelerationSensor({frequency: 100});

		handleAccelerometerReading = () => {
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
	} else if (window.innerWidth < 1000 && 'DeviceMotionEvent' in window) {
		onDeviceMotion = function (eventData) {
			accelerationHandler(eventData.acceleration, 'acceleration');
			accelerationHandler(
				eventData.accelerationIncludingGravity,
				'accelerationWithGravity'
			);
			intervalHandler(eventData.interval);
		};

		window.addEventListener('devicemotion', onDeviceMotion, false);
	} else {
		dummyInterval = setInterval(() => {
			const record = {
				timestamp: Date.now(),
				x: Math.random(),
				y: Math.random(),
				z: Math.random(),
			};
			addData(record);
		});
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
		if (accelerometer) {
			accelerometer.removeEventListener('reading', handleAccelerometerReading);
			accelerometer.stop();
		} else if (onDeviceMotion) {
			window.removeEventListener('devicemotion', onDeviceMotion, false);
		} else {
			clearInterval(dummyInterval);
		}
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
