const epress = require('express');
const router = epress.Router();

const mailController = require('../controllers/mailController.js');

router.post('/send-forgot-password-email', mailController.sendForgotPasswordEmail);
router.put('/send-reset-password-email', mailController.sendResetPasswordEmail);


module.exports = router;