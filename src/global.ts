import { sendMail } from "./utils/email";
import { UserInfo } from "./type";
import { MessageStore, UserStore } from "./module/lib/store";
import { RoomCache, UserCache, VerifyCodeCache } from "./module/lib/cache";

declare module "fastify" {
    export interface FastifyInstance {
        userSql: UserStore;
        messageSql: MessageStore;
        sendMail: typeof sendMail;
        verifyCodeRedis: VerifyCodeCache;
        userRedis: UserCache;
        roomRedis: RoomCache;
    }

    export interface FastifyRequest {
        userInfo: UserInfo;
    }
}

