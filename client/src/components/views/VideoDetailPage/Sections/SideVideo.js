import React, { useEffect, useState } from 'react';
import Axios from 'axios';

function SideVideo() {

	const [sideVideos, setSideVideos] = useState([]);

	useEffect(() => {
		Axios.get('/api/video/getVideos')
		.then(response => {
			if(response.data.success) {
				// console.log(response.data.videos)
				setSideVideos(response.data.videos)
			} else {
				alert('비디오 가져오기를 실패 했습니다. ')
			}
		})
	}, [])

	const renderSideVideo = sideVideos.map((video, index) => {

		let minutes = Math.floor(video.duration / 60);
		let seconds = Math.floor((video.duration - minutes * 60));

		return (
			<div key={index} style={{ display: 'flex', marginBottom: '1rem', padding: '0 2rem' }}>
			<div style={{ width: '40%', marginRight: '1rem '}}>
				<a href={'naver.com'}>
					<img style={{ width: '100%' }} src={`http://localhost:5000/${video.thumbnail}`} alt={'thumbnail'} />
				</a>
			</div>
			<div style={{ width: '50%' }}>
				<a href={'naver.com'} style={{ color: 'gray' }}>
					<span style={{ fontSize: '1rem', color: 'black' }}>{video.title}</span><br/>
					<span>{video.writer.name}</span><br/>
					<span>{video.views} view</span><br/>
					<span>{minutes} : {seconds}</span>
				</a>
			</div>
		</div>
		)
	})

	return (
		<div style={{ marginTop: '3rem' }}>
			{renderSideVideo}
		</div>
	)
}

export default SideVideo
