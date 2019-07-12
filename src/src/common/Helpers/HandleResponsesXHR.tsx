import { ErrorMessages } from "./ErrorMessages";
import MessageBar from "../MessageBar";

export function handleOkResponse(response: XMLHttpRequest, handle: (response: XMLHttpRequest) => void): void {
    if (response.status === 200) {
        if (handle !== undefined) {
            handle(response);
        }
    }
}

export function handleBadRequest(response: XMLHttpRequest, handle?: (response: XMLHttpRequest) => void): void {
    if (response.status === 400) {
        MessageBar.setMessage(response.responseText);
        if (handle !== undefined) {
            handle(response);
        }
    }
}

export function handleCannotAccessServer(response: XMLHttpRequest, handle?: (response: XMLHttpRequest) => void): void {
    if (response.status === 404 || response.status === 0) {
        if (response.status === 404 && response.responseText !== undefined && response.responseText !== "") MessageBar.setMessage(response.responseText);
        else MessageBar.setMessage(ErrorMessages.CannotAccessServer);
        if (handle !== undefined) {
            handle(response);
        }
    }
}

export function handleUnauthorized(response: XMLHttpRequest, handle?: (response: XMLHttpRequest) => void): void {
    if (response.status === 401) {
        MessageBar.setMessage(ErrorMessages.UnauthorizedAccess);
        if (handle !== undefined) {
            handle(response);
        }
    }
}

export function handleNotAcceptable(response: XMLHttpRequest, handle?: (response: XMLHttpRequest) => void) {
    if (response.status === 406) {
        if (handle === undefined) MessageBar.setMessage(ErrorMessages.MalformedRequest);
        else {
            handle(response);
        }
    }
}