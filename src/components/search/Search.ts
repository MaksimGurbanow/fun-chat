import { CallbackType } from "@/customTypes/types";
import BaseComponent from "../BaseComponent";
import Input from "../input/Input";
import classes from './Search.module.scss';
import search from '@/assets/images/search.svg';
import createSvg from "@/utils/createSvg";

export default class Search extends BaseComponent<HTMLDivElement> {
  private input: Input;
  
  constructor(
    callback: (key: string) => void
  ) {
    super({
      tag: 'div',
      classes: [classes.search],
    });
    this.input = new Input({
      txt: '',
      placeholder: 'Search user',
      id: 'searchUser',
      name: 'search user',
      callback: (e) => {
        const { target } = e;
        if (target instanceof HTMLInputElement) {
          const { value } = target;
          callback(value.toLocaleLowerCase())
        }
      },
    });
    const searchElem = createSvg(search);
    searchElem.classList.add(classes.searchIcon);
    this.appendChildren(this.input, searchElem);
  }
}