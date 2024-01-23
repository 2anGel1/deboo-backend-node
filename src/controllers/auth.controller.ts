import { verificationForPasswordResetValidator, pinResetValidator, newPinValidator, signupValidator, loginValidator, phoneValidator } from "../validators/user-validators";
import { generatePasswordResetToken, verifyPasswordResetToken } from "../utils/token-utils";
import { passwordResetCookie, sessionIdCookie } from "../constants/cookies-constants";
import { comparePlainTextToHashedText, hash } from "../utils/hash-utils";
import PasswordResetMail from "../mail-template/password-reset-mail";
import { calculateSessionExpiration, createSession, leaveSession } from "../utils/session-utils";
import { generateRandomCode } from "../utils/code-utils";
import { Request, Response } from 'express';
import { prisma } from "../config";
const axios = require('axios');

// login user
export const login = async (req: Request, res: Response) => {
  try {

    const reqBody = await req.body;
    const { phonenumber } = await phoneValidator.validate(reqBody);

    var user = await prisma.user.findUnique({
      where: {
        phonenumber,
      },
    });

    if (!user) {
      return res.status(200).json({ status: false, message: "Aucun compte avec ce nuémro trouvé.." });
    }
    // const isPinValid = comparePlainTextToHashedText(
    //   pin,
    //   user.pinHash!
    // );
    // if (!isPinValid) {
    //   return res.status(200).json({ status: false, message: "Mot de passe incorrect." });
    // }

    // const sessionToken = await createSession(user.id);
    return res.status(200).json({ status: true, message: "Login success", data: { user: user } });

  } catch (error: any) {
    console.log(error);
    if (error.code == "E_VALIDATION_ERROR") {
      console.log("Erreur de validation");
      return res.status(200).json({ status: false, message: "Remplissez tous les champs correctement" })
    }
    return res.status(500).json({ message: "Erreur interne au serveur" });
  }

};

export const loginvalidate = async (req: Request, res: Response) => {
  try {

    const reqBody = await req.body;
    const { phonenumber, pin } = await loginValidator.validate(reqBody);

    var user = await prisma.user.findUnique({
      where: {
        phonenumber,
      },
    });

    if (!user) {
      return res.status(200).json({ status: false, message: "Aucun compte avec ce nuémro trouvé.." });
    }
    
    const isPinValid = comparePlainTextToHashedText(
      pin,
      user.pinHash!
    );
    if (!isPinValid) {
      return res.status(200).json({ status: false, message: "Mot de passe incorrect." });
    }

    const sessionToken = await createSession(user.id);
    return res.status(200).json({ status: true, message: "Login success", token: sessionToken });

  } catch (error: any) {
    console.log(error);
    if (error.code == "E_VALIDATION_ERROR") {
      console.log("Erreur de validation");
      return res.status(200).json({ status: false, message: "Remplissez tous les champs correctement" })
    }
    return res.status(500).json({ message: "Erreur interne au serveur" });
  }

};

// logout user
export const logout = async (req: Request, res: Response) => {
  try {
    const sessionToken = req.body.session.sessionToken;

    await leaveSession(sessionToken);

    // Effacez le cookie de session
    res.clearCookie(sessionIdCookie.name, {
      ...sessionIdCookie.options,
    });

    res.status(200).json({ status: true, message: "Logout success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// signup user
export const signup = async (req: Request, res: Response) => {

  try {

    const reqBody = await req.body;
    let userData = await signupValidator.validate(reqBody);
    const { email, firstname, lastname, phonenumber, pin } = userData;


    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email
          },
          {
            phonenumber
          }
        ]
      },
    });
    if (existingUser) {
      return res.status(200).json({ status: false, message: "Cet utilisateur existe déjà." });
    }

    const user = await prisma.user.create({
      data: {
        phonenumber: phonenumber,
        firstname: firstname,
        lastname: lastname,
        pinHash: hash(pin),
        email: email,
      }
    });

    return res.status(200).json({ status: true, message: "Utilisateur crée avec succès.", data: { user: user } });

  } catch (error: any) {
    // console.log(error);
    if (error.code == "E_VALIDATION_ERROR") {
      console.log("Erreur de validation");
      return res.status(200).json({ status: false, message: "Remplissez tous les champs correctement" })
    }
    return res.status(500).json({ message: "Erreur interne au serveur" });
  }
};

// password reset request
export const passwordReset = async (req: Request, res: Response) => {
  const reqBody = await req.body;
  const { phonenumber } = await pinResetValidator.validate(reqBody);

  const user = await prisma.user.findUnique({
    where: {
      phonenumber,
    },
  });

  if (user === null) {
    return res.status(400).json({ message: "L'adresse mail ne correspond à aucun utilisateur" });
  }
  const plainCode = generateRandomCode();
  const hashedCode = hash(plainCode);
  console.log(plainCode);

  const passwordReset = await prisma.otp.create({
    data: {
      expires: calculateSessionExpiration(),
      userphone: user.phonenumber,
      createdAt: new Date(),
      code: hashedCode,
    },
  });
  const passwordResetToken = generatePasswordResetToken(passwordReset.id);

  // await sendMail({
  //   subject: "Réinitialiser votre mot de passe",
  //   to: user.email!,
  //   html: render(PasswordResetMail({ verificationCode: plainCode })),
  // });
  // res.cookie(passwordResetCookie.name, passwordResetToken, passwordResetCookie.options);

  return res.status(200).json({ message: "Code sent", status: true });
};

// paswword reset verification 
export const verificationForPasswordReset = async (req: Request, res: Response) => {
  try {
    const reqBody = req.body;

    const passwordResetToken = req.cookies[passwordResetCookie.name];
    const { code, token } = await verificationForPasswordResetValidator.validate({
      code: reqBody.code,
      token: passwordResetToken,
    });

    const { id } = verifyPasswordResetToken(token);

    const passwordReset = await prisma.otp.findUnique({
      where: {
        id,
      },
    });

    if (!passwordReset) {
      throw new Error("Not found");
    }

    if (passwordReset.verified) {
      throw new Error("Déjà vérifié");
    }


    const codeIsValid = comparePlainTextToHashedText(code, passwordReset.code);

    if (!codeIsValid) {
      throw new Error("Code incorrect");
    }

    await prisma.otp.update({
      where: {
        id,
      },
      data: {
        verified: true,
        verifiedAt: new Date(),
      },
    });

    return res.json({ message: "Vérifié" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error });
  }
};

// new password generation
export const newPassword = async (req: Request, res: Response) => {
  try {
    const reqBody = req.body;
    const passwordResetToken = req.cookies[passwordResetCookie.name];

    let { newPin, token } = await newPinValidator.validate({
      newPin: reqBody.newPassword,
      token: passwordResetToken,
    });

    const { id } = verifyPasswordResetToken(token);
    newPin = hash(newPin);

    const otp = await prisma.otp.findUnique({
      where: {
        id,
      },
    });

    if (!otp) {
      throw new Error("Not found");
    }

    if (!otp.verified) {
      throw new Error("Code not verified");
    }

    if (otp.reset) {
      throw new Error("Déjà réinitialisé");
    }

    await prisma.otp.update({
      where: {
        id,
      },
      data: {
        reset: true,
      },
    });

    const user = await prisma.user.update({
      where: {
        phonenumber: otp.userphone,
      },
      data: {
        pinHash: newPin,
      },
    });

    // Effacez le cookie passwordResetCookie
    res.clearCookie(passwordResetCookie.name);

    // Définissez le cookie de session
    // res.cookie(sessionIdCookie.name, sessionId, sessionIdCookie.options);

    return res.json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error });
  }
};




