import { pino } from "pino";

import { Store } from "../lib/db";
import { ScriptStatStore } from "../lib/store";
import { MySql } from "./init";
import { scriptStatSql } from "./init.sql";

const log = pino();

@Store.register
export class ScriptStatSql extends MySql implements ScriptStatStore {
    protected async init() {
        try {
            await this.query(scriptStatSql);
        } catch (error) {
            log.error(`Failed to create the script_stats table. Error info: ${error}`);
        }
    }
    
}
