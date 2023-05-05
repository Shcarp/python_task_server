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
