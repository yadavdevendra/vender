/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { DI, DIProps } from "../../../Core";
import {
  Card,
  Button,
  Badge,
  FlexLayout,
  Pagination,
  Select,
  TextField,
  Filter,
  PageHeader,
  ChoiceList,
} from "@cedcommerce/ounce-ui";
import { Grid } from "../../../Shared/index";
// import Null from "./../Image/null.png";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EmptyDataFound from "../../../Core/EmptyStates/EmptyDataFound";

interface obj {
  source_order_id: number;
  user_id: number;
  source_marketplace: string;
}
function Request_Transactions(Props: DIProps): JSX.Element {
  const [TotalCount, setTotalCount] = useState(0);
  const [PageCount, setPageCount] = useState(0);
  const [name, setName] = useState(false);

  const [colWithoutAcion, setColwithoutAcion] = useState({
    created_at: {
      name: "Order Date",
      alignment: "center",
      visible: true,
      width: "100",
    },
    source_order_id: {
      name: "Order ID",

      visible: true,
      width: "150",
      alignment: "center",
    },
    vendor_amount: {
      name: "Pending Amount",

      visible: true,
      width: "200",
      alignment: "center",
    },
    total_commision: {
      name: "Total Commission",
      visible: true,
      width: "200",
      alignment: "center",
    },
  });
  const [col, setCol] = useState({
    created_at: {
      name: "Order Date",
      alignment: "center",
      visible: true,
      width: "100",
    },
    source_order_id: {
      name: "Order ID",

      visible: true,
      width: "150",
      alignment: "center",
    },
    vendor_amount: {
      name: "Pending Amount",

      visible: true,
      width: "200",
      alignment: "center",
    },
    total_commision: {
      name: "Total Commission",
      visible: true,
      width: "200",
      alignment: "center",
    },

    is_requested: {
      name: "Action",

      filter: false,
      visible: true,
      width: "100",
      alignment: "center",
    },
  });
  // const col =
  // const colWithoutAcion =
  const [params, setParams] = useState({
    activePage: 1,
    count: 10,
  });
  const [loading, setLoading] = useState(false);
  const [viewColumnToggle, setViewColumnToggle] = useState(false);

  const [rows, setRows] = useState([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function formatDate(data: any): any {
    const date = new Date(data);
    const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
    const mo = new Intl.DateTimeFormat("en", { month: "long" }).format(date);
    const da = new Intl.DateTimeFormat("en", { day: "numeric" }).format(date);
    let sub = "";
    if (+da > 3 && +da < 21) {
      sub = "th";
    } else {
      const r = +da % 10;
      if (r === 1) {
        sub = "st";
      }
      if (r === 2) {
        sub = "nd";
      }
      if (r === 3) {
        sub = "rd";
      }
    }
    if (sub === "") {
      sub = "th";
    }
    const dates = "" + da + sub + " " + mo + "," + ye;
    return dates;
  }
  useEffect(() => {
    getData();
  }, [params]);

  // const [error, setError] = useState(true);
  const [TransactionEnable, setTransactionEnable] = useState(false);
  useEffect(() => {
    Props.di.GET("/frontend/app/getUserDetails").then((e) => {
      if (e.success) {
        if (e.request_transactions_enable == "no") {
          setTransactionEnable(true);
        } else {
          setTransactionEnable(false);
        }
      }
    });
  }, []);
  function getData() {
    setLoading(true);

    Props.di
      .GET("/connector/transaction/getRequestTransaction", params)
      .then((e: any) => {
        if (e.success == true) {
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
              created_at: (
                <span style={{ wordBreak: "keep-all" }}>
                  {" "}
                  {formatDate(e.data.rows[j].created_at)}
                </span>
              ),
              vendor_amount:
                e.data.rows[j].currency +
                " " +
                (e.data.rows[j].vendor_amount
                  ? e.data.rows[j].vendor_amount.toFixed(2)
                  : 0.0),
              total_commision:
                e.data.rows[j].currency +
                " " +
                (
                  e.data.rows[j].commission +
                  e.data.rows[j].service_tax +
                  e.data.rows[j].marketplace_Fee +
                  e.data.rows[j].delayed_fulfillment_fine
                ).toFixed(2),
              source_order_id: (
                <Button
                  type="Plain"
                  onClick={() => {
                    Props.history.push(
                      `/order/${e.data.rows[j].source_order_id}`,
                      { user_id: e.data.rows[j].user_id }
                    );
                  }}
                >
                  {e.data.rows[j].source_order_id}
                </Button>
              ),
              is_requested:
                (e.data.rows[j].is_requested == true && (
                  <Badge size="small" type="Success">
                    Requested
                  </Badge>
                )) ||
                (e.data.rows[j].is_requested == false && (
                  <Button
                    type="Outlined"
                    thickness="thin"
                    onClick={() => HandleRequest(e.data.rows[j])}
                  >
                    Request
                  </Button>
                )) ||
                (e.data.rows[j].is_requested == "paid" && (
                  <Badge size="small" type="partialError">
                    Paid
                  </Badge>
                )),
            };
          });
          setRows(temp);
        } else {
          // setError(false);
        }
        setLoading(false);
      });
  }

  function HandleRequest(j: obj) {
    const temp1 = {
      source_order_id: j.source_order_id,
      user_i: j.user_id,
      marketplace: j.source_marketplace,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Props.di.POST(`/connector/transaction/createRequest`, temp1).then((h) => {
      getData();
    });
  }
  //

  function columnToggle(visibleCol: any, bool: boolean, objKey: any) {
    const cols: any = TransactionEnable ? colWithoutAcion : col;

    cols[objKey].visible = bool;
    setName(!name);
    TransactionEnable ? setColwithoutAcion(cols) : setCol(cols);
    // setColumns(cols);
  }

  return (
    <div>
      <PageHeader
        title="Pending Transaction"
        action={
          <Button
            type="Outlined"
            icon={
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
            }
            iconRound={false}
            thickness="thin"
            onClick={() =>
              window.open(
                "https://docs.cedcommerce.com/shopify/multivendor-marketplace-solution-vendors/?section=transactions-section-of-the-app"
              )
            }
          >
            Need Help
          </Button>
        }
      />
      <RenderCardFilter
        {...Props}
        props={Props}
        params={setParams}
        preSetParams={params}
        Pagecount={PageCount}
        TotalCount={TotalCount}
        columnToggle={columnToggle}
        TransactionEnable={TransactionEnable}
        setViewColumnToggle={() => setViewColumnToggle(!viewColumnToggle)}
      />
      {/* {Object.keys(colmn).length != 0 && error ? ( */}

      {rows.length > 0 ? (
        TransactionEnable ? (
          <Grid
            columns={colWithoutAcion}
            rows={rows}
            viewColumnToggle={viewColumnToggle}
            loading={loading}
          />
        ) : (
          <>
            <Grid
              columns={col}
              rows={rows}
              viewColumnToggle={viewColumnToggle}
              loading={loading}
            />
          </>
        )
      ) : (
        <Card>
          {" "}
          <EmptyDataFound />
        </Card>
      )}
    </div>
  );
}
interface tableActionI extends DIProps {
  params: any;
  props: any;
  TotalCount: number;
  Pagecount: number;
  preSetParams: any;
  columnToggle: (val: any, bool: boolean, objKey: any) => any;
  setViewColumnToggle: () => void;
  TransactionEnable: boolean;
}
function RenderCardFilter({
  params,
  TransactionEnable,
  TotalCount,
  Pagecount,
  // setViewColumnToggle,
  preSetParams,
  columnToggle,
}: tableActionI): JSX.Element {
  const [search, updateSearch] = useState("");
  const [src_ID, updateId] = useState("");
  const [date, UpdateDate] = useState(new Date());
  const [pending_amount, updatePendingAmount] = useState("");
  const [page, setpage] = useState(1);
  const [selectUpdateCount, setSelectUpdateCount] = useState("10");
  const [filterTag, setFilterTag] = useState<any>("");
  const [changedDate, setchangedDate] = useState(false);
  const [visibleColumnValue, setVisibleColumnValue] = useState<any>([
    "created_at",
    "source_order_id",
    "vendor_amount",
    "total_commision",
    "is_requested",
  ]);
  useEffect(() => {
    prepareFilter();
  }, [page, selectUpdateCount]);

  function prepareFilter() {
    const par: any = {
      count: 10,
      activePage: page,
    };
    if (search && search != "") {
      par[`filter[source_order_id][1]`] = search;
    }
    if (date && changedDate)
      par[`filter[created_at][1][from]`] = date.toISOString().slice(0, 10);

    if (src_ID) par[`filter[source_order_id][1]`] = src_ID;
    // if (date) par[`filter[is_requested][1]`] = date;
    if (pending_amount) par[`filter[vendor_amount][1]`] = pending_amount;

    params(par);
    setFilterTag(par);
  }
  function resetAllFilter() {
    const par: any = {
      count: selectUpdateCount,
      activePage: page,
    };
    if (src_ID) delete par[`fulfillments.0.shipment_id][3]`];
    if (date) delete par[`filter[created_at][1][from]`];
    if (pending_amount) delete par[`filter[shipped_qty][3]`];
    updateSearch("");
    updateId("");
    UpdateDate(new Date());
    setchangedDate(false);
    updatePendingAmount("");
    params(par);
    setFilterTag(par);
  }

  const resetFilter = (remove: string) => {
    const par = { ...{}, ...preSetParams };

    delete par[`filter[${remove}][3]`];
    delete par[`filter[${remove}][1]`];
    switch (remove) {
      case "source_order_id":
        updateId("");
        break;
      case "vendor_amount":
        updatePendingAmount("");
        break;
      case "created_at":
        delete par[`filter[created_at][1][from]`];
        UpdateDate(new Date());
        setchangedDate(false);
        break;
    }
    params(par);
    setFilterTag(par);
  };

  return (
    <>
      <Card cardType="linkwater">
        <FlexLayout spacing={"loose"} direction="vertical">
          <FlexLayout spacing={"loose"} halign="fill">
            <FlexLayout spacing={"loose"}>
              <TextField
                placeHolder={"Enter Order ID"}
                thickness="thin"
                onChange={(e) => updateSearch(e)}
                value={search}
                onEnter={() => {
                  prepareFilter();
                }}
              />

              <Filter
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
                          value={src_ID}
                          onChange={(e) => updateId(e)}
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
                            selected={date}
                            onChange={(date: any) => {
                              UpdateDate(date);
                              setchangedDate(true);
                            }}
                          />
                        </div>
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
                  {
                    name: "Amount",
                    children: (
                      <FlexLayout
                        halign="start"
                        spacing="loose"
                        childWidth="fullWidth"
                      >
                        <TextField
                          thickness="thin"
                          onChange={(e) => updatePendingAmount(e)}
                          value={pending_amount}
                          onEnter={() => {
                            prepareFilter();
                          }}
                        />
                        <Button
                          onClick={() => resetFilter("vendor_amount")}
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
                ]}
                resetFilter={() => resetAllFilter()}
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
                iconRound={false}
                onApply={prepareFilter}
              />
              {/* <Button type="Secondary" thickness="thin" onClick={setViewColumnToggle}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" height="22"><path fill="#413bbc" fillRule="evenodd" d="M19.928 9.629C17.791 4.286 13.681 1.85 9.573 2.064c-4.06.21-7.892 3.002-9.516 7.603L-.061 10l.118.333c1.624 4.601 5.455 7.393 9.516 7.603 4.108.213 8.218-2.222 10.355-7.565l.149-.371-.149-.371zM10 15a5 5 0 100-10 5 5 0 000 10z" /><circle fill="#413bbc" cx="10" cy="10" r="3" /></svg>

              </Button> */}

              <ChoiceList
                type={"secondary"}
                thickness={"thin"}
                // disabled={true}
                // childFlexOptions={ }
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
                options={
                  TransactionEnable
                    ? [
                        {
                          label: "Order ID",
                          value: "source_order_id",
                        },
                        { label: "Order Date", value: "created_at" },
                        { label: "Pending Amount", value: "vendor_amount" },
                        { label: "Total Commission", value: "total_commision" },
                      ]
                    : [
                        {
                          label: "Order ID",
                          value: "source_order_id",
                        },
                        { label: "Order Date", value: "created_at" },
                        { label: "Pending Amount", value: "vendor_amount" },
                        { label: "Total Commission", value: "total_commision" },
                        { label: "Action", value: "is_requested" },
                      ]
                }
              ></ChoiceList>
            </FlexLayout>
            <FlexLayout spacing={"loose"}>
              <div className="gridselect">
                <Select
                  thickness="thin"
                  type="secondary"
                  popoverContainer="element"
                  options={[
                    { label: "10", value: "10" },
                    { label: "20", value: "20" },
                    { label: "50", value: "50" },
                    { label: "100", value: "100" },
                  ]}
                  value={selectUpdateCount}
                  onChange={(e) => setSelectUpdateCount(e)}
                />
              </div>
              <Pagination
                onEnter={(e: any) => setpage(e)}
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

          {Object.keys(filterTag).length > 2 && (
            <FlexLayout spacing="loose" halign="start">
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
                      : "ends to";
                  return (
                    <Badge
                      destroy={() => resetFilter(filtertagArr[1])}
                      type="Success"
                      size="small"
                    >
                      {filtertagArr[1]
                        .replaceAll("_", " ")
                        .replace("created at", "Date")
                        .replace("source order id", "Order Id")
                        .replace("vendor amount", "Amount") +
                        " " +
                        condition +
                        " " +
                        filterTag[key]}
                    </Badge>
                  );
                }
              })}
            </FlexLayout>
          )}
        </FlexLayout>
      </Card>
    </>
  );
}

export default DI(Request_Transactions);
