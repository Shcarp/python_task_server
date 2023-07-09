import { pino } from "pino";

import { Store } from "../lib/db";
import { UserScriptStore } from "../lib/store";
import { MySql } from "./init";
import { userScriptSql } from "./init.sql";

const log = pino();

export interface PlatformInfo {
    platformId: number;
    platformName: string;
}

@Store.register
export class UserScriptSql extends MySql implements UserScriptStore {
    protected async init() {
        try {
            await this.query(userScriptSql);
        } catch (error) {
            log.error(`Failed to create the user_scripts table. Error info: ${error}`);
        }
    }

    async createUserScript(userId: number, scriptUid: string): Promise<void> {
        const sql = `INSERT INTO user_scripts (userId, scriptUid, created_at) values (${userId}, ${scriptUid}, NOW());`

        try {
            await this.query(sql);
            log.info(`Successfully insert a user_script: ${userId} ${scriptUid}`)
        }
        catch (error) {
            log.error(`Failed to insert a user_script. Error info: ${error}`);
            throw new Error(`Failed to insert a user_script. Error info: ${error}`);
        }
    }
}
