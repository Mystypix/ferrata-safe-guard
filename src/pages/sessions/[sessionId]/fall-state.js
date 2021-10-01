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
		<div>
			<Image src="/icons/accident.svg" width="312" height="244" />
			<div>Fall detected</div>
			<div>Sending for help in {formatDuration(time)}</div>
			<Button
				className={classnames(BUTTON_TYPE.action)}
				onClick={() => handleClick}
			>
				Everything is fine
			</Button>
		</div>
	);
}

export default FallState;
