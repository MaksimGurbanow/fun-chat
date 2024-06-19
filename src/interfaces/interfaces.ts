export interface Request {
  id: string | null;
  type?: RequestType;
  payload: Payload | null
}

export interface Response extends Request {}

export interface Payload {
  user?: UserInfo;
  error?: string;
  users?: UserInfo[];
  message?: MessageInfo;
  messages?: MessageInfo[]
}

export interface UserInfo {
  login: string;
  password?: string;
  islogined?: boolean;
  id?: string;
  [key: string]: any;
}

export interface UserState extends UserInfo {
  recepient: string;
  isEditing: boolean;
  msgId: string;
  isRecepientLogined: boolean;
}

export interface MessageInfo {
  id?: string;
  from?: string;
  to?: string;
  status?: Status;
  datetime?: number;
  text?: string;
}

export interface Status {
  isDelivered: boolean;
  isReaded: boolean;
  isEdited: boolean;
  isDeleted: boolean;
}

export type RequestType = 
'USER_LOGIN' 
| 'USER_LOGOUT' 
| 'ERROR' 
| 'USER_EXTERNAL_LOGIN'
| 'USER_EXTERNAL_LOGOUT'
| 'USER_ACTIVE'
| 'USER_INACTIVE'
| 'MSG_SEND'
| 'MSG_FROM_USER'
| 'MSG_DELIVER'
| 'MSG_READ'
| 'MSG_DELETE'
| 'MSG_EDIT'

export type RequestCallback = (req: RequestType, msgInfo?: MessageInfo) => void;
