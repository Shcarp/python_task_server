import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { handlePlatformOptions } from "../../handle/v1/common";

export default function (fastify: FastifyInstance, opts: FastifyPluginOptions, next: () => void) {
    // 添加脚本
    fastify.get("/common/platforms", {
        schema: {
            response: {
                200: {
                    code: { type: "number" },
                    msg: { type: "string" },
                    data: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                platformId: { type: "number" },
                                platformName: { type: "string" },
                            },
                        },
                    }
                },
            },
        },
    }, handlePlatformOptions);
    next();
}
