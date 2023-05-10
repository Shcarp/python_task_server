import { Redis } from ".";
import { VerifyCodeCache } from "../lib/cache";

import { Cache } from "../lib/db";

// 聊天房间
@Cache.register
export class RedisVerifyCode extends Redis implements VerifyCodeCache {
    static key(email: string) {
        return `email-verify-code-${email}`;
    }

    constructor() {
        super(1);
    }

    public async setVerifyCode(email: string, code: string) {
        return await (Promise.all([
            this.client.set(RedisVerifyCode.key(email), code),
            this.client.expire(RedisVerifyCode.key(email), 60 * 5),
        ]))[0];
    }
    public getVerifyCode(email: string) {
        return this.client.get(RedisVerifyCode.key(email));
    }

    public async delVerifyCode(email: string) {
        this.client.del(RedisVerifyCode.key(email));
    }

    public async checkVerifyCode(email: string, code: string) {
        const scode = await this.client.get(RedisVerifyCode.key(email))
        return scode === code;
    }
}