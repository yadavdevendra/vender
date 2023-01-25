/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { environment } from "../environments/environment";
import { globalState } from "./globalstate";
import { ObjI as ObjectI } from "../Core/@types";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { store } from "../Reducers";

const message = `Sorry, the request was unsuccessful. Please come back later.`;
const GET =
  (
    dispatch: ThunkDispatch<any, unknown, Action<string>>,
    StateProps: ObjectI = {}
  ) =>
  (endpoint: string, params?: ObjectI, fullUrl = false): Promise<any> => {
    console.log(store.getState().necessaryInfo.sup_id, store.getState(), "get");
    environment.user_id = store.getState().necessaryInfo.sup_id;
    let paramsString = "";
    if (params) {
      paramsString += "?";
      for (let i = 0; i < Object.keys(params).length; i++) {
        const end = i < Object.keys(params).length - 1 ? "&" : "";
        paramsString +=
          Object.keys(params)[i] +
          "=" +
          encodeURIComponent(params[Object.keys(params)[i]]) +
          end;
      }
    }
    let url = environment.API_ENDPOINT + endpoint;
    if (fullUrl) {
      url = endpoint;
    }
    return fetch(url + paramsString, {
      method: "GET",
      headers: {
        Authorization:
          "Bearer " +
          globalState.getBearerToken(store.getState().necessaryInfo.sup_id),
      },
    })
      .then((res) => res.json())
      .then((e) => {
        if (
          e.code === "token_expired" ||
          e.code === "invalid_token" ||
          e.code === "future_token" ||
          e.code === "token_user_not_found" ||
          e.code === "token_decode_error"
        ) {
          dispatch({
            type: "TOKEN_EXPIRE",
            state: e,
          });

          setTimeout(() => {
            window.location.href = `/auth/login/${sessionStorage.getItem(
              "admin_shop_id"
            )}`;
          }, 2000);
          sessionStorage.removeItem("user_authenticated");
          sessionStorage.removeItem("vendor_token");
          sessionStorage.removeItem("loglevel:webpack-dev-server");
        }
        return responseModifier(e);
      })
      .catch((e) => {
        return { success: false, message: message, code: e };
      });
  };
const POST =
  (
    dispatch: ThunkDispatch<any, unknown, Action<string>>,
    StateProps: ObjectI = {}
  ) =>
  (
    endpoint: string,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    data?: any,
    fullUrl = false,
    form = false
  ): Promise<any> => {
    let url = environment.API_ENDPOINT + endpoint;
    if (fullUrl && form) {
      url = endpoint;
    }

    const headers: any = form
      ? {
          // "Content-type": "multipart/form-data",
          Accept: "application/json",
          Authorization:
            "Bearer " +
            globalState.getBearerToken(store.getState().necessaryInfo.sup_id),
        }
      : {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization:
            "Bearer " +
            globalState.getBearerToken(store.getState().necessaryInfo.sup_id),
        };

    return fetch(url, {
      method: "POST",
      headers: headers,
      //  {
      //   "Content-Type": "application/json",
      //   Accept: "application/json",
      //   Authorization: "Bearer " + globalState.getBearerToken(),
      // },
      body: form ? data : JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((e) => {
        if (
          e.code === "token_expired" ||
          e.code === "invalid_token" ||
          e.code === "future_token" ||
          e.code === "token_user_not_found" ||
          e.code === "token_decode_error"
        ) {
          dispatch({
            type: "TOKEN_EXPIRE",
            state: e,
          });

          setTimeout(() => {
            window.location.href = `/auth/login/${sessionStorage.getItem(
              "admin_shop_id"
            )}`;
          }, 2000);
          sessionStorage.removeItem("user_authenticated");
          sessionStorage.removeItem("vendor_token");
          sessionStorage.removeItem("loglevel:webpack-dev-server");
        }

        return responseModifier(e);
      })
      .catch((e) => {
        return { success: false, message: message, code: e };
      });
  };

// const POST = (dispatch: ThunkDispatch<any, unknown, Action<string>>, StateProps : ObjectI = {}) => (endpoint: string, data?: ObjectI, fullUrl = false): Promise<any> => {
// 	let url = environment.API_ENDPOINT + endpoint;
// 	if (fullUrl) {
// 		url = endpoint;
// 	}
// 	return fetch(url, {
// 		method: "POST",
// 		headers: {
// 			"Content-Type": "application/json",
// 			Accept: "application/json",
// 			Authorization: "Bearer " + globalState.getBearerToken()
// 		},
// 		body: JSON.stringify(data)
// 	})
// 		.then(res => res.json())
// 		.then(e => {
// 			if (e.code === 'token_expired' || e.code === 'invalid_token' ||
// 				e.code === 'future_token' ||
// 				e.code === 'token_decode_error') {
// 				dispatch({
// 					type: "TOKEN_EXPIRE",
// 					state: e
// 				});
// 			}
// 			return responseModifier(e);
// 		})
// 		.catch(e => {
// 			return { success: false, message: message, code: e };
// 		});
// };

const DELETE =
  (
    dispatch: ThunkDispatch<any, unknown, Action<string>>,
    StateProps: ObjectI = {}
  ) =>
  (endpoint: string, data?: ObjectI, fullUrl = false): Promise<any> => {
    let url = environment.API_ENDPOINT + endpoint;
    if (fullUrl) {
      url = endpoint;
    }
    return fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization:
          "Bearer " +
          globalState.getBearerToken(store.getState().necessaryInfo.sup_id),
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((e) => {
        if (
          e.code === "token_expired" ||
          e.code === "invalid_token" ||
          e.code === "future_token" ||
          e.code === "token_user_not_found" ||
          e.code === "token_decode_error"
        ) {
          dispatch({
            type: "TOKEN_EXPIRE",
            state: e,
          });

          setTimeout(() => {
            window.location.href = `/auth/login/${sessionStorage.getItem(
              "admin_shop_id"
            )}`;
          }, 2000);
          sessionStorage.removeItem("user_authenticated");
          sessionStorage.removeItem("vendor_token");
          sessionStorage.removeItem("loglevel:webpack-dev-server");
        }

        return responseModifier(e);
      })
      .catch((e) => {
        return { success: false, message: message, code: e };
      });
  };

const PUT =
  (
    dispatch: ThunkDispatch<any, unknown, Action<string>>,
    StateProps: ObjectI = {}
  ) =>
  (endpoint: string, data?: ObjectI, fullUrl = false): Promise<any> => {
    let url = environment.API_ENDPOINT + endpoint;
    if (fullUrl) {
      url = endpoint;
    }
    return fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization:
          "Bearer " +
          globalState.getBearerToken(store.getState().necessaryInfo.sup_id),
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((e) => {
        if (
          e.code === "token_expired" ||
          e.code === "invalid_token" ||
          e.code === "future_token" ||
          e.code === "token_user_not_found" ||
          e.code === "token_decode_error"
        ) {
          dispatch({
            type: "TOKEN_EXPIRE",
            state: e,
          });
          setTimeout(() => {
            window.location.href = `/auth/login/${sessionStorage.getItem(
              "admin_shop_id"
            )}`;
          }, 2000);
          sessionStorage.removeItem("user_authenticated");
          sessionStorage.removeItem("vendor_token");
          sessionStorage.removeItem("loglevel:webpack-dev-server");
        }
        return responseModifier(e);
      })
      .catch((e) => {
        return { success: false, message: message, code: e };
      });
  };

function responseModifier(res: ObjectI): ObjectI {
  if (!res["success"] || res["errorFlag"] !== undefined) {
    res["success"] = false;
    if (!res["message"] && res["msg"]) {
      res["message"] = res["msg"];
    }
  }
  return res;
}

const requests = {
  GET: GET,
  POST: POST,
  DELETE: DELETE,
  PUT: PUT,
};

export default requests;

export { requests, GET, POST, DELETE, PUT };
