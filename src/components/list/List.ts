import { UserInfo } from "@/interfaces/interfaces";
import BaseComponent from "../BaseComponent";
import classes from './List.module.scss'
import UserItem from "../item/UserItem";
import Div from "../tags/div/Div";
import Search from "../search/Search";

export default class List extends BaseComponent<HTMLDivElement> {
  private userItems = new Map<string, UserItem>();

  private usersBlock: Div;

  private searchBlock: Search;

  private callback;

  constructor(
    user: UserInfo,
    callback: (user: UserInfo) => void
  ) {
    super({
      tag: 'div',
      classes: [classes.list],
    });
    this.callback = callback;
    this.searchBlock = new Search(this.searchUsers.bind(this));
    this.usersBlock = new Div({
      tag: 'div',
      classes: [classes.users]
    });
    this.appendChildren(this.searchBlock, this.usersBlock);
  }

  public renderUsers(users: Map<string, UserInfo>) {
    users.forEach((v, k) => {
      if (this.userItems.has(k)) {
        this.userItems.get(k)?.updateItem(v);
      } else {
        const newItem = new UserItem(v, this.callback);
        this.userItems.set(k, newItem);
        this.appendChildren(newItem)
      }
    });
  }

  private searchUsers(key: string) {
    this.userItems.forEach((userItem, login) => {
      if (!login.toLocaleLowerCase().includes(key)) {
        userItem.hide();
      } else {
        userItem.show();
      }
    });
  }

  public getItem(k: string) {
    return this.userItems.get(k);
  }

}