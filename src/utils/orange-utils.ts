import { ORANGE_ACCESS_TOKEN_TRANSACTION, prisma } from '../config';
import { Response } from 'express';
const axios = require("axios");

export const orangeSend = async (res: Response, data: any) => {


    var re = null;
    const fail = { status: false, message: "Echec du transfert. Contactez nous pour plus d'informations" };

    // Requête d'optention de l'access_token
    await axios.post("https://api.orange.com/oauth/v3/token", {
        grant_type: "client_credentials"
    },
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": ORANGE_ACCESS_TOKEN_TRANSACTION,
            }
        })
        .then(async (res1: any) => {

            if (res1.status == 201 || res1.status == 200) {

                const access_token = "Bearer " + res1.data.access_token;

                // Requête d'initialisation du transfert
                await axios.post("https://api.orange.com/orange-money-webpay/ci/v1/webpayment", {
                    "merchant_key": "b49c3135",
                    "currency": "XOF",
                    "order_id": data.transactionId,
                    "amount": data.amount,
                    "return_url": "http://www.merchant-example.org/return",
                    "cancel_url": "http://www.merchant-example.org/cancel",
                    "notif_url": "http://www.merchant-example.org/notif",
                    "reference": data.receiver,
                    "lang": "fr",
                }, {
                    headers: {
                        "Authorization": access_token,
                        "Cache-Control": "no-cache"
                    }
                })
                    .then(async (res2: any) => {
                        if (res2.status == 201 || res2.status == 200) {

                            const payment_url = res2.data.payment_url;

                            // Requête sur le guichet de paiement orange pour l'automatisation du transfert
                            await axios.get(payment_url).then(async (res3: any) => {
                                if (res3.status == 201 || res3.status == 200) {

                                    // Requête pour la première étape du flow sur le guichet (/charges)
                                    await axios.post("https://mpayment.orange-money.com/ci/mpayment/charges", {
                                        "Token": res2.data.pay_token,
                                        "Msisdn": data.sender
                                    }, {
                                        headers: {
                                            "Origin": "https://mpayment.orange-money.com",
                                            "Cookie": res3.headers["set-cookie"],
                                            "Host": "mpayment.orange-money.com",
                                            "Referer": payment_url,
                                        }
                                    }).then(async (res4: any) => {

                                        if (res4.status == 201 || res4.status == 200) {

                                            // Requête pour la seconde étape du flow sur le guichet (/finalize)
                                            await axios.post("https://mpayment.orange-money.com/ci/mpayment/finalize", {
                                                "Token": res2.data.pay_token,
                                                "Msisdn": data.sender,
                                                "Otp": data.otp,
                                                "Pos": "",
                                                "Em": ""
                                            }, {
                                                headers: {
                                                    "Origin": "https://mpayment.orange-money.com",
                                                    "Cookie": res3.headers["set-cookie"],
                                                    "Host": "mpayment.orange-money.com",
                                                    "Referer": payment_url,
                                                }
                                            }).then(async (res5: any) => {

                                                if (res5.status == 201 || res5.status == 200) {

                                                    await prisma.transaction.update({
                                                        where: {
                                                            id: data.transactionId
                                                        },
                                                        data: {
                                                            sendReferences: payment_url,
                                                            sentAt: new Date(),
                                                        }
                                                    });

                                                    re = { status: true, data: payment_url, transactionId: data.transactionId };

                                                } else {
                                                    re = fail;
                                                }

                                            }).catch((err5: any) => {
                                                re = { status: false, message: err5.response.data.description }
                                            });

                                        } else {
                                            re = fail;
                                        }

                                    }).catch((err4: any) => {
                                        re = fail;
                                    });

                                } else {
                                    re = fail;
                                }

                            }).catch((err3: any) => {
                                re = fail;
                            });

                        } else {
                            re = fail;
                        }
                    }).catch((err2: any) => {
                        re = fail
                    });
            }

        })
        .catch((error: any) => {
            re = { status: false, error: error }
        })

    re = re == null ? fail : re
    return re;

}
