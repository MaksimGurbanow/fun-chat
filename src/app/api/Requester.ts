import { socket } from "@/components/App";
import { MessageInfo, RequestType, UserInfo } from "@/interfaces/interfaces";
import { formatRequestData, } from "@/utils/formatData";

class Requester {
  constructor() {
  }

  private login(userInfo: UserInfo): void {
    socket.send(formatRequestData({
      id: userInfo.id as string,
      type: 'USER_LOGIN',
      payload: {
        user: {
          login: userInfo.login,
          password: userInfo.password
        }
      }
    }));
  }

  private logout(userInfo: UserInfo): void {
    socket.send(formatRequestData({
      id: userInfo.id as string,
      type: 'USER_LOGOUT',
      payload: {
        user: {
          login: userInfo.login,
          password: userInfo.password
        }
      }
    }));
  }

  private getActiveUsers(id?: string): void {
    socket.send(formatRequestData({
      id: id || '',
      type: 'USER_ACTIVE',
      payload: null,
    }));
  }

  private getInactiveUsers(id?: string): void {
    socket.send(formatRequestData({
      id: id || '',
      type: 'USER_INACTIVE',
      payload: null,
    }));
  }

  private getMessageHistory(id?: string, login?: string) {
    socket.send(formatRequestData({
      id: id || '',
      type: 'MSG_FROM_USER',
      payload: {
        user: {
          login: login || ''
        }
      }
    }));

  }

  private sendMessage(id: string, to: string, text: string) {
    socket.send(formatRequestData({
      id: id,
      type: 'MSG_SEND',
      payload: {
        message: {
          to,
          text,
        }
      }
    }));
  }

  private deleteMessage(userId?: string, msgId?: string) {
    if (userId && msgId) {        
      socket.send(formatRequestData({
        id: userId,
        type: 'MSG_DELETE',
        payload: {
          message: {
            id: msgId,
          }
        }
      }));
    }
  }

  private sendReadStatusChange(userId?: string, msgId?: string) {
    if (userId && msgId) {        
    socket.send(formatRequestData({
        id: userId,
        type: 'MSG_READ',
        payload: {
          message: {
            id: msgId,
          }
        }
      }));
    }
  }

  private editMessage(userId?: string, msgId?: string, msgTxt?: string) {
    socket.send(formatRequestData({
      id: userId || '',
      type: 'MSG_EDIT',
      payload: {
        message: {
          id: msgId,
          text: msgTxt,
        }
      }
    }));
  }

  public sendRequest(type: RequestType, userInfo: UserInfo, msgInfo?: MessageInfo) {
    switch (type) {
      case 'USER_LOGIN':
        this.login(userInfo);
        break;
      case "USER_LOGOUT":
        this.logout(userInfo);
        break;
      case "USER_ACTIVE":
        this.getActiveUsers(userInfo.id);
        break;
      case "USER_INACTIVE":
        this.getInactiveUsers(userInfo.id);
        break;
      case "MSG_SEND":
        if (msgInfo) {
          this.sendMessage(userInfo.id || '', msgInfo.to || '', msgInfo.text || '')
        }
        break;
      case "MSG_FROM_USER":
        this.getMessageHistory(userInfo.id, userInfo.login);
        break;
      case "MSG_DELIVER":
      case "MSG_READ":
        this.sendReadStatusChange(userInfo.id, msgInfo?.id);
        break;
      case "MSG_DELETE":
        this.deleteMessage(userInfo.id, msgInfo?.id);
        break;
      case "MSG_EDIT":
        this.editMessage(userInfo.id, msgInfo?.id, msgInfo?.text);
        break;
    }
  }
}

const requester = new Requester();
export default requester;
