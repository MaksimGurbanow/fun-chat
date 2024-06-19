import { Props } from '@/customTypes/types';

export default class BaseComponent<T extends HTMLElement = HTMLElement> {
  protected element: T | null;

  constructor(
    props: Props<T>,
    ...children: (BaseComponent | HTMLElement | null)[]
  ) {
    this.element = null;
    this.createElement(props);
    if (children) {
      this.appendChildren(...children);
    }
  }

  protected createElement(props: Props<T>): void {
    const tag = props.tag ?? 'div';
    this.element = document.createElement(tag) as T;
    this.addClasses(props.classes);
    this.setTextContent(props.txt);
    this.setCallback(props.events);
  }

  public addClasses(classes: string[] | undefined): void {
    classes?.map((className) => this.element?.classList.add(className));
  }

  public removeClass(className: string): void {
    this.element?.classList.remove(className);
  }

  public toggleClass(className: string): void {
    this.element?.classList.toggle(className);
  }

  public setTextContent(text: string = ''): void {
    if (this.element) {
      this.element.textContent = text;
    }
  }

  public setCallback(events: Props['events']): void {
    events?.forEach((event) => {
      const { callback, eventType } = event;
      if (typeof callback === 'function' && eventType) {
        this.element?.addEventListener(eventType, callback);
      }
    });
  }

  public appendChildren(
    ...children: (BaseComponent | HTMLElement | SVGSVGElement | null)[]
  ): void {
    children
      .filter((child) => child !== null)
      .forEach((child) => {
        if (child instanceof BaseComponent) {
          const childElement = child.getElement();
          if (childElement) {
            this.element?.appendChild(childElement);
          }
        } else if (child instanceof HTMLElement) {
          this.element?.appendChild(child);
        } else if (child instanceof SVGSVGElement) {
          this.element?.append(child);
        }
      });
  }

  public getChildren() {
    return this.element?.children || [];
  }

  public moveChild(item: (BaseComponent | HTMLElement )): void {
    if (item instanceof BaseComponent) {
      this.element?.appendChild(item.getElement());
    }
  }

  public setAttributes(attributes: { [key: string]: string | number }[]) {
    attributes.forEach((attribute) => {
      for (const [key, value] of Object.entries(attribute)) {
        this.element?.setAttribute(key, value as string);
      }
    });
  }

  public getElement(): Node {
    return this.element as Node;
  }

  public destroyChildren(): void {
    this.element?.replaceChildren();
  }

  public destroy(): void {
    this.destroyChildren();
    this.element?.remove();
  }
}