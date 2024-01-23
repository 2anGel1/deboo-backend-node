import { ORANGE_ACCESS_TOKEN, ORANGE_GET_TOKEN_ENDPOINT, ORANGE_SEND_SMS_ENDPOINT } from "../config";
import { Request, Response } from 'express';
const axios = require("axios");


export const sendSms = async (res: Response, code: string, receiver: string) => {

    var result = true;
    await axios.post(ORANGE_GET_TOKEN_ENDPOINT, {
        grant_type: "client_credentials"
    },
        {
            headers: {
                "Authorization": ORANGE_ACCESS_TOKEN,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then((res1: any) => {
            if (res1.status == 200) {
                // console.log(res1.data);
                const access_token = res1.data.access_token;

                axios.post(ORANGE_SEND_SMS_ENDPOINT, {
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
                        console.log(res2.status);
                        if (res2.status != 201) {
                            result = false;
                        }

                    }).catch((err2: any) => {
                        console.error(err2.response.status);
                        result = false;
                    })
            }

        }).catch((err1: any) => {
            console.error(err1);
            result = false;
        });

    return result;
}

export const calculateOtpExpiration = () => {
    const currentDate = new Date();
    const hoursToAdd = 24;
    const expirationDate = new Date(currentDate.getTime() + 5 * 60 * 1000);
    return expirationDate;
  };