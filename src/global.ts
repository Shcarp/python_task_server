
import { MessageSql, UserSql } from "./module/mysql";
import { sendMail } from "./utils/email";
import { RedisUser, RedisVerifyCode } from "./module/redis";

declare module "fastify" {
    export interface FastifyInstance {
        userSql: UserSql;
        messageSql: MessageSql;
        sendMail: typeof sendMail;
        verifyCodeRedis: RedisVerifyCode;
        userRedis: RedisUser;
    }
}

