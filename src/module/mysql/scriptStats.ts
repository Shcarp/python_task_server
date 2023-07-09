import { pino } from "pino";

import { Store } from "../lib/db";
import { ScriptStatStore } from "../lib/store";
import { MySql } from "./init";
import { scriptStatSql } from "./init.sql";

const log = pino();

export interface ScriptStatInfo {
    scriptUid: string;
    like?: number;
    favorite?: number;
}

@Store.register
export class ScriptStatSql extends MySql implements ScriptStatStore {
    protected async init() {
        try {
            await this.query(scriptStatSql);
        } catch (error) {
            log.error(`Failed to create the script_stats table. Error info: ${error}`);
        }
    }

    async insert(uid: string) {
        const sql = `INSERT INTO script_stats (scriptUid, likes, favorites)
        VALUES (${uid}, 0, 0);
        `;

        try {
            await this.query(sql);
            log.info(`Successfully insert a script_stat`);
        } catch (error) {
            log.error(`Failed to insert a script_stat. Error info: ${error}`);
            throw new Error(`Failed to insert a script_stat. Error info: ${error}`);
        }
    }

    async update(params: ScriptStatInfo) {
        const queryParam = [];
        let sql = `UPDATE script_stats SET `;
        if (params.like) {
            sql += `likes = likes + ? `;
            queryParam.push(params.like);
        }
        if (params.favorite) {
            sql += `favorites = favorites + ? `;
            queryParam.push(params.favorite);
        }

        sql += `WHERE scriptUid = ?`;
        queryParam.push(params.scriptUid);

        try {
            await this.queryStruct(sql, queryParam);
            log.info(`Successfully update a script_stat`);
        } catch (error) {
            log.error(`Failed to update a script_stat. Error info: ${error}`);
            throw new Error(`Failed to update a script_stat. Error info: ${error}`);
        }

    }
}
