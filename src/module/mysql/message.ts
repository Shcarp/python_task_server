import { pino } from "pino";

import { MySql } from "./init";
import { messagesql } from "./init.sql";
import { Store } from "../lib/db";
import { MessageStore } from "../lib/store";

const log = pino();

@Store.register
export class MessageSql extends MySql implements MessageStore {
    protected async init() {
        try {
            await this.query(messagesql);
        } catch (error) {
            log.error(`Failed to create the av_chat_messages table. Error info: ${error}`);
        }
    }

    // 获取所有信息
    public async getAllMessage() {
        const sql = `SELECT * FROM av_chat_messages`;
        try {
            const result = await this.query(sql);
            return result;
        } catch (error) {
            log.error(`Failed to get all messages. Error info: ${error}`);
            return null;
        }
    }
}
