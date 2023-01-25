/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import { Grid } from "../../../../Shared/index";
import CategorySelection from "../Create/CategorySelection";
import { DI, DIProps } from "../../../../Core";
import {
  Badge,
  Button,
  Card,
  ChoiceList,
  Modal,
  Filter,
  FlexLayout,
  Pagination,
  Select,
  TextField,
  TextStyles,
  Toast,
  ToastWrapper,
  ToolTip,
} from "@cedcommerce/ounce-ui";
import Null from "./../../Image/null.png";
import EmptyData from "../../../../Core/EmptyStates/EmptyData";

function StatusGrid(Props: any): JSX.Element {
  const [viewColumnToggle, setViewColumnToggle] = useState(false);
  const [toast1, setToast1] = useState(false);
  const [message1, setMessage1] = useState("");
  const [selectedArray, setSelectedArray] = useState<Array<string>>([]);
  const [selectArrayDelete, setSelectArrayDelete] = useState<any>({});
  const [ObjSelect, setobjSelect] = useState<Array<any>>([]);
  const [TotalVariant, setTotalVariant] = useState(0);
  const [sort, setsort] = useState(true);
  const [Start, setStart] = useState(0);
  const [uploadename, updateuploadename] = useState<any>("");
  const [name, setName] = useState(false);
  const [inIf, setInIf] = useState(true);

  const [columns, setColumns] = useState({
    image: {
      name: "Image",
      visible: true,
    },
    title: {
      sort: true,
      name: "Title",
      visible: true,
      width: "300px",
    },
    container_id: {
      sort: true,
      name: "ID",
      visible: true,
      enableMobileImage: false,
    },
    status: {
      name: "Status",
      visible: true,
    },
    quantity: {
      sort: true,
      name: "Inventory",
      visible: true,
    },
    product_type: {
      name: "Type",
      visible: false,
    },
    marketplace: {
      name: "Source",
      visible: true,
    },
    ViewBtn: {
      name: "Action",
      type: "button",
      visible: true,
    },
  });
  const [End, setEnd] = useState(0);
  const [params, setParams] = useState<any>({
    ...(Props.location.state && Props.location.state.reApplyFilter),
    ...{
      type: "vendor",
      uploaded: 0,
      count: 20,
      activePage:
        (Props.location.state && Props.location.state.setActivePage) || 1,
    },
  });
  const [PageCount, setPageCount] = useState(0);
  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [TotalProduct, setTotalProduct] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tag, setTag] = useState<any>([{}]);

  const [total, settotal] = useState(1);
  const [NoProduct, setNoProduct] = useState(true);
  const [Rows, setRows] = useState<Array<any>>([{}]);
  const [countSelected, setcountSelected] = useState(0);
  const [loadingExport, setLoadingExport] = useState(false);
  const [TotalVariantCount, setTotalVariantCount] = useState(0);
  const [approveToast, setApproveToast] = useState(false);
  const [approveMessage, setApproveMessage] = useState("");
  const [SelectAll, setSelectAll] = useState(false);
  const [Userid, setUserid] = useState("");
  const [objSelect1, setObjSelect1] = useState<Array<any>>([]);
  const [FirstClcik, setFirstClcik] = useState("");
  const [readyToAssign, setReadyToAssign] = useState(false);
  useEffect(() => {
    fetchData();

    Object.keys(params).forEach((key) => {
      if (key.includes("filter")) {
        setSelectedArray([]);
        setSelectAll(false);
      }
    });
  }, [params]);

  function onSortClick() {
    setsort(!sort);
  }
  function fetchData() {
    setLoading(true);
    setRows([]);
    let filterExists = false;

    Object.keys(params).forEach((k) => {
      if (params["activePage"] === 1) {
        // inIf = false;
        if (k.includes("filter")) {
          //  setParams( { ...params, ...{ activePage: 1 }} )
          setInIf(false);
        }
        filterExists = k.includes("filter");
      } else if (Object.keys(params).length > 4 && params["activePage"] !== 1) {
        if (inIf && k.includes("filter")) {
          filterExists = true;
        } else {
          filterExists = false;
        }
      }
    });
    Props.di
      .GET(
        "/connector/product/getProducts1",
        Object.keys(params).length > 4 && filterExists
          ? { ...params, ...{ activePage: 1 } }
          : params
      )
      .then((e: any) => {
        if (e.success) {
          setLoading(false);
          setStart(e.data.start);
          setEnd(e.data.end);
          if (e.data.rows.length == 0) {
            setNoProduct(false);
          } else {
            setNoProduct(true);
          }

          setTotalProduct(e.data.mainCount); 
          if (
            e.data.mainCount / params.count >
            Math.round(e.data.mainCount / params.count)
          ) {
            setTotalVariant(Math.round(e.data.mainCount / params.count) + 1);   
          } else {
            setTotalVariant(Math.round(e.data.mainCount / params.count));
          }
          setTotalVariant(Math.round(e.data.mainCount / params.count));
          setTotalVariantCount(e.data.count);
          setUserid(
            e.data.rows.length != 0 && e.data.rows[0].product[0].user_id
          );
          // const tempCount: number[] = [];
          // const tempQty: any = {};
          // e.data.rows.map((productMap: any) => {
          //   Object.values(productMap).forEach((element: any) => {
          //     if (element != null)
          //       Object.values(element).forEach((e: any) => {
          //         if (!tempQty[e["container_id"]]) {
          //           tempQty[e["container_id"]] =
          //             e["edited_fields"] != undefined
          //               ? e["edited_fields"]["quantity"] != undefined
          //                 ? e["edited_fields"]["quantity"]
          //                 : e["quantity"]
          //               : e["quantity"];
          //         } else {
          //           tempQty[e["container_id"]] =
          //             tempQty[e["container_id"]] +
          //             (e["edited_fields"] != undefined
          //               ? e["edited_fields"]["quantity"] != undefined
          //                 ? e["edited_fields"]["quantity"]
          //                 : e["quantity"]
          //               : e["quantity"]);
          //         }
          //         tempCount[e["container_id"]] = Object.keys(
          //           productMap["product"]
          //         ).length;
          //       });
          //   });
          // });
          if (params.count == 10) {
            if (Math.round(e.data.mainCount / 10) < e.data.mainCount / 10)
              setPageCount(Math.round(e.data.mainCount / 10) + 1);
            else setPageCount(Math.round(e.data.mainCount / 10));
          } else if (params.count == 20) {
            if (Math.round(e.data.mainCount / 20) < e.data.mainCount / 20)
              setPageCount(Math.round(e.data.mainCount / 20) + 1);
            else setPageCount(Math.round(e.data.mainCount / 20));
          } else if (params.count == 50) {
            if (Math.round(e.data.mainCount / 50) < e.data.mainCount / 50)
              setPageCount(Math.round(e.data.mainCount / 50) + 1);
            else setPageCount(Math.round(e.data.mainCount / 50));
          } else if (params.count == 100) {
            if (Math.round(e.data.mainCount / 100) < e.data.mainCount / 20) {
              setPageCount(Math.round(e.data.mainCount / 100) + 1);
            } else {
              setPageCount(Math.round(e.data.mainCount / 100));
            }
          }else if (params.count == 200) {
            if (Math.round(e.data.mainCount / 200) < e.data.mainCount / 20) {
              setPageCount(Math.round(e.data.mainCount / 200) + 1);
            } else {
              setPageCount(Math.round(e.data.mainCount / 200));
            }
          }

          const temp = Object.keys(e.data.rows).map((m) => {
            let totalQty = 0;
            const trackInv: any = [];

            Object.values(e.data.rows[m].product).forEach((ele: any) => {
              if (
                ele.edited_fields &&
                ele.edited_fields.variants &&
                ele.edited_fields.variants[ele.source_product_id]
                  .inventory_tracked !== undefined
              ) {
                if (
                  ele.edited_fields.variants[ele.source_product_id]
                    .inventory_tracked
                ) {
                  if (
                    ele.edited_fields.variants[ele.source_product_id] &&
                    ele.edited_fields.variants[ele.source_product_id].quantity
                  ) {
                    totalQty =
                      parseInt(
                        ele.edited_fields.variants[ele.source_product_id]
                          .quantity
                      ) + totalQty;
                  } else {
                    totalQty = parseInt(ele.quantity) + totalQty;
                  }
                }
                trackInv.push(
                  ele.edited_fields.variants[ele.source_product_id]
                    .inventory_tracked
                );
              } else if (
                ele.edited_fields &&
                ele.edited_fields.inventory_tracked !== undefined
              ) {
                if (ele.edited_fields.inventory_tracked) {
                  if (ele.edited_fields && ele.edited_fields.quantity) {
                    totalQty = parseInt(ele.edited_fields.quantity) + totalQty;
                  } else {
                    totalQty = parseInt(ele.quantity) + totalQty;
                  }
                }
                trackInv.push(ele.edited_fields.inventory_tracked);
              } else {
                if (ele.inventory_tracked) {
                  if (ele.edited_fields && ele.edited_fields.quantity) {
                    totalQty = parseInt(ele.edited_fields.quantity) + totalQty;
                  } else {
                    totalQty = parseInt(ele.quantity) + totalQty;
                  }
                }
                trackInv.push(ele.inventory_tracked);
              }
            });
            return {
              image:
                (e.data.rows[m].product[0].main_image != "" &&
                  e.data.rows[m].product[0].main_image) != undefined ? (
                  <img
                    style={{ objectFit: "contain" }}
                    src={e.data.rows[m].product[0].main_image}
                    width="50px"
                    height="50px"
                  />
                ) : (
                  <TextStyles>No Image</TextStyles>
                ),

              title:
                e.data.rows[m].product[0].edited_fields &&
                e.data.rows[m].product[0].edited_fields.title ? (
                  e.data.rows[m].product[0].edited_fields.title.length > 50 ? (
                    <ToolTip
                      helpText={e.data.rows[m].product[0].edited_fields.title}
                    >
                      {e.data.rows[m].product[0].edited_fields.title.substring(
                        1,
                        50
                      ) + "..."}
                    </ToolTip>
                  ) : (
                    e.data.rows[m].product[0].edited_fields.title
                  )
                ) : e.data.rows[m].product[0].title.length > 50 ? (
                  <ToolTip helpText={e.data.rows[m].product[0].title}>
                    {e.data.rows[m].product[0].title.substring(1, 50) + "..."}
                  </ToolTip>
                ) : (
                  e.data.rows[m].product[0].title
                ),

              container_id: e.data.rows[m].product[0].container_id,

              // quantity: trackInv.some((ele: boolean) => ele === true)
              //   ? `${totalQty} in stock for ${
              //       Object.keys(e.data.rows[m].product).length
              //     } variants.`
              //   : "Inventory Not Tracked.",

              quantity: trackInv.some((ele: boolean) => ele === true)
                ? e.data.rows[m].product[0].variant_attributes &&
                  Object.keys(e.data.rows[m].product[0].variant_attributes)
                    .length
                  ? `${totalQty} in stock  for ${
                      Object.keys(e.data.rows[m].product).length
                    } variants`
                  : `${totalQty} in stock`
                : "Inventory Not Tracked",
              // quantity:
              //   e.data.rows[m].product[0].edited_fields &&
              //   e.data.rows[m].product[0].edited_fields.inventory_tracked ===
              //     true ? (
              //     e.data.rows[m].product[0].edited_fields &&
              //     e.data.rows[m].product[0].edited_fields.quantity ? (
              //       e.data.rows[m].product[0].edited_fields.quantity +
              //       " in stock" +
              //       (e.data.rows[m].product[0].type == "simple"
              //         ? ""
              //         : "for " +
              //           Object.keys(e.data.rows[m].product).length +
              //           " variants")
              //     ) : (
              //       (e.data.rows[m].sum_quantity ||
              //         e.data.rows[m].product[0].quantity) +
              //       " in stock" +
              //       (e.data.rows[m].product[0].type == "simple"
              //         ? ""
              //         : "for " +
              //           Object.keys(e.data.rows[m].product).length +
              //           " variants")
              //     )
              //   ) : e.data.rows[m].product[0].inventory_tracked === true ? (
              //     e.data.rows[m].product[0].edited_fields &&
              //     e.data.rows[m].product[0].edited_fields.quantity ? (
              //       e.data.rows[m].product[0].edited_fields.quantity +
              //       " in stock" +
              //       (e.data.rows[m].product[0].type == "simple"
              //         ? ""
              //         : "for " +
              //           Object.keys(e.data.rows[m].product).length +
              //           " variants")
              //     ) : (
              //       (e.data.rows[m].sum_quantity ||
              //         e.data.rows[m].product[0].quantity) +
              //       " in stock" +
              //       (e.data.rows[m].product[0].type == "simple"
              //         ? ""
              //         : "for " +
              //           Object.keys(e.data.rows[m].product).length +
              //           " variants")
              //     )
              //   ) : (
              //     <span style={{ wordBreak: "break-word" }}>
              //       Inventory Not Tracked
              //     </span>
              //   ),

              // e.data.rows[m].product[0].inventory_tracked ? (
              //   <span style={{ wordBreak: "break-word" }}>
              //     {e.data.rows[m].product[0].type == "simple" &&
              //       (e.data.rows[m].product[0].variant_attributes == undefined ||
              //         Object.keys(e.data.rows[m].product[0].variant_attributes)
              //           .length === 0)
              //       ? tempQty[e.data.rows[m].product[0].container_id] +
              //       " in stock "
              //       : tempQty[e.data.rows[m].product[0].container_id] +
              //       " in stock for " +
              //       tempCount[e.data.rows[m].product[0].container_id] +
              //       " variants"}
              //   </span>
              // ) : (
              //     <TextStyles>Inventory Not Tracked</TextStyles>
              //   ),

              product_type:
                e.data.rows[m].product[0].edited_fields != undefined ? (
                  e.data.rows[m].product[0].edited_fields.product_type !=
                  undefined ? (
                    e.data.rows[m].product[0].edited_fields.product_type ||
                    "Not Available"
                  ) : (
                    e.data.rows[m].product[0].product_type || "Not Available"
                  )
                ) : e.data.rows[m].product[0].product_type != undefined ? (
                  e.data.rows[m].product[0].product_type || "Not Available"
                ) : (
                  <TextStyles>No Data</TextStyles>
                ),

              marketplace:
                e.data.rows[m].product[0].source_marketplace ==
                "shopify_vendor" ? (
                  <span>{"Shopify"}</span>
                ) : (
                  <span>{"Marketplace"}</span>
                ),
              status:
                e.data.rows[m].product[0].status == "uploaded" ? (
                  <Badge
                    size="small"
                    backgroundColor={
                      e.data.rows[m].product[0].activeStatus === "disable"
                        ? "#ffce56"
                        : "#ff6384"
                    }
                    // type={
                    //   e.data.rows[m].product[0].activeStatus === "disable"
                    //     ? "Error"
                    //     : "Info"
                    // }
                  >
                    {e.data.rows[m].product[0].activeStatus === "disable" ? (
                      <div style={{ wordBreak: "break-word" }}>
                        <ToolTip helpText="Product have draft status in shopify">
                          Inactive
                        </ToolTip>
                      </div>
                    ) : (
                      <div style={{ wordBreak: "break-word" }}>
                        <ToolTip helpText="Products uploaded on Ozdingo Shopping.">
                          Live
                        </ToolTip>
                      </div>
                    )}
                  </Badge>
                ) : e.data.rows[m].product[0].status == "imported" ? (
                  <Badge type="Success">
                    <ToolTip helpText="Imported from shopify but not pushed to the admin panel">
                      Imported
                    </ToolTip>
                  </Badge>
                ) : e.data.rows[m].product[0].status == "approved" ? (
                  <Badge type="Info">
                    <div style={{ wordBreak: "break-word" }}>
                      <ToolTip helpText="Products having Pending status in our app are under at admin review.">
                        Pending
                      </ToolTip>
                    </div>
                  </Badge>
                ) : e.data.rows[m].product[0].status == "disapproved" ? (
                  <Badge backgroundColor={"#af2cff"} type="Warning">
                    <div style={{ wordBreak: "break-word" }}>
                      <ToolTip helpText="Products rejected from Ozdingo Shopping.">
                        Rejected
                      </ToolTip>
                    </div>
                  </Badge>
                ) : (
                  e.data.rows[m].product[0].status == "pending" && (
                    <Badge type="Info">
                      <div style={{ wordBreak: "break-word" }}>
                        <ToolTip helpText="Products having Pending status in our app are under at admin review.">
                          Pending
                        </ToolTip>
                      </div>
                    </Badge>
                  )
                ),

              ViewBtn: e.data.rows[m].product[0] && (
                <Button
                  type="Plain"
                  thickness="thin"
                  onClick={() => {
                    Props.history.push(
                      "/products/" +
                        e.data.rows[m].product[0].source_product_id,

                      {
                        activePage: params.activePage,
                        appliedFilter: params,
                        source_marketplace:
                          e.data.rows[m].product[0].source_marketplace,
                        user_id:
                          e.data.rows.length != 0 &&
                          e.data.rows[m].product[0].user_id,
                      }
                    );
                  }}
                >
                  <ToolTip
                    helpText={`${
                      e.data.rows[m].product[0].source_marketplace ==
                      "shopify_vendor"
                        ? "View"
                        : "Edit"
                    } Product`}
                  >
                    {e.data.rows[m].product[0].source_marketplace ===
                    "shopify_vendor" ? (
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
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        height="22"
                      >
                        <path
                          d="M14.846 1.403l3.752 3.753.625-.626A2.653 2.653 0 0015.471.778l-.625.625zm2.029 5.472l-3.752-3.753L1.218 15.028 0 19.998l4.97-1.217L16.875 6.875z"
                          fill="#413bbc"
                          fillRule="evenodd"
                        />
                        <circle fill="#413bbc" cx="10" cy="10" r="3" />
                      </svg>
                    )}
                  </ToolTip>
                </Button>
              ),
            };
          });
          setRows(temp);
        }
      });
  }
  function titleCheck(str: string): string | React.ReactNode {
    if (str.length > 20) {
      return <ToolTip helpText={str}>{str.slice(0, 20) + "..."}</ToolTip>;
    }
    return str;
  }
  useEffect(() => {
    const len = "Selected" + objSelect1.length;
    updateuploadename(len);
  }, [objSelect1]);
  useEffect(() => {
    setSelectAll(SelectAll);
  }, [SelectAll]);

  function manageSelect(data: any, selectedArray: string[]): string[] {
    selectedArray.includes(data)
      ? selectedArray.splice(selectedArray.indexOf(data), 1)
      : selectedArray.push(data);
    return selectedArray;
  }

  const [temp1, settemp] = useState<any>([]);
  useEffect(() => {
    manageSelectDelete;
  }, [temp1]);
  const temp: any = [...temp1];
  function manageSelectDelete(
    obj: any
    // ,
    // id: any
  ): any {
    // temp.push(obj);
    settemp((prev: any) => [...prev, obj]);
    // settemp(temp);
    // const temp: any = [...temp1];
    // Object.keys(obj).map((ele) => {
    //   temp.push(obj[ele]);
    //   settemp(temp);
    // });
    // console.log(temp, "temp11");
    // const arr = {
    //   [id]: temp1
    // };
  }

  useEffect(() => {
    ObjSelect.splice(0);
    const ObjArr: any[] = [];

    let tempcount = 0;
    selectedArray.map((selMap) => {
      Rows.map((m1) => {
        if (m1["container_id"] == selMap) {
          let exist = false;

          ObjArr.map((objchk) => {
            if (objchk["user_id"] == m1["user_id"]) {
              tempcount = tempcount + 1;
              objchk["container_id"].push(m1["container_id"]);
              exist = true;
            }
          });

          const temp = {
            container_id: [m1["container_id"]],
            user_id: Userid,
          };
          if (exist == false) {
            tempcount = tempcount + 1;
            ObjArr.push(temp);
          }
        }
      });
    });

    setcountSelected(tempcount);
    setobjSelect(ObjArr);
  }, [selectedArray]);

  const [loadingDelete, setLoadingDelete] = useState(false);
  const [toastDelete, setToastDelete] = useState(false);
  const [messageDelete, setMessageDelete] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [readyToPush, setReadyToPush] = useState(false);
  /**
   * @function handleSort to send 1 and -1 on click of sort button one at a time.
   * @param key to store the name of the column
   * @param sort to store true or false when true then send 1 and when false send -1
   */

  function handleSort(key: string, sort: boolean) {
    Object.keys(params).forEach((ind: string) => {
      if (ind.includes("sort_key")) {
        delete params[ind];
      }
    });

    if (sort) {
      if (key) params[`sort_key[${key}]`] = 1;
    } else {
      if (key) params[`sort_key[${key}]`] = -1;
    }

    fetchData();
  }

  function handleSelectAll() {
    if (SelectAll) {
      const temp = [...selectedArray];
      Rows.forEach((e) => {
        if (!temp.includes(e["container_id"])) temp.push(e["container_id"]);
      });
      setSelectedArray([...temp]);
    } else {
      // setSelectedArray([]);
    }
  }

  useEffect(() => {
    handleSelectAll();
  }, [SelectAll, Rows]);
  useEffect(() => {
    setcountSelected(countSelected);
  }, [countSelected]);

  function columnToggle(visibleCol: any, bool: boolean, objKey: any) {
    const col: any = columns;
    col[objKey].visible = bool;
    setName(!name);
    setColumns(col);
  }

  function deleteData() {
    const DelArr = temp1.filter((e: any, index: number) => {
      return temp1.indexOf(e) === index;
    });

    const arr = {
      [Userid]: selectedArray,
    };
    let tempobj = {};
    setLoadingDelete(true);
    if (SelectAll) {
      tempobj = {
        data: "all",
        framework: "shopify_vendor",
      };
    } else {
      tempobj = {
        data: arr,
        framework: "shopify_vendor",
      };
    }
    Props.di
      .POST("/connector/product/productDelete", tempobj)
      .then((e: any) => {
        if (e.success) {
          settemp([]);
          // setMessageDelete(e.message)
          setToastDelete(true);
          setMessageDelete(e.data);
          fetchData();
          // const temp: any = [];
          setSelectedArray([]);
          setSelectArrayDelete([]);
        }
        setLoadingDelete(false);
        setModalOpen(false);
      });
  }
  function handleAllRowSelect() {
    const newselectedArray: string[] = [...selectedArray];

    if (
      Rows.filter((row: any) => selectedArray.includes(row["container_id"]))
        .length == Rows.length
    ) {
      const UniqueIds = Rows.map((row: any) => row["container_id"]);
      const temp = selectedArray.filter((e: string) => !UniqueIds.includes(e));
      setSelectedArray([...temp]);
      if (SelectAll) {
        setSelectAll(false);
        setSelectedArray([]);
      }
    } else {
      Rows.forEach((row: any) => {
        !selectedArray.includes(row["container_id"]) &&
          newselectedArray.push(row["container_id"]);
      });
      setSelectedArray([...newselectedArray]);
      settemp([...newselectedArray]);
    }
  }

  const pushProducts = () => {
    setLoadingDelete(true);
    const filter = { ...params };
    delete filter["type"];
    delete filter["activePage"];
    delete filter["count"];
    delete filter["uploaded"];
    let dataToSend = {};
    if (SelectAll) {
      dataToSend = {
        ...{
          productsToPush: "all",
          status: "pending",
          product_status: "imported",
          user_id: Userid,
        },
        ...filter,
      };
      Props.di
        .GET("shopifyhome/request/pushProductsToAdmin", dataToSend)
        .then((e: any) => {
          if (e.success) {
            settemp([]);
            // setMessageDelete(e.message)
            setToastDelete(true);
            setMessageDelete(e.message);
            fetchData();
            // const temp: any = [];
            setSelectAll(false);
            setSelectedArray([]);
            setSelectedArray([]);
            setSelectArrayDelete([]);
          }
          setLoadingDelete(false);
          setModalOpen(false);
        });
    } else {
      dataToSend = {
        productsToPush: [
          {
            user_id: Userid,
            container_id: selectedArray,
          },
        ],
        status: "pending",
        product_status: "imported",
      };

      Props.di
        .POST("shopifyhome/request/pushProductsToAdmin", dataToSend)
        .then((e: any) => {
          if (e.success) {
            settemp([]);
            // setMessageDelete(e.message)
            setToastDelete(true);
            setMessageDelete(e.message);
            fetchData();
            // const temp: any = [];
            setSelectedArray([]);
            setSelectArrayDelete([]);
          }
          setLoadingDelete(false);
          setModalOpen(false);
        });
    }
  };

  const bulkAssignCategory = () => {
    setLoadingDelete(true);
    const filter = { ...params };
    delete filter["type"];
    delete filter["activePage"];
    delete filter["count"];
    delete filter["uploaded"];

    if (SelectAll) {
      const dataToSend = {
        ...{
          bulkCatgeoryAssign: "all",
          collection: JSON.stringify(tag),
          user_id: Userid,
        },
        ...filter,
      };
      Props.di
        .GET("shopifyhome/request/BulkCategoryAssign", dataToSend)
        .then((e: any) => {
          if (e.success) {
            settemp([]);
            // setMessageDelete(e.message)
            setToastDelete(true);
            setMessageDelete(e.message);
            fetchData();
            // const temp: any = [];
            setSelectAll(false);

            setSelectedArray([]);
            setSelectArrayDelete([]);
          }
          setLoadingDelete(false);
          setModalOpen(false);
        });
    } else {
      const dataToSend = {
        bulkCatgeoryAssign: [
          {
            user_id: Userid,
            container_id: selectedArray,
          },
        ],
        collection: tag,
      };

      Props.di
        .POST("shopifyhome/request/BulkCategoryAssign", dataToSend)
        .then((e: any) => {
          if (e.success) {
            settemp([]);
            // setMessageDelete(e.message)
            setToastDelete(true);
            setMessageDelete(e.message);
            fetchData();
            // const temp: any = [];
            setSelectedArray([]);
            setSelectArrayDelete([]);
          }
          setLoadingDelete(false);
          setModalOpen(false);
        });
    }
  };

  function setTag1(obj: any) {
    const temp: any = obj.map((e: any) => {
      return {
        collection_id: e.value,
        title: e.label,
        __parentId: 0,
        gid: "gid://shopify/Collection/" + e.value,
      };
    });
    setTag(temp);
  }
  return (
    <>
      <ToastWrapper>
        {approveToast && (
          <Toast
            type="success"
            message={approveMessage}
            timeout={3000}
            onDismiss={() => setApproveToast(!approveToast)}
          />
        )}

        {toast && (
          <Toast
            type="error"
            message={message}
            timeout={3000}
            onDismiss={() => setToast(!toast)}
          />
        )}
        {toast1 && (
          <Toast
            type="success"
            timeout={3000}
            message={message1}
            onDismiss={() => setToast1(!toast1)}
          />
        )}
        {toastDelete && (
          <Toast
            type="success"
            timeout={3000}
            message={messageDelete}
            onDismiss={() => setToastDelete(!toastDelete)}
          />
        )}
      </ToastWrapper>
      <div>
        <RenderCardFilter
          {...Props}
          SelectAll={SelectAll}
          handleAllRowSelect={handleAllRowSelect}
          PageCount={PageCount}
          props={Props}
          fetchData={fetchData}
          deleteData={deleteData}
          loadingDelete={loadingDelete}
          messageDelete={messageDelete}
          totalProduct={TotalProduct}
          // fileType={fileType}
          setInIf={setInIf}
          columnToggle={columnToggle}
          start={Start}
          end={End}
          loadingExport={loadingExport}
          params={setParams}
          preSetParams={params}
          ObjSelect={ObjSelect}
          countSelected={countSelected}
          setViewColumnToggle={() => setViewColumnToggle(!viewColumnToggle)}
          // viewToast={() => setToast(!toast)}
          totalVariant={TotalVariant}
          handleSelectAll={setSelectAll}
          TotalVariantCount={TotalVariantCount}
        />
        {NoProduct ? (
          <Grid
            massAction={
              <FlexLayout halign="start" spacing="loose">
                <div style={{ marginTop: "10px" }}>
                  <FlexLayout halign="start" spacing="loose">
                    <span>
                      Selected:{" "}
                      {SelectAll ? TotalProduct : selectedArray.length} products
                    </span>
                    {!SelectAll && (
                      <span
                        onClick={() => setSelectAll(true)}
                        style={{
                          textDecoration: "underline",
                          color: "#413bbc",
                          cursor: "pointer",
                        }}
                      >
                        Select All {selectedArray.length}+ Products
                      </span>
                    )}

                    {SelectAll && (
                      <span
                        onClick={() => {
                          setSelectAll(false);
                          setSelectedArray([]);
                        }}
                        style={{
                          textDecoration: "underline",
                          color: "#413bbc",
                          cursor: "pointer",
                        }}
                      >
                        Undo
                      </span>
                    )}
                  </FlexLayout>
                </div>
                <div>
                  <Button
                    // loading={loadingDelete}
                    onClick={() => {
                      setReadyToPush(false);
                      setModalOpen(true);
                      setReadyToAssign(false);
                    }}
                    thickness="thin"
                    type={"Outlined"}
                  >
                    Delete
                  </Button>
                </div>
                <Button
                  // loading={loadingDelete}
                  onClick={() => {
                    setReadyToPush(true);
                    setModalOpen(true);
                    setReadyToAssign(false);
                  }}
                  thickness="thin"
                  type={"Secondary"}
                >
                  Push To Admin
                </Button>
                <Button
                  // loading={loadingDelete}
                  // disable={tag.length>0?true:false}
                  onClick={() => {
                    setReadyToPush(false);
                    setReadyToAssign(true);
                    setModalOpen(true);
                  }}
                  thickness="thin"
                  type={"Secondary"}
                >
                  Bulk Assign Category
                </Button>
              </FlexLayout>
            }
            viewColumnToggle={viewColumnToggle}
            loading={loading}
            rows={Rows}
            columns={columns}
            uniqueKey="container_id"
            selectedArray={selectedArray}
            enableSelect={NoProduct && true}
            onRowSelect={(row: any) => {
              if (SelectAll) {
                setSelectAll(false);
              }
              setSelectedArray([
                ...manageSelect(row["container_id"], [...selectedArray]),
              ]);
              manageSelectDelete(
                row["container_id"]
                // ,
                // row.product[0].user_id
              );
            }}
            onAllRowSelect={() => handleAllRowSelect()}
            handleSort={handleSort}
            sort={sort}
            onSortClick={() => onSortClick()}
          />
        ) : (
          <Card>
            {" "}
            <EmptyData />
          </Card>
        )}
      </div>

      <Modal
        modalSize="small"
        heading={
          readyToAssign
            ? "Bulk Assign Category"
            : readyToPush
            ? "Push To Admin"
            : "Warning!"
        }
        open={modalOpen}
        primaryAction={{
          loading: loadingDelete,
          disable:tag.length>=1?false:true,
          type: readyToPush || readyToAssign ? "Primary" : "Danger",
          thickness: "thin",
          content: readyToPush
            ? "Push"
            : readyToAssign
            ? "Bulk Assign"
            : "Delete",
          onClick: () => {
            readyToPush
              ? pushProducts()
              : readyToAssign
              ? bulkAssignCategory()
              : deleteData();
          },
        }}
        secondaryAction={{
          loading: false,
          type: "Secondary",
          thickness: "thin",
          content: "Cancel",
          onClick: () => setModalOpen(!modalOpen),
        }}
        close={() => setModalOpen(!modalOpen)}
      >
        <FlexLayout direction="vertical" valign="stretch" spacing="loose">
          <TextStyles type="SubHeading">
            {readyToPush ? (
              "Are you sure that you want to push products to the admin panel ?"
            ) : readyToAssign ? (
              <FlexLayout direction="vertical" valign="stretch" spacing="loose">
                <>Choose categories to assign with products</>
                <CategorySelection setTag1={setTag1} />
              </FlexLayout>
            ) : (
              "Do you want to delete the selected products ?"
            )}
          </TextStyles>
        </FlexLayout>
      </Modal>
    </>
  );
}

interface tableActionI extends DIProps {
  // fileType: () => void;
  start: number;
  end: number;
  deleteData: () => any;
  props: any;
  handleSelectAll: (a: boolean) => void;
  handleAllRowSelect: () => any;
  fetchData: () => any;
  messageDelete: string;
  loadingDelete: boolean;
  TotalVariantCount: number;
  loadingExport: boolean;
  sync: () => any;
  SelectAll: boolean;
  totalProduct: number;
  params: any;
  PageCount: number;
  preSetParams: any;
  countSelected: number;
  pendingClick: any;
  ObjSelect: any[];
  totalVariant: number;
  setInIf: (value: any) => void;
  setViewColumnToggle: () => void;
  columnToggle: (val: any, bool: boolean, objKey: any) => any;
}
function RenderCardFilter({
  start,
  end,
  fetchData,
  SelectAll,
  handleSelectAll,
  PageCount,
  totalVariant,
  totalProduct,
  preSetParams,
  props,
  deleteData,
  columnToggle,
  setInIf,
  params,
  pendingClick,
  setViewColumnToggle,
  loadingDelete,
  ObjSelect,
  countSelected,
}: tableActionI): JSX.Element {
  const [search, updateSearch] = useState("");
  const [_id, updateId] = useState("");
  const [type, updateType] = useState("");
  const [title, updateTitle] = useState("");
  const [uploadename, updateuploadename] = useState<any>("");
  const [countSelected1, setcountSelected1] = useState(0);
  const [price, updatePrice] = useState("");
  const [quantity, updateQuantity] = useState("");

  const [objSelect1, setObjSelect1] = useState<Array<any>>([]);
  const [page, setpage] = useState(
    (props.location.state && props.location.state.setActivePage) || 1
  );
  const [optId, setOptId] = useState("3");
  const [optType, setOptType] = useState("3");
  const [optTitle, setOptTitle] = useState("3");
  const [optPrice, setOptPrice] = useState("3");

  const [RangeFrom, setRangeFrom] = useState("");
  const [RangeTo, setRangeTo] = useState("");
  const [stat, updateStat] = useState("");
  const [optStat, setOptStat] = useState("1");
  const [filterToast, setFilterToast] = useState(false);
  const [filterToastMsg, setFilterToastMsg] = useState("");
  const [selectUpdateCount, setSelectUpdateCount] = useState("20");
  const [Endpoint, setEndpoint] = useState("");
  const [visibleColumnValue, setVisibleColumnValue] = useState<any>([
    "image",
    "title",
    "container_id",
    "status",
    "quantity",
    "marketplace",
    "ViewBtn",
  ]);

  // const [HandleSelect, setHandleSelect] = useState(false);
  const [filterTag, setFilterTag] = useState<any>(preSetParams);
  const [source, setsource] = useState("");

  const par: any = {
    ...preSetParams,
    ...{
      type: "vendor",
      uploaded: 0,
      count: selectUpdateCount,
      activePage: page,
    },
  };

  useEffect(() => {
    setObjSelect1(ObjSelect);
    setEndpoint(props.di.environment.API_ENDPOINT.replace("/public/", "/"));
  }, [ObjSelect]);

  useEffect(() => {
    const len = "Selected" + objSelect1.length;
    updateuploadename(len);
  }, [objSelect1]);

  useEffect(() => {
    setcountSelected1(countSelected);
  }, [countSelected]);

  useEffect(() => {
    prepareFilter();
  }, [page, selectUpdateCount]);

  useEffect(() => {
    // prepareFilter();
    setpage((props.location.state && props.location.state.setActivePage) || 1);

    params((props.location.state && props.location.state.reApplyFilter) || par);
  }, [selectUpdateCount]);

  function prepareFilter() {
    if (search && search != "" && /\S/.test(search)) {
      par[`filter[title][3]`] = search;
      // par[`filter[type][3]`] = search;
    }

    if (_id) par[`filter[container_id][3]`] = _id;
    if (source) par[`filter[source_marketplace][3]`] = source;
    if (type && /\S/.test(type)) par[`filter[product_type][3]`] = type;
    if (title && /\S/.test(title)) par[`filter[title][3]`] = title;
    if (price) par[`filter[price][3]`] = price;
    if (stat) {
      if (stat === "disable") {
        par[`filter[activeStatus][1]`] = stat;
        delete par[`filter[status][1]`];
      } else if (stat === "uploaded") {
        par[`filter[status][1]`] = stat;
        par[`filter[activeStatus][1]`] = "enable";
      } else {
        par[`filter[status][1]`] = stat;
        delete par[`filter[activeStatus][1]`];
      }
    }
    if (RangeFrom && RangeTo) {
      par[`filter[quantity][7][from]`] = RangeFrom;
      par[`filter[quantity][7][to]`] = RangeTo;
    }
    params(par);
    setFilterTag(par);
  }
  function resetAllFilter() {
    const par: any = {
      ...preSetParams,
      ...{
        type: "vendor",
        uploaded: 0,
        count: selectUpdateCount,
        activePage: page,
      },
    };

    if (title) delete par[`filter[title][${optTitle}]`];
    if (_id) delete par[`filter[container_id][${optId}]`];
    if (type) delete par[`filter[product_type][${optType}]`];
    if (title) delete par[`filter[title][${optTitle}]`];
    if (price) delete par[`filter[price][${optPrice}]`];
    if (source) delete par[`filter[source_marketplace][${optId}]`];
    if (stat) {
      delete par[`filter[status][${optStat}]`];

      delete par[`filter[activeStatus][1]`];
    }

    if (RangeFrom && RangeTo) {
      delete par[`filter[quantity][7][from]`];
      delete par[`filter[quantity][7][to]`];
    }

    params(par);
    updateSearch("");
    updateId("");
    updateType("");
    updateTitle("");
    updatePrice("");
    updateQuantity("");
    updateStat("");
    setsource("");
    setRangeFrom("");
    setRangeTo("");
    setFilterTag(par);
  }
  function resetFilter(filterData: string) {
    const par: any = {
      ...preSetParams,
      ...{
        type: "vendor",
        uploaded: 0,
        count: selectUpdateCount,
        activePage: page,
      },
    };
    switch (filterData) {
      case "title":
        delete par[`filter[title][${optTitle}]`];
        updateTitle("");
        updateSearch("");
        break;
      case "container_id":
        delete par[`filter[container_id][${optId}]`];
        updateId("");
        break;
      case "product_type":
        delete par[`filter[product_type][${optId}]`];
        updateType("");
        break;
      case "status":
        delete par[`filter[status][1]`];
        updateStat("");
        break;
      case "activeStatus":
        delete par[`filter[activeStatus][1]`];
        updateStat("");
        break;
      case "source_marketplace":
        delete par[`filter[source_marketplace][${optId}]`];
        setsource("");
        break;
      case "quantity":
        delete par[`filter[quantity][7][from]`];
        delete par[`filter[quantity][7][to]`];

        setRangeTo("");
        setRangeFrom("");
        break;
    }

    params(par);

    setFilterTag(par);
  }
   

  return (
    <Card cardType="linkwater">
      <div className={"grid_label"}>
        <FlexLayout spacing={"loose"} direction="vertical">
          <div className={"grid_headrow"}>
            <FlexLayout
              spacing={"tight"}
              halign="fill"
              halignMob="center"
              halignTab="center"
            >
              <FlexLayout spacing={"tight"} halign={"center"} valign={"center"}>
                <TextField
                  placeHolder={"Search with the title"}
                  thickness="thin"
                  suffix={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      height={20}
                      onClick={() => {
                        prepareFilter();
                      }}
                    >
                      <path d="M8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm9.707 4.293-4.82-4.82a5.968 5.968 0 0 0 1.113-3.473 6 6 0 0 0-12 0 6 6 0 0 0 6 6 5.968 5.968 0 0 0 3.473-1.113l4.82 4.82a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414z" />
                    </svg>
                  }
                  onChange={(e) => {
                    if (e.length < 255) {
                      updateSearch(e), updateTitle(e);
                    }
                  }}
                  value={search}
                  onEnter={() => {
                    if (search === "") {
                      resetFilter("title");
                    } else {
                      prepareFilter();
                    }
                  }}
                />

                <Filter
                  label={"Filter"}
                  disableReset={false}
                  type="Small"
                  filters={[
                    {
                      name: "Title",
                      children: (
                        <FlexLayout
                          halign="start"
                          spacing="loose"
                          childWidth="fullWidth"
                        >
                          <TextField
                            thickness="thin"
                            onChange={(e) => {
                              if (e.length) {
                                updateTitle(e);
                              }
                            }}
                            value={title}
                            onEnter={() => {
                              if (title === "") {
                                resetFilter("title");
                                updateSearch("");
                              } else {
                                prepareFilter();
                              }
                            }}
                          />
                          <Button
                            onClick={() => {
                              resetFilter("title"), updateSearch("");
                            }}
                            thickness="thin"
                            type="Small"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              height="22"
                            >
                              <path
                                d="M11.414 10l6.293-6.293a1 1 0 10-1.414-1.414L10 8.586 3.707 2.293a1 1 0 00-1.414 1.414L8.586 10l-6.293 6.293a1 1 0 101.414 1.414L10 11.414l6.293 6.293A.998.998 0 0018 17a.999.999 0 00-.293-.707L11.414 10z"
                                fill="#413bbc"
                              />
                            </svg>
                          </Button>
                        </FlexLayout>
                      ),
                    },
                    {
                      name: "ID",
                      children: (
                        <FlexLayout
                          halign="start"
                          spacing="loose"
                          childWidth="fullWidth"
                        >
                          <TextField
                            value={_id}
                            type="text"
                            thickness="thin"
                            onChange={(e) => {
                              // if (e.length < 40) {
                              if (
                                (e.charCodeAt(e.length - 1) >= 48 &&
                                  e.charCodeAt(e.length - 1) <= 57 &&
                                  e.length < 40) ||
                                e == ""
                              ) {
                                updateId(e);
                                setFilterToast(false);
                              }
                              // } else {
                              //   setFilterToast(true);
                              //   setFilterToastMsg(
                              //     "Maximum character length(40 characters) exceeded"
                              //   );
                              // }
                            }}
                            onEnter={() => {
                              if (_id === "") {
                                resetFilter("container_id");
                              } else {
                                prepareFilter();
                              }
                            }}
                          />

                          <Button
                            onClick={() => resetFilter("container_id")}
                            thickness="thin"
                            type="Small"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              height="22"
                            >
                              <path
                                d="M11.414 10l6.293-6.293a1 1 0 10-1.414-1.414L10 8.586 3.707 2.293a1 1 0 00-1.414 1.414L8.586 10l-6.293 6.293a1 1 0 101.414 1.414L10 11.414l6.293 6.293A.998.998 0 0018 17a.999.999 0 00-.293-.707L11.414 10z"
                                fill="#413bbc"
                              />
                            </svg>
                          </Button>
                        </FlexLayout>
                      ),
                    },
                    {
                      name: "Type",
                      children: (
                        <FlexLayout
                          valign="start"
                          spacing="extraLoose"
                          childWidth={"fullWidth"}
                        >
                          <TextField
                            value={type}
                            thickness="thin"
                            onChange={(e) => updateType(e)}
                            onEnter={() => {
                              if (type === "") {
                                resetFilter("product_type");
                              } else {
                                prepareFilter();
                              }
                            }}
                          />
                          <Button
                            onClick={() => resetFilter("product_type")}
                            thickness="thin"
                            type="Small"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              height="22"
                            >
                              <path
                                d="M11.414 10l6.293-6.293a1 1 0 10-1.414-1.414L10 8.586 3.707 2.293a1 1 0 00-1.414 1.414L8.586 10l-6.293 6.293a1 1 0 101.414 1.414L10 11.414l6.293 6.293A.998.998 0 0018 17a.999.999 0 00-.293-.707L11.414 10z"
                                fill="#413bbc"
                              />
                            </svg>
                          </Button>
                        </FlexLayout>
                      ),
                    },

                    {
                      name: "Status",
                      children: (
                        <FlexLayout
                          halign="fill"
                          spacing="extraLoose"
                          childWidth={"fullWidth"}
                        >
                          <Select
                            thickness="thin"
                            options={[
                              { label: "Live", value: "uploaded" },
                              { label: "Imported", value: "imported" },
                              { label: "Pending", value: "pending" },
                              { label: "Inactive", value: "disable" },
                              { label: "Rejected", value: "disapproved" },
                            ]}
                            value={stat}
                            onChange={(e) => {
                              if (e === "none") {
                                resetFilter("status");
                              } else {
                                updateStat(e);
                              }
                            }}
                          />
                        </FlexLayout>
                      ),
                    },
                    {
                      name: "Source",
                      children: (
                        <FlexLayout
                          halign="fill"
                          spacing="extraLoose"
                          childWidth={"fullWidth"}
                        >
                          <Select
                            thickness="thin"
                            options={[
                              // { label: "None", value: "none" },
                              { label: "Marketplace", value: "cedcommerce" },
                              { label: "Shopify", value: "shopify_vendor" },
                            ]}
                            value={source}
                            onChange={(e) => {
                              if (e === "none") {
                                resetFilter("source_marketplace");
                              } else {
                                setsource(e);
                              }
                            }}
                          />
                        </FlexLayout>
                      ),
                    },
                    {
                      name: "Quantity",
                      children: (
                        <FlexLayout
                          halign="start"
                          spacing="loose"
                          childWidth="fullWidth"
                          wrap={"noWrap"}
                        >
                          <TextField
                            placeHolder="from"
                            thickness="thin"
                            type={"text"}
                            onChange={(e) => {
                              if (
                                (e.charCodeAt(e.length - 1) >= 48 &&
                                  e.charCodeAt(e.length - 1) <= 57) ||
                                e == ""
                              ) {
                                updateQuantity(e);
                                setRangeFrom(e);
                              }
                            }}
                            value={RangeFrom}
                            onEnter={() => {
                              if (RangeTo === "" && RangeFrom === "") {
                                resetFilter("quantity");
                              } else {
                                prepareFilter();
                              }
                            }}
                          />
                          <TextField
                            placeHolder="to"
                            thickness="thin"
                            type="text"
                            // showHelp={
                            //   RangeTo >= RangeFrom && RangeTo !== ""
                            //     ? "Can't be same as start quantity"
                            //     : ""
                            // }
                            onChange={(e) => {
                              if (
                                (e.charCodeAt(e.length - 1) >= 48 &&
                                  e.charCodeAt(e.length - 1) <= 57) ||
                                e == ""
                              ) {
                                setRangeTo(e);
                              }
                            }}
                            value={RangeTo}
                            onEnter={() => {
                              if (RangeTo === "" && RangeFrom === "") {
                                resetFilter("quantity");
                              } else {
                                prepareFilter();
                              }
                            }}
                          />

                          <Button
                            thickness="thin"
                            type="Small"
                            onClick={() => resetFilter("quantity")}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              height="22"
                            >
                              <path
                                d="M11.414 10l6.293-6.293a1 1 0 10-1.414-1.414L10 8.586 3.707 2.293a1 1 0 00-1.414 1.414L8.586 10l-6.293 6.293a1 1 0 101.414 1.414L10 11.414l6.293 6.293A.998.998 0 0018 17a.999.999 0 00-.293-.707L11.414 10z"
                                fill="#413bbc"
                              />
                            </svg>
                          </Button>
                        </FlexLayout>
                      ),
                    },
                  ]}
                  heading={"Filters"}
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#413bbc"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                  }
                  onApply={prepareFilter}
                  resetFilter={resetAllFilter}
                  iconRound={false}
                />

                <ChoiceList
                  type={"secondary"}
                  thickness={"thin"}
                  placeholder="Customize Grid"
                  value={visibleColumnValue}
                  onChange={(val) => {
                    if (visibleColumnValue.includes(val)) {
                      const filterArr = visibleColumnValue.filter(
                        (ele: any) => {
                          return ele !== val;
                        }
                      );
                      columnToggle(filterArr, false, val);
                      setVisibleColumnValue(filterArr);
                    } else {
                      setVisibleColumnValue([...visibleColumnValue, ...[val]]);
                      columnToggle(
                        [...visibleColumnValue, ...[val]],
                        true,
                        val
                      );
                    }
                  }}
                  options={[
                    {
                      label: "Image",
                      value: "image",
                    },
                    // {
                    //   label: "Title",
                    //   value: "title"
                    // },
                    { label: "ID", value: "container_id" },
                    { label: "Status", value: "status" },
                    { label: "Inventory", value: "quantity" },
                    { label: "Type", value: "product_type" },
                    { label: "Source", value: "marketplace" },
                    // { label: "View", value: "ViewBtn" }
                  ]}
                ></ChoiceList>
              </FlexLayout>

              <FlexLayout spacing={"tight"} halign={"center"} valign={"center"}>
                {totalProduct > 0 && (
                  <TextStyles type="neutralText">
                    Showing {start + 1}-{end} of {totalProduct} Product(s)
                  </TextStyles>
                )}
                <div className="gridselect">
                  <Select
                    popoverContainer="element"
                    thickness="thin"
                    type="secondary"
                    options={[
                      { label: "10", value: "10" },
                      { label: "20", value: "20" },
                      { label: "50", value: "50" },
                      { label: "100", value: "100" },
                      { label: "200", value: "200" },
                    ]}
                    value={selectUpdateCount}
                    onChange={(e) => setSelectUpdateCount(e)}
                  />
                </div>
            

                <Pagination
                  // simpleView={false}
                  totalPages={PageCount}
                  currentPage={page > totalVariant ? totalVariant : page}
                  onNext={() => {
                    setpage(page + 1);
                  }}
                  onPrevious={() => {
                    setpage(page - 1);
                  }}
                  onEnter={(e: any) => {
                    setpage(e);
                    setInIf(false);
                  }}
                />
              </FlexLayout>
            </FlexLayout>
          </div>

          {Object.keys(filterTag).length > 4 && (
            <FlexLayout spacing="loose" halign={"start"}>
              {Object.keys(filterTag).map((key: any) => {
                if (key.includes("filter")) {
                  const filtertagArr = key
                    .replace("[", " ")
                    .replace("]", " ")
                    .split(" ");
                  const condition =
                    filtertagArr[2] === "[1]"
                      ? "equals to"
                      : filtertagArr[2] === "[2]"
                      ? "not equal to"
                      : filtertagArr[2] === "[3]"
                      ? "Contains "
                      : filtertagArr[2] === "[4]"
                      ? "does not contain to"
                      : filtertagArr[2] === "[5]"
                      ? "starts to"
                      : filtertagArr[2] === "[7][from]"
                      ? "from"
                      : "to";
                  return (
                    filterTag[key] !== "enable" && (
                      <Badge
                        destroy={() => resetFilter(filtertagArr[1])}
                        type="Success"
                        size="small"
                      >
                        {filterTag[key].length > 80 ? (
                          <ToolTip helpText={filterTag[key]}>
                            {(
                              filtertagArr[1].charAt(0).toUpperCase() +
                              filtertagArr[1].slice(1)
                            ).replaceAll("_", " ") +
                              " " +
                              condition +
                              " " +
                              filterTag[key].substring(1, 80) +
                              "..."}
                          </ToolTip>
                        ) : (
                          (
                            filtertagArr[1].charAt(0).toUpperCase() +
                            filtertagArr[1].slice(1)
                          )
                            .replace("ActiveStatus", "Status")
                            .replace("marketplace", "")
                            .replace("Container_id", "Product ID")
                            .replaceAll("_", " ") +
                          " " +
                          condition +
                          " " +
                          filterTag[key]
                            .replace("uploaded", "Live")
                            .replace("pending,approved", "Pending")
                            .replace("disapproved", "Rejected")
                            .replace("cedcommerce", "Marketplace")
                            .replace("shopify_vendor", "Shopify")
                            .replace("disable", "Inactive")
                        )}
                      </Badge>
                    )
                  );
                }
              })}
            </FlexLayout>
          )}
        </FlexLayout>
      </div>
      <ToastWrapper>
        {filterToast && (
          <Toast
            type="error"
            message={filterToastMsg}
            timeout={3000}
            onDismiss={() => setFilterToast(false)}
          />
        )}
      </ToastWrapper>
    </Card>
  );
}

export default DI(StatusGrid);
