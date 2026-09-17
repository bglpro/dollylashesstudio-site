const { JSDOM } = require("jsdom");

global.__clientWidth = 1280;

const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>", {
  pretendToBeVisual: true,
  url: "https://example.com",
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;
global.Element = dom.window.Element;
global.Node = dom.window.Node;
global.Event = dom.window.Event;
global.MouseEvent = dom.window.MouseEvent;
global.KeyboardEvent = dom.window.KeyboardEvent;
global.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
global.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
global.IS_REACT_ACT_ENVIRONMENT = true;

// jsdom n'implémente ni ResizeObserver ni la lecture vidéo
const observed = [];
class ResizeObserver {
  constructor(cb) {
    this.cb = cb;
  }
  observe(el) {
    observed.push([this, el]);
  }
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;
dom.window.ResizeObserver = ResizeObserver;
global.__observed = observed;

const playCalls = [];
const pauseCalls = [];
Object.defineProperty(dom.window.HTMLMediaElement.prototype, "play", {
  configurable: true,
  value() {
    playCalls.push(this.getAttribute("src"));
    return Promise.resolve();
  },
});
Object.defineProperty(dom.window.HTMLMediaElement.prototype, "pause", {
  configurable: true,
  value() {
    pauseCalls.push(this.getAttribute("src"));
  },
});
global.__playCalls = playCalls;
global.__pauseCalls = pauseCalls;

// clientWidth = 0 dans jsdom : on force une largeur de conteneur réaliste
Object.defineProperty(dom.window.HTMLElement.prototype, "clientWidth", {
  configurable: true,
  get() {
    return global.__clientWidth;
  },
});
