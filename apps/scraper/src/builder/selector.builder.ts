class SelectorBuilder {
  private readonly selector: string;

  constructor(selector: string) {
    this.selector = selector;
  }

  child(query: string) {
    return new SelectorBuilder(`${this.selector} ${query}`);
  }

  toString() {
    return this.selector;
  }
}

export default SelectorBuilder;
