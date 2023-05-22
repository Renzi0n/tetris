import { createElement } from "../../common";

export class Component<T extends Element = Element> {
    constructor() {
      if (new.target === Component) {
        throw new Error(`Can't instantiate Component, only concrete one.`);
      }
    }

    private _element: Element | null = null;
  
    protected getTemplate(): string {
      throw new Error(`Abstract method not implemented: getTemplate.`);
    }
  
    getElement(): T {
      if (!this._element) {
        this._element = createElement(this.getTemplate());
      }
  
      return this._element as T;
    }

    protected removeListeners(): void {};
  
    removeElement() {
      if (this._element) {
        if (this.removeListeners) this.removeListeners();
        this._element.remove();
        this._element = null;
      }
    }
}