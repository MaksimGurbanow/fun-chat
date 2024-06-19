export type CallbackType = (event: Event | DragEvent) => void;

export interface EventInterface {
  callback?: CallbackType;
  eventType?: Event['type'] | DragEvent['type'];
}
export type Props<T extends HTMLElement = HTMLElement> = Partial<
  Omit<T, 'style' | 'dataset' | 'classList' | 'children' | 'tagName'>
> & {
  txt?: string;
  classes?: string[];
  tag?: keyof HTMLElementTagNameMap;
  events?: EventInterface[];
};

export type ElementFnProps<T extends HTMLElement = HTMLElement> = Omit<
  Props<T>,
  'tag'
>;
