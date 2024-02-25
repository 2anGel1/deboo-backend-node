import { ORANGE_ACCESS_TOKEN, ORANGE_GET_TOKEN_ENDPOINT, ORANGE_SEND_SMS_ENDPOINT } from "../config";
import { Request, Response } from 'express';
const axios = require("axios");


export const sendSms = async (res: Response, response: any, code: string, receiver: string) => {

    await axios.post(ORANGE_GET_TOKEN_ENDPOINT, {
        grant_type: "client_credentials"
    },
        {
            headers: {
                "Authorization": ORANGE_ACCESS_TOKEN,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(async (res1: any) => {
            if (res1.status == 200) {

                const access_token = res1.data.access_token;

                await axios.post("https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B2250000/requests", {
                    "outboundSMSMessageRequest": {
                        "address": "tel:+225" + receiver,
                        "outboundSMSTextMessage": {
                            "message": "Code de validation Deboo: " + code
                        },
                        "senderAddress": "tel:+2250000",
                        "senderName": "Kayoo",
                    }
                }, {
                    headers: {
                        "Authorization": "Bearer " + access_token,
                    }
                })
                    .then((res2: any) => {
                        if (res2.status == 201) {
                            return res.status(200).json(response);
                        } else {
                            return res.status(200).json({ status: false, message: "Echec d'envoi du sms" });
                        }
                    }).catch((err2: any) => {
                        console.error("ERROR 2", err2);
                        return res.status(200).json({ status: false, message: "Echec d'envoi du sms", error: err2 });
                    })
            }

        }).catch((err1: any) => {
            console.error("ERROR 1", err1);
            return res.status(200).json({ status: false, message: "Echec d'envoi du sms", error: err1 });
        });
}

export const calculateOtpExpiration = () => {
    const currentDate = new Date();
    const expirationDate = new Date(currentDate.getTime() + 2 * 60 * 1000);
    return expirationDate;
};