export function startTracking(sessionId) {
	if ('LinearAccelerationSensor' in window && 'Gyroscope' in window) {
		let lastReadingTimestamp
		let accelerometer = new LinearAccelerationSensor()

		accelerometer.addEventListener('reading', () => {
			if (lastReadingTimestamp) {
				intervalHandler(Math.round(accelerometer.timestamp - lastReadingTimestamp))
			}
			lastReadingTimestamp = accelerometer.timestamp
			accelerationHandler(accelerometer, 'acceleration')
		})
		accelerometer.start()

		if ('GravitySensor' in window) {
			let gravity = new GravitySensor();
			gravity.addEventListener('reading', () => accelerationHandler(gravity, 'accelerationWithGravity'))
			gravity.start()
		}

	} else if ('DeviceMotionEvent' in window) {
		const onDeviceMotion = function (eventData) {
			accelerationHandler(eventData.acceleration, 'acceleration')
			accelerationHandler(eventData.accelerationIncludingGravity, 'accelerationWithGravity')
			intervalHandler(eventData.interval)
		}

		window.addEventListener('devicemotion', onDeviceMotion, false);
	} else {
		console.log('No device motion sensor available')
	}

	// Handler
	function accelerationHandler(acceleration, type) {
		const logKey = `${sessionId}_${type}`
		const timestamp = Date.now()
		const x = acceleration.x && acceleration.x.toFixed(3)
		const y = acceleration.y && acceleration.y.toFixed(3)
		const z = acceleration.z && acceleration.z.toFixed(3)

		const record = {
			timestamp,
			x,
			y,
			z,
		}
		const prevLog = localStorage.getItem(logKey)
		console.log('prevLog', prevLog)
		localStorage.setItem(logKey, prevLog + JSON.stringify(record))
	}

	function intervalHandler(interval) {
		const logKey = `${sessionId}_interval_${timestamp}`
		const prevLog = localStorage.getItem(logKey)
		localStorage.setItem(logKey, prevLog + interval + '#')
	}
}

export function getGeolocation() {
	function success(position) {
		return position
	}

	function error(error) {
		console.log('fuck', error)
	}

	if ('geolocation' in navigator) {
		return navigator.geolocation.getCurrentPosition(success, error)
	}
}
