import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { handleCheckoutUsername, handleLogin, handleRegister, handleGetVerifyCode, handleCheckVerifyCode, handleLogout, handleResetPassword } from "../../handle/v1/user";

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
                            data: { type: "string"}
                        },
                    },
                },
            },
        },
        handleLogin
    );
    // 退出登录
    fastify.get("/logout", handleLogout);

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

    // 重置密码
    fastify.post("/resetPassword", {
        schema: {
            body: {
                type: "object",
                properties: {
                    password: { type: "string" },
                    email: { type: "string" },
                },
            },
            response: {
                200: {
                    $ref: "opt/200",
                },
            },
        }
    }, handleResetPassword)

    // 获取邮箱验证码
    fastify.get("/getVerifyCode", handleGetVerifyCode);

    // 验证验证码
    fastify.post("/checkVerifyCode", handleCheckVerifyCode);

    next();
}
