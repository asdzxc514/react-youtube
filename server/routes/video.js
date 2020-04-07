const express = require('express');
const router = express.Router();
const multer = require('multer');
var ffmpeg = require('fluent-ffmpeg');
const { Video } = require('../models/Video');
const { Subscriber } = require('../models/Subscriber');
const { auth } = require('../middleware/auth');

//=================================
//             video
//=================================


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
        }
        cb(null, true)
    }
})

var upload = multer({ storage: storage }).single("file")

router.post('/uploadfiles', (req, res) => {
	// 비디오를 서버에 저장한다.
	upload(req, res, err => {
		if(err) {
			return res.json({ success: false, err });
		}
		return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename });
	})
});


router.post('/getVideoDetail', (req, res) => {
	Video.findOne({ "_id" : req.body.videoId })
		.populate('writer')
		.exec((err, videoDetail) => {
			if(err) return res.status(400).send(err)
			return res.status(200).json({ success: true, videoDetail });
		});
});


router.post('/uploadVideo', (req, res) => {
	// 비디오 정보들을 저장
	const video = new Video(req.body);
	// mongoDB 저장
	video.save((err, video) => {
        if(err) return res.status(400).json({ success: false, err })
        return res.status(200).json({ success: true });
    })
});

router.get('/getVideos', (req, res) => {
	// 비디오를 DB에서 가져와서 클라이언트에 보낸다.
	Video.find()
		.populate('writer')
		.exec((err, videos) => {
			if(err) return res.status(400).send(err);
			res.status(200).json({ success: true, videos });
		})
});

router.post("/thumbnail", (req, res) => {
	// 썸네일 생성하고, 비디오 러닝타임 가져오기
	let filePath = '';
	let fileDuration = '';

	// 비디오 정보 가져오기
	ffmpeg.ffprobe(req.body.url, function (err, metadata) {
		console.dir(metadata);
		fileDuration = metadata.format.duration;

		console.log(fileDuration)
	})

	// 썸네일 생성
	ffmpeg(req.body.url)
	.on('filenames', function (filenames) {
		console.log('Will generate ' + filenames.join(', '));
		console.log(filenames);

		filePath = 'uploads/thumbnails/' + filenames[0];
	})
	.on('end', function () {
		console.log('Screenshots taken');
            return res.json({ success: true, url: filePath, fileDuration: fileDuration })
	})
	.on('error', function (err) {
		console.log(err);
		return res.json({ success: false, err });
	})
	.screenshots({
		count: 3,
		folder: 'uploads/thumbnails',
		size:'320x240',
		filename:'thumbnail-%b.png'
	});
});

// 구독한 것만 불러오기
router.post('/getSubscriptionVideos', (req, res) => {

	console.log(res)

	// 1. 자신의 아이디를 가지고 구독하는 사람들을 찾는다
	Subscriber.find({ 'userFrom': req.body.userFrom })
		.exec((err, subscriberInfo) => {
			if(err) return res.status(400).send(err);

			var subscribedUser = [];

			subscriberInfo.map((subscriber, i) => {
				subscribedUser.push(subscriber.userTo);
			})

			// 2. 찾은 사람들의 비디오를 가지고 온다
			// writer가 1명일때는 req.body.id 가능하지만, 여러명일때는 $in 이라는 mongoDB 의 기능을 사용해야함

			Video.find({ writer: { $in: subscribedUser } })
			.populate('writer')
			.exec((err, videos) => {
				if(err) return res.status(400).send(err);
				res.status(200).json({ success: true, videos })
			})
		})
});


module.exports = router;
