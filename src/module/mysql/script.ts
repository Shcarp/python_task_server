import { pino } from "pino";

import { Store } from "../lib/db";
import { ScriptStore } from "../lib/store";
import { MySql } from "./init";
import { scriptSql } from "./init.sql";

const log = pino();

@Store.register
export class ScriptSql extends MySql implements ScriptStore {
    protected async init() {
        try {
            await this.query(scriptSql);
        } catch (error) {
            log.error(`Failed to create the scripts table. Error info: ${error}`);
        }
    }
    
}
