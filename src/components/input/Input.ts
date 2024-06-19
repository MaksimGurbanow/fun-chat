import { CallbackType } from "@/customTypes/types";
import BaseComponent from "../BaseComponent";
import classes from'./Input.module.scss';

export default class Input extends BaseComponent<HTMLInputElement> {
  constructor(attributes: {
    txt: string,
    placeholder: string,
    id: string,
    name: string,
    callback: CallbackType
  }) {
    const { txt, id, name, placeholder, callback } = attributes;
    super({
      tag: 'input',
      classes: [classes.input],
      events: [
        {
          eventType: 'keyup',
          callback: (e) => {
            callback(e);
          }
        }
      ]
    });
    this.setAttributes([
      { 'placeholder': placeholder },
      { 'id': id },
      { 'name': name },
      { 'value': txt },
      { 'required': 'true' },
      {'autocomplete': 'off'}
    ]);
  }

  public clear() {
    if (this.element instanceof HTMLInputElement) {
      this.element.value = '';
    }
  }

  public set(value: string) {
    if (this.element instanceof HTMLInputElement) {
      this.element.value = value;
    }
  }
}