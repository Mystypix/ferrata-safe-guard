import Link from 'next/link';
import Image from 'next/image';
import Router from 'next/router';
import {useState, useContext, useEffect, useRef} from 'react';
import climbingSessionsApi from 'api/climbing-sessions';
import Button from 'components/button';
import Input from 'components/input';
import Textarea from 'components/textarea';
import Layout from 'components/layout';
import SessionContext from 'components/session-context';
import css from './new-session.module.scss';

function NewSessionPage() {
	const [loading, setLoading] = useState(false);
	const formRef = useRef();
	const accountSession = useContext(SessionContext);

	const handleCreateSession = async (ev, type = 'save-and-start') => {
		ev.preventDefault();
		const form = formRef.current;
		if (!form) return;
		setLoading(true);
		const climbingSession = await climbingSessionsApi.createSession(
			accountSession.currentUser,
			{
				id: Math.random().toString(),
				name: form.name.value,
				location: form.location.value,
				mountain: form.mountain.value,
				description: form.description.value,
			}
		);

		Router.push(
			type === 'save-only' ? 'sessions' : '/sessions/' + climbingSession.id
		);
	};

	if (loading) {
		return <div>Creating new climbing session...</div>;
	}
	return (
		<form
			className={css.createSessionForm}
			onSubmit={handleCreateSession}
			ref={formRef}
		>
			<div className={css.formGroup}>
				<label htmlFor="username">Name of Session</label>
				<Input id="username" name="name" />
			</div>
			<div className={css.formGroup}>
				<label htmlFor="mountain">Mountain</label>
				<Input id="mountain" name="mountain" />
			</div>
			<div className={css.formGroup}>
				<label htmlFor="location">Location</label>
				<Input id="location" name="location" />
			</div>
			<div className={css.formGroup}>
				<label htmlFor="description">Description</label>
				<Textarea id="description" name="description" />
			</div>
			<div className={css.actions}>
				<Button
					type="default"
					size="large"
					onClick={ev => {
						handleCreateSession(ev, 'save-only');
					}}
				>
					Save
				</Button>
				<Button type="action" size="large">
					Save and Start
				</Button>
			</div>
		</form>
	);
}

NewSessionPage.getLayout = function getLayout(page) {
	return (
		<Layout goBack="/sessions" goBackTitle="Create Session">
			{page}
		</Layout>
	);
};

export default NewSessionPage;
