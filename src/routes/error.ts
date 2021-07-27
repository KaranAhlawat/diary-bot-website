import express = require('express');

const router = express.Router();

router.get('/unregistered', (req, res) => {
	res.render('error');
})

module.exports = router;