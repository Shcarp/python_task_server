import { RoomInfo, UserInfo } from "../../type";

export interface UserCache {
    setUserLoginInfo(token: string, userInfo: UserInfo): Promise<number>;
    checkUserLoginInfo(token: string): Promise<string | undefined>;
    checkUserLogin(token: string): Promise<boolean>;
    getUserLoginInfo(token: string): Promise<string | undefined>;
    delUserLoginInfo(token: string): Promise<number>;
    setUserToken(username: string, token: string): Promise<string | null>;
    getUserToken(username: string): Promise<string | null>;
}


export interface RoomCache {
    createChatRoom(ownerId: number, roomName: string, description: string): Promise<string>;
    getChatRoomOwnerId(roomId: string): Promise<string | undefined>;
    getChatRoomInfo(roomId: string): Promise<RoomInfo>;
    delChatRoom(roomId: string): Promise<number>;
    getAllChatRoom(): Promise<string[]>;
    getChatRoomUserList(roomId: string): Promise<string[]>;
    joinChatRoom(roomId: string, username: string): Promise<number[]>;
    leaveChatRoom(roomId: string, username: string): Promise<number[]>;
    checkUserInChatRoom(roomId: string, username: string): Promise<boolean>;
    updateChatRoomInfo(roomId: string, body: Partial<Pick<RoomInfo, "owner_id" | "roomName" | "description">>): Promise<number[]>;
}

export interface VerifyCodeCache {
    setVerifyCode(email: string, code: string): Promise<string>;
    getVerifyCode(email: string): Promise<string | null>;
    delVerifyCode(email: string): Promise<void>;
    checkVerifyCode(email: string, code: string): Promise<boolean>;
}
