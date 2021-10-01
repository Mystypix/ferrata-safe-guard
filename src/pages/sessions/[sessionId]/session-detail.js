import Link from 'next/link';
import {useState, useContext, useEffect} from 'react';
import climbingSessionsApi from 'api/climbing-sessions';
import css from './session-detail.module.scss';
import {Duration} from 'luxon';
import {getGeolocation, startTracking} from '../../../utils/utils';
import {VictoryAxis, VictoryChart, VictoryArea, VictoryTheme} from 'victory';
import emailjs from 'emailjs-com';
import SessionContext from 'components/session-context';
import FallState from './fall-state';
import ActiveState from './active-state';
import Router from 'next/router';
import Button, {BUTTON_TYPE} from 'components/button'
import classnames from 'classnames';

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
	const [time, setTime] = useState(0);
	const [data, setData] = useState([]);
	const [showActiveState, setShowActiveState] = useState(false);
	const [showFallState, setShowFallState] = useState(false);

	const accountSession = useContext(SessionContext);

	const addData = item => {
		const value = Math.sqrt(
			Math.pow(item.x, 2) + Math.pow(item.y, 2) + Math.pow(item.z, 2)
		)

		if (value >= 50) {
			setTimeout(() => {
				setShowFallState(true)
			}, 20000)
		}
		setData(data => [...data, item].slice(-10000));
	};

	useEffect(async () => {
		let climbingSession;
		try {
			climbingSession = await climbingSessionsApi.getSession(
				accountSession.currentUser,
				props.sessionId
			);
		} catch (err) {
			console.log(err);
			Router.push('/');
		}
		setSession(climbingSession);
		setLoading(false);
		setGeolocation(getGeolocation());
	}, [props.sessionId]);

	useEffect(() => {
		const interval = setInterval(() => {
			setTime(time => time + 1);
		}, 1000);
		const stopTracking = startTracking(props.sessionId, addData);
		return () => {
			stopTracking();
			clearInterval(interval);
		};
	}, [setTime]);

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
			username: accountSession.currentUser.username,
			projectname: session.name,
			location: session.location,
			geolocation: geolocation, // TODO add correct data
		};

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
		Router.push('/sessions');
	}

	function cancelFallState() {
		setShowFallState(false);
	}

	function openActiveState() {
		setShowFallState(false);
		setShowActiveState(true);
	}

	if (showActiveState)
		return (
			<ActiveState sendForHelp={sendEmail} finishSession={finishSession} />
		);

	if (showFallState)
		return (
			<FallState
				cancelFallState={cancelFallState}
				openActiveState={openActiveState}
			/>
		);

	return (
		<div>
			<h1>Active for {formatDuration(time)}</h1>
			<div className={css.chart}>
				<VictoryChart
					width={312}
					height={244}
					domainPadding={12}
					theme={VictoryTheme.material}
				>
					<VictoryAxis
						// tickValues specifies both the number of ticks and where
						// they are placed on the axis
						// tickValues={[1, 2, 3, 4]}
						// tickFormat={['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4']}
						tickFormat={x => `${formatTimestamp(x - firstTimestamp)}s`}
					/>
					{/* <VictoryAxis
						dependentAxis
						// tickFormat specifies how ticks should be displayed
						// tickFormat={x => `$${x - firstTimestamp}`}
					/> */}
					<VictoryArea
						data={displayData}
						style={{ data: { fill: "#FFE1C0", stroke: '#FF8A00'} }}
						// data accessor for x values
						x="timestamp"
						// data accessor for y values
						y="distance"
					/>
				</VictoryChart>
			</div>
			<div className={css.buttonWrapper}>
				{/* <button ref={callHelpButton}>Call the help</button> */}
				<Button type='action' size='large' onClick={() => finishSession()}>Finish</Button>
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
