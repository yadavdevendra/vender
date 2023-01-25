/* eslint-disable @typescript-eslint/no-explicit-any */
import { requests } from "../Services";
import { ThunkAction } from "redux-thunk";
import { Action } from "redux";
// Action to Re-sync necessary Info
export const syncConnectorInfo =
  (): ThunkAction<void, any, unknown, Action<string>> => async (dispatch) => {
    await requests
      .GET(dispatch)("connector/get/all")
      .then((e) => {
        if (e.success && e.data) {
          dispatch({
            type: "setConnector",
            state: {
              connector: { ...e.data },
            },
          });
        }
        return e;
      });
  };

export const syncNecessaryInfo =
  (): ThunkAction<void, any, unknown, Action<string>> => async (dispatch) => {
    const path = [];
    path.push("/App/User/Step");
    await requests
      .POST(dispatch)("frontend/app/getStepCompleted", {
        path: "/App/User/Step",
      })
      .then((e) => {
        if (e.success) {
          dispatch({
            type: "setBasicInfo",
            state: {
              basic: {
                stepActive: e.data,
                name: e.name,
                shop_url: e.shop_url,
              },
            },
          });
        }
        return e;
      });
  };

export const showNotification =
  (
    message: string,
    error = false
  ): ThunkAction<void, any, unknown, Action<string>> =>
  (dispatch) => {
    dispatch({
      type: "showToast",
      state: {
        error: error,
        message: message,
      },
    });
  };

export const success =
  (message: string): ThunkAction<void, any, unknown, Action<string>> =>
  (dispatch) => {
    dispatch({
      type: "showToast",
      state: {
        error: false,
        message: message,
      },
    });
  };

export const error =
  (message: string): ThunkAction<void, any, unknown, Action<string>> =>
  (dispatch) => {
    dispatch({
      type: "showToast",
      state: {
        error: true,
        message: message,
      },
    });
  };

export const warn =
  (message: string): ThunkAction<void, any, unknown, Action<string>> =>
  (dispatch) => {
    dispatch({
      type: "showToast",
      state: {
        error: false,
        warn: true,
        message: message,
      },
    });
  };

export const hideNotification =
  (id: string | number): ThunkAction<void, any, unknown, Action<string>> =>
  (dispatch) => {
    dispatch({
      type: "hideToast",
      state: {
        id: id,
      },
    });
  };

export const themeChange =
  (type: string): ThunkAction<void, any, unknown, Action<string>> =>
  (dispatch) => {
    sessionStorage.setItem("cedTheme", type);
    dispatch({
      type: "theme",
      state: {
        type: type,
        newDesign: type !== "old",
      },
    });
  };
