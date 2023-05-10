import { uid } from "uid";
import { Redis } from ".";
import { stringifyRoomInfoList } from "../../utils/jsonf";
import { RoomInfo } from "../../type";
import { RoomCache } from "../lib/cache";
import { Cache } from "../lib/db";

// 聊天房间
@Cache.register
export class RedisChatRoom extends Redis implements RoomCache {
    static key(roomId: string) {
        return `chat-room-${roomId}`;
    }

    // 生成聊天房间id
    static generateChatRoomId() {
        return uid(32);
    }

    constructor() {
        super(2);
    }

    // 创建聊天房间
    public async createChatRoom(ownerId: number, roomName: string, description: string): Promise<string> {
        const roomId = RedisChatRoom.generateChatRoomId();
        // 设置房间，id, 房间名，创建时间，更新时间，描述，使用redis 字典
        const list = stringifyRoomInfoList([]);
        await Promise.all([
            this.client.hSet(RedisChatRoom.key(roomId), "owner_id", ownerId),
            this.client.hSet(RedisChatRoom.key(roomId), "roomName", roomName),
            this.client.hSet(RedisChatRoom.key(roomId), "roomId", roomId),
            this.client.hSet(RedisChatRoom.key(roomId), "createTime", Date.now().toString()),
            this.client.hSet(RedisChatRoom.key(roomId), "updateTime", Date.now().toString()),
            this.client.hSet(RedisChatRoom.key(roomId), "description", description),
            this.client.hSet(RedisChatRoom.key(roomId), "userList", list),
        ]);

        return roomId;
    }

    // 获取所有者id
    public async getChatRoomOwnerId(roomId: string) {
        return this.client.hGet(RedisChatRoom.key(roomId), "owner_id");
    }

    // 获取聊天房间信息
    public async getChatRoomInfo(roomId: string) {
        const info = await this.client.hGetAll(RedisChatRoom.key(roomId));
        return {
            ...info,
            userList: JSON.parse(info.userList),
        } as RoomInfo;
    }

    // 删除聊天房间
    public async delChatRoom(roomId: string) {
        return this.client.del(RedisChatRoom.key(roomId));
    }

    // 获取所有聊天房间
    public async getAllChatRoom() {
        return this.client.keys("chat-room-*");
    }

    // 获取聊天房间人员列表
    public async getChatRoomUserList(roomId: string) {
        return this.client.hKeys(RedisChatRoom.key(roomId));
    }

    // 加入聊天房间
    public async joinChatRoom(roomId: string, username: string) {
        // 获取list
        const list = await this.client.hGet(RedisChatRoom.key(roomId), "userList");
        // 将用户加入list
        const newList = JSON.parse(list ?? '[]');
        newList.push(username);
        // 更新list
        // 更新时间
       
        return await Promise.all([
            await this.client.hSet(RedisChatRoom.key(roomId), "updateTime", Date.now().toString()),
            await this.client.hSet(RedisChatRoom.key(roomId), "userList", stringifyRoomInfoList(newList))
        ]);
    }

    // 离开聊天房间
    public async leaveChatRoom(roomId: string, username: string) {
        // 获取list
        const list = await this.client.hGet(RedisChatRoom.key(roomId), "userList");
        // 将用户加入list
        const newList =( JSON.parse(list ?? '[]') as string[]).filter((item) => item !== username);
        // 更新list
        return await Promise.all([
            await this.client.hSet(RedisChatRoom.key(roomId), "updateTime", Date.now().toString()),
            await this.client.hSet(RedisChatRoom.key(roomId), "userList", stringifyRoomInfoList(newList))
        ]);
    }

    // 判断用户是否在聊天房间
    public async checkUserInChatRoom(roomId: string, username: string) {
        return this.client.hExists(RedisChatRoom.key(roomId), username);
    }

    // 修改聊天房间信息
    public async updateChatRoomInfo(roomId: string, body: Partial<Pick<RoomInfo, "owner_id" | "roomName" | "description">>) {
        const keys = Object.keys(body) as ("owner_id" | "roomName" | "description")[];
        const set = keys.map((key: string) => {
            // @ts-ignore
            return this.client.hSet(RedisChatRoom.key(roomId), key, body[key]);
        })
        return Promise.all(set);
    }
}
