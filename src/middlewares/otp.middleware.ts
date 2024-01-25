import { Request, Response, NextFunction } from 'express';
import { verifyOtpToken } from '../utils/token-utils';
import { prisma } from '../config';


export const requireOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const tok = req.headers.authorization?.toString();
    const otpToken = tok?.substring(7, tok.length);

    const { id } = verifyOtpToken(otpToken!);

    const otp = await prisma.otp.findFirst({
        where: {
            id,
            expires: {
                gte: new Date(),
            },
        },
    });

    if (!otp) {
        return res.json({ message: 'Le code a expiré.', status: false, code: 400 });
    }

    req.body.otp = otp;
    console.log(otp);

    next();

}

export const otpEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    req.body.sendemail = true;
    next();

}