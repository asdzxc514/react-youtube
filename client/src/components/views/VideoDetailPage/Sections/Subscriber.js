import React, { useEffect, useState } from 'react'
import Axios from 'axios';

function Subscriber(props) {

	const [SubscribeNumber, setSubscribeNumber] = useState(0);
	const [Subscribed, setSubscribed] = useState(false)

	useEffect(() => {

		let variable = { userTo: props.userTo };
		Axios.post('/api/subscribe/subscribeNumber', variable)
			.then( response => {
				if(response.data.success) {
					setSubscribeNumber(response.data.subscribeNumber)
				} else {
					alert('구독자 수 정보를 받아오지 못했습니다.')
				}
			})

		let subscribedVariable = { userTo: props.userTo, userFrom: localStorage.getItem('userId') };

		Axios.post('/api/subscribe/subscribed', subscribedVariable)
			.then( response => {
				if(response.data.success) {
					setSubscribed(response.data.subscribed);
				} else {
					alert('정보를 받아오지 못했습니다.')
				}
			})

	});


	const onSubscribe = () => {

		let subscrivedVariable = {
			userTo: props.userTo,
			userFrom: props.userFrom
		}

		// 구독 O
		if(Subscribed) {
			Axios.post('/api/subscribe/unSubscribe', subscrivedVariable)
				.then(response => {
					if(response.data.success) {
						setSubscribeNumber(SubscribeNumber - 1);
						setSubscribed(!Subscribed);
					} else {
						alert('구독 취소 하는데 실패 했습니다.')
					}
				})

		// 구독 X
		} else {
			Axios.post('/api/subscribe/subscribe', subscrivedVariable)
			.then(response => {
				if(response.data.success) {
					setSubscribeNumber(SubscribeNumber + 1);
					setSubscribed(!Subscribed);
				} else {
					alert('구독 하는데 실패 했습니다.')
				}
			})
		}

	}

	return (
		<div>
			<button
				style={{
					padding: '10px 16px',
					fontSize: '1rem',
					fontWeight: '500',
					color: 'white',
					backgroundColor: `${Subscribed ? '#aaa' : '#cc0000'}`,
					border: 'none',
					borderRadius: '4px',
					textTransform: 'uppercase'
				}}
				onClick={onSubscribe}
			>
				{SubscribeNumber !== 0 && SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
			</button>
		</div>
	)
}

export default Subscriber
