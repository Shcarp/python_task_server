import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { handleCreateRoom, handleDeleteRoom, handleGetAllRoom, handleGetRoom, handleGetRoomUsers, handleJoinRoom, handleLeaveRoom, handleUpdateRoom } from "../../handle/v1/room";

export default function (fastify: FastifyInstance, opts: FastifyPluginOptions, next: () => void) { 
    // 获取所有房间
    fastify.get("/rooms", handleGetAllRoom);
    // 获取指定房间信息
    fastify.get("/room/:roomId", handleGetRoom);
    // 创建房间
    fastify.put("/room", {
        schema: {
            body: {
                type: "object",
                properties: {
                    roomName: { type: "string" },
                },
                required: ["roomName"],
            },
            response: {
                200: {
                    type: "object",
                    properties: {
                        code: { type: "number" },
                        msg: { type: "string" },
                        data: { type: "string" },
                    },
                },
            },
        },
    } ,handleCreateRoom);
    // 删除房间
    fastify.delete("/room/:roomId", handleDeleteRoom);
    // 离开房间
    fastify.delete("/room/:roomId/leave", handleLeaveRoom);
    // 加入房间
    fastify.put("/room/:roomId/join", handleJoinRoom);
    // 获取房间用户
    fastify.get("/room/:roomId/users", handleGetRoomUsers);
    // 修改房间信息
    fastify.post("/room/:roomId", {
        schema: {
            body: {
                type: "object",
                properties: {
                    roomName: { type: "string" },
                    owner_id: { type: "number" },
                    description: { type: "string" },
                },
            },
            response: {
                200: {
                    $ref: "opt/200",
                },
            },
        },
    }, handleUpdateRoom);

    next();
}