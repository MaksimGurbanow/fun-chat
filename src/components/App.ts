import { MessageInfo, RequestType, Response, UserInfo, UserState } from '@/interfaces/interfaces';
import Login from './login/Login';
import { generateUserId } from '@/utils/generateUserId';
import State from '@/state/State';
import Menu from './menu/Menu';
import Router from '@/router/Router';
import { Pages } from '@/router/pages';
import { isValid } from '@/utils/checkValidity';
import BaseComponent from './BaseComponent';
import { formatErrorMessage, formatResponseData } from '@/utils/formatData';
import requester from '@/app/api/Requester';
import Page from './page/Page';
import { connection } from '@/app/api/socket';

let socket = connection();

export { socket };

export default class App {
  private loginPage: Login;

  private menuPage: Menu;

  private infoPage: Page;

  private recconectPage: Page; 

  private user: UserState;

  private router: Router;

  private rootElem: HTMLElement | null = null;

  private state = new State();

  private currentPage = Pages.LOGIN;

  constructor() {
    this.router = new Router();
    this.initWebSocketListener();
    this.initWindowListener();
    this.user = {
      login: this.state.getField('login') || '',
      password: this.state.getField('password') || '',
      id: generateUserId(),
      recepient: '',
      isEditing: false,
      msgId: '',
      islogined: false,
      isRecepientLogined: false,
    };
    this.loginPage = new Login(
      this.user,
      (e) => this.sendRequest.bind(this)('USER_LOGIN'),
      this.handleChange.bind(this),
      (e) => this.switchPage.bind(this)(Pages.ABOUT),
    );
    this.menuPage = new Menu(
      this.user,
      this.sendRequest.bind(this),
      this.sendMessage.bind(this),
      (e) => this.switchPage.bind(this)(Pages.ABOUT),
    );
    this.infoPage = new Page(
      `The application was develope
      as part of the course the RSSchool JS/FE
     2023Q3 course`,
     'Info',
      (e) => {
      if (this.user.islogined) {
        this.switchPage(Pages.MENU);
      } else {
        this.switchPage(Pages.LOGIN);
      }
    });
    this.recconectPage = new Page(
      `Oops... Disconnection occured. would you like to try to reconnect?`,
      'Reconnect',
      (e) => {
        socket = connection();
        socket.onopen = () => {
          this.sendRequest('USER_LOGIN');
          this.initWebSocketListener();
        }
      }
    );

  }
  
  private initWindowListener() {
    window.addEventListener('keyup', (e) => {
      if (
        e.key === 'Enter' &&
        isValid(this.user.login, this.user.password || '')
      ) {
        switch (this.currentPage) {
          case Pages.LOGIN:
            this.sendRequest('USER_LOGIN');
            break;
          case Pages.MENU:
            this.sendMessage();
            break;
          default:
            throw new Error('PageError: unknown page');
        }
      }
    });
  }

  public init() {
    this.rootElem = document.createElement('div');
    this.rootElem.id = 'root';
    document.body.append(this.rootElem);
    this.router.navigateToPage(Pages.LOGIN);
    this.renderPage(this.loginPage);
  }

  private renderPage(elem?: BaseComponent | null) {
    this.rootElem?.replaceChildren();
    if (elem) {
      this.rootElem?.appendChild(elem.getElement());
    }
  }

  private handleChange(e: Event) {
    const { target } = e;
    if (target instanceof HTMLInputElement) {
      const { name, value } = target;
      const allowedNames = ['login', 'password'];
      if (allowedNames.includes(name)) {
        this.user[name] = value;
        this.state.setField(name, value);
      }
    }
  }

  private sendMessage() {
    if (this.user.recepient && this.user.txt) {
      if (this.user.isEditing) {
        this.sendRequest('MSG_EDIT', {
          id: this.user.msgId,
          text: this.user.txt,
        });
      } else {
        this.sendRequest('MSG_SEND', {
          to: this.user.recepient, 
          text: this.user.txt,
        });
      }
      this.menuPage.clearInput();
      this.user.isEditing = false;
      this.user.txt = '';
      this.user.msgId = '';
    }
  }

  private switchPage(page: Pages) {
    switch (page) {
      case Pages.MENU:
        this.renderPage(this.menuPage);
        break;
      case Pages.LOGIN:
        this.renderPage(this.loginPage);
        break;
      case Pages.ABOUT:
        this.renderPage(this.infoPage);
        break;
      case Pages.RECONNECT:
        this.renderPage(this.recconectPage);
        break;
    }
    this.router.navigateToPage(page);
    this.currentPage = page;
  }

  private initWebSocketListener() {
    socket.onmessage = (e) => {
      const data = formatResponseData(e.data);
      if (data) {
        const { id, type, payload } = data as Response;
        switch (type) {
          case 'USER_LOGIN':
            this.menuPage.setheaderContent();
            this.user.islogined = true;
            this.switchPage(Pages.MENU);
            this.sendRequest('USER_ACTIVE');
            this.sendRequest('USER_INACTIVE');
            break;
          case 'USER_LOGOUT':
            this.switchPage(Pages.LOGIN);
            this.user.islogined = false;
            break;
          case 'ERROR':
            const formatedError = formatErrorMessage(payload?.error)
            this.loginPage.renderError(formatedError);
            break;
          case 'USER_EXTERNAL_LOGIN':
            const loginedUser = payload?.user;
            if (loginedUser) {
              this.menuPage.addUsers(loginedUser);
            }
            break;
          case 'USER_EXTERNAL_LOGOUT':
            const logoutUser = payload?.user;
            if (logoutUser) {
              this.menuPage.addUsers(logoutUser);
            }
          break;
          case 'USER_ACTIVE':
            if (payload?.users) {
              const filteredUsers = payload.users
                .filter((user: UserInfo) => user.login !== this.user.login);
              this.menuPage.addUsers(...filteredUsers);
              filteredUsers.forEach((user) => {
                requester.sendRequest('MSG_FROM_USER', {
                  id: id || '',
                  login: user.login
                });
              });
            }
            break;
          case 'USER_INACTIVE':
            if (data.payload?.users) {
              const { users } = data.payload;
              this.menuPage.addUsers(...users);
              users.forEach((user) => {
                requester.sendRequest('MSG_FROM_USER', {
                  id: id || '',
                  login: user.login
                })
              })
            }
            break;
          case 'MSG_SEND':
            if (!payload?.message) {
              throw new Error('Message payload is empty')
            }
              this.menuPage.addMessage(payload.message);
            break;
          case 'MSG_FROM_USER':
            const messages = payload?.messages || [];
            if (messages.length) this.menuPage.getMessageHistory(
              ...messages
            )
            break;
          case 'MSG_DELIVER':
            if (payload?.message) {
              this.menuPage.notify(payload?.message);
            }
            break;
          case 'MSG_READ':
            if (!payload?.message) {
              throw new TypeError('Message info is empty');
            }
            if (id === null) {
              this.menuPage.getMessageHistory(payload.message);
              this.menuPage.notify(payload.message);
            }
            this.menuPage.read(payload?.message);
            break;
          case 'MSG_DELETE':
            if (payload?.message) {
              this.menuPage.deleteMessage(payload?.message);
            }
            break;
          case 'MSG_EDIT':
            if (payload?.message) {
              this.menuPage.editMessage(payload?.message);
            }
            break;
          default:
            break;
        }
      }
    }
    socket.onclose = (e) => {
      this.switchPage(Pages.RECONNECT);
    }
  }

  private sendRequest(reqType: RequestType, msgInfo?: MessageInfo) {
    requester.sendRequest(reqType, this.user, msgInfo);
  }
}
