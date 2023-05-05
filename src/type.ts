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
