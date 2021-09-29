import css from './layout.module.scss';
import Link from 'next/link';

export default function Layout({children}) {
	return (
		<>
			<header className={css.header}>
				<div className={css.inner}>
					<Link href="/" passHref>
						<a className={css.headerName}>Ferrata Safe Guard</a>
					</Link>
					<Link href="/settings" passHref>
						<a className={css.headerUser}>MK</a>
					</Link>
				</div>
			</header>
			<main className={css.main}>
				<div className={css.inner}>{children}</div>
			</main>
		</>
	);
}
