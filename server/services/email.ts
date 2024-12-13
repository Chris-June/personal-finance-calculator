import nodemailer from 'nodemailer';
import { config } from '../config/auth';

const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
        user: config.smtp.user,
        pass: config.smtp.password,
    },
});

export const sendVerificationEmail = async (email: string, token: string) => {
    const verificationUrl = `${config.appUrl}/verify-email?token=${token}`;

    const mailOptions = {
        from: config.smtp.from,
        to: email,
        subject: 'Verify your email address',
        html: `
            <h1>Email Verification</h1>
            <p>Please click the link below to verify your email address:</p>
            <a href="${verificationUrl}">${verificationUrl}</a>
            <p>This link will expire in 24 hours.</p>
        `,
    };

    await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetUrl = `${config.appUrl}/reset-password?token=${token}`;

    const mailOptions = {
        from: config.smtp.from,
        to: email,
        subject: 'Reset your password',
        html: `
            <h1>Password Reset</h1>
            <p>Please click the link below to reset your password:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
        `,
    };

    await transporter.sendMail(mailOptions);
};
