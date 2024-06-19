const KEY = 'chat_key'

export default class State {
  private fields;

  constructor() {
    this.fields = this.loadState();

    window.addEventListener('beforeunload', this.saveState.bind(this));
  }

  public getField(name: string) {
    if (this.fields.has(name)) {
        return this.fields.get(name);
    }
    return '';
  }

  public setField(name: string, value: string) {
    this.fields.set(name, value);
  }

  public saveState() {
    const fieldObj = Object.fromEntries(this.fields.entries());
    localStorage.setItem(KEY, JSON.stringify(fieldObj))
  }

  private loadState() {
    const storageInfo = localStorage.getItem(KEY);
    if (storageInfo) {
      const fieldObject = JSON.parse(storageInfo);
      return new Map(Object.entries(fieldObject));
    }
    return new Map();
  }
}