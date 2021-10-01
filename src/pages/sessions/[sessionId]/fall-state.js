import classnames from 'classnames';
import {useEffect, useState} from 'react';
import Image from 'next/image';
import Button, {BUTTON_TYPE} from 'components/button';
import {Duration} from 'luxon';

const formatDuration = duration => {
	return Duration.fromMillis(duration * 1000).toFormat('mm:ss');
};

const COUNTDOWN_TIME = 20;

function FallState(props) {
	const [time, setTime] = useState(COUNTDOWN_TIME);

	useEffect(() => {
		const interval = setInterval(() => {
			setTime(time => time - 1);
			if (time === 0) {
				props.openActiveState();
			}
		}, 1000);
		return () => {
			clearInterval(interval);
		};
	}, [time, setTime]);

	function handleClick() {
		props.cancelFallState();
	}

	return (
		<div className='pageWrapper'>
			<h1 className='fallTimeWrapper'>
				<Image className='warningIcon' src='/icons/warning.svg' width='28' height='28' />
				<div className='fallTime'>{formatDuration(time)}</div>
			</h1>
			<Image className='illustration' src='/icons/accident.svg' width='312' height='244' />
			<h1 className='fallHeader'>Fall detected</h1>
			<Button size='large' onClick={() => handleClick}>Everything is fine</Button>
		</div>
	);
}

export default FallState;
