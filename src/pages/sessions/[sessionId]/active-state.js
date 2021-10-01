import classnames from 'classnames'
import {useEffect, useState} from 'react';
import Image from 'next/image'
import Button, {BUTTON_TYPE} from 'components/button'
import {Duration} from 'luxon';

function ActiveState(props) {

	useEffect(() => {
		props.sendForHelp()
	});

	function handleFinish() {
		props.finishSession()
	}

	return (
		<div className='pageWrapper'>
			<Image className='illustration' src='/icons/rescue.svg' width='312' height='244' />
			<h1>Rescue servis contacted</h1>
			<p>Hang on tight</p>
			<Button className='finishButon' type='action' size='large' onClick={() => handleFinish}>Finish</Button>
		</div>
	)
}

export default ActiveState
