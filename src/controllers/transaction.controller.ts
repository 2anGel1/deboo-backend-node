import { transactionValidator } from '../validators/transaction-validators';
import { waveSend, waveTransfert } from '../utils/transaction-utils';
import { Request, Response } from 'express';
import { prisma } from "../config";


export const start = async (req: Request, res: Response) => {

    try {

        const reqBody = req.body;
        const { amount, senderId, receiveoperatorId, sendoperatorId, receiver } = await transactionValidator.validate(reqBody);

        const senderoperator = await prisma.operator.findUnique({
            where: {
                id: sendoperatorId
            }
        });

        const receiveroperator = await prisma.operator.findUnique({
            where: {
                id: receiveoperatorId
            }
        });

        if (!senderoperator) {
            return res.json({ status: false, message: "Operateur d'envoi introuveable" });
        }

        if (!receiveroperator) {
            return res.json({ status: false, message: "Operateur de reception introuveable" });
        }

        const transaction = await prisma.transaction.create({
            data: {
                receiveoperatorId: receiveroperator.id,
                sendoperatorId: senderoperator.id,
                receiver: receiver,
                amount: amount,
                senderId
            }
        });

        switch (senderoperator.code) {
            case "wave":

                await waveSend(res, { amount: amount, receiver: receiver, receivername: "The name", transactionId: transaction.id })
                    .then((re: any) => {
                        return res.json(re);
                    })

                break;
            case "orange":
                console.log("sent by orange");
                break;

            case "moov":
                console.log("sent by moov");
                break;

            case "mtn":
                console.log("sent by mtn");
                break;

            default:
                return res.status(500).json({ message: "Erreur interne au serveur" });
        }

        // return res.json({ status: true, data: { transactionId: transaction.id } });


    } catch (error: any) {

        console.error(error);
        if (error.code == "E_VALIDATION_ERROR") {
            return res.status(200).json({ status: false, message: "Remplissez tous les champs correctement" })
        }
        return res.status(500).json({ message: "G - Erreur interne au serveur" });
    }

}

export const end = async (req: Request, res: Response) => {

    try {

        const reqBody = req.body;
        const transaction = await prisma.transaction.findUnique({
            where: {
                id: reqBody.transactionId
            }
        });

        if (!transaction) {
            return res.json({ status: false, message: "Transaction introuveable" });
        }

        const receiveroperator = await prisma.operator.findUnique({
            where: {
                id: transaction?.receiveoperatorId
            }
        });

        switch (receiveroperator?.code) {
            case "wave":
                await waveTransfert(res, { amount: transaction.amount, transactionId: transaction.id })
                    .then((re: any) => {
                        return res.json(re);
                    });
                break;

            case "orange":
                console.log("received on orange");
                break;

            case "moov":
                console.log("received on moov");
                break;

            case "mtn":
                console.log("received on mtn");
                break;

            default:
                return res.status(500).json({ message: "Erreur interne au serveur" });
        }

    } catch (error: any) {

        if (error.code == "E_VALIDATION_ERROR") {
            // console.error(error);
            return res.status(200).json({ status: false, message: "Remplissez tous les champs correctement" })
        }
        return res.status(500).json({ message: "Erreur interne au serveur" });
    }

}


