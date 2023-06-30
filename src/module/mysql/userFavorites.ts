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
    
}
