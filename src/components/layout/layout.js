import css from './layout.module.scss';
import Link from 'next/link';
import Image from 'next/image';

export default function Layout({children}) {
	return (
		<>
			<header className={css.header}>
				<div className={css.inner}>
					<Link href="/" passHref>
						<a className={css.headerName}>
							<Image src="/icons/ferrata.svg" width="32" height="32" />
							<div className={css.headerTitle}>Ferrata Safe Guard</div>
						</a>
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
