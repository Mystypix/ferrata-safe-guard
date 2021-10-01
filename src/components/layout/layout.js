import css from './layout.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import {useState, useEffect} from 'react';
import SessionContext from 'components/session-context';

const getInitials = currentUser => {
	const parts = (currentUser.fullname || '').split(' ');
	if (parts.length === 0) return 'X';
	if (parts.length === 1) return parts[0][0] || 'X';
	return parts[0][0] + parts[parts.length - 1][0] || 'X';
};

let currentSession = null;
if (global.localStorage) {
	currentSession = localStorage.getItem('session');
	currentSession = currentSession ? JSON.parse(currentSession) : null;
}

export default function Layout({children, goBack, goBackTitle}) {
	const [currentUser, setCurrentUser] = useState(() => {
		if (global.localStorage) {
			let currentSession = localStorage.getItem('session');
			return currentSession ? JSON.parse(currentSession) : null;
		}
		return null;
	});
	const setAndPersistCurrentUser = currentUser => {
		setCurrentUser(currentUser);
		localStorage.setItem(
			'session',
			currentUser === null ? null : JSON.stringify(currentUser)
		);
	};
	useEffect(() => {
		console.log('first render');
	}, []);
	return (
		<>
			<SessionContext.Provider
				value={{currentUser, setCurrentUser: setAndPersistCurrentUser}}
			>
				<header className={css.header}>
					<div className={css.inner}>
						{goBack && (
							<Link href={goBack} passHref>
								<a className={css.headerName}>
									<Image src="/icons/arrow-back.svg" width="20" height="10" />
									<div className={css.headerTitle}>{goBackTitle}</div>
								</a>
							</Link>
						)}
						{!goBack && (
							<Link href={currentUser ? '/sessions' : '/'} passHref>
								<a className={css.headerName}>
									<Image src="/icons/logo.svg" width="32" height="32" />
									<div className={css.headerTitle}>Ferrata Safe Guard</div>
								</a>
							</Link>
						)}
						{currentUser && (
							<Link href="/settings" passHref>
								<a className={css.headerUser}>{getInitials(currentUser)}</a>
							</Link>
						)}
					</div>
				</header>
				<main className={css.main}>
					<div className={css.inner}>{children}</div>
				</main>
			</SessionContext.Provider>
		</>
	);
}
