import classnames from 'classnames';
import {forwardRef} from 'react';
import css from './input.module.scss';

function Input(props, ref) {
	return (
		<input
			{...props}
			ref={ref}
			className={classnames(css.input, props.className)}
		/>
	);
}

export default forwardRef(Input);
