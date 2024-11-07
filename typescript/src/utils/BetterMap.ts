export class BetterMap<Key, Value> {
  private _values = new Map<string, Value>()
  private _keys = new Map<string, Key>()

  get keys() {
    return this._keys.values()
  }

  get values() {
    return this._values.values();
  }
  
  constructor(protected keyToString: (k: Key) => string) {}

  public set(key: Key, value: Value) {
    const s = this.keyToString(key)
    this._values.set(s, value)
    this._keys.set(s, key)
  }

  public delete(key: Key) {
    const s = this.keyToString(key)
    this._values.delete(s)
    this._keys.delete(s)
  }

  public get(key: Key): Value | undefined {
    return this._values.get(this.keyToString(key))
  }

  public has(key: Key): boolean {
    return this._keys.has(this.keyToString(key))
  }
}