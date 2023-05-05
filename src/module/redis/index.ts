import pino from "pino";
import { createClient, RedisClientType } from "redis";
import { UserInfo } from "../../type";
import { stringifyUserInfo } from "../../utils/jsonf";

const log = pino();

const Port: number = Number(process.env.REDIS_PORT) || 6379;

const baseConfig = {
    socket: {
        host: process.env?.REDIS_HOST || "127.0.0.1",
        port: Port,
        family: 4,
    },
    password: process.env?.REDIS_PASSWORD || "",
};

export abstract class Redis {
    protected client: RedisClientType;

    protected abstract name: string;

    constructor(database: number) {
        this.client = createClient({
            ...baseConfig,
            database,
        });

        this.client.connect();
        this.client.on("connect", () => {
            log.info(`Redis client ${this.name} connected`);
        });
        this.client.on("ready", () => {
            log.info(`Redis client ${this.name} ready`);
        });
        this.client.on("error", function (error: any) {
            log.error(error);
        });
    }
}

export class RedisUser extends Redis {
    static key(username: string) {
        return `user-token-${username}`;
    }

    protected name = "RedisUser";

    constructor() {
        super(0);
    }

    // 用hash表保存用户登录信息，token 作为键，用户登录信息作为值, 用户登录信息为对象, 设置过期时间30天
    public async setUserLoginInfo(token: string, userInfo: UserInfo) {
        const key = "user-login-info";
        const value = stringifyUserInfo(userInfo);
        const expireTimeSeconds = 30 * 24 * 60 * 60; // 30 days in seconds
        return Promise.all([this.client.hSet(key, token, value), this.client.expire(key, expireTimeSeconds)]);
    }

    public async checkUserLoginInfo(token: string) {
        return this.client.hGet("user-login-info", token);
    }
    // 判断用户是否已登录
    public async checkUserLogin(token: string) {
        return this.client.hExists("user-login-info", token);
    }
    public async getUserLoginInfo(token: string) {
        return this.client.hGet("user-login-info", token);
    }
    public async delUserLoginInfo(token: string) {
        return this.client.hDel("user-login-info", token);
    }
}

export class RedisVerifyCode extends Redis {
    static key(email: string) {
        return `email-verify-code-${email}`;
    }

    protected name = "RedisVerifyCode";

    constructor() {
        super(1);
    }

    public setVerifyCode(email: string, code: string) {
        return Promise.all([
            this.client.set(RedisVerifyCode.key(email), code),
            this.client.expire(RedisVerifyCode.key(email), 60 * 5),
        ]);
    }
    public getVerifyCode(email: string) {
        return this.client.get(RedisVerifyCode.key(email));
    }

    public async delVerifyCode(email: string) {
        this.client.del(RedisVerifyCode.key(email));
    }

    public async checkVerifyCode(email: string, code: string) {
        return (await this.client.get(RedisVerifyCode.key(email))) === code;
    }
}
