const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ success: true, msg: 'show all Bootcamp' });
});

router.post('/', (req, res) => {
  res.status(200).json({ success: true, msg: 'create new Bootcamp' });
});

router.put('/:id', (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `update Bootcamp ${req.params.id}` });
});

router.delete('/:id', (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete Bootcamp ${req.params.id}` });
});

module.exports = router;
