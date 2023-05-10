
type CacheConstructor = new (...args: any[]) => any

export class Cache {
    static caches: Record<string, CacheConstructor> = {}
    static instances: Record<string, Cache> = {}

    static register(classConstructor: CacheConstructor) {
        Cache.caches[classConstructor.name] = classConstructor;
	}

    static get<T extends Cache>(name: string){
        const constructor = Cache.caches[name];
        if(!constructor) {
            throw new Error(`Cache ${name} not found`)
        }
        if(!Cache.instances[name]) {
            Cache.instances[name] = new constructor();
        }
        return Cache.instances[name] as T;
    }

    get name() {
        return this.constructor.name
    }

}

type StoreConstructor = new (...args: any[]) => Store
export class Store {
    static stores: Record<string, StoreConstructor> = {}
    static instances: Record<string, Store> = {}

    static register(classConstructor: StoreConstructor) {
        Store.stores[classConstructor.name] = classConstructor;
    }

    static get<T extends Store>(name: string) {
        const constructor = Store.stores[name];
        if(!constructor) {
            throw new Error(`Store ${name} not found`)
        }
        if(!Store.instances[name]) {
            Store.instances[name] = new constructor();
        }
        return Store.instances[name] as T;
    }

    get name() {
        return this.constructor.name
    }
    
}
