import * as React from "react";

/**
 * Merged Interfaces
 */
export interface PropsInterface
  extends RowInterface,
    checked,
    ColumnInterface,
    SettingsInterface,
    EventsInterface,
    ObjectInterface {
  index?: number;
  row?: ObjectInterface;
  section1?: JSX.Element;
  section2?: JSX.Element;
  section3?: JSX.Element;
  loading?: boolean;
  viewColumnToggle?: boolean;
  popOverData?:React.ReactNode;
}
export interface checked {
  check?: boolean;
}
export interface RowInterface {
  /**
   * This will get the Array of Rows,
   * each child been given with the same key as Column which will help it in render right
   */
  rows: Array<ObjectInterface>;
  enableSelect?: boolean;
  uniqueKey?: string;
  selectedArray?: Array<string | number | React.ReactNode>;
  massAction?:React.ReactNode;
  onRowSelect?: (row: ObjectInterface) => void;
  Accordiankey?: string;
  // onAllRowSelect ?: (rows : Array<ObjectInterface>) => void,
}

/**
 * Grids Settings
 */
export interface SettingsInterface {
  /**
   * Enable/disable Columns Wise Filters
   */
  enableColumnsFilter?: boolean;
  /**
   * Enable/Disable Sorting, To be Available in Future update
   */
  enableColumnsSorting?: boolean;
}

/**
 * grids Events
 */
export interface EventsInterface {
  rowOnClick?: (row: ObjectInterface) => void;
  columnOnClick?: () => void;
}

export interface ColumnInterface {
  /**
   * The Column for the Rows, name is required , position will be decided by the prepared key
   */
  columns: ColumnObjectInterface;
  
  onAllRowSelect?: () => void;
  handleFilterFinal?: (filterFinal: {
    [name: string]: filterObjectInterface;
  }) => void;
  filterOptions?: { value: number; label: string }[];
}
/**
 * this Will give { name : "value1", id : 2 }
 */
export interface ColumnObjectInterface {
  [abc: string]: ColumnKeyInterface;
}

export interface ColumnKeyInterface extends extraColumnKeys {
  /**
   * this will be shown in Column heading
   */
  name: string;
  /**
   * Unique Identifier
   */
  id?: string | number;
  /**
   * used to enable or Disable Filer
   */
  filter?: boolean;
  /**cedcoss@MdFaizanKhan:~/traning-admin-panel$
   * Enable or Disable the Sorting feature
   * TODO : Need to Implement in future
   */
  sort?: boolean;
  // Show or hide the column
  visible?: boolean;
  /**
   * This Data Will be return As it is, when you do any action on Grids
   * E.g : { keyForFilter : 'shops.SOMETHING' } , this will return as it is
   */
  rawData?: Array<ObjectInterface>;
  preFilter?: React.ReactNode;
  enableMobileImage?:boolean;

}
interface extraColumnKeys {
  filterText?: string;
  type?: string;
  filterOption?: string;
  domain?: string;
  sorting?: boolean;
  width?:string;
}
export interface ArrayInterface {
  [index: number]: ObjectInterface;
}

/**
 * this Will give { key1 : "value1", key2 : 2, key3 : <p>Value</p> }
 */
export interface ObjectInterface {
  [name: string]: React.ReactNode | string | number | boolean;
  according?: React.FunctionComponent<{row: ObjectInterface}>;
}
export interface filterObjectInterface {
  key: string;
  value: string;
  rawData: ObjectInterface;
}
