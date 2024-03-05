import { Request, Response } from 'express';
import { prisma } from "../config";


export const seed = async (req: Request, res: Response) => {
    const data = [
        {
            label: "Moov Money",
            image: "Moov",
            code: "moov",
            fee: 1
        },
        {
            label: "Mtn Money (MoMo)",
            image: "Mtn",
            code: "mtn",
            fee: 1
        },
        {
            label: "Orange Money",
            image: "Orange",
            code: "orange",
            fee: 1
        },
        {
            label: "Wave Mobile Money",
            image: "Wave",
            code: "wave",
            fee: 1
        }
    ];

    data.forEach(async (operator) => {
        const existingOperator = await prisma.operator.findFirst({
            where: {
                OR: [
                    { image: operator.image },
                    { label: operator.label },
                    { code: operator.code }
                ]
            }
        });

        if (!existingOperator) {
            await prisma.operator.create({
                data: operator
            });
        }
    });

    return res.json({ status: true, message: "Ok" });
}

export const all = async (req: Request, res: Response) => {

    const operators = await prisma.operator.findMany();
    return res.json({ status: true, data: operators });

}