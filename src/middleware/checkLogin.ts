import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";
import { readdirSync } from "fs";
import path from "path";

// 排除的url
const excludeUrl = [
    "/register", 
    "/login", 
    "/checkUsernameExist", 
    "/verifyCode", 
    "/forgetPassword",
    "/resetPassword",
    "/getVerifyCode"
];

// 生成完整的url
const generateCompleteUrl: () => string[] = () => {
    const versions = readdirSync(path.join(__dirname, "../handle/"))
    return versions.map((version) => {
        return excludeUrl.map((url) => {
            return `/${version}${url}`;
        })
    }).flat()
}

let completeExcludeUrl: string[];

const checkLogin = fp((fastify: FastifyInstance, opts: FastifyPluginOptions, next: () => void) => {
    if(!completeExcludeUrl) {
        completeExcludeUrl = generateCompleteUrl()
    }
    fastify.addHook("preHandler", async (request, reply) => {
        const noLogin = () => {
            reply.status(401);
            reply.send({
                code: 1,
                msg: "The user is not login.",
            });
        }

        // 获取请求头中token
        const token = request.headers.authorization;
        if (completeExcludeUrl.includes(request.routerPath)) {
            return;
        } else {
            if (!token) {
                noLogin()
                return;
            }
            const userInfo = await request.server.userRedis.getUserLoginInfo(token);
            if (!userInfo) {
                noLogin()
                return;
            }
            request.userInfo = JSON.parse(userInfo);
        }
    });
    next();
})

export default checkLogin;
