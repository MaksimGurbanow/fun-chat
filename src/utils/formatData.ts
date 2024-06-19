import { Payload, Request, Response } from "@/interfaces/interfaces";

export function formatRequestData(data: Request) {
  return JSON.stringify(data);
}

export function formatResponseData(data: string = ''): Response {
  return JSON.parse(data);
}

export function formatErrorMessage(msg: string = '') {
  const formatedMessage = msg.charAt(0).toUpperCase() + msg.slice(1) + '!';
  return formatedMessage;
}
