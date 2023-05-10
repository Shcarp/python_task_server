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
};

// username === email

export const handleRegister: RouteHandlerMethod = async (request: FastifyRequest, reply: FastifyReply) => {
    const { username, password, email } = request.body as RegisterRequestBody;
    // 判断用户名是否存在
    const isExist = await request.server.userSql.checkUsernameExist(username);
    if (isExist) {
        reply.send({
            code: 1,
            msg: "The username already exists.",
        });
        return;
    }
    // 插入一个用户
    await request.server.userSql.insertUser({ username, password, email });
    reply.send({
        code: 0,
        msg: "Successfully register.",
    });
};

export const handleLogin = async (request: FastifyRequest, reply: FastifyReply) => {
    const { username, password } = request.body as LoginRequestBody;
    // 判断用户登录密码是否正确
    const userInfo = await request.server.userSql.checkUserPassword(username, password);
    if (!userInfo) {
        reply.send({
            code: 1,
            msg: "Incorrect username or password.",
        });
        return;
    }
    let token = await request.server.userRedis.getUserToken(userInfo.username)
    if (!token) {
        token = await reply.jwtSign(userInfo);
        await request.server.userRedis.setUserToken(userInfo.username, token);
    }

    // 保存用户登录信息
    await request.server.userRedis.setUserLoginInfo(token, userInfo);

    reply.send({
        code: 0,
        msg: "Successfully login.",
        data: token,
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
    await request.server.userRedis.delUserLoginInfo(token);
    reply.send({
        code: 0,
        msg: "Successfully logout.",
    });
};

// 判断用户名是否存在
export const handleCheckoutUsername = async (request: FastifyRequest, reply: FastifyReply) => {
    const { username } = request.query as { username: string };
    const isExist = await request.server.userSql.checkUsernameExist(username);
    reply.send({
        code: 0,
        msg: "Successfully check the username.",
        data: !!isExist,
    });
};

export const handleGetVerifyCode = async (request: FastifyRequest, reply: FastifyReply) => {
    const generateVerifyCode = async () => {
        // 生成6位数随机数
        const verifyCode = Math.floor(Math.random() * 1000000)
            .toString()
            .padStart(6, "0");
        await request.server.verifyCodeRedis.setVerifyCode(email, verifyCode);
        return verifyCode;
    };
    let retry = 1;
    const send = async () => {
        try {
            await reply.server.sendMail(email, "VerifyCode", "VerifyCode", await generateVerifyCode());
        } catch (error) {
            if (retry < 3) {
                retry++;
                send();
            } else {
                log.error(error);
            }
        }
    };

    const { email } = request.query as { email: string };
    send();

    reply.send({
        code: 0,
        msg: "Successfully get the verify code.",
    });
};

// 验证邮箱验证码
export const handleCheckVerifyCode = async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, verifyCode } = request.body as { email: string; verifyCode: string };
    const code = await request.server.verifyCodeRedis.checkVerifyCode(email, verifyCode);
    if (!code) {
        reply.send({
            code: 1,
            msg: "The verify code is not correct.",
        });
        return;
    }
    // 从redis中删除验证码
    request.server.verifyCodeRedis.delVerifyCode(email);
    reply.send({
        code: 0,
        msg: "Successfully check the verify code.",
    });
};

// 重置密码
export const handleResetPassword = async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = request.body as { email: string; password: string };
    await request.server.userSql.updateUserPassword(email, password);
    reply.send({
        code: 0,
        msg: "Successfully reset the password.",
    });
};
