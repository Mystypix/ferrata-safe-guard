import Link from 'next/link';
import {useState, useEffect, useRef} from 'react';
import climbingSessionsApi from 'api/climbing-sessions';
import css from './session-detail.module.scss';
import {Duration} from 'luxon';
import {getGeolocation, startTracking} from '../../../utils/utils';
import {VictoryAxis, VictoryChart, VictoryBar, VictoryTheme} from 'victory';
import emailjs from 'emailjs-com'

const formatTimestamp = ms => {
	return Math.round(ms / 1000);
};

const formatDuration = duration => {
	return Duration.fromMillis(duration * 1000).toFormat('hh:mm:ss');
};

function SessionDetailPage(props) {
	const [loading, setLoading] = useState(true);
	const [session, setSession] = useState(null);
	const [geolocation, setGeolocation] = useState(null);
	const [inProgress, setInProgress] = useState(false);
	const [time, setTime] = useState(0);
	const [data, setData] = useState([]);

	const addData = item => setData([...data, item]);

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
		startTracking(props.sessionId, addData);
		return () => clearInterval(interval);
	}, [inProgress, setTime]);

	if (loading) {
		return <div>Loading...</div>;
	} else if (session === null) {
		return <div>This session does not exist.</div>;
	}

	// const lastTimestamp = data[data.length - 1].timestamp;
	const displayData = data
		.map(item => ({
			timestamp: item.timestamp,
			distance: Math.sqrt(
				Math.pow(item.x, 2) + Math.pow(item.y, 2) + Math.pow(item.z, 2)
			),
		}))
		.slice(-200);
	// .filter(item => lastTimestamp - item.timestamp < 1000);
	const firstTimestamp = displayData.length
		? displayData[0].timestamp
		: Date.now();

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
				<div onClick={() => sendEmail()}>Send email</div>
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

function sendEmail(e) {
	e.preventDefault();

	emailjs.sendForm(`gmail`, process.env.TEMPLATE_ID, e.target, process.env.USER_ID)
		.then((result) => {
			alert("Message Sent, We will get back to you shortly", result.text);
		},
		(error) => {
			alert("An error occurred, Please try again", error.text);
		});
}

export default SessionDetailPage;
