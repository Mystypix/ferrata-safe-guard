import css from './layout.module.scss';

export default function Layout({children}) {
	return (
		<>
			<header className={css.header}>
				<div className={css.inner}>Ferrat Safe Guard</div>
			</header>
			<main className={css.main}>
				<div className={css.inner}>{children}</div>
			</main>
		</>
	);
}
