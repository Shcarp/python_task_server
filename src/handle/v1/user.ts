import { FastifyReply, FastifyRequest, RouteHandlerMethod } from "fastify";
import pino from "pino";

const log = pino();

type BaseRequestBody = {
    username: string;
    password: string;
};

type LoginRequestBody = BaseRequestBody;

type RegisterRequestBody = BaseRequestBody & {
    email: string;
    code: string;
};

export const handleRegister: RouteHandlerMethod = async (request: FastifyRequest, reply: FastifyReply) => {
    const { username, password } = request.body as RegisterRequestBody;
    // 判断用户名是否存在
    const isExist = await request.server.userStore.checkUsernameExist(username);
    if (isExist) {
        reply.send({
            code: 1,
            msg: "The username already exists.",
        });
        return;
    }
    // 插入一个用户
    await request.server.userStore.insertUser({ username, password});
    reply.send({
        code: 0,
        msg: "Successfully register.",
    });
};

export const handleLogin = async (request: FastifyRequest, reply: FastifyReply) => {
    const { username, password } = request.body as LoginRequestBody;
    // 判断用户登录密码是否正确
    const userInfo = await request.server.userStore.checkUserPassword(username, password);
    if (!userInfo) {
        reply.send({
            code: 1,
            msg: "Incorrect username or password.",
        });
        return;
    }
    let token = await request.server.userCache.getUserToken(userInfo.username)
    if (!token) {
        token = await reply.jwtSign(userInfo);
        await request.server.userCache.setUserToken(userInfo.username, token);
    }

    // 保存用户登录信息
    await request.server.userCache.setUserLoginInfo(token, userInfo);

    reply.send({
        code: 0,
        msg: "Successfully login.",
        data: {
            token,
            ...userInfo
        },
    });
};

// 退出登录
export const handleLogout = async (request: FastifyRequest, reply: FastifyReply) => {

    // 从请求头中获取token
    const token = request.headers.authorization;
    // 删除用户登录信息
    if (!token) {
        return;
    }
    await request.server.userCache.delUserLoginInfo(token);
    reply.send({
        code: 0,
        msg: "Successfully logout.",
    });
};

// 判断用户名是否存在
export const handleCheckoutUsername = async (request: FastifyRequest, reply: FastifyReply) => {
    const { username } = request.query as { username: string };
    const isExist = await request.server.userStore.checkUsernameExist(username);
    reply.send({
        code: 0,
        msg: "Successfully check the username.",
        data: !!isExist,
    });
};

// 重置密码
export const handleResetPassword = async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = request.body as { email: string; password: string };
    await request.server.userStore.updateUserPassword(email, password);
    reply.send({
        code: 0,
        msg: "Successfully reset the password.",
    });
};
