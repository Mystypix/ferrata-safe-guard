import classnames from 'classnames'
import {useEffect, useState} from 'react';
import Image from 'next/image'
import Button, {BUTTON_TYPE} from 'components/button'
import {Duration} from 'luxon';

const formatDuration = duration => {
	return Duration.fromMillis(duration * 1000).toFormat('mm:ss');
};

const TIMER = 20

function FallState(props) {
	const [timer, setTimer] = useState(TIMER)

	useEffect(() => {
		const interval = setInterval(() => {
			if (timer === 0) {
				props.callHelp()
			}
			setTimer(timer => timer - 1);
		}, 1000);
		return () => {
			clearInterval(interval);
		};
	}, [setTimer]);

	function handleClick() {
		props.cancelFallState()
	}

	return (
		<div>
			<Image src='/icons/accident.svg' width='312' height='244' />
			<div>Fall detected</div>
			<div>Sending for help in {formatDuration(timer)}</div>
			<Button className={classnames(BUTTON_TYPE.action)} onClick={() => handleClick}>Everything is fine</Button>
		</div>
	)
}

export default FallState
