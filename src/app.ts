import fastify from "fastify";
import jwt from "@fastify/jwt";
import split from "split2";

import "./global";
// 需要这两个，不加，编译后的代码中，没有这两个文件，导致注册不成功
import "./module/mysql"
import "./module/redis"

import { sendMail } from "./utils/email";
import { Cache, Store } from "./module/lib/db";

import checkLogin from "./middleware/checkLogin";
import setUserInfo from "./middleware/setUserInfo";
import userRouter from "./routes/v1/user";
import roomRouter from "./routes/v1/room";

const stream = split(JSON.parse)

const app = fastify({ logger: {
    level: "error",
    stream: stream
}});

app.decorate("userSql", Store.get("UserSql"));
app.decorate("messageSql", Store.get("MessageSql"));
app.decorate("sendMail", sendMail);
app.decorate("verifyCodeRedis", Cache.get("RedisVerifyCode"));
app.decorate("userRedis", Cache.get("RedisUser"));
app.decorate("roomRedis", Cache.get("RedisChatRoom"));

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

app.register(userRouter, { prefix: "/v1" });
app.register(roomRouter, { prefix: "/v1" });


const start = async () => {
    try {
        await app.listen({ host: "0.0.0.0", port: 3000 });
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();

