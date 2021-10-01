import classnames from 'classnames';
import Link from 'next/link';
import Router from 'next/router';
import {useState, useEffect, useContext, useRef} from 'react';
import Image from 'next/image';
import usersApi from 'api/users';
import css from './signup.module.scss';
import Button from 'components/button';
import Input from 'components/input';
import Password from 'components/password';
import Steps from 'components/steps';
import SessionContext from 'components/session-context';

function SignupPage() {
	const [creatingAccount, setCreatingAccount] = useState(false);
	const [step, setStep] = useState(1);
	const formRef = useRef();
	const accountSession = useContext(SessionContext);

	const handleFormSubmit = async ev => {
		ev.preventDefault();
		const form = formRef.current;
		if (!form) return;
		if (step < 5) {
			setStep(value => value + 1);
			return;
		}
		setCreatingAccount(true);
		const user = await usersApi.createUser({
			username: form.username.value.trim(),
			password: form.password.value.trim(),
			fullname: form.fullname.value.trim(),
			email: form.email.value.trim(),
		});
		accountSession.setCurrentUser(user);
		Router.push('/sessions');
	};

	function skipIntro() {
		setStep(5);
	}

	if (creatingAccount) {
		return <div className={css.creatingAccount}>Creating account...</div>;
	}

	const isAcc = step === 1 || step === 2

	return (
		<div className={css.signUp}>
			<h1>{isAcc ? 'Create account' : 'Introduction'} </h1>
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
					<div className={css.formGroup}>
						<label htmlFor="fullname">Full Name</label>
						<Input id="fullname" name="fullname" />
					</div>
					<div className={css.formGroup}>
						<label htmlFor="email">Email</label>
						<Input id="email" name="email" />
					</div>
				</div>

				<div className={classnames(css.formStep, {[css.active]: step === 3})}>
					<Image src="/icons/intro-step-2.svg" width="312" height="180" />
					<p>
						Fill the name of project and its location
					</p>
					<p>Tip: Project name might be
						name of the route.
					</p>
					<p>
						Tip 2: The more precise location, the better.
					</p>
				</div>
				<div className={classnames(css.formStep, {[css.active]: step === 4})}>
					<Image src="/icons/intro-step-3.svg" width="312" height="180" />
					<p>
						Start climbing your project!
					</p>
					<p>Tip: Dont forget to turn off the session
						at the end :)
					</p>
				</div>
				<div className={classnames(css.formStep, {[css.active]: step === 5})}>
					<Image src="/icons/intro-step-4.svg" width="312" height="180" />
					<p>
						Emergency call App will recognize the fall and will contact rescue
						service to help
					</p>
				</div>

				{step < 5 ? (
					<div className={classnames(css.actionButtons, {[css.single]: step === 1 || step === 2})}>
						{step > 2 && <div className={css.skipInto} onClick={() => skipIntro()}>Skip intro</div>}
						<Button type="action" size="large">
							Next
						</Button>
					</div>
				) : (
					<div className={css.finishButtonWrapper}>
						<Button type="action" size="large">
							Create Account
						</Button>
					</div>
				)}
			</form>

			<div className={classnames(css.steps)}>
				<Steps current={step} count={5} onChange={value => setStep(value)} />
			</div>
		</div>
	);
}

export default SignupPage;
