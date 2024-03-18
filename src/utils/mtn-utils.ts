import { ORANGE_ACCESS_TOKEN_TRANSACTION, prisma } from '../config';
import { Response } from 'express';
const axios = require("axios");

export const mtnSend = async (res: Response, data: any) => {
    console.log("START");


    var re = null;
    const fail = { status: false, message: "Echec du transfert. Contactez nous pour plus d'informations" };

    const apiUser = "f8745bc9-3d95-4e67-beed-bc7ae8236b0e";
    const key = "d3e09b8696f6430f8c53c76e702e9236";
    const host = "momodeveloper.mtn.com";

    await axios.post("https://momodeveloper.mtn.com/apiuser/" + apiUser + "/apikey",
        {
            "providerCallbackHost": "billetic.net"
        },
        {
            headers: {
                "Ocp-Apim-Subscription-Key": "d3e09b8696f6430f8c53c76e702e9236",
                // "X-Reference-Id": "c72025f5-5cd1-4630-99e4-8ba4722fad56",
                // "Host": "momodeveloper.mtn.com"
            }
        })
        .then(async (response: any) => {

            // await prisma.transaction.update({
            //     where: {
            //         id: data.transactionId
            //     },
            //     data: {
            //         sendReferences: response.data.id,
            //         sentAt: new Date(),
            //     }
            // });

            // re = { status: true, data: response.data, transactionId: data.transactionId };

        })
        .catch((error: any) => {
            console.log(error);

            re = error;
        })

    re = re == null ? fail : re;
    return re;


}
