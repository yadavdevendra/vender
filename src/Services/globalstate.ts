import { environment } from "../environments/environment";
import { BasicObjI as ObjectI } from "../Core/@types";

export interface GSI {
  setsessionStorage: (key: string, value: string) => void;
  getsessionStorage: (key: string) => unknown;
  removesessionStorage: (key: string) => unknown;
  getBearerToken: (a:string | null) => string | null;
  prepareQuery: (params: ObjectI) => unknown;
  removeAllsessionStorage: () => void;
}

export const globalState: GSI = {
  setsessionStorage: (key: string, value: string): void => {
    sessionStorage.setItem(key, value);
  },
  getsessionStorage: (key: string): unknown => {
    return sessionStorage.getItem(key);
  },
  removesessionStorage: (key: string): unknown => {
    return sessionStorage.removeItem(key);
  },
  getBearerToken: (): string | null => {
    if (typeof sessionStorage.getItem("vendor_token") !== "string") {
      return environment.Bearer;
    } else {
      return sessionStorage.getItem("vendor_token");
    }
  },
  prepareQuery: (params: ObjectI): unknown => {
    let queryString = Object.keys(params).length > 0 ? "?" : "";
    const end = "";
    for (let i = 0; i < Object.keys(params).length; i++) {
      let key = params[Object.keys(params)[i]];
      queryString += end + key + "=" + params[key];
      key = "&";
    }
    return queryString;
  },
  removeAllsessionStorage: (): void => {
    sessionStorage.clear();
  },
};
