import Link from 'next/link';
import {useState, useEffect, useRef} from 'react';
import sessionsApi from 'api/sessions';
import css from './sessions.module.scss';

function SessionCard({session, setSessions}) {
	const [showRemoveForm, setShowRemoveForm] = useState(false);
	const [removing, setRemoving] = useState(false);

	const handleRemove = async () => {
		setRemoving(true);
		const sessions = await sessionsApi.removeSession(session.id);
		setSessions(sessions);
		// setRemoving(false);
	};

	if (removing) {
		return <div className={css.card}>Removing...</div>;
	} else if (showRemoveForm) {
		return (
			<div className={css.card}>
				<p>
					Are you sure you want to remove session{' '}
					<strong>{session.name}</strong>?
				</p>
				<button onClick={handleRemove}>Confirm</button>{' '}
				<button onClick={() => setShowRemoveForm(false)}>Cancel</button>
			</div>
		);
	}

	return (
		<div className={css.card}>
			<div>
				<strong>Session {session.name}</strong>
			</div>
			<div>Location: {session.location}</div>
			<Link
				href={{
					pathname: '/sessions/[sessionId]',
					query: {sessionId: session.id},
				}}
			>
				<button>Detail</button>
			</Link>{' '}
			<button onClick={() => setShowRemoveForm(true)}>Remove</button>
		</div>
	);
}

function CreateSession({setSessions}) {
	const [showForm, setShowForm] = useState(false);
	const [loading, setLoading] = useState(false);
	const formRef = useRef();

	const handleCreateSession = async ev => {
		ev.preventDefault();
		const form = formRef.current;
		if (!form) return;
		setLoading(true);
		const sessions = await sessionsApi.createSession({
			id: Math.random().toString(),
			name: form.name.value,
			location: form.location.value,
		});
		setLoading(false);
		setShowForm(false);
		setSessions(sessions);
	};

	if (loading) {
		return <div>Creating new session...</div>;
	} else if (showForm) {
		return (
			<form
				className={css.createSessionForm}
				onSubmit={handleCreateSession}
				ref={formRef}
			>
				<table>
					<tbody>
						<tr>
							<td>Session Name: </td>
							<td>
								<input name="name" />
							</td>
						</tr>
						<tr>
							<td>Location: </td>
							<td>
								<input name="location" />
							</td>
						</tr>
						<tr>
							<td></td>
							<td>
								<button className={css.createSessionSubmit}>
									Create Session
								</button>
								<button
									className={css.createSessionCancel}
									onClick={ev => {
										ev.preventDefault();
										setShowForm(false);
									}}
								>
									Cancel
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</form>
		);
	}

	return (
		<button
			title="Add Session"
			className={css.addSession}
			onClick={() => setShowForm(true)}
		>
			+
		</button>
	);
}

function SessionsPage() {
	const [sessions, setSessions] = useState(null);
	useEffect(async () => {
		const sessions = await sessionsApi.getSessions();
		setSessions(sessions);
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
			<CreateSession setSessions={setSessions} />
			{!cards && 'Loading...'}
			{cards && cards.length === 0 && 'There are no sessions yet.'}
			{cards && <div className={css.cardList}>{cards}</div>}
		</div>
	);
}

export default SessionsPage;
