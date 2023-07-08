import { pino } from "pino";

import { Store } from "../lib/db";
import { UserScriptLikeStore } from "../lib/store";
import { MySql } from "./init";

const log = pino();

@Store.register
export class UserScriptLikeSql extends MySql implements UserScriptLikeStore {
    protected async init() {
        try {
            // await this.query(userFavoriteSql);
        } catch (error) {
            log.error(`Failed to create the user_favorites table. Error info: ${error}`);
        }
    }
    
    async like(userId: number, scriptUid: string): Promise<void> {
        try {
            await this.queryStruct(`
                INSERT INTO user_likes (userId, scriptUid) 
                SELECT ?, ? 
                FROM DUAL 
                WHERE NOT EXISTS 
                (
                    SELECT 1 
                    FROM user_likes 
                    WHERE userId = ? AND scriptUid = ?
                )`, [userId, scriptUid, userId, scriptUid]);
        } catch (error) {
            log.error(`Failed to like a script. Error info: ${error}`);
            throw new Error(`Failed to like a script. Error info: ${error}`);
        }
    }

    async unlike(userId: number, scriptUid: string): Promise<void> {
        try {
            await this.queryStruct(`DELETE FROM user_likes WHERE userId=? AND scriptUid=?`, [userId, scriptUid]);
        } catch (error) {
            log.error(`Failed to unlike a script. Error info: ${error}`);
            throw new Error(`Failed to unlike a script. Error info: ${error}`);
        }
    }
}
