import { pino } from "pino";

import { Store } from "../lib/db";
import { UserScriptFavoriteStore } from "../lib/store";
import { MySql } from "./init";
import { userFavoriteSql } from "./init.sql";

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

    async favorite(userId: number, scriptUid: string): Promise<void> {
        try {
            await this.queryStruct(`INSERT INTO user_favorites (userId, scriptUid) values (?, ?)`, [userId, scriptUid]);
        } catch (error) {
            log.error(`Failed to favorite a script. Error info: ${error}`);
            throw new Error(`Failed to favorite a script. Error info: ${error}`);
        }
    }

    async unfavorite(userId: number, scriptUid: string): Promise<void> {
        try {
            await this.queryStruct(`DELETE FROM user_favorites WHERE userId=? AND scriptUid=?`, [userId, scriptUid]);
        } catch (error) {
            log.error(`Failed to unfavorite a script. Error info: ${error}`);
            throw new Error(`Failed to unfavorite a script. Error info: ${error}`);
        }
    }
    
}
