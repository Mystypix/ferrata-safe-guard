import Link from 'next/link';
import {useState, useEffect, useRef} from 'react';
import climbingSessionsApi from 'api/climbing-sessions';
import sesssionService from 'services/session';
import css from './session-detail.module.scss';
import {Duration} from 'luxon';
import {getGeolocation, startTracking} from '../../../utils/utils';
import {VictoryAxis, VictoryChart, VictoryBar, VictoryTheme} from 'victory';
import emailjs from 'emailjs-com';
import FallState from './fall-state'
import ActiveState from './active-state'

const formatTimestamp = ms => {
	return Math.round(ms / 1000);
};

const formatDuration = duration => {
	return Duration.fromMillis(duration * 1000).toFormat('hh:mm:ss');
};

function SessionDetailPage(props) {
	const [loading, setLoading] = useState(true);
	const [session, setSession] = useState(null);
	const [user, setUser] = useState(null);
	const [geolocation, setGeolocation] = useState(null);
	const [inProgress, setInProgress] = useState(false);
	const [time, setTime] = useState(0);
	const [data, setData] = useState([]);
	const [showActiveState, setShowActiveState] = useState(false);
	const [showFallState, setShowFallState] = useState(false);

	const addData = item => {
		setData(data => [...data, item].slice(-100));
	};

	useEffect(async () => {
		const session = await climbingSessionsApi.getSession(props.sessionId);
		const user = await sesssionService.getUser();
		setSession(session);
		setUser(user);
		setLoading(false);
		setGeolocation(getGeolocation());
	}, [props.sessionId]);

	useEffect(() => {
		if (!inProgress) return;
		const interval = setInterval(() => {
			setTime(time => time + 1);
		}, 1000);
		const stopTracking = startTracking(props.sessionId, addData);
		return () => {
			stopTracking();
			clearInterval(interval);
		};
	}, [inProgress, setTime]);

	if (loading) {
		return <div>Loading...</div>;
	} else if (session === null) {
		return <div>This session does not exist.</div>;
	}

	// const lastTimestamp = data[data.length - 1].timestamp;
	const displayData = data.map(item => ({
		timestamp: item.timestamp,
		distance: Math.sqrt(
			Math.pow(item.x, 2) + Math.pow(item.y, 2) + Math.pow(item.z, 2)
		),
	}));
	// .filter(item => lastTimestamp - item.timestamp < 1000);
	const firstTimestamp = displayData.length
		? displayData[0].timestamp
		: Date.now();

	function sendEmail() {
		const emailData = {
			username: user.username,
			projectname: session.name,
			location: session.location,
			geolocation: geolocation, // TODO add correct data
		}

		// TODO turn on after fix of env

		// emailjs.send(process.env.SERVICE_ID, process.env.TEMPLATE_ID, emailData, process.env.USER_ID)
		// 	.then((result) => {
		// 		alert("Message Sent, We will get back to you shortly", result.text);
		// 	},
		// 	(error) => {
		// 		alert("An error occurred, Please try again", error.text);
		// 	});
	}

	function finishSession() {
		// TODO
	}

	function cancelFallState() {
		setShowFallState(false)
	}

	function openActiveState() {
		setShowFallState(false)
		setShowActiveState(true)
	}

	if (showActiveState) return <ActiveState sendForHelp={sendEmail} finishSession={finishSession} />

	if (!showFallState) return <FallState cancelFallState={cancelFallState} openActiveState={openActiveState} />

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
			<div className={css.chart}>
				{displayData.length}
				<VictoryChart
					width={600}
					height={400}
					domainPadding={20}
					theme={VictoryTheme.material}
				>
					<VictoryAxis
						// tickValues specifies both the number of ticks and where
						// they are placed on the axis
						// tickValues={[1, 2, 3, 4]}
						// tickFormat={['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4']}
						tickFormat={x => `${formatTimestamp(x - firstTimestamp)}s`}
					/>
					<VictoryAxis
						dependentAxis
						// tickFormat specifies how ticks should be displayed
						// tickFormat={x => `$${x - firstTimestamp}`}
					/>
					<VictoryBar
						data={displayData}
						// data accessor for x values
						x="timestamp"
						// data accessor for y values
						y="distance"
					/>
				</VictoryChart>
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
