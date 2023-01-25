/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from "react";

import { StoreDispatcher } from "../index";

import { connect } from "react-redux";
import { Action } from "redux";

import { withRouter, RouteComponentProps, match } from "react-router-dom";

import * as _Services from "../Services";
import * as _env from "../environments/environment";
import {
  showNotification,
  hideNotification,
  success,
  error,
  warn,
} from "../Actions";
import { environmentI, ObjI } from "./@types";
import { GSI as globalStateI } from "../Services/globalstate";
import { ThunkDispatch } from "redux-thunk";

type ObjectI = {
  [key: string]: any;
};

interface diI {
  environment: environmentI;
  GET: (endpoint: string, params?: ObjI, fullUrl?: boolean) => Promise<any>;
  POST: (
    endpoint: string,
    data?: ObjI,
    fullUrl?: boolean,
    form?: boolean
  ) => Promise<any>;
  DELETE: (endpoint: string, data?: ObjI, fullUrl?: boolean) => Promise<any>;
  PUT: (endpoint: string, data?: ObjI, fullUrl?: boolean) => Promise<any>;
  globalState: globalStateI;
}

interface PreFunI {
  showNotification: (message: string, error?: boolean) => void;
  success: (message: boolean) => void;
  error: (message: string) => void;
  warn: (message: string) => void;
  hideNotification: (id: string | number) => void;
}

/**
 * THIS SHOULD be used with DI\, it will help you in using the Dependency without any problem
 */
interface DIProps extends RouteComponentProps, PreFunI {
  currency: any;
  match: match<{ [name: string]: string }>;
  di: diI;
  redux: {
    sup_id: string | null;
    basic: {
      name: string;
      shop_url: string;
      stepActive: string;
    };
    connector: {
      [code: string]: {
        can_import: 1 | 0;
        code: string;
        description: string;
        image: string;
        installed: Array<ObjectI> | number;
        is_source: boolean;
        is_target: boolean;
        source_model: string;
        title: string;
        type: "real";
        [extra: string]: any;
      };
    };
  };
}

interface OptionalParams {
  /**
   * Redux Action, you can send your own Action here\
   * E.g YOUR Func = () => (dispacher) => {/ YOUR LOGIC /}
   */
  func?: ObjectI;
  /**
   * Justify if you want to Inject the Redux State or Not\
   * DEFAULT if true
   */
  stateNeeded?: boolean;
}

/**
 * This Will Inject the Nessasary props which will help in the Compoenent\
 * E.G : Notify, Redux ,Router, Services etc\
 * You can access them using props, props.di or props.redux
 */
const DependencyInjection = function (
  Component: React.FC | any,
  { func = {}, stateNeeded = true }: OptionalParams = {}
): React.FC<ObjectI> {
  const ComponentWrapper = function (props: ObjectI): JSX.Element {
    const dispacher = useContext(StoreDispatcher);

    /**
     * This will Inject Services and Environment Variable\
     * Props.di.GET or Props.di.POST
     */
    const Dispatch: ThunkDispatch<any, unknown, Action<string>> = dispacher;
    const di: diI = {
      ..._Services,
      GET: _Services.GET(Dispatch, { ...props.redux }),
      POST: _Services.POST(Dispatch, { ...props.redux }),
      DELETE: _Services.DELETE(Dispatch, { ...props.redux }),
      PUT: _Services.PUT(Dispatch, { ...props.redux }),
      ..._env,
    };
    return (
      <React.Fragment>
        <Component {...props} di={di} />
      </React.Fragment>
    );
  };

  /**
   * Injecting the Redux Stated\
   * @param state = Redux State, you can find all the state in Reduces folder and used them accordingly
   */
  const mappedStateToProps = (state: any) => {
    return { redux: { ...state.necessaryInfo } };
  };

  /**
   * Pre define Function for Redux
   */
  const preFunInject = {
    showNotification,
    success,
    error,
    warn,
    hideNotification,
  };

  return connect(!stateNeeded ? null : mappedStateToProps, {
    ...func,
    ...preFunInject,
  })(withRouter<any, any>(ComponentWrapper));
};

export default DependencyInjection;

export { DependencyInjection as DI, DIProps, PreFunI, diI };
