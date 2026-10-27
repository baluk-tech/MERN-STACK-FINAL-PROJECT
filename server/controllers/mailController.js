const User = require('../models/User.js');
const crypto = require('crypto');
const transporter = require('../services/mailService.js');
const { BaseCollection } = require('mongoose');
const bcrypt = require('bcrypt');

const sendForgotPasswordEmail = async (req, res) => {
    const data = req.body;
    try {
        const user = await User.findOne({ email: data.email })
        if (!user) {
            return res.status(404).send({message: "User not found"});
        }
        const resetPasswordToken = Buffer.from(crypto.randomBytes(28)).toString('hex');
        user.resetPasswordToken = resetPasswordToken;
        user.expireAt = new Date(Date.now() + (15*60*1000));
        await user.save();

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Reset Password",
            text: `Click on the link to reset your password: 
            http://localhost:5173/reset-password/${resetPasswordToken},
            
            This link will expire in 15 minutes.`
        });
        res.send({message: "Reset password email sent successfully"});
    } catch (err) {
        return res.status(500).send({message: "Error occurred while sending reset password email", err});
    }
}

const sendResetPasswordEmail = async (req, res) => {
    const data = req.body;
    try {
        const user = await User.findOne({ resetPasswordToken: data.token })
        if (user) {
            if (user.expireAt < new Date()) {
                return res.status(400).send({message: "Token has expired"});
            }
            const resetPasswordHash = await bcrypt.hash(data.newPassword, 10);
            user.resetPasswordToken = null;
            user.password = resetPasswordHash;
            await user.save();
            return res.send({message: "Password reset successfully"});
        } else {
            return res.status(400).send({message: "Invalid or expired token"});
        }
    } catch (err) {
        return res.status(500).send({message: "Error occurred while resetting password", err});
    }
}


module.exports = { sendForgotPasswordEmail, sendResetPasswordEmail };