import pino from "pino";
import { RedisClientType, createClient } from "redis";
import { Cache } from "../lib/db";

import split from "split2";

const stream = split(JSON.parse)

const log = pino({
    level: "error",
    stream: stream
});

const Port: number = Number(process.env.REDIS_PORT) || 6379;

const baseConfig = {
    socket: {
        host: process.env?.REDIS_HOST || "127.0.0.1",
        port: Port,
        family: 4,
    },
    password: process.env?.REDIS_PASSWORD || "",
};


export abstract class Redis extends Cache {
    protected client: RedisClientType;

    constructor(database: number) {
        super();
        this.client = createClient({
            ...baseConfig,
            database,
        });

        this.client.connect();
        this.client.on("connect", () => {
            log.info(`Redis client ${this.name} connected`);
        });
        this.client.on("ready", () => {
            log.info(`Redis client ${this.name} ready`);
        });
        this.client.on("error", function (error: any) {
            log.error(error);
        });
    }
}
