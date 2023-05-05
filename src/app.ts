import fastify from "fastify";
import "./global"
import { MessageSql, UserSql } from "./module/mysql";
// import { client } from "./module/redis";
import { sendMail } from "./utils/email";
import { RedisUser, RedisVerifyCode } from "./module/redis";

const app = fastify({ logger: true });

const usesql = new UserSql();
const messageSql = new MessageSql();

app.decorate('userSql', usesql);
app.decorate('messageSql', messageSql);
app.decorateRequest('userSql', usesql);
app.decorateRequest('messageSql', messageSql);
app.decorateReply('sendMail', sendMail)
app.decorateRequest('verifyCodeRedis', new RedisVerifyCode())
app.decorateRequest('userRedis', new RedisUser())

app.addSchema({
    $id: "opt/200",
    type: "object",
    properties: {
        code: { type: "number" },
        msg: { type: "string" },
    },
})

app.addSchema({
    $id: "v1/userInfo",
    type: "object",
    properties: {
        username: { type: 'string' },
        password: { type: 'string' },
        email: { type: 'string' },
        id: { type: 'number' },
        profile_picture: { type: 'string'},
    },
})

app.register(require('./routes/v1/user'), { prefix: '/v1' })

app.get('/creator', async (request, reply) => {
    console.log(await app.userSql.checkUsernameExist("test001"));
    // return app.userSql.insertUser({
    //   username: "test001",
    //   password: "test001password",
    //   email: "sunhui1314."
    // })
    const userInfo = await app.userSql.getUserInfo("test001");
    // await request.redis.set("test001", "test001token");
    console.log(userInfo);
    reply.send(userInfo);
})

const start = async () => {
    try {
        await app.listen({ port: 3000 });
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();
