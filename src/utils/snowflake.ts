// Snowflake 算法生成 UUID

class Snowflake {
    private workerId: number;
    private datacenterId: number;
    private sequence: number;
    private lastTimestamp: number;

    constructor(workerId: number, datacenterId: number) {
        this.workerId = workerId;
        this.datacenterId = datacenterId;
        this.sequence = 0;
        this.lastTimestamp = this.timestamp();
    }

    public nextId(): string {
        let timestamp = this.timestamp();

        if (timestamp < this.lastTimestamp) {
            throw new Error("Clock moved backwards. Refusing to generate id.");
        }

        if (timestamp === this.lastTimestamp) {
            this.sequence = (this.sequence + 1) & 4095;
            if (this.sequence === 0) {
                timestamp = this.nextMillis(this.lastTimestamp);
            }
        } else {
            this.sequence = 0;
        }

        this.lastTimestamp = timestamp;

        const id =
            (BigInt(timestamp) << BigInt(22)) |
            (BigInt(this.datacenterId) << BigInt(17)) |
            (BigInt(this.workerId) << BigInt(12)) |
            BigInt(this.sequence);

        return id.toString();
    }

    private timestamp(): number {
        return Date.now();
    }

    private nextMillis(lastTimestamp: number): number {
        let timestamp = this.timestamp();
        while (timestamp <= lastTimestamp) {
            timestamp = this.timestamp();
        }
        return timestamp;
    }
}

// 创建 Snowflake 实例
const snowflake = new Snowflake(1, 1);
export default snowflake;
