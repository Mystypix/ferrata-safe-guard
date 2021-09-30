import Link from 'next/link';
import Image from 'next/image';
import Router from 'next/router';
import {useState, useEffect, useRef} from 'react';
import climbingSessionsApi from 'api/climbing-sessions';
import Button from 'components/button';
import css from './sessions.module.scss';

function SessionCard({session, setSessions}) {
	const [showRemoveForm, setShowRemoveForm] = useState(false);
	const [removing, setRemoving] = useState(false);

	const handleRemove = async () => {
		setRemoving(true);
		const sessions = await climbingSessionsApi.removeSession(session.id);
		setSessions(sessions);
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
						<strong>{session.name}</strong>?
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
			<div className={css.cardName}>{session.name}</div>
			{session.name && (
				<div className={css.cardLocation}>{session.location}</div>
			)}
			<div className={css.cardStartClimbing}>
				<Link
					href={{
						pathname: '/sessions/[sessionId]',
						query: {sessionId: session.id},
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

function CreateSession() {
	return (
		<Link href="/sessions/new" passHref>
			<a title="Add Session" className={css.addSession}>
				+
			</a>
		</Link>
	);
}

function SessionsPage() {
	const [sessions, setSessions] = useState(null);
	useEffect(async () => {
		try {
			const sessions = await climbingSessionsApi.getSessions();
			setSessions(sessions);
		} catch (err) {
			Router.push('/home');
		}
	}, []);
	const cards = sessions
		? sessions.map(session => (
				<SessionCard
					key={'session-' + session.id}
					session={session}
					setSessions={setSessions}
				/>
		  ))
		: null;
	return (
		<div>
			<CreateSession />
			{!cards && 'Loading...'}
			{cards && cards.length === 0 && 'There are no sessions yet.'}
			{cards && <div className={css.cardList}>{cards}</div>}
		</div>
	);
}

export default SessionsPage;
