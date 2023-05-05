import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { handleCheckoutUsername, handleLogin, handleRegister, handleForgetPassword } from "../../handle/v1/user";

export default function (fastify: FastifyInstance, opts: FastifyPluginOptions, next: () => void) {
    // 注册用户
    fastify.post(
        "/register",
        {
            schema: {
                body: {
                    type: "object",
                    properties: {
                        username: { type: "string" },
                        password: { type: "string" },
                        email: { type: "string" },
                    },
                    required: ["username", "password", "email"],
                },
                response: {
                    200: {
                        $ref: "opt/200",
                    },
                },
            },
        },
        handleRegister
    );
    // 用户登录
    fastify.post(
        "/login",
        {
            schema: {
                body: {
                    type: "object",
                    properties: {
                        username: { type: "string" },
                        password: { type: "string" },
                    },
                    required: ["username", "password"],
                },
                response: {
                    200: {
                        type: "object",
                        properties: {
                            code: { type: "number" },
                            msg: { type: "string" },
                            data: {
                                $ref: "v1/userInfo",
                            },
                        },
                    },
                },
            },
        },
        handleLogin
    );
    // 判断用户名是否存在
    fastify.get(
        "/checkUsernameExist",
        {
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        username: { type: "string" },
                    },
                    required: ["username"],
                },
                response: {
                    200: {
                        type: "object",
                        properties: {
                            code: { type: "number" },
                            msg: { type: "string" },
                            data: { type: "boolean" },
                        },
                    },
                },
            },
        },
        handleCheckoutUsername
    );
    // 忘记密码
    fastify.post("/forgetPassword", handleForgetPassword);

    // 获取邮箱验证码
    fastify.get("/getVerifyCode", async (request, reply) => {
        const generateVerifyCode = async () => {
            // 生成6位数随机数
            const verifyCode = Math.floor(Math.random() * 1000000)
                .toString()
                .padStart(6, "0");
            await request.verifyCodeRedis.setVerifyCode(email, verifyCode);
            return verifyCode;
        };
        let retry = 1;
        const send = async () => {
            try {
                await reply.sendMail(email, "VerifyCode", "VerifyCode",  await generateVerifyCode());
            } catch (error) {
                console.log(retry)
                if(retry < 3) {
                    retry++;
                    send()
                }else {
                    console.log(error)
                    // log.error(error);
                }
            }
        };

        const { email } = request.query as { email: string };
        // // 生成6位数随机数
        send()

        reply.send({
            code: 0,
            msg: "Successfully get the verify code.",
        });
    });
    next();
}
