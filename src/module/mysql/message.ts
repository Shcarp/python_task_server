import { pino } from "pino";

import { MySql } from "./init";
import { messagesql } from "./init.sql";

const log = pino();

export class MessageSql extends MySql {
    protected async init() {
        try {
            await this.query(messagesql);
        } catch (error) {
            log.error(`Failed to create the av_chat_messages table. Error info: ${error}`);
        }
    }
}
