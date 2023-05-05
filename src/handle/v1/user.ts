import { FastifyReply, FastifyRequest } from "fastify";

type BaseRequestBody = {
    username: string;
    password: string;
};

type LoginRequestBody = BaseRequestBody;

type RegisterRequestBody = BaseRequestBody & {
    email: string;
};


export const handleRegister = async (request: FastifyRequest, reply: FastifyReply) => {
    const { username, password, email } = request.body as RegisterRequestBody;
    // 判断用户名是否存在
    const isExist = await request.userSql.checkUsernameExist(username);
    if (isExist) {
        reply.send({
            code: 1,
            msg: "The username already exists.",
        });
        return;
    }
    // 插入一个用户
    await request.userSql.insertUser({ username, password, email });
    reply.send({
        code: 0,
        msg: "Successfully register.",
    });
}

export const handleLogin = async (request: FastifyRequest, reply: FastifyReply) => {
    const { username, password } = request.body as LoginRequestBody;
    // 判断用户登录密码是否正确
    const userInfo = await request.userSql.checkUserPassword(username, password);
    if (!userInfo) {
        reply.send({
            code: 1,
            msg: "Incorrect username or password.",
        });
        return;
    }
    reply.send({
        code: 0,
        msg: "Successfully login.",
        data: userInfo,
    });
}

export const handleCheckoutUsername = async (request: FastifyRequest, reply: FastifyReply) => {
    const { username } = request.query as { username: string };
    // 判断用户名是否存在
    const isExist = await request.userSql.checkUsernameExist(username);
    reply.send({
        code: 0,
        msg: "Successfully check the username.",
        data: !!isExist,
    });
}

export const handleForgetPassword = async (request: FastifyRequest, reply: FastifyReply) => {
    const { username, email } = request.body as { username: string, email: string };
    // 判断用户名是否存在
    const isExist = await request.userSql.checkUsernameExist(username);
    if (!isExist) {
        reply.send({
            code: 1,
            msg: "The username does not exist.",
        });
        return;
    }
    // 判断邮箱是否正确
    const isEmailCorrect = await request.userSql.checkEmailCorrect(username, email);
    if (!isEmailCorrect) {
        reply.send({
            code: 1,
            msg: "The email is not correct.",
        });
        return;
    }
    // 生成一个随机密码
    const randomPassword = Math.random().toString(36).substr(2);
    // 更新密码
    // await request.userSql.updateUserPassword(username, randomPassword);
    // 发送邮件
    // await request.email.sendMail({
    //     from: "
    //     <

}