import pino from "pino";
import fp from "fastify-plugin";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
const log = pino();
// 向request 实例中注入用户信息
const setUserInfo = fp((fastify: FastifyInstance, opts: FastifyPluginOptions, next: () => void) => {
    fastify.addHook("preHandler", async (request, reply) => {
        // 获取请求头中token
        const token = request.headers.authorization;
        // 获取用户信息
        if (!token) {
            return;
        }
        const userInfo = await request.server.userRedis.getUserLoginInfo(token);
        if (!userInfo) {
            return;
        }
        request.userInfo = JSON.parse(userInfo);
    });
    next();
});

export default setUserInfo;
