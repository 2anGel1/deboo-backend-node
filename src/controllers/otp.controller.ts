import { Request, Response } from 'express';
import { prisma } from "../config";
import { generateRandomCode } from '../utils/code-utils';
import { comparePlainTextToHashedText, hash } from '../utils/hash-utils';
import { generateOtpToken, verifyOtpToken } from '../utils/token-utils';
import { calculateOtpExpiration, sendSms } from '../utils/sms-utils';


export const sendotp = async (req: Request, res: Response) => {

    try {

        const reqBody = await req.body;

        const plainCode = generateRandomCode();
        const hashedCode = hash(plainCode);

        const otp = await prisma.otp.create({
            data: {
                expires: calculateOtpExpiration(),
                userphone: reqBody.phonenumber,
                createdAt: new Date(),
                type: reqBody.type,
                code: hashedCode,
            },
        });

        const otpToken = generateOtpToken(otp.id);

        console.log("sending...");

        await sendSms(res, plainCode, reqBody.phonenumber);
        return res.status(200).json({ status: true, data: { otptoken: otpToken } });


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
            return res.json({ status: false, message: "Code déja vérifié" });
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
            console.log("Erreur de validation");
            return res.status(200).json({ status: false, message: "Remplissez tous les champs correctement" })
        }
        return res.status(500).json({ message: "Erreur interne au serveur" });
        //
    }

}