import { FastifyReply, FastifyRequest, RouteHandlerMethod } from "fastify";
import { RoomInfo } from "../../type";

// 创建房间
export const handleCreateRoom: RouteHandlerMethod = async (request: FastifyRequest, reply: FastifyReply) => {
    const { roomName, description } = request.body as { roomName: string, description: string };
    const { username, id } = request.userInfo;
    // 创建房间
    const roomId = await request.server.roomCache.createChatRoom(id ,roomName, description);
    // 将用户加入房间
    await request.server.roomCache.joinChatRoom(roomId, username);
    reply.send({
        code: 0,
        msg: "Successfully create room.",
        data: roomId,
    });
}

// 获取所有房间
export const handleGetAllRoom: RouteHandlerMethod = async (request: FastifyRequest, reply: FastifyReply) => {
    const rooms = (await request.server.roomCache.getAllChatRoom()).map((roomRawId) => {
        const id = roomRawId.split("-")[2];
        return id;
    });
    reply.send({
        code: 0,
        msg: "Successfully get all room.",
        data: rooms,
    });
}

// 获取房间信息
export const handleGetRoom: RouteHandlerMethod = async (request: FastifyRequest, reply: FastifyReply) => {
    const { roomId } = request.params as { roomId: string };
    const room = await request.server.roomCache.getChatRoomInfo(roomId);
    reply.send({
        code: 0,
        msg: "Successfully get room.",
        data: room,
    });
}

// 离开房间
export const handleLeaveRoom: RouteHandlerMethod = async (request: FastifyRequest, reply: FastifyReply) => {
    const { roomId } = request.params as { roomId: string };
    const { username } = request.userInfo;
    await request.server.roomCache.leaveChatRoom(roomId, username);
    reply.send({
        code: 0,
        msg: "Successfully leave room.",
    });
}

// handleJoinRoom
export const handleJoinRoom: RouteHandlerMethod = async (request: FastifyRequest, reply: FastifyReply) => {
    const { roomId } = request.params as { roomId: string };
    const { username } = request.userInfo;
    await request.server.roomCache.joinChatRoom(roomId, username);
    reply.send({
        code: 0,
        msg: "Successfully join room.",
    });
}

// handleGetRoomUsers
export const handleGetRoomUsers: RouteHandlerMethod = async (request: FastifyRequest, reply: FastifyReply) => {
    const { roomId } = request.params as { roomId: string };
    const users = (await request.server.roomCache.getChatRoomInfo(roomId)).userList;
    reply.send({
        code: 0,
        msg: "Successfully get room users.",
        data: users,
    });
}

// handleDeleteRoom
export const handleDeleteRoom: RouteHandlerMethod = async (request: FastifyRequest, reply: FastifyReply) => {
    const { roomId } = request.params as { roomId: string };
    const { id } = request.userInfo;
    const owner = await request.server.roomCache.getChatRoomOwnerId(roomId);
    if (owner && id === Number(owner)) {
        await request.server.roomCache.delChatRoom(roomId);
    }
    reply.send({
        code: 0,
        msg: "Successfully delete room.",
    });
}

// 修改房间信息
export const handleUpdateRoom: RouteHandlerMethod = async (request: FastifyRequest, reply: FastifyReply) => {
    const { roomId } = request.params as { roomId: string };
    const body = request.body as Partial<RoomInfo>;
    
    await request.server.roomCache.updateChatRoomInfo(roomId, body);

    reply.send({
        code: 0,
        msg: "Successfully update room.",
    });
}

