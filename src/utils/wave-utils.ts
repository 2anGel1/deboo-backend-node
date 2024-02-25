import { WAVE_ACCESS_TOKEN, prisma } from '../config';
import { Response } from 'express';
const axios = require("axios");

export const waveSend = async (res: Response, data: any) => {

    var re = null;
    const fail = { status: false, message: "Echec du transfert. Contactez nous pour plus d'informations" };

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
            re = fail;
        })

    re = re == null ? fail : re;
    return re;

}

export const waveTransfert = async (res: Response, data: any) => {

    var re = null;
    const fail = { status: false, message: "Echec du transfert. Contactez nous pour plus d'informations" };

    await axios.post("https://api.wave.com/v1/payout",
        {
            mobile: "+225" + data.receiver,
            receive_amount: data.amount,
            name: data.receiver,
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
            re = fail;
        })

    re = re == null ? fail : re
    return re;

}