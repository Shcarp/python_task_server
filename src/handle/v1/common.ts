import { FastifyReply, FastifyRequest } from "fastify";


export const handlePlatformOptions = async (req: FastifyRequest, res: FastifyReply) => {
    try {
        const list = await req.server.platformSql.getPlatformList();
        res.send({
            code: 0,
            msg: "Successfully get the script list.",
            data: list,
        });

    } catch (error) {
        res.status(500).send({
            code: 1,
            msg: error,
        });
    }
}
