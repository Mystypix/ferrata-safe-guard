import classnames from 'classnames'
import {useEffect, useState} from 'react';
// import Image from 'next/image'
import Button, {BUTTON_TYPE} from 'components/button'
import {Duration} from 'luxon';

const formatDuration = duration => {
	return Duration.fromMillis(duration * 1000).toFormat('hh:mm:ss');
};

function ActiveState(props) {
	const [time, setTime] = useState(0)

	useEffect(() => {
		props.sendForHelp()
		const interval = setInterval(() => {
			setTime(time => time + 1);
		}, 1000);
		return () => {
			clearInterval(interval);
		};
	}, [setTime]);

	function handleFinish() {
		props.finishSession()
	}

	return (
		<div>
			<div>{formatDuration(time)}</div>
			{/* <Image src='/icons/accident.svg' width='312' height='244' /> */}
			<div>Rescue servis contacted</div>
			<div>Hang on tight</div>
			<div>
				<a href='tel:112'>Emergency call</a>
				<Button className={classnames(BUTTON_TYPE.action)} onClick={() => handleFinish}>Finish</Button>
			</div>
		</div>
	)
}

export default ActiveState
