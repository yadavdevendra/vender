/* eslint-disable @typescript-eslint/no-explicit-any */

interface necessaryInfoActionI {
  type:
    | "syncNecessaryInfo"
    | "setConnector"
    | "setBasicInfo"
    | "TOKEN_EXPIRE"
    | "SUPPLIER_ID";
  state: any;
  payload: any;
}

export const necessaryInfo = (
  state = {},
  action: necessaryInfoActionI
): any => {
  switch (action.type) {
    case "syncNecessaryInfo":
      return {
        ...state,
        ...action.state,
      };
    case "SUPPLIER_ID":
      return {
        ...state,
        ...{ sup_id: action.payload },
      };
    case "TOKEN_EXPIRE":
      return {
        ...state,
        LOGIN_STATUS: {
          ...action.state,
          status: "LOGOUT",
        },
      };
    case "setConnector":
      return {
        ...state,
        ...action.state,
      };
    case "setBasicInfo":
      return {
        ...state,
        ...action.state,
      };
    default:
      return { ...state };
  }
};
