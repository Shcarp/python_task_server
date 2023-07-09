import { FastifyReply, FastifyRequest } from "fastify";
import pino from "pino";
import { GetScriptListInfoParams, ScriptInfo } from "../../module/mysql";
import snowflake from "../../utils/snowflake";

const log = pino();

/**
 * 创建脚本
 * @param req 
 * @param rsp 
 */
export const handleCreate = async (req: FastifyRequest, rsp: FastifyReply) => {
    const data = req.body as Omit<ScriptInfo, "scriptUid">;
    const uuid = snowflake.nextId();
    try {
        // 新建一条记录
        await req.server.scriptSql.createScript({...data, scriptUid: uuid});
        // 在userScript表中插入一条记录
        await req.server.userScriptSql.createUserScript(req.userInfo.id, uuid);

        await req.server.scriptStatSql.insert(uuid);

        rsp.send({
            code: 0,
            msg: "Successfully create the script.",
            data: uuid,
        });
    } catch (error) {
        rsp.status(500).send({
            code: 1,
            msg: error,
        });
    }
}

export const handleGetList = async (req: FastifyRequest, rsp: FastifyReply) => {
    const data = req.query as GetScriptListInfoParams;
    try {
        const list = await req.server.scriptSql.getScriptList({...data, userId: req.userInfo.id});
        rsp.send({
            code: 0,
            msg: "Successfully get the script list.",
            data: list,
        });

    } catch (error) {
        rsp.status(500).send({
            code: 1,
            msg: error,
        });
    }
}

export const handleLike = async (req: FastifyRequest, rsp: FastifyReply) => {
    const id = req.userInfo.id;
    const { scriptUid } = req.query as { scriptUid: string };

    try {
        const res = await req.server.scriptLikeSql.like(id, scriptUid);
        if (res !== 0) {
            await req.server.scriptStatSql.update({ scriptUid, like: 1 });
        }
        rsp.send({
            code: 0,
            msg: "Successfully like the script.",
        });
    } catch (error) {
        rsp.status(500).send({
            code: 1,
            msg: error,
        });
    }
}

export const handleUnlike = async (req: FastifyRequest, rsp: FastifyReply) => {
    const id = req.userInfo.id;
    const { scriptUid } = req.query as { scriptUid: string };

    try {
        const res = await req.server.scriptLikeSql.unlike(id, scriptUid);
        if (res !== 0) {
            await req.server.scriptStatSql.update({ scriptUid, like: -1 });
        }
        rsp.send({
            code: 0,
            msg: "Successfully dislike the script.",
        });
    } catch (error) {
        rsp.status(500).send({
            code: 1,
            msg: error,
        });
    }
}

export const handleFavorite = async (req: FastifyRequest, rsp: FastifyReply) => {
    const id = req.userInfo.id;
    const { scriptUid } = req.query as { scriptUid: string };

    try {
        const res = await req.server.userScriptFavoriteSql.favorite(id, scriptUid);
        if (res !== 0) 
            await req.server.scriptStatSql.update({ scriptUid, favorite: 1 });
        rsp.send({
            code: 0,
            msg: "Successfully favorites the script.",
        });
    } catch (error) {
        rsp.status(500).send({
            code: 1,
            msg: error,
        });
    }
}

export const handleUnFavorite = async (req: FastifyRequest, rsp: FastifyReply) => {
    const id = req.userInfo.id;
    const { scriptUid } = req.query as { scriptUid: string };

    try {
        const res = await req.server.userScriptFavoriteSql.unfavorite(id, scriptUid);
        if (res !== 0)
            await req.server.scriptStatSql.update({ scriptUid, favorite: -1 });
        rsp.send({
            code: 0,
            msg: "Successfully unfavorite the script.",
        });
    } catch (error) {
        rsp.status(500).send({
            code: 1,
            msg: error,
        });
    }
}

export const handleGetDetail = async (req: FastifyRequest, res: FastifyReply) => {
    const id = req.userInfo.id;
    const { scriptUid } = req.query as { scriptUid: string };

    try {
        const detail = await req.server.scriptSql.getScriptInfoByUid(id, scriptUid);
        res.send({
            code: 0,
            msg: "Successfully get the script detail.",
            data: detail,
        });
    } catch (error) {
        res.status(500).send({
            code: 1,
            msg: error,
        });
    }
}

export const handleUpdateScriptVersion = async (req: FastifyRequest, rsp: FastifyReply) => {
    const data = req.body as ScriptInfo;
    try {
        await req.server.scriptSql.createScript(data);
        rsp.send({
            code: 0,
            msg: "Successfully update the script version.",
        });
    } catch (error) {
        rsp.status(500).send({
            code: 1,
            msg: error,
        });
    }
}



export const handleGetUserUploadList = async (req: FastifyRequest, rsp: FastifyReply) => {
    const data = req.query as GetScriptListInfoParams;
    try {
        const list = await req.server.scriptSql.getScriptListByUserId({...data, userId: req.userInfo.id});
        rsp.send({
            code: 0,
            msg: "Successfully get the script list.",
            data: list,
        });

    } catch (error) {
        rsp.status(500).send({
            code: 1,
            msg: error,
        });
    }
}

export const handleGetUserLikeList = async (req: FastifyRequest, rsp: FastifyReply) => {
    const data = req.query as GetScriptListInfoParams;
    try {
        const list = await req.server.scriptSql.getUserLikeScriptList({...data, userId: req.userInfo.id});
        rsp.send({
            code: 0,
            msg: "Successfully get the script list.",
            data: list,
        });

    } catch (error) {
        rsp.status(500).send({
            code: 1,
            msg: error,
        });
    }
}

export const handleGetUserFavoriteList = async (req: FastifyRequest, rsp: FastifyReply) => {
    const data = req.query as GetScriptListInfoParams;
    try {
        const list = await req.server.scriptSql.getUserFavoriteScriptList({...data, userId: req.userInfo.id});
        rsp.send({
            code: 0,
            msg: "Successfully get the script list.",
            data: list,
        });

    } catch (error) {
        rsp.status(500).send({
            code: 1,
            msg: error,
        });
    }
}
