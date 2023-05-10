import fastJson from "fast-json-stringify";

export const stringifyUserInfo = fastJson({
    title: "userInfo",
    type: "object",
    properties: {
        id: { type: "number" },
        username: { type: "string" },
        password: { type: "string" },
        email: { type: "string" },
        profile_picture: { type: "string" },
        last_active: { type: "string" },
        created_at: { type: "string" },
        updated_at: { type: "string" },
    },
});

export const stringifyRoomInfo = fastJson({
    title: "roomInfo",
    type: "object",
    properties: {
        owner_id: { type: "number" },
        room_id: { type: "string" },
        room_name: { type: "string" },
        created_at: { type: "string" },
        updated_at: { type: "string" },
        description: { type: "string" },
    },
});

export const stringifyRoomInfoList = fastJson({
    title: "roomInfoList",
    type: "array",
    items: {
        type: "string",
    },
});


