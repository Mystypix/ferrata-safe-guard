import Link from 'next/link';
import {useState, useEffect, useRef} from 'react';
import climbingSessionsApi from 'api/climbing-sessions';
import css from './session-detail.module.scss';
import {Duration} from 'luxon';
import {getGeolocation, startTracking} from '../../../utils/utils';

const formatDuration = duration => {
	return Duration.fromMillis(duration * 1000).toFormat('hh:mm:ss');
};

function SessionDetailPage(props) {
	const [loading, setLoading] = useState(true);
	const [session, setSession] = useState(null);
	const [geolocation, setGeolocation] = useState(null);
	const [inProgress, setInProgress] = useState(false);
	const [time, setTime] = useState(0);
	useEffect(async () => {
		const session = await climbingSessionsApi.getSession(props.sessionId);
		setSession(session);
		setLoading(false);
		setGeolocation(getGeolocation());
	}, [props.sessionId]);

	useEffect(() => {
		if (!inProgress) return;
		const interval = setInterval(() => {
			setTime(time => time + 1);
		}, 1000);
		startTracking(props.sessionId);
		return () => clearInterval(interval);
	}, [inProgress, setTime]);

	if (loading) {
		return <div>Loading...</div>;
	} else if (session === null) {
		return <div>This session does not exist.</div>;
	}
	return (
		<div>
			<div>
				<strong>{session.name}</strong>
			</div>
			<div>Location: {session.location}</div>
			<div>
				{!inProgress && (
					<div>
						<div>{formatDuration(time)}</div>
						<button onClick={() => setInProgress(true)}>Start Climbing</button>
					</div>
				)}
				{inProgress && (
					<div>
						<div>{formatDuration(time)}</div>
						<button onClick={() => setInProgress(false)}>Stop Climbing</button>
						{/* <button ref={callHelpButton}>Call the help</button> */}
					</div>
				)}
			</div>
		</div>
	);
}

export async function getServerSideProps(context) {
	return {
		props: {
			sessionId: context.params.sessionId,
		},
	};
}

export default SessionDetailPage;
