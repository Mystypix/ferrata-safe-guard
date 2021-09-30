import classnames from 'classnames';
import Link from 'next/link';
import Router from 'next/router';
import {useState, useContext, useEffect, useRef} from 'react';
import usersApi from 'api/users';
import css from './login.module.scss';
import Button from 'components/button';
import Input from 'components/input';
import Password from 'components/password';
import SessionContext from 'components/session-context';

function LoginPage() {
	const [loggingIn, setLoggingIn] = useState(false);
	const [logginError, setLogginError] = useState('');
	const formRef = useRef();
	const accountSession = useContext(SessionContext);

	const handleFormSubmit = async ev => {
		ev.preventDefault();
		const form = formRef.current;
		if (!form) return;
		setLoggingIn(true);
		const user = await usersApi.logIn(
			form.username.value.trim(),
			form.password.value.trim()
		);
		if (user) {
			accountSession.setCurrentUser(user);
			Router.push('/sessions');
		} else {
			setLogginError('Invalid name or password');
			setLoggingIn(false);
		}
	};

	if (loggingIn) {
		return <div className={css.loggingIn}>Logging in ...</div>;
	}

	return (
		<div className={css.logIn}>
			<h2>Log In</h2>
			<form className={css.loginForm} onSubmit={handleFormSubmit} ref={formRef}>
				<div className={css.formGroup}>
					<label htmlFor="username">Username</label>
					<Input id="username" name="username" />
				</div>
				<div className={css.formGroup}>
					<label htmlFor="password">Password</label>
					<Password id="password" name="password" />
				</div>
				{logginError && <div className={css.logginError}>{logginError}</div>}
				<div className={css.actionButton}>
					<Button type="action" size="large">
						Log In
					</Button>
				</div>
			</form>
			<div className={css.newAccount}>
				Do have an account? <Link href="/signup">Create one now.</Link>.
			</div>
		</div>
	);
}

export default LoginPage;
