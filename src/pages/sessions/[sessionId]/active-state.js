import {useEffect} from 'react';
import Image from 'next/image'
import Button from 'components/button'

function ActiveState(props) {

	// useEffect(() => {
	// 	console.log('lkdsfhjkjsdf')
	// 	props.sendForHelp()
	// }, []);

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
