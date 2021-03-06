import {useState, forwardRef} from 'react';
import Image from 'next/image';
import css from './password.module.scss';
import Input from 'components/input';

function Password(props, ref) {
	const [showPassword, setShowPassword] = useState(false);
	const type = showPassword ? 'text' : 'password';
	return (
		<div className={css.wrapper}>
			<Input {...props} type={type} ref={ref} />
			<div className={css.eye} onClick={() => setShowPassword(value => !value)}>
				<Image src="/icons/eye.svg" width="20" height="18" />
			</div>
		</div>
	);
}

export default forwardRef(Password);
