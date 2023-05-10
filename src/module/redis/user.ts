import { Redis } from ".";
import { UserInfo } from "../../type";
import { stringifyUserInfo } from "../../utils/jsonf";
import { UserCache } from "../lib/cache";
import { Cache } from "../lib/db";

@Cache.register
export class RedisUser extends Redis implements UserCache {
    static key(username: string) {
        return `user-token-${username}`;
    }

    constructor() {
        super(0);
    }

    // 用hash表保存用户登录信息，token 作为键，用户登录信息作为值, 用户登录信息为对象, 设置过期时间30天
    public async setUserLoginInfo(token: string, userInfo: UserInfo) {
        const key = "user-login-info";
        const value = stringifyUserInfo(userInfo);
        const expireTimeSeconds = 30 * 24 * 60 * 60; // 30 days in seconds
        return (await Promise.all([this.client.hSet(key, token, value), this.client.expire(key, expireTimeSeconds)]))[0];
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
    // 保存用户名-token
    public async setUserToken(username: string, token: string) {
        return (await Promise.all([
            this.client.set(RedisUser.key(username), token),
            this.client.expire(RedisUser.key(username), 5 * 24 * 60 * 60),
        ]))[0]
    }
    // 获取用户名-token
    public async getUserToken(username: string) {
        return this.client.get(RedisUser.key(username));
    }
}