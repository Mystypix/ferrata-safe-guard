import Link from 'next/link';
import Image from 'next/image';
import css from './home.module.scss';
import Button from 'components/button';

function HomePage() {
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
				<Link href="/login">
					<Button size="medium" type="action">
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
