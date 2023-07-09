import { pino } from "pino";

import { Store } from "../lib/db";
import { UserScriptFavoriteStore } from "../lib/store";
import { MySql } from "./init";
import { userFavoriteSql } from "./init.sql";
import { ResultSetHeader } from "mysql2";

const log = pino();

@Store.register
export class UserScriptFavoriteSql extends MySql implements UserScriptFavoriteStore {
    protected async init() {
        try {
            await this.query(userFavoriteSql);
        } catch (error) {
            log.error(`Failed to create the user_favorites table. Error info: ${error}`);
        }
    }

    async favorite(userId: number, scriptUid: string): Promise<number> {
        try {
            const res: ResultSetHeader = await this.queryStruct(
                `
            INSERT INTO user_favorites (userId, scriptUid) 
            SELECT ?, ? 
            FROM DUAL 
            WHERE NOT EXISTS 
            (
                SELECT 1 
                FROM user_favorites 
                WHERE userId = ? AND scriptUid = ?
            )`,
                [userId, scriptUid, userId, scriptUid]
            );
            
            return res.affectedRows;
        } catch (error) {
            log.error(`Failed to favorite a script. Error info: ${error}`);
            throw new Error(`Failed to favorite a script. Error info: ${error}`);
        }
    }

    async unfavorite(userId: number, scriptUid: string): Promise<number> {
        try {
            const res: ResultSetHeader = await this.queryStruct(`DELETE FROM user_favorites WHERE userId=? AND scriptUid=?`, [userId, scriptUid]);
            
            return res.affectedRows;
        } catch (error) {
            log.error(`Failed to unfavorite a script. Error info: ${error}`);
            throw new Error(`Failed to unfavorite a script. Error info: ${error}`);
        }
    }
}
