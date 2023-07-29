import nodemailer from 'nodemailer'
import config from '@/config'
import logger from '@/log'
import { isString } from '@/utils/valid'

interface MailConfig {
    host: string
    port: number
    secure: boolean
    auth: {
        user: string
        pass: string
    }
}
const emailRegexp = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/
const mailConfig = config.mail as unknown as MailConfig
const transporter = nodemailer.createTransport(mailConfig)

export const isEmail = (email: string) => isString(email) && emailRegexp.test(email)

export const sendMail = async (mail: nodemailer.SendMailOptions) => {
    if (!isEmail(mail.to as string)) return false
    try {
        mail.from = mailConfig.auth.user
        const info = await transporter.sendMail(mail)
        logger.debug('Mail sent success:', info.messageId)
    } catch (err) {
        logger.error(err)
        return false
    }
    return true
}

export const sendCode = async (receiver: string, code: string) => {
    return sendMail({
        from: 'System noreply',
        to: receiver,
        subject: 'Verification code',
        text: `Your verification code is: ${code}`
    })
}
