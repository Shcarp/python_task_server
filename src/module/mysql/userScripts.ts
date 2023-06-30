import { pino } from "pino";

import { Store } from "../lib/db";
import { UserScriptStore } from "../lib/store";
import { MySql } from "./init";
import { userScriptSql } from "./init.sql";

const log = pino();

@Store.register
export class UserScriptSql extends MySql implements UserScriptStore {
    protected async init() {
        try {
            await this.query(userScriptSql);
        } catch (error) {
            log.error(`Failed to create the user_scripts table. Error info: ${error}`);
        }
    }
    
}
