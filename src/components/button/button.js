import classnames from 'classnames';
import {forwardRef} from 'react';
import css from './button.module.scss';

export const BUTTON_SIZE = {
	small: css.sizeSmall,
	medium: css.sizeMedium,
	large: css.sizeLarge,
};

export const BUTTON_TYPE = {
	primary: css.typePrimary,
	action: css.typeAction,
	default: css.typeDefault,
};

function Button(props, ref) {
	const sizeCls = BUTTON_SIZE[props.size] || BUTTON_SIZE.small;
	const typeCls = BUTTON_TYPE[props.type] || BUTTON_TYPE.default;
	return (
		<button
			{...props}
			ref={ref}
			className={classnames(css.button, sizeCls, typeCls, props.className)}
		/>
	);
}

export default forwardRef(Button);
