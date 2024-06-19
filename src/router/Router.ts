export default class Router {
  constructor() {
    this.init();
  }

  private init() {
    addEventListener('hashchange', this.handleUrlChange.bind(this));
    this.handleUrlChange();
  }

  public handleUrlChange() {
    const page = location.hash.slice(1);
  }

  public navigateToPage(page: string) {
    const url = `/${page}`;
    window.history.pushState({ page }, '', url);
  }
}