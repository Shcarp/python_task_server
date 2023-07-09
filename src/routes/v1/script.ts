import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
    handleCreate,
    handleFavorite,
    handleGetDetail,
    handleGetList,
    handleGetUserFavoriteList,
    handleGetUserLikeList,
    handleGetUserUploadList,
    handleLike,
    handleUnFavorite,
    handleUnlike,
    handleUpdateScriptVersion,
} from "../../handle/v1/script";

export default function (fastify: FastifyInstance, opts: FastifyPluginOptions, next: () => void) {
    // 添加脚本
    fastify.post(
        "/script/create",
        {
            schema: {
                body: {
                    type: "object",
                    properties: {
                        scriptName: { type: "string" },
                        scriptModule: { type: "string" },
                        scriptKey: { type: "string" },
                        scriptVersion: { type: "string" },
                        scriptDescription: { type: "string" },
                        scriptDetailedDescription: { type: "string" },
                        scriptConfigText: { type: "string" },
                        scriptPlatformId: { type: "number" },
                        scriptVisibility: { type: "number" },
                    },
                    required: [
                        "scriptVersion",
                        "scriptName",
                        "scriptDescription",
                        "scriptDetailedDescription",
                        "scriptConfigText",
                        "scriptPlatformId",
                        "scriptVisibility",
                        "scriptModule",
                        "scriptKey",
                    ],
                },
                response: {
                    200: {
                        $ref: "opt/200",
                    },
                },
            },
        },
        handleCreate
    );

    fastify.post(
        "/script/update",
        {
            schema: {
                body: {
                    type: "object",
                    properties: {
                        scriptUid: { type: "string" },
                        scriptName: { type: "string" },
                        scriptModule: { type: "string" },
                        scriptKey: { type: "string" },
                        scriptVersion: { type: "string" },
                        scriptDescription: { type: "string" },
                        scriptDetailedDescription: { type: "string" },
                        scriptConfigText: { type: "string" },
                        scriptPlatformId: { type: "number" },
                        scriptVisibility: { type: "number" },
                    },
                    required: [
                        "scriptUid",
                        "scriptVersion",
                        "scriptName",
                        "scriptDescription",
                        "scriptDetailedDescription",
                        "scriptConfigText",
                        "scriptPlatformId",
                        "scriptVisibility",
                        "scriptModule",
                        "scriptKey",
                    ],
                },
                response: {
                    200: {
                        $ref: "opt/200",
                    },
                },
            },
        },
        handleUpdateScriptVersion
    );

    fastify.get(
        "/script/list",
        {
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        keyword: { type: "string" },
                        scriptModule: { type: "string" },
                        scriptUid: { type: "string" },
                        scriptPlatformId: { type: "number" },
                        current: { type: "number" },
                        pageSize: { type: "number" },
                    },
                    required: ["current", "pageSize"],
                },
                response: {
                    200: {
                        code: { type: "number" },
                        msg: { type: "string" },
                        data: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    scriptId: { type: "number" },
                                    scriptUid: { type: "string" },
                                    scriptName: { type: "string" },
                                    scriptModule: { type: "string" },
                                    scriptKey: { type: "string" },
                                    scriptVersion: { type: "string" },
                                    scriptDescription: { type: "string" },
                                    scriptDetailedDescription: { type: "string" },
                                    scriptConfigText: { type: "string" },
                                    scriptPlatformId: { type: "number" },
                                    scriptVisibility: { type: "number" },
                                    likes: { type: "number" },
                                    isFavorite: { type: "number" },
                                    isLike: { type: "number" },
                                    favorites: { type: "number" },
                                    created_at: { type: "string" },
                                    updated_at: { type: "string" },
                                },
                            },
                        },
                    },
                },
            },
        },
        handleGetList
    );

    fastify.get(
        "/script/like",
        {
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        scriptUid: { type: "string" },
                    },
                    required: ["scriptUid"],
                },
                response: {
                    200: {
                        $ref: "opt/200",
                    },
                },
            },
        },
        handleLike
    );
    fastify.get(
        "/script/unlike",
        {
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        scriptUid: { type: "string" },
                    },
                    required: ["scriptUid"],
                },
                response: {
                    200: {
                        $ref: "opt/200",
                    },
                },
            },
        },
        handleUnlike
    );
    fastify.get(
        "/script/favorite",
        {
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        scriptUid: { type: "string" },
                    },
                    required: ["scriptUid"],
                },
                response: {
                    200: {
                        $ref: "opt/200",
                    },
                },
            },
        },
        handleFavorite
    );
    fastify.get(
        "/script/unfavorite",
        {
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        scriptUid: { type: "string" },
                    },
                    required: ["scriptUid"],
                },
                response: {
                    200: {
                        $ref: "opt/200",
                    },
                },
            },
        },
        handleUnFavorite
    );

    fastify.get(
        "/script/detail",
        {
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        scriptUid: { type: "string" },
                    },
                }
            },
        },
        handleGetDetail
    );

    fastify.get(
        "/script/list/user",
        {
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        keyword: { type: "string" },
                        scriptModule: { type: "string" },
                        scriptUid: { type: "string" },
                        scriptPlatformId: { type: "number" },
                        current: { type: "number" },
                        pageSize: { type: "number" },
                    },
                    required: ["current", "pageSize"],
                },
                response: {
                    200: {
                        code: { type: "number" },
                        msg: { type: "string" },
                        data: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    scriptId: { type: "number" },
                                    scriptUid: { type: "string" },
                                    scriptName: { type: "string" },
                                    scriptModule: { type: "string" },
                                    scriptKey: { type: "string" },
                                    scriptVersion: { type: "string" },
                                    scriptDescription: { type: "string" },
                                    scriptDetailedDescription: { type: "string" },
                                    scriptConfigText: { type: "string" },
                                    scriptPlatformId: { type: "number" },
                                    scriptVisibility: { type: "number" },
                                    likes: { type: "number" },
                                    favorites: { type: "number" },
                                    created_at: { type: "string" },
                                    updated_at: { type: "string" },
                                },
                            },
                        },
                    },
                },
            },
        },
        handleGetUserUploadList
    )
    fastify.get(
        "/script/list/user/like",
        {
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        keyword: { type: "string" },
                        scriptModule: { type: "string" },
                        scriptUid: { type: "string" },
                        scriptPlatformId: { type: "number" },
                        current: { type: "number" },
                        pageSize: { type: "number" },
                    },
                    required: ["current", "pageSize"],
                },
                response: {
                    200: {
                        code: { type: "number" },
                        msg: { type: "string" },
                        data: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    scriptId: { type: "number" },
                                    scriptUid: { type: "string" },
                                    scriptName: { type: "string" },
                                    scriptModule: { type: "string" },
                                    scriptKey: { type: "string" },
                                    scriptVersion: { type: "string" },
                                    scriptDescription: { type: "string" },
                                    scriptDetailedDescription: { type: "string" },
                                    scriptConfigText: { type: "string" },
                                    scriptPlatformId: { type: "number" },
                                    scriptVisibility: { type: "number" },
                                    likes: { type: "number" },
                                    favorites: { type: "number" },
                                    created_at: { type: "string" },
                                    updated_at: { type: "string" },
                                },
                            },
                        },
                    },
                },
            },
        },
        handleGetUserLikeList
    )
    fastify.get(
        "/script/list/user/favorite",
        {
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        keyword: { type: "string" },
                        scriptModule: { type: "string" },
                        scriptUid: { type: "string" },
                        scriptPlatformId: { type: "number" },
                        current: { type: "number" },
                        pageSize: { type: "number" },
                    },
                    required: ["current", "pageSize"],
                },
                response: {
                    200: {
                        code: { type: "number" },
                        msg: { type: "string" },
                        data: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    scriptId: { type: "number" },
                                    scriptUid: { type: "string" },
                                    scriptName: { type: "string" },
                                    scriptModule: { type: "string" },
                                    scriptKey: { type: "string" },
                                    scriptVersion: { type: "string" },
                                    scriptDescription: { type: "string" },
                                    scriptDetailedDescription: { type: "string" },
                                    scriptConfigText: { type: "string" },
                                    scriptPlatformId: { type: "number" },
                                    scriptVisibility: { type: "number" },
                                    likes: { type: "number" },
                                    favorites: { type: "number" },
                                    created_at: { type: "string" },
                                    updated_at: { type: "string" },
                                },
                            },
                        },
                    },
                },
            },
        },
        handleGetUserFavoriteList
    )

    next();
}
