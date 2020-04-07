import React, { useEffect, useState } from 'react'
import { Row, Col, List, Avatar } from 'antd';
import Axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscriber from './Sections/Subscriber';

function VideoDetailPage(props) {

	const videoId = props.match.params.videoId;
	const variable = { videoId: videoId }
	const [videoDetailInfo, setVideoDetailInfo] = useState([]);

	useEffect(() => {
		Axios.post('/api/video/getVideoDetail', variable)
			.then(response => {
				if(response.data.success) {
					setVideoDetailInfo(response.data.videoDetail);
				} else {
					alert('비디오 정보를 가져오는데 실패했습니다.')
				}
			})
	}, [variable])

	if(videoDetailInfo && videoDetailInfo.writer){

		const subscribeButton = videoDetailInfo.writer._id !== localStorage.getItem('userId') && <Subscriber userTo={videoDetailInfo.writer._id} userFrom={localStorage.getItem('userId')}/>;

		return (
			<Row gutter={[16, 16]}>
				<Col lg={18} xs={24}>
					<div style={{ width: '100%', padding: '3rem 2rem' }}>
						<video style={{ width: '100%' }} src={`http://localhost:5000/${videoDetailInfo.filePath}`} controls />
						<List.Item actions={[subscribeButton]}>
							<List.Item.Meta
								avatar={<Avatar src={videoDetailInfo.writer.image} />}
								title={videoDetailInfo.writer.name}
								description={videoDetailInfo.description}
							/>
						</List.Item>
						{/* Comments */}
					</div>
				</Col>
				<Col lg={6} xs={24}>
					<SideVideo />
				</Col>
			</Row>
		)
	} else {
		return <div>...Loading</div>
	}

}

export default VideoDetailPage
