const express = require('express');
const router = express.Router()
const { getContact, postContact, getContacts, updateContact, deleteContact } = require('../controllers/contactController')
const { validateTokenHandler } = require('../middleware/validateTokenHandler');

router.use(validateTokenHandler);

router.route('/').get(getContacts).post(postContact)

router.route('/:id').get(getContact).put(updateContact).delete(deleteContact)

module.exports = router;