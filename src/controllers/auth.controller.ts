import { signupValidator, loginValidator, phoneValidator } from "../validators/user-validators";
import { comparePlainTextToHashedText, hash } from "../utils/hash-utils";
import { createSession, leaveSession } from "../utils/session-utils";
import { Request, Response } from 'express';
import { prisma } from "../config";

//
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
      return res.status(200).json({ status: false, message: "Aucun compte trouvé" });
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

//
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
      return res.status(200).json({ status: false, message: "Aucun compte trouvé." });
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
    // console.error(error);
    if (error.code == "E_VALIDATION_ERROR") {
      // console.log("Erreur de validation");
      return res.status(200).json({ status: false, message: "Remplissez tous les champs correctement" })
    }
    return res.status(500).json({ message: "Erreur interne au serveur" });
  }

};

// 
export const logout = async (req: Request, res: Response) => {
  try {
    const sessionToken = req.body.session.sessionToken;

    await leaveSession(sessionToken);

    res.status(200).json({ status: true, message: "Logout success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 
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
      // console.log("Erreur de validation");
      return res.status(200).json({ status: false, message: "Remplissez tous les champs correctement" })
    }
    return res.status(500).json({ message: "Erreur interne au serveur" });
  }
};

// 
export const newCodePin = async (req: Request, res: Response) => {
  try {
    const reqBody = req.body;

    let { phonenumber, pin } = await loginValidator.validate(reqBody)

    pin = hash(pin);

    await prisma.user.update({
      where: {
        phonenumber: phonenumber,
      },
      data: {
        pinHash: pin,
      },
    });

    return res.json({ message: "Mot de passe modifié avec succès", status: true });
  } catch (error: any) {
    // console.log(error);
    if (error.code == "E_VALIDATION_ERROR") {
      console.log("Erreur de validation");
      return res.status(200).json({ status: false, message: "Remplissez tous les champs correctement" })
    }
    return res.status(500).json({ message: "Erreur interne au serveur" });
  }
};




