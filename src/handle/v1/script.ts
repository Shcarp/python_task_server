import { FastifyReply, FastifyRequest } from "fastify";
import pino from "pino";
import { GetScriptListInfoParams, ScriptInfo } from "../../module/mysql";
import snowflake from "../../utils/snowflake";

const log = pino();

export const handleCreate = async (req: FastifyRequest, res: FastifyReply) => {
    const data = req.body as Omit<ScriptInfo, "scriptUid">;
    const uuid = snowflake.nextId();
    try {
        // 新建一条记录
        await req.server.scriptSql.createScript({...data, scriptUid: uuid});
        // 在userScript表中插入一条记录
        await req.server.userScriptSql.createUserScript(req.userInfo.id, uuid);

        await req.server.scriptStatSql.insert(uuid);

        res.send({
            code: 0,
            msg: "Successfully create the script.",
            data: uuid,
        });
    } catch (error) {
        res.status(500).send({
            code: 1,
            msg: error,
        });
    }
}

export const handleGetList = async (req: FastifyRequest, res: FastifyReply) => {
    const data = req.query as GetScriptListInfoParams;
    try {
        const list = await req.server.scriptSql.getScriptList({...data, userId: req.userInfo.id});
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

export const handleLike = async (req: FastifyRequest, res: FastifyReply) => {
    const id = req.userInfo.id;
    const { scriptUid } = req.query as { scriptUid: string };

    try {
        await req.server.scriptLikeSql.like(id, scriptUid);
        res.send({
            code: 0,
            msg: "Successfully like the script.",
        });
    } catch (error) {
        res.status(500).send({
            code: 1,
            msg: error,
        });
    }
}

export const handleUnlike = async (req: FastifyRequest, res: FastifyReply) => {
    const id = req.userInfo.id;
    const { scriptUid } = req.query as { scriptUid: string };

    try {
        await req.server.scriptLikeSql.unlike(id, scriptUid);
        res.send({
            code: 0,
            msg: "Successfully dislike the script.",
        });
    } catch (error) {
        res.status(500).send({
            code: 1,
            msg: error,
        });
    }
}

export const handleFavorite = async (req: FastifyRequest, res: FastifyReply) => {
    const id = req.userInfo.id;
    const { scriptUid } = req.query as { scriptUid: string };

    try {
        await req.server.userScriptFavoriteSql.favorite(id, scriptUid);
        res.send({
            code: 0,
            msg: "Successfully favorites the script.",
        });
    } catch (error) {
        res.status(500).send({
            code: 1,
            msg: error,
        });
    }
}

export const handleUnFavorite = async (req: FastifyRequest, res: FastifyReply) => {
    const id = req.userInfo.id;
    const { scriptUid } = req.query as { scriptUid: string };

    try {
        await req.server.userScriptFavoriteSql.unfavorite(id, scriptUid);
        res.send({
            code: 0,
            msg: "Successfully unfavorite the script.",
        });
    } catch (error) {
        res.status(500).send({
            code: 1,
            msg: error,
        });
    }
}

export const handleGetDetail = async (req: FastifyRequest, res: FastifyReply) => {
}
