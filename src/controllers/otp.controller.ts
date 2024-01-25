import { comparePlainTextToHashedText, hash } from '../utils/hash-utils';
import { calculateOtpExpiration, sendSms } from '../utils/sms-utils';
import { generateRandomCode } from '../utils/code-utils';
import { generateOtpToken } from '../utils/token-utils';
import { sendMail } from '../utils/mail-utils';
import { render } from "@react-email/render";
import { Request, Response } from 'express';
import { prisma } from "../config";
import AccountVerificationMail from '../mail-template/account-verification-mail';


export const sendotp = async (req: Request, res: Response) => {

    try {

        const reqBody = await req.body;

        const plainCode = generateRandomCode();
        const hashedCode = hash(plainCode);

        const otp = await prisma.otp.create({
            data: {
                expires: calculateOtpExpiration(),
                userphone: reqBody.phonenumber,
                useremail: reqBody.email,
                createdAt: new Date(),
                type: reqBody.type,
                code: hashedCode,
            },
        });

        const otpToken = generateOtpToken(otp.id);

        if (reqBody.sendemail) {
            return await sendMail({
                res,
                response: { status: true, data: { otptoken: otpToken, code: plainCode } },
                subject: "Vérification de votre compte",
                to: reqBody.email,
                html: render(AccountVerificationMail({ verificationCode: plainCode })),
            });
        } else {
            return await sendSms(res, { status: true, data: { otptoken: otpToken, code: plainCode } }, plainCode, reqBody.phonenumber);

        }


    } catch (error: any) {
        //
        console.log(error);
        if (error.code == "E_VALIDATION_ERROR") {
            console.log("Erreur de validation");
            return res.status(200).json({ status: false, message: "Remplissez tous les champs correctement" })
        }
        return res.status(500).json({ message: "Erreur interne au serveur" });
        //
    }

}

export const checkotp = async (req: Request, res: Response) => {
    try {
        const reqBody = req.body;
        const otp = reqBody.otp;

        if (otp.verified) {
            return res.json({ status: false, message: "Code expiré" });
        }

        const codeIsValid = comparePlainTextToHashedText(reqBody.pin, otp.code);

        if (!codeIsValid) {
            return res.json({ status: false, message: "Code incorrect" });
        }

        await prisma.otp.update({
            where: {
                id: otp.id,
            },
            data: {
                verified: true,
                verifiedAt: new Date(),
            },
        });

        return res.json({ status: true, message: "ok" });
        //
    } catch (error: any) {
        //
        console.log(error);
        if (error.code == "E_VALIDATION_ERROR") {
            // console.log("Erreur de validation");
            return res.status(200).json({ status: false, message: "Remplissez tous les champs correctement" })
        }
        return res.status(500).json({ message: "Erreur interne au serveur" });
        //
    }

}