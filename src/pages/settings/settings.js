import classnames from 'classnames';
import Router from 'next/router';
import {useState, useEffect, useRef} from 'react';
import css from './settings.module.scss';
import Button from 'components/button';
import sessionService from 'services/session';

function SettingsPage() {
	const handleLogOut = () => {
		sessionService.setUser(null);
		Router.push('/');
	};
	return (
		<div className={css.signUp}>
			<h2>Settings</h2>

			<Button type="action" size="large" onClick={handleLogOut}>
				Log Out
			</Button>
		</div>
	);
}

export default SettingsPage;
