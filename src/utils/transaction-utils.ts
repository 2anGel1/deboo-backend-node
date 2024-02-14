import { WAVE_ACCESS_TOKEN, prisma } from '../config';
import { Response } from 'express';
const axios = require("axios");

export const waveSend = async (res: Response, data: any) => {

    var re = null;

    await axios.post("https://api.wave.com/v1/checkout/sessions",
        {
            amount: data.amount,
            currency: "XOF",
            error_url: "https://example.com/error",
            success_url: "https://example.com/success"
        },
        {
            headers: {
                "Authorization": WAVE_ACCESS_TOKEN,
            }
        })
        .then(async (response: any) => {

            await prisma.transaction.update({
                where: {
                    id: data.transactionId
                },
                data: {
                    sendReferences: response.data.id,
                    sentAt: new Date(),
                }
            });

            re = { status: true, data: response.data, transactionId: data.transactionId };

        })
        .catch((error: any) => {
            re = { status: false, error: error }
        })

    re = re == null ? { status: false, message: "Echec de transfert; cause inconnue" } : re
    return re;

}

export const waveTransfert = async (res: Response, data: any) => {

    var re = null;

    await axios.post("https://api.wave.com/v1/payout",
        {
            mobile: "+225" + data.receiver,
            receive_amount: data.amount,
            name: data.receivername,
            currency: "XOF",
        },
        {
            headers: {
                "Authorization": WAVE_ACCESS_TOKEN,
                "idempotency-key": data.transactionId
            }
        })
        .then(async (response: any) => {

            console.log(response);

            await prisma.transaction.update({
                where: {
                    id: data.transactionId
                },
                data: {
                    receiveReferences: response.data.id,
                    receivedAt: new Date(),
                }
            });

            re = { status: true, data: response.data, transactionId: data.transactionId };

        })
        .catch((error: any) => {
            re = { status: false, error: error }
        })

    re = re == null ? { status: false, message: "Echec de transfert; cause inconnue" } : re
    return re;

}