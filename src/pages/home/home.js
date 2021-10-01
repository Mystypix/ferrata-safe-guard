import Link from 'next/link';
import Image from 'next/image';
import css from './home.module.scss';
import Button from 'components/button';
import {useRef, useEffect} from 'react';

const IS_STANDALONE =
	global.matchMedia && global.matchMedia('(display-mode: standalone)').matches;

function HomePage() {
	const defferedPromptRef = useRef();
	const handleBeforeInstall = event => {
		event.preventDefault();
		defferedPromptRef.current = event;
	};
	useEffect(() => {
		let defferedPrompt;
		window.addEventListener('beforeinstallprompt', handleBeforeInstall);
		() =>
			window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
	}, []);

	const handleInstall = ev => {
		const defferedPrompt = defferedPromptRef.current;
		if (!defferedPrompt) return;
		defferedPrompt.prompt();

		defferedPrompt.userChoice.then(choice => {
			if (choice.outcome === 'accepted') {
				console.log('user accepted the prompt');
			}
			defferedPrompt = null;
		});
	};

	return (
		<div className={css.homePage}>
			<Image src="/icons/fall.svg" width="312" height="244" />
			<Image src="/icons/ferrata.svg" width="44" height="44" />
			<h2>Ferrata safe guard</h2>
			<p className={css.text}>
				a distinct section of a piece of writing, usually dealing with a single
				theme and indicated by a new line, indentation, or numbering.
			</p>
			<div className={css.actions}>
				{!IS_STANDALONE && (
					<Button size="large" type="primary" onClick={handleInstall}>
						Install App
					</Button>
				)}

				<Link href="/login">
					<Button size="large" type="action">
						Let's Start{' '}
						<Image src="/icons/arrow-right.svg" width="20" height="10" />
					</Button>
				</Link>
			</div>
		</div>
	);
}

HomePage.getLayout = function getLayout(page) {
	return <>{page}</>;
};

export default HomePage;
