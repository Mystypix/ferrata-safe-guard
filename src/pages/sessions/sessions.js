import Link from 'next/link';
import css from './sessions.module.scss';

function Session() {
	return <div className={css.card}></div>;
}

function SessionsPage() {
	const cards = [1, 2, 3].map(session => (
		<div key={'card' + session} className={css.card}>
			<div>Card {session}</div>
		</div>
	));
	return <div className={css.cardList}>{cards}</div>;
}

export default SessionsPage;
