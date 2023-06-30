import { pino } from "pino";

import { Store } from "../lib/db";
import { PlatformStore } from "../lib/store";
import { MySql } from "./init";
import { platformSql } from "./init.sql";


const log = pino();

@Store.register
export class PlatformSql extends MySql implements PlatformStore {
    protected async init() {
        try {
            await this.query(platformSql);
        } catch (error) {
            log.error(`Failed to create the platforms table. Error info: ${error}`);
        }
    }
    
}
