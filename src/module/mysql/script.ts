import { pino } from "pino";

import { Store } from "../lib/db";
import { ScriptStore } from "../lib/store";
import { MySql } from "./init";
import { scriptSql } from "./init.sql";

const ALL_WEIGHT = Number(process.env.WEIGHT_LIKE) + Number(process.env.WEIGHT_FAVORITE);

// 计算且保留两位小数
const LIKE_WEIGHT = (Number(process.env.WEIGHT_LIKE) / ALL_WEIGHT).toFixed(2);
const FAV_WEIGHT = (Number(process.env.WEIGHT_FAVORITE) / ALL_WEIGHT).toFixed(2);

const log = pino();
export interface ScriptInfo {
    scriptUid: string;
    scriptModule: string;
    scriptVersion: string;
    scriptName: string;
    scriptKey: string;
    scriptDescription: string;
    scriptDetailedDescription: string;
    scriptConfigText: string;
    scriptPlatformId: number;
    scriptVisibility: number;
    likes: number;
    favorites: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface GetScriptListInfoParams {
    keyword?: string;
    scriptModule?: string;
    scriptUid?: string;
    scriptPlatformId?: number;
    current: number;
    pageSize: number;
}

@Store.register
export class ScriptSql extends MySql implements ScriptStore {
    protected async init() {
        try {
            await this.query(scriptSql);
        } catch (error) {
            log.error(`Failed to create the scripts table. Error info: ${error}`);
        }
    }

    async createScript(content: ScriptInfo) {
        const sql = `INSERT INTO scripts (
            scriptUid, 
            scriptVersion, 
            scriptName, 
            scriptModule, 
            scriptKey, 
            scriptDescription, 
            scriptDetailedDescription, 
            scriptConfigText, 
            scriptPlatformId, 
            scriptVisibility, 
            created_at, 
            updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

        try {
            await this.queryStruct(sql, [
                content.scriptUid,
                content.scriptVersion,
                content.scriptName,
                content.scriptModule,
                content.scriptKey,
                content.scriptDescription,
                content.scriptDetailedDescription,
                content.scriptConfigText,
                content.scriptPlatformId,
                content.scriptVisibility,
            ]);
            log.info(`Successfully insert a script: ${content.scriptName}`);
        } catch (error) {
            log.error(`Failed to insert a script. Error info: ${error}`);
            throw new Error(`Failed to insert a script. Error info: ${error}`);
        }
    }

    async getScriptList(param: GetScriptListInfoParams & { userId: number }) {
        const keyword = param.keyword || "";
        const offset = (param.current - 1) * param.pageSize;

        let insert = [];

        let sql = `SELECT s.*,ss.likes as likes, ss.favorites AS favorites, 
                   CASE WHEN uf.scriptUid IS NOT NULL THEN 1 ELSE 0 END AS isFavorite,
                   case WHEN ul.scriptUid IS NOT NULL THEN 1 ELSE 0 END AS isLike
                   FROM scripts s`;

        if (
            param.keyword ||
            param.scriptModule ||
            param.scriptUid ||
            param.scriptPlatformId ||
            param.scriptPlatformId === 0
        ) {
            sql += ` WHERE`;
            if (param.keyword) {
                sql += ` scriptName LIKE '%?%'`;
                insert.push(keyword);
            }
            if (param.scriptModule) {
                if (param.keyword) sql += ` AND`;
                sql += ` scriptModule = ?`;
                insert.push(param.scriptModule);
            }
            if (param.scriptUid) {
                if (param.keyword || param.scriptModule) sql += ` AND`;
                sql += ` scriptUid = ?`;
                insert.push(param.scriptUid);
            }

            if (param.scriptPlatformId || param.scriptPlatformId === 0) {
                if (param.keyword || param.scriptModule || param.scriptUid) sql += ` AND`;
                sql += ` scriptPlatformId =?`;
                insert.push(param.scriptPlatformId);
            }
        }

        sql += ` LEFT JOIN (
            SELECT scriptUid, MAX(created_at) AS max_created_at
            FROM scripts
            GROUP BY scriptUid
          ) sub ON s.scriptUid = sub.scriptUid AND s.created_at = sub.max_created_at`;

        sql += ` LEFT JOIN user_favorites uf ON s.scriptUid = uf.scriptUid AND uf.userId = ?`;
        sql += ` LEFT JOIN user_likes ul ON s.scriptUid = ul.scriptUid AND ul.userId = ?`;
        sql += ` LEFT JOIN script_stats ss ON s.scriptUid = ss.scriptUid`;
        sql += ` ORDER BY ${LIKE_WEIGHT} * ss.likes + ${FAV_WEIGHT} * ss.favorites DESC`;
        sql += ` LIMIT ? OFFSET ?`;

        insert = insert.concat([param.userId, param.userId, param.pageSize, offset]);

        try {
            const result = await this.queryStruct(sql, insert);
            return result as ScriptInfo[];
        } catch (error) {
            log.error(`Failed to get script list. Error info: ${error}`);
            throw new Error(`Failed to get script list. Error info: ${error}`);
        }
    }

    /**
     * 通过 scriptUid 获取脚本信息
     * 获取最后一次更新的脚本信息
     * @param scriptUid string
     * @returns
     */
    async getScriptInfoByUid(scriptUid: string) {
        const sql = `SELECT * FROM scripts WHERE scriptUid = ? ORDER BY created_at DESC LIMIT 1`;

        try {
            const result = await this.queryStruct(sql, [scriptUid]);
            return result[0] as ScriptInfo;
        } catch (error) {
            log.error(`Failed to get script info by uid. Error info: ${error}`);
            throw new Error(`Failed to get script info by uid. Error info: ${error}`);
        }
    }
}
