import fastify from "fastify";
import jwt from "@fastify/jwt";
import split from "split2";

import "./global";
// 需要这两个，不加，编译后的代码中，没有这两个文件，导致注册不成功
import "./module/mysql"
import "./module/redis"

import { Cache, Store } from "./module/lib/db";

import checkLogin from "./middleware/checkLogin";
import setUserInfo from "./middleware/setUserInfo";
import commonRouter from "./routes/v1/common";
import userRouter from "./routes/v1/user";
import scriptRouter from "./routes/v1/script";

const stream = split(JSON.parse)

const app = fastify({ logger: {
    level: "error",
    stream: stream
}});

app.decorate("userStore", Store.get("UserSql"));
app.decorate("platformSql", Store.get("PlatformSql"));
app.decorate("scriptSql", Store.get("ScriptSql"));
app.decorate("userScriptSql", Store.get("UserScriptSql"));
app.decorate("userScriptFavoriteSql", Store.get("UserScriptFavoriteSql"));
app.decorate("scriptStatSql", Store.get("ScriptStatSql"));
app.decorate("scriptLikeSql", Store.get("UserScriptLikeSql"));
app.decorate("userCache", Cache.get("RedisUser"));

app.addSchema({
    $id: "opt/200",
    type: "object",
    properties: {
        code: { type: "number" },
        msg: { type: "string" },
    },
});

app.addSchema({
    $id: "v1/userInfo",
    type: "object",
    properties: {
        username: { type: "string" },
        password: { type: "string" },
        email: { type: "string" },
        id: { type: "number" },
        profile_picture: { type: "string" },
    },
});

app.register(jwt, { secret: "supersecret" });
 
app.register(checkLogin);
app.register(setUserInfo);

app.register(commonRouter, { prefix: "/v1" })
app.register(userRouter, { prefix: "/v1" });
app.register(scriptRouter, { prefix: "/v1" });


const start = async () => {
    try {
        await app.listen({ host: "0.0.0.0", port: 3306 });
        console.log("server start: http://localhost:3306");
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();

