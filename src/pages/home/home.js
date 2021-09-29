import Link from 'next/link';
import css from './home.module.scss';
import Button from 'components/button';

function HomePage() {
	return (
		<div>
			<p>Lorem ipsum sit dolor.</p>
			<div className={css.actions}>
				<Link href="/signup">
					<Button type="primary" size="medium">
						Sign Up
					</Button>
				</Link>
				<Link href="/login">
					<Button size="medium">Log In</Button>
				</Link>
			</div>
		</div>
	);
}

export default HomePage;
