/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import { DI, DIProps } from "../../../Core";
// import Null from "./../Image/null.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Grid } from "./../../../Shared/index";
import {
  Card,
  FlexLayout,
  Button,
  TextField,
  Filter,
  Select,
  ChoiceList,
  Pagination,
  Badge,
  TextStyles,
  PageHeader,
  ToolTip,
} from "@cedcommerce/ounce-ui";
import EmptyOrder from "../../../Core/EmptyStates/EmptyOrder";
interface props extends DIProps {
  url: string;
}

//interface PropsI extends DIProps {};
function Order(Props: props): JSX.Element {
  const [params, setParams] = useState<any>({
    activePage: 1,
    count: 10,
  });
  const [viewColumnToggle, setViewColumnToggle] = useState(false);
  const [rows, setRows] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [TotalCount, setTotalCount] = useState(0);
  const [name, setName] = useState(false);

  const [sort, setsort] = useState(true);
  const [NoProduct, setNoProduct] = useState(true);
  const [PageCount, setPageCount] = useState(0);
  const [columns, setColumns]: any = useState({
    source_order_id: {
      sort: true,
      name: "Order ID",
      visible: true,
    },
    placed_at: {
      name: "Date",
      visible: true,
    },
    total_price: {
      sort: true,
      name: "Total Price",
      visible: true,
    },
    name: {
      sort: true,
      name: "Customer",
      visible: true,
    },
    status: {
      name: "Status",
      visible: true,
    },
    email: {
      name: "Email",
      visible: false,
    },
    target: {
      name: "Channel",
      visible: false,
    },
    total_commision: {
      name: "Total Commision",
      visible: false,
    },
    qty: {
      sort: true,
      name: "Quantity",
      visible: true,
    },
    action: {
      name: "Action",
      visible: true,
    },
  });
  // function formatDate(data: any): any {
  //   const date = new Date(data);

  //   const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
  //   const mo = new Intl.DateTimeFormat("en", { month: "long" }).format(date);
  //   const da = new Intl.DateTimeFormat("en", { day: "numeric" }).format(date);
  //   let sub = "";
  //   if (+da > 3 && +da < 21) {
  //     sub = "th";
  //   } else {
  //     const r = +da % 10;
  //     if (r === 1) {
  //       sub = "st";
  //     }
  //     if (r === 2) {
  //       sub = "nd";
  //     }
  //     if (r === 3) {
  //       sub = "rd";
  //     }
  //   }
  //   if (sub === "") {
  //     sub = "th";
  //   }

  //   const dates = "" + da + sub + " " + mo + "," + ye;
  //   return dates;
  // }

  useEffect(() => {
    setRows([]);
    getAllOrders();
  }, [params]);

  function onSortClick() {
    setsort(!sort);
  }

  function getAllOrders() {
    setLoading(true);
    Props.di
      .GET(
        "connector/order/getAllOrders",
        // Object.keys(params).length > 2
        //   ? { ...params, ...{ activePage: 1 } }
        //   :

        params
      )
      .then((e) => {
        if (e.success == true) {
          if (e.data.rows.length == 0) {
            setNoProduct(false);
          } else {
            setNoProduct(true);
          }
          setTotalCount(e.data.count);
          if (params.count == 10) {
            if (Math.round(e.data.count / 10) < e.data.count / 10)
              setPageCount(Math.round(e.data.count / 10) + 1);
            else setPageCount(Math.round(e.data.count / 10));
          } else if (params.count == 20) {
            if (Math.round(e.data.count / 20) < e.data.count / 20)
              setPageCount(Math.round(e.data.count / 20) + 1);
            else setPageCount(Math.round(e.data.count / 20));
          } else if (params.count == 50) {
            if (Math.round(e.data.count / 50) < e.data.count / 50)
              setPageCount(Math.round(e.data.count / 50) + 1);
            else setPageCount(Math.round(e.data.count / 50));
          } else if (params.count == 100) {
            if (Math.round(e.data.count / 100) < e.data.count / 20)
              setPageCount(Math.round(e.data.count / 100) + 1);
            else setPageCount(Math.round(e.data.count / 100));
          }
          const temp: any = Object.keys(e.data.rows).map((j) => {
            return {
              source_order_id: (
                <span style={{ wordBreak: "keep-all" }}>
                  {e.data.rows[j].source_order_id}
                </span>
              ),
              placed_at: (
                <span style={{ wordBreak: "break-word" }}>
                  {e.data.rows[j]["placed_at"].split("T")[0]}
                </span>
              ),
              total_commision:
                e.data.rows[j].currency +
                " " +
                (
                  e.data.rows[j].total_price - e.data.rows[j].vendor_amount
                ).toFixed(2),

              total_price: e.data.rows[j].vendor_amount
                ? e.data.rows[j].currency +
                  " " +
                  e.data.rows[j].vendor_amount.toFixed(2)
                : e.data.rows[j].currency + " " + 0.0,
              name: <span>{e.data.rows[j].client_details.name}</span>,
              status: (
                <Badge
                  type={
                    e.data.rows[j].status == "pending"
                      ? "Info"
                      : e.data.rows[j].status == "fulfilled"
                      ? "Success"
                      : e.data.rows[j].status == "partially_fulfilled"
                      ? "partialSuccess"
                      : e.data.rows[j].status == "error"
                      ? "Warning"
                      : e.data.rows[j].status == "skipped"
                      ? "partialError"
                      : e.data.rows[j].status == "canceled"
                      ? "Error"
                      : e.data.rows[j].status == "partially_refunded"
                      ? "partialWarning"
                      : e.data.rows[j].status == "refunded"
                      ? "Pending"
                      : undefined
                  }
                >
                  {e.data.rows[j].status &&
                    e.data.rows[j].status
                      .toUpperCase()
                      .replace("_", " ")
                      .replace("CANCELED", "CANCELLED")}
                </Badge>
              ),

              email: e.data.rows[j].email,
              target: e.data.rows[j].target,
              qty: e.data.rows[j].qty,
              action: e.data.rows[j] && (
                <ToolTip helpText="View Order">
                  <Button
                    type="Plain"
                    thickness="thin"
                    onClick={() => {
                      Props.history.push(
                        "/order/" + e.data.rows[j].source_order_id,
                        { user_id: e.data.rows[j].user_id }
                      );
                    }}
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
                </ToolTip>
              ),
            };
          });
          setRows(temp);
        }
        setLoading(false);
      });
  }
  function handleSort(key: string, sort: boolean) {
    Object.keys(params).forEach((ind: string) => {
      if (ind.includes("sort")) {
        delete params[ind];
      }
    });
    if (sort) {
      if (key) params[`sort_key[${key}]`] = 1;
    } else {
      if (key) params[`sort_key[${key}]`] = -1;
    }

    getAllOrders();
  }

  function columnToggle(visibleCol: any, bool: boolean, objKey: any) {
    const col: any = columns;
    col[objKey].visible = bool;
    setName(!name);
    setColumns(col);
  }
  const quesicon = (
    <svg
      style={{ display: "flex" }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      height="20"
    >
      <path
        fillRule="evenodd"
        d="M0 10C0 4.478 4.478 0 10 0c5.523 0 10 4.478 10 10 0 5.523-4.477 10-10 10-5.522 0-10-4.477-10-10zm11.125 2.002H8.989v-.141c.01-1.966.492-2.254 1.374-2.782.093-.056.19-.114.293-.178.73-.459 1.292-1.038 1.292-1.883 0-.948-.743-1.564-1.666-1.564-.851 0-1.657.398-1.712 1.533H6.304C6.364 4.693 8.18 3.5 10.294 3.5c2.306 0 3.894 1.447 3.894 3.488 0 1.382-.695 2.288-1.805 2.952l-.238.144c-.79.475-1.009.607-1.02 1.777V12zm.17 3.012a1.344 1.344 0 01-1.327 1.328 1.32 1.32 0 01-1.328-1.328 1.318 1.318 0 011.328-1.316c.712 0 1.322.592 1.328 1.316z"
        fill="#000000"
      />
    </svg>
  );

  return (
    <>
      <PageHeader
        title="Orders"
        action={
          <Button
            type="Outlined"
            icon={quesicon}
            iconRound={false}
            thickness="thin"
            onClick={() =>
              window.open(
                "https://docs.cedcommerce.com/shopify/multivendor-marketplace-solution-vendors/?section=order-section-of-the-vendor-app"
              )
            }
          >
            Need Help
          </Button>
        }
      />

      <RenderCardFilter
        {...Props}
        params={setParams}
        preSetParams={params}
        columnToggle={columnToggle}
        TotalCount={TotalCount}
        Pagecount={PageCount}
        setViewColumnToggle={() => setViewColumnToggle(!viewColumnToggle)}
      />

      {NoProduct ? (
        <Grid
          loading={loading}
          viewColumnToggle={viewColumnToggle}
          rows={rows}
          columns={columns}
          handleSort={handleSort}
          sort={sort}
          onSortClick={onSortClick}
        />
      ) : (
        <Card>
          <EmptyOrder />{" "}
        </Card>
      )}
    </>
  );
}
interface tableActionI extends DIProps {
  params: any;

  setViewColumnToggle: () => void;
  TotalCount: number;
  preSetParams: any;
  columnToggle: (val: any, bool: boolean, objKey: any) => any;
  Pagecount: number;
}

function RenderCardFilter({
  TotalCount,
  Pagecount,
  preSetParams,
  columnToggle,
  params,
}: tableActionI): JSX.Element {
  const [search, updateSearch] = useState("");
  const [source_id, updateSourceId] = useState("");
  const [amount, UpdateAmount] = useState("");
  const [stat, updateStatus] = useState("");
  const [customer, updateCustomer] = useState("");
  const [source, updateSource] = useState("");
  const [filterTag, setFilterTag] = useState<any>("");
  const [page, setpage] = useState<any>(1);
  const [startDate, setStartDate] = useState(new Date());
  const [changedDate, setchangedDate] = useState(false);
  const [selectUpdateCount, setSelectUpdateCount] = useState("10");
  const [visibleColumnValue, setVisibleColumnValue] = useState<any>([
    "source_order_id",
    "total_price",
    "placed_at",
    "status",
    "name",
    "qty",
    "action",
  ]);

  useEffect(() => {
    prepareFilter();
  }, [page, selectUpdateCount]);
  function prepareFilter() {
    const par: any = {
      count: selectUpdateCount,
      activePage: page,
    };
    if (search && search != "") {
      par[`filter[source_order_id][3]`] = search;
    }
    if (source_id) par[`filter[source_order_id][3]`] = source_id;
    if (amount) par[`filter[client_details.name][3]`] = amount;
    if (stat) par[`filter[status][1]`] = stat;
    if (customer && /\S/.test(customer))
      par[`filter[client_details.name][3]`] = customer;
    if (source) par[`filter[target][3]`] = source;
    if (startDate && changedDate)
      par[`filter[created_at][3]`] = new Date(startDate)
        .toISOString()
        .slice(0, 10);

    params(par);
    setFilterTag(par);
  }

  function resetAllFilter() {
    const par: any = {
      count: selectUpdateCount,
      activePage: page,
    };
    if (startDate) delete par[`filter[created_at][3]`];
    if (source_id) delete par[`filter[source_order_id][3]`];
    if (stat) delete par[`filter[status][1]`];
    if (customer) delete par[`filter[client_details.name][3]`];
    updateSearch("");
    updateSourceId("");
    UpdateAmount("");
    updateCustomer("");
    UpdateAmount("");
    updateStatus("");
    updateSource("");
    params(par);
    setFilterTag(par);
  }

  function resetFilter(filterData: string) {
    const par: any = {
      ...preSetParams,
      ...{
        count: selectUpdateCount,
        activePage: page,
      },
    };
    switch (filterData) {
      case "source_order_id":
        delete par[`filter[source_order_id][3]`];

        updateSourceId("");
        break;
      case "created_at":
        delete par[`filter[created_at][3]`];

        setStartDate(new Date());
        setchangedDate(false);
        break;
      case "client_details.name":
        delete par[`filter[client_details.name][3]`];

        updateCustomer("");

        break;
      case "status":
        delete par[`filter[status][1]`];
        updateStatus("");

        break;
    }
    params(par);
    setFilterTag(par);
  }

  // useEffect(() => {
  //   updateStatus(stat);
  //   prepareFilter();
  // }, [stat]);

  return (
    <Card cardType="linkwater">
      <FlexLayout spacing={"loose"} direction="vertical">
        <div className={"grid_headrow"}>
          <FlexLayout spacing={"loose"} halign="fill">
            <FlexLayout spacing={"loose"} halign={"center"} valign={"center"}>
              <TextField
                placeHolder="Enter Order ID"
                thickness="thin"
                onChange={(e) => {
                  if (
                    (e.charCodeAt(e.length - 1) >= 48 &&
                      e.charCodeAt(e.length - 1) <= 57) ||
                    e == ""
                  ) {
                    updateSourceId(e);
                  }
                }}
                value={source_id}
                onEnter={() => {
                  prepareFilter();
                }}
              />

              <Filter
                label={"Filter"}
                type="Small"
                disableReset={false}
                filters={[
                  {
                    name: "Order ID",
                    children: (
                      <FlexLayout
                        halign="start"
                        spacing="loose"
                        childWidth="fullWidth"
                      >
                        <TextField
                          thickness="thin"
                          type="text"
                          value={source_id}
                          onChange={(e) => {
                            if (
                              (e.charCodeAt(e.length - 1) >= 48 &&
                                e.charCodeAt(e.length - 1) <= 57) ||
                              e == ""
                            ) {
                              updateSourceId(e);
                            }
                          }}
                          onEnter={() => {
                            prepareFilter();
                          }}
                        />
                        <Button
                          onClick={() => resetFilter("source_order_id")}
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
                    name: "Date",
                    children: (
                      <FlexLayout
                        halign="start"
                        spacing="loose"
                        childWidth="fullWidth"
                      >
                        <div
                          className="inte-formElement--Wrap  inte--Textfield__thin  "
                          style={{ width: "100%" }}
                        >
                          <DatePicker
                            className={
                              "inte-formElement inte-formElementTextfield inte--Textfield__thin"
                            }
                            selected={startDate}
                            onChange={(date: any) => {
                              setStartDate(date);
                              setchangedDate(true);
                            }}
                          />
                        </div>
                        {/* <TextField onEnter={() => { prepareFilter(); }} showHelp="YYYY-MM-DD" thickness='thin' value={startDate} onChange={(e: any) => { setStartDate(e); }}></TextField> */}
                        <Button
                          onClick={() => resetFilter("created_at")}
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

                  // {
                  //   name: "Amount",
                  //   children: (
                  //     <FlexLayout
                  //       halign='start'
                  //       spacing='loose'
                  //       childWidth='fullWidth'
                  //     >
                  //       <TextField
                  //         type={"text"}
                  //         thickness='thin'
                  //         onChange={(e) => UpdateAmount(e)}
                  //         value={amount}
                  //         onEnter={() => {
                  //           prepareFilter();
                  //         }}
                  //       />
                  //       <Button
                  //         onClick={() => resetFilter()}
                  //         thickness='thin'
                  //         type='Small'
                  //       >
                  //         <svg
                  //           xmlns='http://www.w3.org/2000/svg'
                  //           viewBox='0 0 20 20'
                  //           height='22'
                  //         >
                  //           <path
                  //             d='M11.414 10l6.293-6.293a1 1 0 10-1.414-1.414L10 8.586 3.707 2.293a1 1 0 00-1.414 1.414L8.586 10l-6.293 6.293a1 1 0 101.414 1.414L10 11.414l6.293 6.293A.998.998 0 0018 17a.999.999 0 00-.293-.707L11.414 10z'
                  //             fill='#413bbc'
                  //           />
                  //         </svg>
                  //       </Button>
                  //     </FlexLayout>
                  //   )
                  // },
                  {
                    name: "Customer",
                    children: (
                      <FlexLayout
                        halign="start"
                        spacing="loose"
                        childWidth="fullWidth"
                      >
                        <TextField
                          thickness="thin"
                          type={"text"}
                          onChange={(e) => {
                            updateCustomer(e);
                          }}
                          value={customer}
                          onEnter={() => {
                            prepareFilter();
                          }}
                        />
                        <Button
                          onClick={() => resetFilter("client_details.name")}
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
                        halign="start"
                        spacing="loose"
                        childWidth="fullWidth"
                      >
                        <Select
                          thickness="thin"
                          value={stat}
                          options={[
                            { label: "Pending", value: "pending" },
                            { label: "Fulfilled", value: "fulfilled" },
                            { label: "Cancelled", value: "canceled" },
                            {
                              label: "Partially-fulfilled",
                              value: "partially_fulfilled",
                            },
                            { label: "Refunded", value: "refunded" },
                            { label: "Partially-Refunded", value: "partially_refunded" },
                          ]}
                          onChange={(e) => {
                            updateStatus(e);
                            // prepareFilter();
                          }}
                        />
                      </FlexLayout>
                    ),
                  },
                  // {
                  //   name: "Source",
                  //   children: (
                  //     <FlexLayout
                  //       halign='start'
                  //       spacing='loose'
                  //       childWidth='fullWidth'
                  //     >
                  //       <Select
                  //         thickness='thin'
                  //         value={source}
                  //         options={[
                  //           { label: "Ozdingo", value: "Ozdingo" },
                  //           { label: "Amazon", value: "Amazon" },
                  //           { label: "Shopify", value: "shopify" },
                  //           { label: "Ebay", value: "Ebay" },
                  //           { label: "Kogan", value: "Kogan" },
                  //           { label: "Spocket", value: "Spocket" },
                  //           { label: "Trademe", value: "Trademe" },
                  //           { label: "Wish", value: "Wish" }
                  //         ]}
                  //         onChange={(e) => {
                  //           updateSource(e);
                  //           prepareFilter();
                  //         }}
                  //       />
                  //     </FlexLayout>
                  //   )
                  // }
                ]}
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
                heading={"Filters"}
                onApply={prepareFilter}
                resetFilter={resetAllFilter}
                iconRound={false}
              />
              {/* <ToolTip helpText='Customize your grid' position='bottom'>
              <Button
                type='Secondary'
                thickness='thin'
                onClick={setViewColumnToggle}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                  height='22'
                >
                  <path
                    fill='#413bbc'
                    fillRule='evenodd'
                    d='M19.928 9.629C17.791 4.286 13.681 1.85 9.573 2.064c-4.06.21-7.892 3.002-9.516 7.603L-.061 10l.118.333c1.624 4.601 5.455 7.393 9.516 7.603 4.108.213 8.218-2.222 10.355-7.565l.149-.371-.149-.371zM10 15a5 5 0 100-10 5 5 0 000 10z'
                  />
                  <circle fill='#413bbc' cx='10' cy='10' r='3' />
                </svg>
              </Button>
            </ToolTip> */}

              <ChoiceList
                type={"secondary"}
                thickness={"thin"}
                placeholder="Customize Grid"
                value={visibleColumnValue}
                onChange={(val) => {
                  if (visibleColumnValue.includes(val)) {
                    const filterArr = visibleColumnValue.filter((ele: any) => {
                      return ele !== val;
                    });
                    columnToggle(filterArr, false, val);
                    setVisibleColumnValue(filterArr);
                  } else {
                    setVisibleColumnValue([...visibleColumnValue, ...[val]]);
                    columnToggle([...visibleColumnValue, ...[val]], true, val);
                  }
                }}
                options={[
                  // {
                  //   label: "Source Order Id",
                  //   value: "source_order_id"
                  // },
                  {
                    label: "Date",
                    value: "placed_at",
                  },
                  // { label: "Total Price", value: "total_price" },
                  { label: "Customer", value: "name" },
                  { label: "Status", value: "status" },
                  { label: "Email", value: "email" },
                  { label: "Channel", value: "target" },
                  { label: "Total Commision", value: "total_commision" },
                  // { label: "Quantity", value: "qty" },
                  { label: "Action", value: "action" },
                ]}
              ></ChoiceList>
            </FlexLayout>
            <FlexLayout
              spacing={"loose"}
              childWidth="fullWidth"
              valign="center"
            >
              <TextStyles type="neutralText">
                Total Order(s): {TotalCount}
              </TextStyles>
              <div className="gridselect">
              <Select
                thickness="thin"
                type="secondary"
                popoverContainer="element"
                options={[
                  { label: "10", value: "10" },
                  { label: "20", value: "20" },
                  { label: "50", value: "50" },
                ]}
                value={selectUpdateCount}
                onChange={(e) => {
                  setSelectUpdateCount(e);
                }}
              />
              </div>
              <Pagination
                onEnter={(e) => setpage(e)}
                totalPages={Pagecount}
                currentPage={TotalCount === 0 ? 0 : page}
                onNext={() => {
                  setpage(page + 1);
                }}
                onPrevious={() => {
                  setpage(page - 1);
                }}
              />
            </FlexLayout>
          </FlexLayout>
        </div>
        {Object.keys(filterTag).length > 2 && (
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
                    ? "Contains"
                    : filtertagArr[2] === "[4]"
                    ? "does not contain to"
                    : filtertagArr[2] === "[5]"
                    ? "starts to"
                    : filtertagArr[2] === "[1][from]"
                    ? "from"
                    : "ends to";
                return (
                  <Badge
                    destroy={() => resetFilter(filtertagArr[1])}
                    size="small"
                    type="Success"
                  >
                    {filtertagArr[1]
                      .replace("source_order_id", "Order ID")
                      .replace("status", "Status")
                      .replace("client_details.name", "Customer")
                      .replace("created_at", "Created at") +
                      " " +
                      (filtertagArr[1] === "created_at" ? "" : condition) +
                      " " +
                      filterTag[key].replace("canceled", "cancelled")}
                  </Badge>
                );
              }
            })}
          </FlexLayout>
        )}
      </FlexLayout>
    </Card>
  );
}

export default DI(Order);
