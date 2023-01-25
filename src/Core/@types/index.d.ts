import { ProductI, CreateProductI } from "./Product";
import { OrderI } from "./Order";
import { DIProps } from "../DependencyInjection";

/**
 * THIS SHOULD EVENERY WHERE
 */
type PropsI = DIProps;

/**
 * Type of String | bool | number
 */
interface ObjI {
  [name: string]: string | number | boolean;
}

/**
 * Type of String  | number
 */
interface BasicObjI {
  [name: string]: string | number;
}

/**
 * Type of String | React.ReactNode | number
 */
interface AdvObjI {
  [name: string]: string | number | React.ReactNode;
}

interface environmentI {
  production: boolean;
  /**
   * Backend URL, it is Used in Request.js to Make call
   */
  API_ENDPOINT: string;
  AppName: string;
  user_id: string | null;
  /**
   * Token, it is a type of JWT
   */
  Bearer: string;
}

export {
  ObjI,
  BasicObjI,
  AdvObjI,
  environmentI,
  ProductI,
  CreateProductI,
  OrderI,
  PropsI,
};
