import { sendMail } from "./utils/email";
import { UserInfo } from "./type";
import {
    UserStore,
    PlatformStore,
    UserScriptFavoriteStore,
    UserScriptStore,
    ScriptStatStore,
    ScriptStore,
} from "./module/lib/store";
import { UserCache } from "./module/lib/cache";

declare module "fastify" {
    export interface FastifyInstance {
        userStore: UserStore;
        platformSql: PlatformStore;
        scriptSql: ScriptStore;
        userScriptSql: UserScriptStore;
        userScriptFavoriteSql: UserScriptFavoriteStore;
        scriptStatSql: ScriptStatStore;
        userCache: UserCache;
    }

    export interface FastifyRequest {
        userInfo: UserInfo;
    }
}
