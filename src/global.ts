
import { MessageSql, UserSql } from "./module/mysql";
import { sendMail } from "./utils/email";
import { Redis, RedisUser, RedisVerifyCode } from "./module/redis";

declare module "fastify" {
    export interface FastifyInstance {
        userSql: UserSql;
        messageSql: MessageSql;
    }

    export interface FastifyRequest {
        userSql: UserSql;
        messageSql: MessageSql;
        verifyCodeRedis: RedisVerifyCode;
        userRedis: RedisUser;
    }
    export interface FastifyReply {
      sendMail: typeof sendMail;
    }

}

