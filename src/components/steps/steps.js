import classnames from 'classnames';
import {useState} from 'react';
import css from './steps.module.scss';

export default function Steps(props) {
	const steps = new Array(props.count).fill(0).map((step, index) => {
		return (
			<div
				key={'step-' + index}
				className={classnames(css.step, {
					[css.active]: index + 1 === props.current,
				})}
				onClick={() => props.onChange(index + 1)}
			>
				<div className={css.inner} />
			</div>
		);
	});
	return <div className={css.steps}>{steps}</div>;
}
