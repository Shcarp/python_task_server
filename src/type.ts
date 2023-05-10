import { RowDataPacket } from "mysql2";

export interface UserInfo extends RowDataPacket {
    id: number;
    username: string;
    password: string;
    email: string;
    profile_picture?: string;
    last_active?: Date;
    created_at?: Date;
    updated_at?: Date;
}

/**
 * @description: 用于存储在 redis 中的用户信息
 */
export interface RoomInfo {
    owner_id: number;
    roomId: string;
    roomName: string;
    createTime: Date;
    updateTime: Date;
    description?: string;
    userList: any;
}
