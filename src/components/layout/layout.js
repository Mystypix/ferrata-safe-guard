import css from './layout.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import sessionService from 'services/session';

export default function Layout({children, goBack, goBackTitle}) {
	return (
		<>
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
						<Link href="/" passHref>
							<a className={css.headerName}>
								<Image src="/icons/ferrata.svg" width="32" height="32" />
								<div className={css.headerTitle}>Ferrata Safe Guard</div>
							</a>
						</Link>
					)}
					{sessionService}
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
