import { pino } from "pino";

import { Store } from "../lib/db";
import { PlatformStore } from "../lib/store";
import { MySql } from "./init";
import { platformSql } from "./init.sql";
import { PlatformInfo } from "./userScripts";


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

    async getPlatformList(): Promise<PlatformInfo[]> {
        // 别名
        const sql = `SELECT id as platformId, name as platformName FROM platforms;`;
        try {
            return await this.query(sql) as PlatformInfo[];
        } catch (error) {
            log.error(`Failed to get the platform list. Error info: ${error}`);
            throw new Error(`Failed to get the platform list. Error info: ${error}`);
        }
    }
}
