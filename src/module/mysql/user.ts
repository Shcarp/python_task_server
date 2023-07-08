import { pino } from "pino";

import { MySql } from "./init";
import { userSql } from "./init.sql";
import { OkPacket } from "mysql2";
import { UserInfo } from "../../type";
import { UserStore, CreatorUser } from "../lib/store";
import { Store } from "../lib/db";

const log = pino();

@Store.register
export class UserSql extends MySql implements UserStore {
    private userInfofield = `id, username, email, profile_picture, last_active, created_at, updated_at`

    // 判断用户名是否存在
    public async checkUsernameExist(username: string) {
        const sql = `SELECT username FROM user WHERE uk_username = ?`;
        try {
            const result = await this.queryStruct<UserInfo[]>(sql, [username]);
            if(result.length > 0) {
                return true;
            }
            return false;
        } catch (error) {
            log.error(`Failed to check the username exist. Error info: ${error}`);
            return false;
        }
    }

    // 插入一个用户
    public async insertUser(user: CreatorUser) {
        const sql = `INSERT INTO user (username, password, email, created_at, updated_at) 
        VALUES ('${user.username}', '${user.password}', '${user.email}', NOW(), NOW());
        `;
        try {
            await this.query<OkPacket>(sql);
            log.info(`Successfully insert a user: ${user.username}`)
        } catch (error) {
            log.error(`Failed to insert a user. Error info: ${error}`);
        }
    }

    // 判断用户登录密码是否正确
    public async checkUserPassword(username: string, password: string) {
        const sql = `SELECT * FROM user WHERE username = ? AND password = ?`;
        try {
            const result = await this.queryStruct<UserInfo[]>(sql, [username, password]);
            if (result.length !== 1) {
                return null;
            }
            // 更新用户最后登录时间
            await this.updateUserLastActive(result[0].id);
            log.info(`Successfully login: ${username}`)
            return result[0];
        } catch (error) {
            log.error(`Failed to check the user password. Error info: ${error}`);
            return null;
        }
    }

    // 更新用户最后登录时间
    public async updateUserLastActive(id: number) {
        const sql = `UPDATE user SET last_active = NOW() WHERE id = '${id}'`;
        try {
            await this.query(sql);
        } catch (error) {
            log.error(`Failed to update the user last active time. Error info: ${error}`);
        }
    }

    // 更新用户信息
    public async updateUserInfo(id: number, user: CreatorUser) {
        const sql = `UPDATE user SET username = '${user.username}', password = '${user.password}', email = '${user.email}', updated_at = NOW() WHERE id = '${id}'`;
        try {
            await this.query(sql);
            log.info(`Successfully update the user info: ${user.username}`)
        } catch (error) {
            log.error(`Failed to update the user info. Error info: ${error}`);
        }
    }

    // 获取用户信息
    public async getUserInfo(username: string) {
        const sql = `SELECT ${this.userInfofield} FROM user WHERE username = '${username}'`;
        try {
            const result = await this.query<UserInfo[]>(sql);
            return result[0];
        } catch (error) {
            log.error(`Failed to get the user info. Error info: ${error}`);
            return null
        }
    }
    // checkEmailCorrect
    public async checkEmailCorrect(username: string, email: string) {

        const sql = `SELECT ${this.userInfofield} FROM user WHERE username = '${username}' AND email = '${email}' `;
        try {
            const result = await this.query<UserInfo[]>(sql);
            if(result.length > 0) {
                return true;
            }
            return false;
        } catch (error) {
            log.error(`Failed to check the email correct. Error info: ${error}`);
            return false;
        }
    }

    // 更新用户密码
    public async updateUserPassword(email: string, password: string) {
        const sql = `UPDATE user SET password = ?, updated_at = NOW() WHERE username = ?`;
        try {
            await this.queryStruct(sql, [email, password]);
            log.info(`Successfully update the user password: ${email}`)
        } catch (error) {
            log.error(`Failed to update the user password. Error info: ${error}`);
        }
    }

    // 更新用户头像
    public async updateUserProfilePicture(id: number, profile_picture: string) {
        const sql = `UPDATE user SET profile_picture = '${profile_picture}', updated_at = NOW() WHERE id = '${id}'`;
        try {
            await this.query(sql);
            log.info(`Successfully update the user profile picture: ${id}`)
        } catch (error) {
            log.error(`Failed to update the user profile picture. Error info: ${error}`);
        }
    }
    
    protected async init() {
        try {
            await this.query(userSql);
        } catch (error) {
            log.error(`Failed to create the user table. Error info: ${error}`);
        }
    }
}
