import Link from 'next/link';
import css from './home.module.scss';

function HomePage() {
	return (
		<div>
			<p>Lorem ipsum sit dolor.</p>
			<Link href="/sessions">
				<button className={css.getStarted}>Get Started</button>
			</Link>
		</div>
	);
}

export default HomePage;
