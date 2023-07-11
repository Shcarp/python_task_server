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
            updated_at,
            delete_flag
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), 0)`;

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

        let insert: any = [param.userId, param.userId];

        let sql = `
        SELECT s.*, ss.likes AS likes, ss.favorites AS favorites, 
        CASE 
            WHEN uf.scriptUid IS NOT NULL THEN 1 
            ELSE 0 
        END AS isFavorite, 
        CASE 
            WHEN ul.scriptUid IS NOT NULL THEN 1 
            ELSE 0 
        END AS isLike 
        FROM scripts s 
        LEFT JOIN (
            SELECT scriptUid, MAX(created_at) AS max_created_at 
            FROM scripts 
            WHERE delete_flag = 0 AND scriptVisibility = 1 
            GROUP BY scriptUid
        ) sub ON s.scriptUid = sub.scriptUid AND s.created_at = sub.max_created_at 
        LEFT JOIN user_favorites uf ON s.scriptUid = uf.scriptUid AND uf.userId = ?
        LEFT JOIN user_likes ul ON s.scriptUid = ul.scriptUid AND ul.userId = ? 
        LEFT JOIN script_stats ss ON s.scriptUid = ss.scriptUid 
        WHERE sub.max_created_at IS NOT NULL 
        `;

        if (param.keyword) {
            sql += ` AND s.scriptName LIKE ?`;
            insert.push(`%${keyword}%`);
        }
        if (param.scriptModule) {
            sql += ` AND s.scriptModule = ?`;
            insert.push(param.scriptModule);
        }
        if (param.scriptUid) {
            sql += ` AND s.scriptUid = ?`;
            insert.push(param.scriptUid);
        }

        if (param.scriptPlatformId || param.scriptPlatformId === 0) {
            sql += ` AND s.scriptPlatformId =?`;
            insert.push(param.scriptPlatformId);
        }

        sql += ` ORDER BY ${LIKE_WEIGHT} * ss.likes + ${FAV_WEIGHT} * ss.favorites DESC`;
        sql += ` LIMIT ? OFFSET ?`;

        insert.push(param.pageSize);
        insert.push(offset);

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
    async getScriptInfoByUid(userID: number, scriptUid: string) {
        const sql = `
        SELECT 
            s.scriptUid, 
            s.scriptName, 
            s.scriptDescription,
            s.scriptDetailedDescription, 
            s.scriptVisibility, 
            ss.likes AS likes,
            ss.favorites AS favorites,
            CASE 
                WHEN uf.scriptUid IS NOT NULL THEN 1 ELSE 0 
            END AS isFavorite,
            CASE 
                WHEN ul.scriptUid IS NOT NULL THEN 1 ELSE 0 
            END AS isLike,
            temp.items
        FROM (
            SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'scriptId', scriptId,
                    'scriptName', scriptName,
                    'scriptVersion', scriptVersion,
                    'scriptKey', scriptKey,
                    'scriptModule', scriptModule,
                    'scriptConfigText', scriptConfigText, 
                    'scriptPlatformId', scriptPlatformId, 
                    'created_at', created_at,
                    'updated_at', updated_at
                    )
                ) AS items
            FROM scripts WHERE scriptUid = ? ORDER BY created_at DESC
        ) AS temp
            JOIN scripts s ON s.scriptUid = ?
            LEFT JOIN user_favorites uf ON s.scriptUid = uf.scriptUid 
            AND uf.userId = ?
            LEFT JOIN user_likes ul ON s.scriptUid = ul.scriptUid 
            AND ul.userId = ?
            LEFT JOIN script_stats ss ON s.scriptUid = ss.scriptUid
        ORDER BY 
            s.created_at DESC
            LIMIT 1`;

        console.log([scriptUid, scriptUid, userID, userID]);

        try {
            const result = await this.queryStruct(sql, [scriptUid, scriptUid, userID, userID]);
            return result[0] as ScriptInfo;
        } catch (error) {
            log.error(`Failed to get script info by uid. Error info: ${error}`);
            throw new Error(`Failed to get script info by uid. Error info: ${error}`);
        }
    }

    /**
     * 通过userId获取脚本列表, 用户自己的脚本
     */
    async getScriptListByUserId(param: GetScriptListInfoParams & { userId: number }) {
        const keyword = param.keyword || "";
        const offset = (param.current - 1) * param.pageSize;

        let insert: any = [];

        let addSql = ``;

        if (param.keyword) {
            addSql += ` AND scriptName LIKE ?`;
            insert.push(`%${keyword}%`);
        }
        if (param.scriptModule) {
            addSql += ` AND scriptModule = ?`;
            insert.push(param.scriptModule);
        }
        if (param.scriptUid) {
            addSql += ` AND scriptUid = ?`;
            insert.push(param.scriptUid);
        }

        if (param.scriptPlatformId || param.scriptPlatformId === 0) {
            addSql += ` AND scriptPlatformId =?`;
            insert.push(param.scriptPlatformId);
        }

        let sql = `
        SELECT
            s.*,
            ss.likes AS likes,
            ss.favorites AS favorites 
        FROM
            user_scripts us
            LEFT JOIN scripts s ON s.scriptUid = us.scriptUid
            LEFT JOIN ( SELECT scriptUid, MAX( created_at ) AS max_created_at FROM scripts WHERE delete_flag = 0 ${addSql} GROUP BY scriptUid LIMIT ? OFFSET ? ) sub ON s.scriptUid = sub.scriptUid 
            AND s.created_at = sub.max_created_at
            LEFT JOIN script_stats ss ON s.scriptUid = ss.scriptUid 
        WHERE
            userId = ?
            AND sub.max_created_at IS NOT NULL`;
        insert.push(param.pageSize);
        insert.push(offset);
        insert.push(param.userId);

        try {
            const result = await this.queryStruct(sql, insert);
            return result as ScriptInfo[];
        } catch (error) {
            log.error(`Failed to get script list. Error info: ${error}`);
            throw new Error(`Failed to get script list. Error info: ${error}`);
        }
    }
    async getUserLikeScriptList(param: GetScriptListInfoParams & { userId: number }) {
        const keyword = param.keyword || "";
        const offset = (param.current - 1) * param.pageSize;

        let insert: any = [];

        let addSql = ``;

        if (param.keyword) {
            addSql += ` AND scriptName LIKE ?`;
            insert.push(`%${keyword}%`);
        }
        if (param.scriptModule) {
            addSql += ` AND scriptModule = ?`;
            insert.push(param.scriptModule);
        }
        if (param.scriptUid) {
            addSql += ` AND scriptUid = ?`;
            insert.push(param.scriptUid);
        }

        if (param.scriptPlatformId || param.scriptPlatformId === 0) {
            addSql += ` AND scriptPlatformId =?`;
            insert.push(param.scriptPlatformId);
        }

        let sql = `
        SELECT
            s.*,
            ss.likes AS likes,
            ss.favorites AS favorites 
        FROM
            user_likes ul
            LEFT JOIN scripts s ON s.scriptUid = ul.scriptUid
            LEFT JOIN ( SELECT scriptUid, MAX( created_at ) AS max_created_at FROM scripts WHERE delete_flag = 0 ${addSql} GROUP BY scriptUid LIMIT ? OFFSET ? ) sub ON s.scriptUid = sub.scriptUid 
            AND s.created_at = sub.max_created_at
            LEFT JOIN script_stats ss ON s.scriptUid = ss.scriptUid 
        WHERE
            userId = ?
            AND sub.max_created_at IS NOT NULL`;
        insert.push(param.pageSize);
        insert.push(offset);
        insert.push(param.userId);

        try {
            const result = await this.queryStruct(sql, insert);
            return result as ScriptInfo[];
        } catch (error) {
            log.error(`Failed to get script list. Error info: ${error}`);
            throw new Error(`Failed to get script list. Error info: ${error}`);
        }
    }
    async getUserFavoriteScriptList(param: GetScriptListInfoParams & { userId: number }) {
        const keyword = param.keyword || "";
        const offset = (param.current - 1) * param.pageSize;

        let insert: any = [];

        let addSql = ``;

        if (param.keyword) {
            addSql += ` AND scriptName LIKE ?`;
            insert.push(`%${keyword}%`);
        }
        if (param.scriptModule) {
            addSql += ` AND scriptModule = ?`;
            insert.push(param.scriptModule);
        }
        if (param.scriptUid) {
            addSql += ` AND scriptUid = ?`;
            insert.push(param.scriptUid);
        }

        if (param.scriptPlatformId || param.scriptPlatformId === 0) {
            addSql += ` AND scriptPlatformId =?`;
            insert.push(param.scriptPlatformId);
        }

        let sql = `
        SELECT
            s.*,
            ss.likes AS likes,
            ss.favorites AS favorites 
        FROM
            user_favorites uf
            LEFT JOIN scripts s ON s.scriptUid = uf.scriptUid
            LEFT JOIN ( SELECT scriptUid, MAX( created_at ) AS max_created_at FROM scripts WHERE delete_flag = 0 ${addSql} GROUP BY scriptUid LIMIT ? OFFSET ? ) sub ON s.scriptUid = sub.scriptUid 
            AND s.created_at = sub.max_created_at
            LEFT JOIN script_stats ss ON s.scriptUid = ss.scriptUid 
        WHERE
            userId = ?
            AND sub.max_created_at IS NOT NULL`;
        insert.push(param.pageSize);
        insert.push(offset);
        insert.push(param.userId);

        try {
            const result = await this.queryStruct(sql, insert);
            return result as ScriptInfo[];
        } catch (error) {
            log.error(`Failed to get script list. Error info: ${error}`);
            throw new Error(`Failed to get script list. Error info: ${error}`);
        }
    }
}
