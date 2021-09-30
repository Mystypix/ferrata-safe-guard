import classnames from 'classnames';
import {forwardRef} from 'react';
import css from './textarea.module.scss';

function Textarea(props, ref) {
	return (
		<textarea
			{...props}
			ref={ref}
			className={classnames(css.textarea, props.className)}
		/>
	);
}

export default forwardRef(Textarea);
