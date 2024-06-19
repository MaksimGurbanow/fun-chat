import BaseComponent from "../BaseComponent";
import Div from "../tags/div/Div";
import classes from './MessageOptions.module.scss'

export default class MessageOptions extends BaseComponent<HTMLDivElement> {
  private delete: Div;

  private edit: Div;
  
  constructor(
    deleteCallback: () => void,
    turnOnEditMode: () => void,
  ) {
    super({
      tag: 'div',
      classes: [classes.options],
    });

    this.delete = new Div({
      tag: 'div',
      txt: 'delete',
      classes: [classes.optionItem],
      events: [
        {
          eventType: 'click',
          callback: (e) => deleteCallback()
        }
      ]
    });
  
    this.edit = new Div({
      tag: 'div',
      txt: 'edit',
      classes: [classes.optionItem],
      events: [
        {
          eventType: 'click',
          callback: () => turnOnEditMode(),
        }
      ]
    });

    this.appendChildren(this.delete, this.edit);
  }
}