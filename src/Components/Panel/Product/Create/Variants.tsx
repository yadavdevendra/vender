/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CheckBox,
  FlexLayout,
  Button,
  TextField,
  Card,
  Badge,
  Table,
  //   insta,
  //   TextArea,
  //   TextStyles,
  Select,
  FlexChild,
} from "@cedcommerce/ounce-ui";
import { profile } from "console";
import React, { useState, useEffect } from "react";
import { DI, DIProps } from "../../../../Core";
interface Obj {
  [name: string]: {
    att: string;
    attValue: string;
    fieldArr: Array<string>;
  };
}
interface Objtext {
  [name: string]: {
    weight: number;
    requires_shipping: any;
    inventory_policy: any;
    inventory_tracked: any;
    weight_unit: any;
    source_product_id: string;
    variant_image?: any;
    price?: number | string;
    compare_at_price?: number;
    quantity?: any;
    sku?: string;
    barcode?: string;
    variant_title?: string;
    type?: string;
    del?: boolean;
    edit?: boolean;
    sell?: any;
    realQty?: any;
  };
}

interface EditInstance {
  source_product_id: string;
  price?: number;
  quantity?: any;
  sku?: number;
  barcode?: string;
  variant_title?: string;
  sell?: boolean;
}
interface props1 extends DIProps {
  variantData: any;
  type: any;
  saveEditDisable: boolean;
  varientToAddProduct: (
    varE: Array<{
      variant_title: string;
      price: number;
      quantity: any;
      sku: string;
      barcode: string;
    }>
  ) => void;
  variant_check: (val: any) => any;
  editedVarient: (val: any) => any;

  tableLength: (val: number) => void;
  editedSell: (val: any) => any;
  SetIsVarImageEditFun: (val: any) => void;
  currency: string;
  variantArrReset: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  arr1: any;
  source_marketplace: string;
  variantsAttributes: any;
  lenarr1: Array<number>;
  variant1: Array<string>;
  attr1: Array<string>;
  attr2: Array<string>;
  attr3: Array<string>;
}

function Variants(props: props1): JSX.Element {
  const {
    price,
    quantity,
    sku,
    barcode,
    inventory_tracked,
    inventory_policy,
    weight,
    weight_unit,
  } = props.variantData.details;
  const [CheckedSell, setCheckedSell] = useState<any>(false);
  const [InventoryPolicy, setInventoryPolicy] = useState(false);
  const [sell, setSell] = useState<any>({});
  const [diff, changeDiff] = useState(false);
  const [constState, constComplete] = useState(false);
  const [lenArray, lenHandle] = useState([0]);

  const [varImgObj, setVarImgObj] = useState({});
  const [tracked, setTracked] = useState<boolean>(false);
  const [NewOptionName, setNewOptionName] = useState<any>();
  const [arr, setArr] = useState<
    Array<{
      variant_title: string;
      price: JSX.Element;
      quantity: any;
      sku: JSX.Element;
    }>
  >([]);
  const [newArr, setNewArr] = useState<
    Array<{
      variant_title: string;
      price: number;
      quantity: any;
      sku: string;
      barcode: string;
    }>
  >([]);
  const [instance, changeInstance] = useState<Objtext>({});
  const [instanceEdit, setInstanceEdit] = useState<any>({});

  const [attrType, setAttrType] = useState<Obj>({
    0: {
      att: "Color",
      attValue: "",
      fieldArr: [],
    },
    1: {
      att: "Size",
      attValue: "",
      fieldArr: [],
    },
    2: {
      att: "",
      attValue: "",
      fieldArr: [],
    },
  });
  const [varname, setvarname] = useState("");
  useEffect(() => {
    setAttrType({
      0: {
        att: "Color",
        attValue: "",
        fieldArr: [],
      },
      1: {
        att: "Size",
        attValue: "",
        fieldArr: [],
      },
      2: {
        att: "Material",
        attValue: "",
        fieldArr: [],
      },
    });
    setArr([]);
    setNewArr([]);
    lenHandle([0]);
  }, [diff]);
  //.........................................................................
  // eslint-disable-next-l)
  useEffect(() => {
    const OptionName: any = [];
    if (props != undefined) {
      lenHandle(props.lenarr1);
      if (props.type == "variant") {
        Object.keys(props.arr1).map((e) => {
          if (props.arr1[e].edited_fields != undefined) {
            OptionName.push(props.arr1[e].variant_title);

            instance[props.arr1[e].variant_title] = {
              source_product_id: props.arr1[e].source_product_id,

              variant_image: props.arr1[e].variant_image,

              price:
                props.arr1[e]["edited_fields"]["variants"] != undefined
                  ? props.arr1[e]["edited_fields"].variants[
                    props.arr1[e].source_product_id
                  ].price != undefined
                    ? props.arr1[e]["edited_fields"].variants[
                      props.arr1[e].source_product_id
                    ].price
                    : parseFloat(props.arr1[e].price)
                  : parseFloat(props.arr1[e].price),

              requires_shipping:
                props.arr1[e]["edited_fields"]["variants"] != undefined
                  ? props.arr1[e]["edited_fields"].variants[
                    props.arr1[e].source_product_id
                  ].requires_shipping != undefined
                    ? props.arr1[e]["edited_fields"].variants[
                      props.arr1[e].source_product_id
                    ].requires_shipping
                    : props.arr1[e].requires_shipping
                  : props.arr1[e].requires_shipping,

              inventory_tracked:
                props.arr1[e]["edited_fields"]["variants"] != undefined
                  ? props.arr1[e]["edited_fields"].variants[
                    props.arr1[e].source_product_id
                  ].inventory_tracked != undefined
                    ? props.arr1[e]["edited_fields"].variants[
                      props.arr1[e].source_product_id
                    ].inventory_tracked
                    : props.arr1[e].inventory_tracked
                  : props.arr1[e].inventory_tracked,

              inventory_policy:
                props.arr1[e]["edited_fields"]["variants"] != undefined
                  ? props.arr1[e]["edited_fields"].variants[
                    props.arr1[e].source_product_id
                  ].inventory_policy != undefined
                    ? props.arr1[e]["edited_fields"].variants[
                      props.arr1[e].source_product_id
                    ].inventory_policy
                    : props.arr1[e].inventory_policy
                  : props.arr1[e].inventory_policy,

              compare_at_price:
                props.arr1[e]["edited_fields"]["variants"] != undefined
                  ? props.arr1[e]["edited_fields"].variants[
                    props.arr1[e].source_product_id
                  ].compare_at_price != undefined
                    ? props.arr1[e]["edited_fields"].variants[
                      props.arr1[e].source_product_id
                    ].compare_at_price
                    : parseFloat(props.arr1[e].compare_at_price)
                  : parseFloat(props.arr1[e].compare_at_price),

              weight:
                props.arr1[e]["edited_fields"]["variants"] != undefined
                  ? props.arr1[e]["edited_fields"].variants[
                    props.arr1[e].source_product_id
                  ].weight != undefined
                    ? props.arr1[e]["edited_fields"].variants[
                      props.arr1[e].source_product_id
                    ].weight
                    : parseFloat(props.arr1[e].weight)
                  : parseFloat(props.arr1[e].weight),

              weight_unit:
                props.arr1[e]["edited_fields"]["variants"] != undefined
                  ? props.arr1[e]["edited_fields"].variants[
                    props.arr1[e].source_product_id
                  ].weight_unit != undefined
                    ? props.arr1[e]["edited_fields"].variants[
                      props.arr1[e].source_product_id
                    ].weight_unit
                    : props.arr1[e].weight_unit
                  : props.arr1[e].weight_unit,

              quantity:
                props.arr1[e]["edited_fields"]["variants"] &&
                  props.arr1[e]["edited_fields"].variants[
                    props.arr1[e].source_product_id
                  ].quantity !== undefined
                  ? props.arr1[e]["edited_fields"].variants[
                    props.arr1[e].source_product_id
                  ].quantity
                  : props.arr1[e].quantity,

              realQty:
                props.arr1[e]["edited_fields"]["variants"] &&
                  props.arr1[e]["edited_fields"].variants[
                    props.arr1[e].source_product_id
                  ].quantity
                  ? props.arr1[e]["edited_fields"].variants[
                    props.arr1[e].source_product_id
                  ].quantity === 0
                    ? ""
                    : props.arr1[e]["edited_fields"].variants[
                      props.arr1[e].source_product_id
                    ].quantity
                  : props.arr1[e].quantity === 0
                    ? ""
                    : props.arr1[e].quantity,

              // props.arr1[e]["edited_fields"]["variants"] != undefined
              //   ? props.arr1[e]["edited_fields"].variants[
              //       props.arr1[e].source_product_id
              //     ].quantity != undefined
              //     ? props.arr1[e]["edited_fields"].variants[
              //         props.arr1[e].source_product_id
              //       ].quantity
              //     : props.arr1[e].quantity
              //   : props.arr1[e].inventory_tracked
              //   ? props.arr1[e].quantity
              //   : "NA",

              sku:
                props.arr1[e]["edited_fields"]["variants"] != undefined
                  ? props.arr1[e]["edited_fields"].variants[
                    props.arr1[e].source_product_id
                  ].custom_sku != undefined
                    ? props.arr1[e]["edited_fields"].variants[
                      props.arr1[e].source_product_id
                    ].custom_sku
                    : props.arr1[e].custom_sku
                  : props.arr1[e].custom_sku,

              barcode:
                props.arr1[e]["edited_fields"]["variants"] != undefined
                  ? props.arr1[e]["edited_fields"].variants[
                    props.arr1[e].source_product_id
                  ].barcode != undefined
                    ? props.arr1[e]["edited_fields"].variants[
                      props.arr1[e].source_product_id
                    ].barcode
                    : props.arr1[e].barcode
                  : props.arr1[e].barcode,

              del: false,
              edit: true,
              sell: props.arr1[e].sell,
            };
          } else {
            OptionName.push(props.arr1[e].variant_title);
            instance[props.arr1[e].variant_title] = {
              weight: props.arr1[e].weight,
              requires_shipping: props.arr1[e].requires_shipping,
              inventory_policy: props.arr1[e].inventory_policy,
              weight_unit:
                props.arr1[e].weight_unit == "KILOGRAMS" ||
                  props.arr1[e].weight_unit == "kg"
                  ? "kg"
                  : props.arr1[e].weight_unit == "POUNDS" ||
                    props.arr1[e].weight_unit == "lb"
                    ? "lb"
                    : props.arr1[e].weight_unit == "OUNCE" ||
                      props.arr1[e].weight_unit == "oz"
                      ? "oz"
                      : props.arr1[e].weight_unit == "GRAMS" ||
                        props.arr1[e].weight_unit == "g"
                        ? "g"
                        : "",

              inventory_tracked: props.arr1[e].inventory_tracked,
              source_product_id: props.arr1[e].source_product_id,
              variant_image: props.arr1[e].variant_image,
              price: props.arr1[e].price,
              compare_at_price: props.arr1[e].compare_at_price,

              barcode: props.arr1[e].barcode,
              quantity: props.arr1[e].quantity,
              realQty: props.arr1[e].quantity,
              sku: props.arr1[e].custom_sku,
              del: false,
              edit: true,
              sell: props.arr1[e].sell,
            };
          }
        });
        setNewOptionName(OptionName);
      } else {
        if (props.arr1.edited_fields != undefined) {
          OptionName.push(props.arr1.variant_title);

          instance[props.arr1.variant_title] = {
            source_product_id: props.arr1.source_product_id,

            variant_image: props.arr1.variant_image,

            requires_shipping:
              props.arr1["edited_fields"]["variants"] != undefined
                ? props.arr1["edited_fields"].variants[
                  props.arr1.source_product_id
                ].requires_shipping != undefined
                  ? props.arr1["edited_fields"].variants[
                    props.arr1.source_product_id
                  ].requires_shipping
                  : props.arr1.requires_shipping
                : props.arr1.requires_shipping,

            inventory_tracked:
              props.arr1["edited_fields"]["variants"] != undefined
                ? props.arr1["edited_fields"].variants[
                  props.arr1.source_product_id
                ].inventory_tracked != undefined
                  ? props.arr1["edited_fields"].variants[
                    props.arr1.source_product_id
                  ].inventory_tracked
                  : props.arr1.inventory_tracked
                : props.arr1.inventory_tracked,

            inventory_policy:
              props.arr1["edited_fields"]["variants"] != undefined
                ? props.arr1["edited_fields"].variants[
                  props.arr1.source_product_id
                ].inventory_policy != undefined
                  ? props.arr1["edited_fields"].variants[
                    props.arr1.source_product_id
                  ].inventory_policy
                  : props.arr1.inventory_policy
                : props.arr1.inventory_policy,

            weight:
              props.arr1["edited_fields"]["variants"] != undefined
                ? props.arr1["edited_fields"].variants[
                  props.arr1.source_product_id
                ].weight != undefined
                  ? props.arr1["edited_fields"].variants[
                    props.arr1.source_product_id
                  ].weight
                  : parseFloat(props.arr1.weight)
                : parseFloat(props.arr1.weight),

            weight_unit:
              props.arr1["edited_fields"]["variants"] != undefined
                ? props.arr1["edited_fields"].variants[
                  props.arr1.source_product_id
                ].weight_unit != undefined
                  ? props.arr1["edited_fields"].variants[
                    props.arr1.source_product_id
                  ].weight_unit
                  : props.arr1.weight_unit
                : props.arr1.weight_unit,

            price:
              props.arr1["edited_fields"]["variants"] != undefined
                ? props.arr1["edited_fields"].variants[
                  props.arr1.source_product_id
                ].price != undefined
                  ? props.arr1["edited_fields"].variants[
                    props.arr1.source_product_id
                  ].price
                  : parseFloat(props.arr1.price)
                : parseFloat(props.arr1.price),

            compare_at_price:
              props.arr1["edited_fields"]["variants"] != undefined
                ? props.arr1["edited_fields"].variants[
                  props.arr1.source_product_id
                ].compare_at_price != undefined
                  ? props.arr1["edited_fields"].variants[
                    props.arr1.source_product_id
                  ].compare_at_price
                  : parseFloat(props.arr1.compare_at_price)
                : parseFloat(props.arr1.compare_at_price),

            // quantity:
            //   props.arr1["edited_fields"]["variants"] != undefined
            //     ? props.arr1["edited_fields"].variants[
            //         props.arr1.source_product_id
            //       ].quantity != undefined
            //       ? props.arr1["edited_fields"].variants[
            //           props.arr1.source_product_id
            //         ].quantity
            //       : props.arr1.quantity
            //     : !props.arr1.inventory_tracked
            //     ? props.arr1.quantity
            //     : "NA",

            quantity:
              props.arr1["edited_fields"]["variants"] &&
                props.arr1["edited_fields"].variants[props.arr1.source_product_id]
                  .quantity !== undefined
                ? props.arr1["edited_fields"].variants[
                  props.arr1.source_product_id
                ].quantity
                : props.arr1.quantity,

            realQty:
              props.arr1["edited_fields"]["variants"] &&
                props.arr1["edited_fields"].variants[props.arr1.source_product_id]
                  .quantity
                ? props.arr1["edited_fields"].variants[
                  props.arr1.source_product_id
                ].quantity
                : props.arr1.quantity,
            sku:
              props.arr1["edited_fields"]["variants"] != undefined
                ? props.arr1["edited_fields"].variants[
                  props.arr1.source_product_id
                ].custom_sku != undefined
                  ? props.arr1["edited_fields"].variants[
                    props.arr1.source_product_id
                  ].custom_sku
                  : props.arr1.custom_sku
                : props.arr1.custom_sku,

            barcode:
              props.arr1["edited_fields"]["variants"] != undefined
                ? props.arr1["edited_fields"].variants[
                  props.arr1.source_product_id
                ].barcode != undefined
                  ? props.arr1["edited_fields"].variants[
                    props.arr1.source_product_id
                  ].barcode
                  : props.arr1.barcode
                : props.arr1.barcode,

            del: false,
            edit: true,
            sell: props.arr1.sell,
          };
        } else {
          // if (map["edited_fields"]["variants"] != undefined) {
          OptionName.push(props.arr1.variant_title);

          instance[props.arr1.variant_title] = {
            weight: props.arr1.weight,
            requires_shipping: props.arr1.requires_shipping,
            inventory_policy: props.arr1.inventory_policy,
            inventory_tracked: props.arr1.inventory_tracked,
            source_product_id: props.arr1.source_product_id,
            variant_image: props.arr1.variant_image,
            price: props.arr1.price,
            compare_at_price: props.arr1.compare_at_price,
            barcode: props.arr1.barcode,
            quantity: props.arr1.inventory_tracked ? props.arr1.quantity : "0",
            sku: props.arr1.custom_sku,
            del: false,
            edit: true,
            sell: props.arr1.sell,
            weight_unit:
              props.arr1.weight_unit != ""
                ? props.arr1.weight_unit == "KILOGRAMS" ||
                  props.arr1.weight_unit == "kg"
                  ? "kg"
                  : props.arr1.weight_unit == "POUNDS" ||
                    props.arr1.weight_unit == "lb"
                    ? "lb"
                    : props.arr1.weight_unit == "OUNCE" ||
                      props.arr1.weight_unit == "oz"
                      ? "oz"
                      : props.arr1.weight_unit == "GRAMS" ||
                        props.arr1.weight_unit == "g"
                        ? "g"
                        : ""
                : weight_unit,
          };
        }
        setNewOptionName(OptionName);
      }

      // }
      setAttrType((prevState) => ({
        ...prevState,
        [0]: {
          ...prevState[0],
          att: props.variant1[0],
          fieldArr: props.attr1,
        },
      }));
      props.variant1[1] != undefined &&
        setAttrType((prevState) => ({
          ...prevState,
          [1]: {
            ...prevState[1],
            att: props.variant1[1],
            fieldArr: props.attr2,
          },
        }));
      props.variant1[2] != undefined &&
        setAttrType((prevState) => ({
          ...prevState,
          [2]: {
            ...prevState[2],
            att: props.variant1[2],
            fieldArr: props.attr3,
          },
        }));
      constComplete(true);
    }
  }, [props.variant1, props.attr1]);
  useEffect(() => {
    Mapping();
    constComplete(false);
  }, [constState]);
  useEffect(() => {
    tablefunc();
    props.varientToAddProduct(newArr);
  }, [attrType]);
  useEffect(() => {
    Mapping();
  }, [instance, props.currency]);
  useEffect(() => {
    props.varientToAddProduct(newArr);
  }, [newArr]);
  useEffect(() => {
    props.variant_check(diff);
  }, [diff]);
  const [editArr, setEditArr] = useState<any>({});
  const [tempEdit, setEditTemp] = useState<any>({});

  useEffect(() => {
    const editVarObj: any = { ...{}, ...editArr };
    delete editVarObj.undefined;
    editVarObj[instanceEdit["source_product_id"]] = {
      ...editVarObj[instanceEdit["source_product_id"]],
      ...instanceEdit[instanceEdit["source_product_id"]],
    };

    setEditArr(editVarObj);
    props.editedVarient(Object.values(editVarObj));

    // props.editedSell(tempEdit);
  }, [instanceEdit, sell]);

  useEffect(() => {
    if (props.variantArrReset) {
      setEditArr({});
    }
  }, [props.variantArrReset]);

  useEffect(() => {
    for (let i = 0; i < 3; i++) {
      if (!lenArray.includes(i)) {
        setAttrType((prevState) => ({
          ...prevState,
          [i]: {
            ...prevState[i],
            // att: "",
            attValue: "",
            fieldArr: [],
          },
        }));
      }
    }
  }, [lenArray]);

  /**
   *@function Mapping is used to maps all the attributes.
   */
  function Mapping() {
    // let tempFieldArray: any = [];
    arr.splice(0);
    newArr.splice(0);
    const a = lenArray[0];
    const b = lenArray[1];
    const c = lenArray[2];

    //  tempFieldArray = [new Set(fieldArr)]
    // if (props.source_marketplace === "shopify_vendor") {
    //     attrType[a].fieldArr.map((m: string) => {
    //         (typeof b !== 'undefined') ? attrType[b].fieldArr.map((n: string) => {
    //             const vari = m + " / " + n;
    //             const varname1 = attrType[a].att + "/" + attrType[b].att;
    //             (typeof c !== 'undefined') ? attrType[c].fieldArr.map((k: string) => {

    //                 const vari = m + " / " + n + " / " + k;
    //                 const varname1 = attrType[a].att + "/" + attrType[b].att + "/" + attrType[c].att;
    //                 Arrayobj(vari, varname1);
    //             }) : Arrayobj(vari, varname1);
    //         }) : Arrayobj(m, attrType[a].att);
    //     });
    // } else {
    // attrType[a].fieldArr.map((m: string) => {
    //   typeof b !== "undefined"
    //     ? attrType[b].fieldArr.map((n: string) => {
    //         const vari = m + " / " + n;
    //         const varname1 = attrType[a].att + "/" + attrType[b].att;
    //         typeof c !== "undefined"
    //           ? attrType[c].fieldArr.map((k: string) => {
    //               const vari = m + " / " + n + " / " + k;
    //               const varname1 =
    //                 attrType[a].att +
    //                 "/" +
    //                 attrType[b].att +
    //                 "/" +
    //                 attrType[c].att;
    //               Arrayobj(vari, varname1);
    //             })
    //           : Arrayobj(vari, varname1);
    //       })
    //     : Arrayobj(m, attrType[a].att);
    // });
    // // }

    if (NewOptionName != undefined && NewOptionName[0] != undefined) {
      NewOptionName?.map((m: string, index1: number) => {
        Arrayobj(m, attrType[a].att, index1);
      });
    } else {
      attrType[a].fieldArr?.map((m: string, index1: number) => {
        typeof b !== "undefined"
          ? attrType[b].fieldArr.map((n: string, index2: number) => {
            const vari = m + " / " + n;
            const varname1 = attrType[a].att + " / " + attrType[b].att;
            typeof c !== "undefined"
              ? attrType[c].fieldArr.map((k: string, index3: number) => {
                const vari = m + " / " + n + " / " + k;
                const varname1 =
                  attrType[a].att +
                  " / " +
                  attrType[b].att +
                  " / " +
                  attrType[c].att;

                Arrayobj(vari.replaceAll("  ", " "), varname1, index3);
              })
              : Arrayobj(vari.replaceAll("  ", " "), varname1, index2);
          })
          : Arrayobj(m, attrType[a].att, index1);
      });
    }
  }
  function EditFunc(vari: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props.arr1.map((m1: any) => {
      if (m1["variant_title"] == vari) {
        props.history.push(
          "/products/" +
          m1["source_marketplace"] +
          "/variants/" +
          m1["source_product_id"]
        );
      }
    });
  }
  /**
   * @function Arrayobj is to set the map values in an array
   * @param vari variant Type EX-(Red/Small)
   * @param varname1 variant name EX-(Color/Size)
   */

  function Arrayobj(vari: string, varname1: string, rowIndex: number) {
    setvarname(varname1);
    vari in instance
      ? null
      : (instance[vari] = {
        weight: -1,
        requires_shipping: false,
        inventory_policy: "",
        weight_unit: "",
        inventory_tracked: "",
        source_product_id: "",
        variant_image: "",
        price: "price",
        compare_at_price: 0,
        quantity: "price",
        sku: "sku",
        barcode: "barcode",
        del: false,
        edit: false,
        sell: false,
      });

    const variarr = vari.split("/");
    const varname1arr = varname1.split("/");
    props.variantsAttributes(varname1arr);

    const temp1: any = {
      type: "simple",
      variant_title: vari,
      barcode: instance[vari]["barcode"] || barcode,
      source_product_id: instance[vari]["source_product_id"],
      price: instance[vari]["price"] || price,
      compare_at_price: instance[vari]["compare_at_price"],
      quantity:
        instance[vari]["inventory_tracked"] !== ""
          ? instance[vari]["inventory_tracked"]
            ? instance[vari]["quantity"] != ""
              ? instance[vari]["quantity"]
              : quantity
            : "NA"
          : inventory_tracked
            ? quantity
            : "NA",
      sku: instance[vari]["sku"] || sku,
      variant_attributes: varname1arr,
      variant_image: instance[vari]["variant_image"],
      weight: instance[vari].weight || weight,
      requires_shipping: instance[vari].requires_shipping,

      inventory_policy:
        instance[vari].inventory_policy !== ""
          ? instance[vari].inventory_policy
          : inventory_policy,
      inventory_tracked:
        instance[vari]["inventory_tracked"] !== ""
          ? instance[vari]["inventory_tracked"]
          : inventory_tracked,
      weight_unit: instance[vari].weight_unit || weight_unit,
    };
    temp1[varname1arr[0]] = variarr[0];
    1 in varname1arr && (temp1[varname1arr[1]] = variarr[1]);
    2 in varname1arr && (temp1[varname1arr[2]] = variarr[2]);
    setCheckedSell(instance[vari]["sell"]);
    const temp = {
      variant_title: vari,
      variant_image: (
        <>
          {instance[vari]["variant_image"] == "" ||
            instance[vari]["variant_image"] == undefined ? (
            <div className="image_upload">
              <label className="inte-btn inte-btn--Outlined inte-btn--hasIcon">
                <span className="inte-btn__icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </span>
                <span className="inte__text">Upload File</span>
              </label>

              <input
                className="img_inpt"
                type="file"
                id="files"
                disabled={!props.saveEditDisable}
                accept="image/*"
                onChange={(event: any) => {
                  const varImg = {
                    ...varImgObj,
                    ...{
                      [instance[vari]["source_product_id"]]:
                        event.target.files[0],
                    },
                  };
                  setVarImgObj(varImg);
                  props.SetIsVarImageEditFun(Object.values(varImg));
                  if (event.target.files[0]) {
                    changeInstance((prevState: any) => ({
                      ...prevState,
                      [vari]: {
                        ...prevState[vari],
                        variant_image: event.target.files[0],
                      },
                    }));
                  }
                  setInstanceEdit((prev: any) => ({
                    ...prev,
                    // rowIndex:{v},
                    [instance[vari]["source_product_id"]]: {
                      variant_image: event.target.files[0],
                      source_product_id: instance[vari]["source_product_id"],
                    },
                    source_product_id: instance[vari]["source_product_id"],
                    variant_image: event.target.files[0],
                  }));
                }}
              />
            </div>
          ) : (
            <>
              <div className="Btn-overImage p_relative">
                <Button
                  iconRound={false}
                  disable={!props.saveEditDisable}
                  thickness="thin"
                  type="Plain"
                  onClick={() => {
                    const varImg: any = { ...{}, ...varImgObj };
                    delete varImg[instance[vari]["source_product_id"]];
                    setVarImgObj(varImg);

                    props.SetIsVarImageEditFun(Object.values(varImg));

                    changeInstance((prevState: any) => ({
                      ...prevState,
                      [vari]: {
                        ...prevState[vari],
                        variant_image: "",
                      },
                    }));
                    setInstanceEdit((prevState: any) => ({
                      ...prevState,
                      // [rowIndex],
                      [instance[vari]["source_product_id"]]: {
                        variant_image: "",
                        source_product_id: instance[vari]["source_product_id"],
                      },
                      source_product_id: instance[vari]["source_product_id"],
                      variant_image: "",
                    }));
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    width="18"
                  >
                    <path
                      d="M11.414 10l6.293-6.293a1 1 0 10-1.414-1.414L10 8.586 3.707 2.293a1 1 0 00-1.414 1.414L8.586 10l-6.293 6.293a1 1 0 101.414 1.414L10 11.414l6.293 6.293A.998.998 0 0018 17a.999.999 0 00-.293-.707L11.414 10z"
                      fill="#5C5F62"
                    />
                  </svg>
                </Button>

                <img
                  src={
                    typeof instance[vari]["variant_image"] == "object"
                      ? instance[vari]["variant_image"].name != undefined &&
                      URL.createObjectURL(instance[vari]["variant_image"])
                      : instance[vari]["variant_image"]
                  }
                  width="50px"
                  height="50px"
                  style={{ objectFit: "contain" }}
                />
              </div>
            </>
          )}
        </>
      ),

      price: (
        <>
          <TextField
            prefix={props.currency}
            value={instance[vari]["price"] == "price" ? price : instance[vari]["price"]}
            readOnly={!props.saveEditDisable}
            onChange={(e: any) => {
              const tempArr: any = [];
              changeInstance((prevState: any) => ({
                ...prevState,
                [vari]: {
                  ...prevState[vari],
                  price: e,
                },
              }));
              setInstanceEdit((prev: any) => ({
                ...prev,
                [instance[vari]["source_product_id"]]: {
                  price: e,
                  source_product_id: instance[vari]["source_product_id"],
                },
                rowIndex,
                source_product_id: instance[vari]["source_product_id"],
                price: e,
              }));

            }}
            type="number"
            thickness="thin"
          />
        </>
      ),
      compare_at_price: (
        <TextField
          value={instance[vari]["compare_at_price"]}
          readOnly={!props.saveEditDisable}
          onChange={(e: any) => {
            changeInstance((prevState: any) => ({
              ...prevState,
              [vari]: {
                ...prevState[vari],
                compare_at_price: e,
              },
            }));
            setInstanceEdit((prev: any) => ({
              ...prev,
              // [rowIndex],

              source_product_id: instance[vari]["source_product_id"],
              compare_at_price: e,
            }));
          }}
          type="number"
          thickness="thin"
        />
      ),

      quantity: (
        <FlexLayout direction="vertical" spacing="loose" halign="evenly">
          <TextField
            value={
              instance[vari]["inventory_tracked"] !== ""
                ? instance[vari]["inventory_tracked"]
                  ? instance[vari]["quantity"] != ""
                    ? instance[vari]["quantity"]
                    : quantity
                  : "NA"
                : inventory_tracked
                  ? quantity
                  : "NA"
            }
            readOnly={
              !props.saveEditDisable ||
                instance[vari]["inventory_tracked"] !== ""
                ? !instance[vari]["inventory_tracked"]
                : !inventory_tracked
            }
            onChange={(e: any) => {
              if (e == 0) {
                changeInstance((prevState: any) => ({
                  ...prevState,
                  [vari]: {
                    ...prevState[vari],
                    // inventory_tracked: false,
                  },
                }));
                setInstanceEdit((prev: any) => ({
                  ...prev,
                  [instance[vari]["source_product_id"]]: {
                    quantity: e,
                    source_product_id: instance[vari]["source_product_id"],
                  },
                  rowIndex,

                  source_product_id: instance[vari]["source_product_id"],
                  // inventory_tracked: false,
                }));
              } else {
                changeInstance((prevState: any) => ({
                  ...prevState,
                  [vari]: {
                    ...prevState[vari],
                    inventory_tracked: true,
                  },
                }));
                setInstanceEdit((prev: any) => ({
                  ...prev,
                  [instance[vari]["source_product_id"]]: {
                    quantity: e,
                    source_product_id: instance[vari]["source_product_id"],
                  },
                  rowIndex,

                  source_product_id: instance[vari]["source_product_id"],
                  inventory_tracked: true,
                }));
              }
              changeInstance((prevState: any) => ({
                ...prevState,
                [vari]: {
                  ...prevState[vari],
                  quantity: e === "" ? e : parseInt(e),
                },
              }));
              setInstanceEdit((prev: any) => ({
                ...prev,
                [instance[vari]["source_product_id"]]: {
                  quantity: e,
                  source_product_id: instance[vari]["source_product_id"],
                },
                rowIndex,

                source_product_id: instance[vari]["source_product_id"],
                quantity: e === "" ? e : parseInt(e),
              }));
            }}
            type={instance[vari]["inventory_tracked"] ? "number" : "text"}
            thickness="thin"
          />
          <CheckBox
            checked={
              instance[vari]["inventory_tracked"] !== ""
                ? instance[vari]["inventory_tracked"]
                : inventory_tracked
            }
            labelVal="Track Inventory"
            onClick={() => {
              // setTracked(!instance[vari]["inventory_tracked"]);

              changeInstance((prevState: any) => ({
                ...prevState,
                [vari]: {
                  ...prevState[vari],
                  inventory_tracked: !instance[vari]["inventory_tracked"],
                  // quantity: !instance[vari]["inventory_tracked"]
                  //   ? instance[vari]["realQty"]
                  //   : 0,
                },
              }));
              setInstanceEdit((prev: any) => ({
                ...prev,
                [instance[vari]["source_product_id"]]: {
                  inventory_tracked: !instance[vari]["inventory_tracked"],
                  source_product_id: instance[vari]["source_product_id"],
                },
                rowIndex,

                source_product_id: instance[vari]["source_product_id"],
                inventory_tracked: !instance[vari]["inventory_tracked"],
                // quantity: !instance[vari]["inventory_tracked"]
                //   ? instance[vari]["realQty"]
                //   : 0,
              }));
            }}
          />

          <CheckBox
            checked={
              instance[vari].inventory_policy !== ""
                ? instance[vari].inventory_policy == "continue"
                  ? true
                  : false
                : inventory_policy == "continue"
                  ? true
                  : false
            }
            labelVal={" Continue Selling"}
            onClick={() => {
              setInventoryPolicy(!InventoryPolicy);
              if (props.saveEditDisable) {
                changeInstance((prevState: any) => ({
                  ...prevState,
                  [vari]: {
                    ...prevState[vari],
                    inventory_policy:
                      instance[vari].inventory_policy == "continue"
                        ? "deny"
                        : "continue",
                  },
                }));
                setInstanceEdit((prev: any) => ({
                  ...prev,
                  [instance[vari]["source_product_id"]]: {
                    inventory_policy:
                      instance[vari].inventory_policy == "continue"
                        ? "deny"
                        : "continue",
                    source_product_id: instance[vari]["source_product_id"],
                  },
                  rowIndex,

                  source_product_id: instance[vari]["source_product_id"],
                  inventory_tracked:
                    instance[vari].inventory_policy == "continue"
                      ? "deny"
                      : "continue",
                }));
              }
            }}
          />
          {/* {(instance[vari]["inventory_tracked"] !== ""
            ? instance[vari]["inventory_tracked"]
            : inventory_tracked) && (
              <CheckBox
                checked={
                  instance[vari].inventory_policy !== ""
                    ? instance[vari].inventory_policy == "continue"
                      ? true
                      : false
                    : inventory_policy == "continue"
                      ? true
                      : false
                }
                labelVal={" Continue Selling"}
                onClick={() => {
                  setInventoryPolicy(!InventoryPolicy);
                  if (props.saveEditDisable) {
                    changeInstance((prevState: any) => ({
                      ...prevState,
                      [vari]: {
                        ...prevState[vari],
                        inventory_policy:
                          instance[vari].inventory_policy == "continue"
                            ? "deny"
                            : "continue",
                      },
                    }));
                    setInstanceEdit((prev: any) => ({
                      ...prev,
                      [instance[vari]["source_product_id"]]: {
                        inventory_policy:
                          instance[vari].inventory_policy == "continue"
                            ? "deny"
                            : "continue",
                        source_product_id: instance[vari]["source_product_id"],
                      },
                      rowIndex,

                      source_product_id: instance[vari]["source_product_id"],
                      inventory_tracked:
                        instance[vari].inventory_policy == "continue"
                          ? "deny"
                          : "continue",
                    }));
                  }
                }}
              />
            )} */}
        </FlexLayout>
      ),

      sku: (
        <TextField
          value={instance[vari]["sku"] == 'sku' ? sku : instance[vari]["sku"]}
          readOnly={!props.saveEditDisable}
          onChange={(e: any) => {
            changeInstance((prevState: any) => ({
              ...prevState,
              [vari]: {
                ...prevState[vari],
                sku: e,
              },
            }));
            setInstanceEdit((prev: any) => ({
              ...prev,
              [instance[vari]["source_product_id"]]: {
                custom_sku: e,
                source_product_id: instance[vari]["source_product_id"],
              },
              rowIndex,

              source_product_id: instance[vari]["source_product_id"],
              custom_sku: e,
            }));
          }}
          thickness="thin"
        />
      ),

      barcode: (
        <TextField
          value={instance[vari]["barcode"] == "barcode" ? barcode : instance[vari]["barcode"]}
          readOnly={!props.saveEditDisable}
          onChange={(e: any) => {
            changeInstance((prevState: any) => ({
              ...prevState,
              [vari]: {
                ...prevState[vari],
                barcode: e,
              },
            }));
            setInstanceEdit((prev: any) => ({
              ...prev,
              [instance[vari]["source_product_id"]]: {
                barcode: e,
                source_product_id: instance[vari]["source_product_id"],
              },
              rowIndex,

              source_product_id: instance[vari]["source_product_id"],
              barcode: e,
            }));
          }}
          thickness="thin"
        />
      ),
      // ACTIONS: <div><FlexLayout><Button onClick={() => {
      //     changeInstance((prevState: any) => ({
      //         ...prevState
      //         [vari]: {
      //             ...prevState[vari],
      //             del: true
      //         }
      //     }));
      // }} type="Plain">
      //     Delete
      //     </Button>
      // </FlexLayout>
      //     <FlexLayout>
      //         {instance[vari]['edit'] == true && <Button type="Plain" onClick={() => EditFunc(vari)}>EDIT</Button>}
      //     </FlexLayout>
      // </div>
      weight: (
        //  <FlexLayout direction='row-reverse' halign='start' spacing='extraTight'> <CheckBox labelVal={""} checked={instance[vari].requires_shipping} onClick={() => {
        //     changeInstance((prevState: any) => ({
        //         ...prevState,
        //         [vari]: {
        //             ...prevState[vari],
        //             requires_shipping: !instance[vari]['requires_shipping']
        //         }
        //     }));
        //     setInstanceEdit((prev: any) => ({
        //         ...prev,
        //         source_product_id: instance[vari]['source_product_id'],
        //         barcode: !instance[vari]['sell']
        //     }));
        // }} />
        //     {instance[vari].requires_shipping &&

        <FlexLayout spacing="none" wrap="noWrap">
          <FlexChild desktopWidth="50" mobileWidth="50" tabWidth="50">
            <TextField
              innerSufIcon={true}
              readOnly={!props.saveEditDisable}
              value={instance[vari]["weight"] == -1 ? weight : instance[vari]["weight"]}
              onChange={(e: any) => {
                if (e == 0) {
                  changeInstance((prevState: any) => ({
                    ...prevState,
                    [vari]: {
                      ...prevState[vari],
                      requires_shipping: false,
                    },
                  }));
                  setInstanceEdit((prev: any) => ({
                    ...prev,
                    [instance[vari]["source_product_id"]]: {
                      weight: e,
                      source_product_id: instance[vari]["source_product_id"],
                    },
                    rowIndex,

                    source_product_id: instance[vari]["source_product_id"],
                    requires_shipping: false,
                  }));
                }
                {
                  changeInstance((prevState: any) => ({
                    ...prevState,
                    [vari]: {
                      ...prevState[vari],
                      requires_shipping: true,
                    },
                  }));
                  setInstanceEdit((prev: any) => ({
                    ...prev,
                    [instance[vari]["source_product_id"]]: {
                      weight: e,
                      source_product_id: instance[vari]["source_product_id"],
                    },
                    rowIndex,

                    source_product_id: instance[vari]["source_product_id"],
                    requires_shipping: true,
                  }));
                }
                changeInstance((prevState: any) => ({
                  ...prevState,
                  [vari]: {
                    ...prevState[vari],
                    weight: e,
                  },
                }));
                setInstanceEdit((prev: any) => ({
                  ...prev,
                  [instance[vari]["source_product_id"]]: {
                    weight: e,
                    source_product_id: instance[vari]["source_product_id"],
                  },
                  rowIndex,

                  source_product_id: instance[vari]["source_product_id"],
                  weight: e,
                }));
              }}
              thickness="thin"
              type="number"
            />
          </FlexChild>
          <FlexChild desktopWidth="50" mobileWidth="50" tabWidth="50">
            <Select
              thickness={"thin"}
              disabled={!props.saveEditDisable}
              onChange={(e) => {
                changeInstance((prevState: any) => ({
                  ...prevState,
                  [vari]: {
                    ...prevState[vari],
                    weight_unit: e,
                  },
                }));
                setInstanceEdit((prev: any) => ({
                  ...prev,
                  [instance[vari]["source_product_id"]]: {
                    weight_unit: e,
                    source_product_id: instance[vari]["source_product_id"],
                  },
                  rowIndex,

                  source_product_id: instance[vari]["source_product_id"],
                  weight_unit: e,
                }));
              }}
              value={
                instance[vari]["weight_unit"] !== ""
                  ? instance[vari]["weight_unit"] == "KILOGRAMS" ||
                    instance[vari]["weight_unit"] == "kg"
                    ? "kg"
                    : instance[vari]["weight_unit"] == "POUNDS" ||
                      instance[vari]["weight_unit"] == "lb"
                      ? "lb"
                      : instance[vari]["weight_unit"] == "OUNCE" ||
                        instance[vari]["weight_unit"] == "oz"
                        ? "oz"
                        : instance[vari]["weight_unit"] == "GRAMS" ||
                          instance[vari]["weight_unit"] == "g"
                          ? "g"
                          : ""
                  : weight_unit
              }
              options={[
                {
                  label: "kg",
                  value: "kg",
                },
                {
                  label: "g",
                  value: "g",
                },
                {
                  label: "lb",
                  value: "lb",
                },
                {
                  label: "oz",
                  value: "oz",
                },
              ]}
            />
          </FlexChild>
        </FlexLayout>
      ),
      // } </FlexLayout>,

      // inventory_policy: (
      //   <CheckBox
      //     checked={instance[vari].inventory_policy == "continue" ? true : false}
      //     labelVal={""}
      //     onClick={() => {
      //       setInventoryPolicy(!InventoryPolicy);
      //       if (props.saveEditDisable) {
      //         changeInstance((prevState: any) => ({
      //           ...prevState,
      //           [vari]: {
      //             ...prevState[vari],
      //             inventory_policy:
      //               instance[vari].inventory_policy == "continue"
      //                 ? "deny"
      //                 : "continue",
      //           },
      //         }));
      //         setInstanceEdit((prev: any) => ({
      //           ...prev,
      //           [instance[vari]["source_product_id"]]: {
      //             inventory_policy:
      //               instance[vari].inventory_policy == "continue"
      //                 ? "deny"
      //                 : "continue",
      //             source_product_id: instance[vari]["source_product_id"],
      //           },
      //           rowIndex,

      //           source_product_id: instance[vari]["source_product_id"],
      //           inventory_tracked:
      //             instance[vari].inventory_policy == "continue"
      //               ? "deny"
      //               : "continue",
      //         }));
      //       }
      //     }}
      //   />
      // ),
      view: (
        <Button
          thickness="thin"
          type="Plain"
          onClick={() =>
            props.history.push("/variant", {
              source_product_id: props.match.params.id,
              barcode: instance[vari]["barcode"],
              sku: instance[vari]["sku"],
              quantity: instance[vari]["quantity"],
              price: instance[vari]["price"],
              comapre_at_price: instance[vari]["compare_at_price"],
              variant_title: vari,
              weight: instance[vari].weight,
              requires_shipping: instance[vari].requires_shipping,
              inventory_policy: instance[vari].inventory_policy,
              inventory_tracked: instance[vari].inventory_tracked,
              weight_unit: instance[vari].weight_unit,
            })
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            height="22"
          >
            <path
              fill="#413bbc"
              fillRule="evenodd"
              d="M19.928 9.629C17.791 4.286 13.681 1.85 9.573 2.064c-4.06.21-7.892 3.002-9.516 7.603L-.061 10l.118.333c1.624 4.601 5.455 7.393 9.516 7.603 4.108.213 8.218-2.222 10.355-7.565l.149-.371-.149-.371zM10 15a5 5 0 100-10 5 5 0 000 10z"
            />
            <circle fill="#413bbc" cx="10" cy="10" r="3" />
          </svg>
        </Button>
      ),
    };
    // setArr([...arr, { ...temp }]);
    if (instance[vari].del == false) {
      setArr((prev) => [...prev, temp]);
      setNewArr((prev) => [...prev, temp1]);
    }
  }
  /**
   * @function Combi function is for checking the combination not exeeds than 100 Combination.
   * @param l It's Contain number
   */
  function combi(l: number) {
    let first =
      attrType[0].fieldArr.length == 0 ? 1 : attrType[0].fieldArr.length;
    let sec =
      attrType[1].fieldArr.length == 0 ? 1 : attrType[1].fieldArr.length;
    let thrd =
      attrType[2].fieldArr.length == 0 ? 1 : attrType[2].fieldArr.length;
    l == 0 && (first = first + 1);
    l == 1 && (sec = sec + 1);
    l == 2 && (thrd = thrd + 1);

    return first * sec * thrd;
  }
  /**
   * This Function is for Displaying Table For the Varients.
   */
  function tablefunc() {
    props.tableLength(arr.length);

    let columns = {};
    // if (props.type != "") {
    columns = {
      variant_image: {
        title: "Image",
        alignment: "left",
        // type: 'string',
        width: "175",
      },
      variant_title: {
        alignment: "left",
        title: "Options",
        // type: 'string',
        width: "140",
      },

      price: {
        alignment: "left",
        title: (
          <FlexLayout>
            <>Price</>
            <span style={{ color: "red" }}>*</span>
          </FlexLayout>
        ),
        // type: 'number',
        width: "130",
      },
      sku: {
        alignment: "left",
        title: "SKU",
        type: "string",
        width: "240",
      },

      barcode: {
        alignment: "left",
        title: "Barcode",
        type: "string",
        width: "120",
      },
      // compare_at_price: {
      //     alignment: 'left',
      //     title: 'Compare at Price',
      //     // type: 'number',
      //     width: '60'
      // },

      quantity: {
        alignment: "left",
        title: (
          <FlexLayout>
            <>Quantity</>
            <span style={{ color: "red" }}>*</span>
          </FlexLayout>
        ),
        type: "string",
        width: "155",
      },

      weight: {
        alignment: "left",
        title: "Weight",
        type: "string",
        width: "200",
      },

      // inventory_policy: {
      //   alignment: "center",
      //   title: "Continue Selling",
      //   type: "action",
      //   width: "50",
      // },
      // ,
      // view: {
      //     alignment: "left",
      //     title: "View",
      //     width: "50"
      // }
    };

    return (
      <>
        {/* <Card cardType="linkwater" > */}
        <div className="cstmtable">
          <Table columns={columns} rows={arr}></Table>
        </div>
        {/* </Card> */}
      </>
    );
  }
  /**
   * for adding a varient type .
   * @param Key Holds the options box value.
   */
  const AddVariantValue = (Key: number) => {
    attrType[Key].att != "" &&
      combi(Key) < 100 &&
      attrType[Key].attValue[0] != undefined &&
      attrType[Key].attValue[0] != " " &&
      attrType[Key].fieldArr.includes(attrType[Key].attValue) == false &&
      attrType[Key].fieldArr.push(attrType[Key].attValue);
    setAttrType((prev) => ({
      ...prev,
      [Key]: {
        ...prev[Key],
        attValue: "",
      },
    }));
    combi(Key);
    Mapping();
  };
  // function handleDestroy(val: any) {

  // }

  /**
   * Func for Creating Varients Textboxes and Add button
   * @param Key option box value
   * @function functionLayout is for the layout of the table
   */
  function functionLayout(Key: number) {
    const t = lenArray.indexOf(Key);
    return (
      <div>
        <FlexLayout spacing="loose">
          <TextField
            thickness="thin"
            placeHolder="Variant"
            value={attrType[Key].att}
            onChange={(e: string) => {
              setAttrType((prevState) => ({
                ...prevState,
                [Key]: {
                  ...prevState[Key],
                  att: e,
                },
              }));
            }}
          />
          {/* <div style={{ width: "400px" }}>
                    <TextArea rows={1}
                        thickness="thin"

                        type='badge'
                        value={attrType[Key].attValue}
                        onChange={
                            (e: string) => {
                                setAttrType((prevState) => ({
                                    ...prevState,
                                    [Key]: {
                                        ...prevState[Key],
                                        attValue: e
                                    }
                                }));



                            }
                        }
                        onEnter={(val) => {
                            AddVariantValue(Key);

                        }}
                    ></TextArea>
                </div> */}

          <TextField
            thickness="thin"
            type="text"
            showHelp="Press enter to add variants."
            value={attrType[Key].attValue}
            onEnter={() => AddVariantValue(Key)}
            onChange={(e: string) => {
              setAttrType((prevState) => ({
                ...prevState,
                [Key]: {
                  ...prevState[Key],
                  attValue: e,
                },
              }));
            }}
          />

          {/* <div style={{ width: "400px" }}>
                    <FlexLayout spacing="loose" wrap="wrap" >
                        {attrType[Key].fieldArr.map((m: string) => {
                            const x = attrType[Key].fieldArr.indexOf(m);
                            return <><Badge
                                backgroundColor="rgba(206,206,206,1)"
                                destroy={() => {
                                    attrType[Key].fieldArr.splice(x, 1); const c: Array<string> = [...attrType[Key].fieldArr]; setAttrType((prev) => ({
                                        ...prev,
                                        [Key]: {
                                            ...prev[Key],
                                            fieldArr: c
                                        }
                                    })); Mapping();
                                }}
                                size="small"
                                type="Success"
                            >{m}</Badge></>;

                        })}
                    </FlexLayout>
                </div> */}
          {/* <Button
                    disable={(attrType[Key].att == "")}
                    thickness="thin"
                    type="Plain"
                    onClick={() => {
                        AddVariantValue(Key);
                    }}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" height="24"><path d="M17 9h-6V3a1 1 0 00-2 0v6H3a1 1 0 000 2h6v6a1 1 0 102 0v-6h6a1 1 0 000-2z" fill="#413bbc" /></svg></Button> */}
          <div style={{ marginTop: "9px" }}>
            <Button
              type="PlainDark"
              onClick={() => {
                if (lenArray.length === 1) {
                  changeDiff(false);
                }
                lenArray.splice(t, 1);
                const c: Array<number> = [...lenArray];
                lenHandle(c);
                Mapping();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                height="24"
              >
                <path
                  fillRule="evenodd"
                  d="M14 4h3a1 1 0 011 1v1H2V5a1 1 0 011-1h3V1.5A1.5 1.5 0 017.5 0h5A1.5 1.5 0 0114 1.5V4zM8 2v2h4V2H8zM3 8h14v10.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 18.5V8zm4 3H5v6h2v-6zm4 0H9v6h2v-6zm2 0h2v6h-2v-6z"
                  fill="#413bbc"
                />
              </svg>
            </Button>
          </div>
        </FlexLayout>
        <div style={{ marginTop: "5px", width: "600px" }}>
          <FlexLayout spacing="loose" wrap="wrap">
            {attrType[Key].fieldArr.map((m: string) => {
              const x = attrType[Key].fieldArr.indexOf(m);
              return (
                <>
                  <Badge
                    backgroundColor="rgba(206,206,206,1)"
                    destroy={() => {
                      attrType[Key].fieldArr.splice(x, 1);
                      const c: Array<string> = [...attrType[Key].fieldArr];
                      setAttrType((prev) => ({
                        ...prev,
                        [Key]: {
                          ...prev[Key],
                          fieldArr: c,
                        },
                      }));
                      Mapping();
                    }}
                    size="small"
                    type="Success"
                  >
                    {m}
                  </Badge>
                </>
              );
            })}
          </FlexLayout>
        </div>
        <br />
      </div>
    );
  }

  return (
    <Card title="Variants" cardType="plain">
      {props.arr1.length == 0 && (
        <CheckBox
          checked={diff}
          onClick={() => { changeDiff(!diff) }}

          labelVal="This product has multiple options, like different sizes or colors."
        />
      )}
      <div>{diff && lenArray.includes(0) && functionLayout(0)}</div>
      <div>{diff && lenArray.includes(1) && functionLayout(1)}</div>
      <div>{diff && lenArray.includes(2) && functionLayout(2)}</div>
      {diff && (
        <div className="mt-20">
          <Button
            thickness="thin"
            onClick={() => {
              if (!lenArray.includes(0)) {
                lenArray.push(0);
                const c: Array<number> = [...lenArray];
                lenHandle(c);
              } else if (!lenArray.includes(1)) {
                lenArray.push(1);
                const c: Array<number> = [...lenArray];
                lenHandle(c);
              } else if (!lenArray.includes(2)) {
                lenArray.push(2);
                const c: Array<number> = [...lenArray];
                lenHandle(c);
              }
            }}
          >
            ADD OPTIONS
          </Button>
        </div>
      )}
      {arr.length > 0 && tablefunc()}
    </Card>
  );
}

export default DI(Variants);
