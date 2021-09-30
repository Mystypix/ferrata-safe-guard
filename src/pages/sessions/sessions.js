import Link from 'next/link';
import Image from 'next/image';
import Router from 'next/router';
import {useState, useContext, useEffect, useRef} from 'react';
import climbingSessionsApi from 'api/climbing-sessions';
import Button from 'components/button';
import css from './sessions.module.scss';
import SessionContext from 'components/session-context';

function ClimbingSessionCard({climbingSession, setClimbingSessions}) {
	const [showRemoveForm, setShowRemoveForm] = useState(false);
	const [removing, setRemoving] = useState(false);
	const accountSession = useContext(SessionContext);

	const handleRemove = async () => {
		setRemoving(true);
		const climbingSessions = await climbingSessionsApi.removeSession(
			accountSession.currentUser,
			climbingSession.id
		);
		setClimbingSessions(climbingSessions);
		// setRemoving(false);
	};

	if (removing) {
		return <div className={css.card}>Removing...</div>;
	} else if (showRemoveForm) {
		return (
			<div className={css.removeForm}>
				<div className={css.removeFormInner}>
					<div className={css.removeFormTitle}>Remove Session</div>
					<div className={css.removeFormDescription}>
						Are you sure you want to permantently remove{' '}
						<strong>{climbingSession.name}</strong>?
					</div>
					<div className={css.removeFormActions}>
						<Button
							type="default"
							size="small"
							onClick={() => setShowRemoveForm(false)}
						>
							Cancel
						</Button>
						<Button type="action" size="small" onClick={handleRemove}>
							Remove
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={css.card}>
			<div className={css.cardActions}>
				<div className={css.cardAction}>
					<Image src="/icons/pencil.svg" width="18" height="18" />
				</div>
				<div className={css.cardAction} onClick={() => setShowRemoveForm(true)}>
					<Image src="/icons/trash.svg" width="20" height="21" />
				</div>
			</div>
			<div className={css.cardName}>{climbingSession.name}</div>
			{climbingSession.location && (
				<div className={css.cardLocation}>{climbingSession.location}</div>
			)}
			<div className={css.cardStartClimbing}>
				<Link
					href={{
						pathname: '/sessions/[sessionId]',
						query: {sessionId: climbingSession.id},
					}}
				>
					<Button size="medium" type="action">
						Start Climbing
					</Button>
				</Link>
			</div>
		</div>
	);
}

function CreateClimbingSession() {
	return (
		<Link href="/sessions/new" passHref>
			<a title="Add Session" className={css.addSession}>
				+
			</a>
		</Link>
	);
}

function SessionsPage() {
	const [climbingSessions, setClimbingSessions] = useState(null);
	const accountSession = useContext(SessionContext);

	useEffect(async () => {
		try {
			const climbingSessions = await climbingSessionsApi.getSessions(
				accountSession.currentUser
			);
			setClimbingSessions(climbingSessions);
		} catch (err) {
			Router.push('/home');
		}
	}, []);
	const cards = climbingSessions
		? climbingSessions.map(climbingSession => (
				<ClimbingSessionCard
					key={'climbing-session-' + climbingSession.id}
					climbingSession={climbingSession}
					setClimbingSessions={setClimbingSessions}
				/>
		  ))
		: null;
	return (
		<div>
			<CreateClimbingSession />
			{!cards && 'Loading...'}
			{cards && cards.length === 0 && 'There are no climbing sessions yet.'}
			{cards && <div className={css.cardList}>{cards}</div>}
		</div>
	);
}

export default SessionsPage;
