import classnames from 'classnames';
import Link from 'next/link';
import Router from 'next/router';
import {useState, useEffect, useRef} from 'react';
import usersApi from 'api/users';
import css from './signup.module.scss';
import Button from 'components/button';
import Input from 'components/input';
import Password from 'components/password';
import Steps from 'components/steps';
import sessionService from 'services/session';

function SignupPage() {
	const [creatingAccount, setCreatingAccount] = useState(false);
	const [step, setStep] = useState(1);
	const formRef = useRef();

	const handleFormSubmit = async ev => {
		ev.preventDefault();
		const form = formRef.current;
		if (!form) return;
		if (step < 1) {
			setStep(value => value + 1);
			return;
		}
		setCreatingAccount(true);
		const user = await usersApi.createUser({
			username: form.username.value.trim(),
			password: form.password.value.trim(),
		});
		sessionService.setUser(user);
		Router.push('/sessions');
	};

	if (creatingAccount) {
		return <div className={css.creatingAccount}>Creating account...</div>;
	}

	return (
		<div className={css.signUp}>
			<h2>Create account</h2>
			<form
				className={css.signupForm}
				onSubmit={handleFormSubmit}
				ref={formRef}
			>
				<div className={classnames(css.formStep, {[css.active]: step === 1})}>
					<div className={css.formGroup}>
						<label htmlFor="username">Username</label>
						<Input id="username" name="username" />
					</div>
					<div className={css.formGroup}>
						<label htmlFor="password">Password</label>
						<Password id="password" name="password" />
					</div>
				</div>
				<div className={classnames(css.formStep, {[css.active]: step === 2})}>
					step 2
				</div>
				<div className={classnames(css.formStep, {[css.active]: step === 3})}>
					step 3
				</div>
				<div className={classnames(css.formStep, {[css.active]: step === 4})}>
					step 4
				</div>

				<div className={css.actionButton}>
					{step < 1 ? (
						<Button type="action" size="large">
							Next
						</Button>
					) : (
						<Button type="action" size="large">
							Create Account
						</Button>
					)}
				</div>
			</form>

			{false && (
				<div className={classnames(css.steps)}>
					<Steps current={step} count={1} onChange={value => setStep(value)} />
				</div>
			)}
		</div>
	);
}

export default SignupPage;
