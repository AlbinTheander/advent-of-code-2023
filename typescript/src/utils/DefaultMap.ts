import { BetterMap } from "./BetterMap";

export class DefaultMap<Key, Value> extends BetterMap<Key, Value> {
    constructor(
        keyToString: (key: Key) => string,
        private defaultValue: Value
    ) {
        super(keyToString);
    }

    override get(key: Key): Value {
        const v = super.get(key);
        return v === undefined ? this.defaultValue : v;
    }

    copy(): DefaultMap<Key, Value> {
        const copy = new DefaultMap(this.keyToString, this.defaultValue);
        for (const key of this.keys) {
            copy.set(key, this.get(key));
        }
        return copy;
    }
}
