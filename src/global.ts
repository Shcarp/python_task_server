import { sendMail } from "./utils/email";
import { UserInfo } from "./type";
import { MessageStore, UserStore } from "./module/lib/store";
import { RoomCache, UserCache, VerifyCodeCache } from "./module/lib/cache";

declare module "fastify" {
    export interface FastifyInstance {
        userStore: UserStore;
        messageStore: MessageStore;
        sendMail: typeof sendMail;
        verifyCodeCache: VerifyCodeCache;
        userCache: UserCache;
        roomCache: RoomCache;
    }

    export interface FastifyRequest {
        userInfo: UserInfo;
    }
}

