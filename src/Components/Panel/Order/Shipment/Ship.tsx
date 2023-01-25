/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Badge,
  Button,
  Card,
  Filter,
  FlexLayout,
  PageHeader,
  Pagination,
  Select,
  TextField,
  TextStyles,
  ChoiceList,
} from "@cedcommerce/ounce-ui";
import React, { useEffect, useState } from "react";
import { DI, DIProps } from "../../../../Core";
import { Grid } from "./../../../../Shared/index";
import Null from "./../../Image/null.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import EmptyDataFound from "../../../../Core/EmptyStates/EmptyDataFound";

function Ship(props: DIProps) {
  const [TotalShip, setTotalShip] = useState(0);
  const [viewColumnToggle, setViewColumnToggle] = useState(false);
  const [params, setParams] = useState({
    activePage: 1,
    count: 10,
  });
  const [NoProduct, setNoProduct] = useState(true);
  const [PageCount, setPageCount] = useState(0);
  const [Rows, setRows] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [Data, setData] = useState([]);
  const [name, setName] = useState(false);
  const [columns, setColumns] = useState({
    source_order_id: {
      name: "Order ID",
      visible: true,
    },
    shipment_id: {
      visible: true,
      name: "Shipment ID",
    },

    shipped_date: {
      visible: true,
      name: "Created At",
    },

    quantity: {
      visible: true,
      name: "Shipped Quantity",
    },

    action: {
      visible: true,
      name: "View",
    },
  });

  useEffect(() => {
    getData();
  }, [params]);
  function getData() {
    setLoading(true);
    setRows([]);
    props.di
      .GET(
        "connector/shipment/getAllShipments",
        Object.keys(params).length > 2
          ? { ...params, ...{ activePage: 1 } }
          : params
      )
      .then((e) => {
        if (e.success) {
          if (e.data.rows.length == 0) {
            setNoProduct(false);
          } else {
            setNoProduct(true);
          }
          setData(e.data.rows);
          setTotalShip(e.data.count);
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
          const temp = Object.keys(e.data.rows).map((j) => {
            let t = 0;
            return {
              ...e.data.rows[j],
              shipment_id: e.data.rows[j].fulfillments.shipment_id,
              shipped_date: e.data.rows[j].fulfillments.shipped_date,
              quantity: e.data.rows[j].fulfillments.items.map((ele: any) => {
                // console.log(ele, "ele");
                t = t + ele.quantity;
                return t;
              }),
              action: e.data.rows[j] && (
                <Button
                  type="Plain"
                  thickness="thin"
                  onClick={() => {
                    props.history.push(
                      "/ship/" + e.data.rows[j].fulfillments.shipment_id
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
              ),
            };
          });
          setRows(temp);
        }
        setLoading(false);
      });
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
    <div>
      <PageHeader
        title="Shipments"
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
          // <span
          //   style={{ cursor: "pointer" }}
          //   onClick={() =>
          //     window.open(
          //       "hhttps://devbackend.cedcommerce.com/docs/#/resources/shipment"
          //     )
          //   }
          // >
          //   <Badge size={"small"} backgroundColor="#6ec5b8" badgeTextColor="light">
          //     <FlexLayout halign="start" spacing="none" valign="center">
          //       <>
          //       <svg style={{display:"flex"}}
          //         xmlns="http://www.w3.org/2000/svg"
          //         viewBox="0 0 20 20"
          //         height="15"
          //       >
          //         <path
          //           fillRule="evenodd"
          //           d="M0 10C0 4.478 4.478 0 10 0c5.523 0 10 4.478 10 10 0 5.523-4.477 10-10 10-5.522 0-10-4.477-10-10zm11.125 2.002H8.989v-.141c.01-1.966.492-2.254 1.374-2.782.093-.056.19-.114.293-.178.73-.459 1.292-1.038 1.292-1.883 0-.948-.743-1.564-1.666-1.564-.851 0-1.657.398-1.712 1.533H6.304C6.364 4.693 8.18 3.5 10.294 3.5c2.306 0 3.894 1.447 3.894 3.488 0 1.382-.695 2.288-1.805 2.952l-.238.144c-.79.475-1.009.607-1.02 1.777V12zm.17 3.012a1.344 1.344 0 01-1.327 1.328 1.32 1.32 0 01-1.328-1.328 1.318 1.318 0 011.328-1.316c.712 0 1.322.592 1.328 1.316z"
          //           fill="#ffffff"
          //         />
          //       </svg>
          //       </>
          //         <TextStyles type="smallText">Need Help</TextStyles>

          //     </FlexLayout>
          //   </Badge>
          // </span>
        }
      />
      <RenderCardFilter
        {...props}
        preSetParams={params}
        TotalShip={TotalShip}
        PageCount={PageCount}
        columnToggle={columnToggle}
        params={setParams}
        setViewColumnToggle={() => setViewColumnToggle(!viewColumnToggle)}
      />
      {NoProduct ? (
        <Grid
          loading={loading}
          rows={Rows}
          columns={columns}
          viewColumnToggle={viewColumnToggle}
        />
      ) : (
        <Card>
          <EmptyDataFound />
        </Card>
      )}
    </div>
  );
}
interface tableActionI extends DIProps {
  params: any;
  preSetParams: any;
  columnToggle: (val: any, bool: boolean, objKey: any) => any;
  PageCount: number;
  setViewColumnToggle: () => void;
  TotalShip: number;
}
function RenderCardFilter({
  params,
  preSetParams,
  setViewColumnToggle,
  columnToggle,
  TotalShip,
  PageCount,
}: tableActionI): JSX.Element {
  const [search, updateSearch] = useState("");
  const [Ship_id, updateShipID] = useState("");
  const [orderId, setorderId] = useState("");
  const [fullAdd, setFullAdd] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectUpdateCount, setSelectUpdateCount] = useState("10");

  // const [startDate, setStartDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());

  const [filterTag, setFilterTag] = useState<any>(preSetParams);
  const [changedDate, setchangedDate] = useState(false);

  const [pageCount, setPageCount] = useState(PageCount);
  const [page, setpage] = useState<any>(1);
  const [visibleColumnValue, setVisibleColumnValue] = useState<any>([
    "source_order_id",
    "shipment_id",
    "shipped_date",
    "shipped_qty",
    "action",
  ]);
  useEffect(() => {
    prepareFilter();
  }, [page, selectUpdateCount]);
  function prepareFilter() {
    // const Original_month = startDate.getMonth() + 1;
    // let Startmonth = "";
    // let tempStartDate = "";
    // if (Original_month < 10) {
    //     Startmonth = "0" + Original_month;
    //     tempStartDate = startDate.getFullYear() + "-" + Startmonth + "-" + startDate.getDate();
    // }

    const par: any = {
      ...preSetParams,
      ...{
        count: selectUpdateCount,
        activePage: page,
      },
    };
    if (search && search != "") {
      par[`or_filter[shipment_id][3]`] = search;
    }
    if (orderId) par[`filter[source_order_id][3]`] = orderId;
    if (Ship_id) par[`filter[fulfillments.shipment_id][3]`] = Ship_id;

    if (quantity) par[`filter[shipped_qty][1]`] = quantity;
    if (startDate && changedDate)
      par[`filter[created_at][3]`] = new Date(startDate)
        .toISOString()
        .slice(0, 10);
    setFilterTag(par);

    params(par);
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
      case "fulfillments.shipment_id":
        delete par[`filter[fulfillments.shipment_id][3]`];
        updateShipID("");
        break;
      case "source_order_id":
        delete par[`filter[source_order_id][3]`];
        setorderId("");
        break;
      case "shipped_qty":
        delete par[`filter[shipped_qty][1]`];
        setQuantity("");
        break;
      case "created_at":
        delete par[`filter[created_at][3]`];

        setStartDate(new Date());
        setchangedDate(false);
        break;
    }
    params(par);

    setFilterTag(par);
  }

  function resetAllFilter() {
    const par: any = {
      ...preSetParams,
      ...{
        count: selectUpdateCount,
        activePage: page,
      },
    };
    if (orderId) par[`fulfillments.shipment_id][3]`] = orderId;

    if (Ship_id) delete par[`filter[shipment_id][3]`];
    if (quantity) delete par[`filter[shipped_qty][3]`];
    if (startDate) delete par[`filter[created_at][3][from]`];

    updateSearch("");
    setorderId("");
    setQuantity("");
    updateShipID("");

    params(par);
    setFilterTag(par);
  }

  return (
    <Card cardType="linkwater">
      <FlexLayout spacing={"loose"} direction="vertical">
        <FlexLayout spacing={"loose"} halign="fill">
          <FlexLayout spacing={"loose"} halign={"center"} valign={"center"}>
            <TextField
              placeHolder={"Enter Shipment ID"}
              thickness="thin"
              onChange={(e) => {
                if (
                  (e.charCodeAt(e.length - 1) >= 48 &&
                    e.charCodeAt(e.length - 1) <= 57) ||
                  e == ""
                ) {
                  updateShipID(e);
                }
              }}
              value={Ship_id}
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
              onEnter={() => {
                if (Ship_id === "") {
                  resetFilter("fulfillments.shipment_id");
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
                  name: "Shipment ID",
                  children: (
                    <FlexLayout
                      halign="start"
                      spacing="loose"
                      childWidth="fullWidth"
                    >
                      <TextField
                        value={Ship_id}
                        thickness="thin"
                        type="text"
                        onChange={(e) => {
                          if (
                            (e.charCodeAt(e.length - 1) >= 48 &&
                              e.charCodeAt(e.length - 1) <= 57) ||
                            e == ""
                          ) {
                            updateShipID(e);
                          }
                        }}
                        onEnter={() => {
                          if (Ship_id === "") {
                            resetFilter("fulfillments.shipment_id");
                          } else {
                            prepareFilter();
                          }
                        }}
                      />
                      <Button
                        onClick={() => resetFilter("fulfillments.shipment_id")}
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
                  name: "Order ID",
                  children: (
                    <FlexLayout
                      halign="start"
                      spacing="loose"
                      childWidth="fullWidth"
                    >
                      <TextField
                        thickness="thin"
                        value={orderId}
                        type="text"
                        onChange={(e) => {
                          if (
                            (e.charCodeAt(e.length - 1) >= 48 &&
                              e.charCodeAt(e.length - 1) <= 57) ||
                            e == ""
                          ) {
                            setorderId(e);
                          }
                        }}
                        onEnter={() => {
                          if (orderId === "") {
                            resetFilter("source_order_id");
                          } else {
                            prepareFilter();
                          }
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
                      <div className={"inte--Textfield__thin"}>
                        <DatePicker
                          popperPlacement={"bottom"}
                          popperModifiers={{
                            flip: {
                              behavior: ["bottom"],
                            },
                            preventOverflow: {
                              enabled: false,
                            },
                            hide: {
                              enabled: false,
                            },
                          }}
                          className={
                            "inte-formElement inte-formElementTextfield"
                          }
                          selected={startDate}
                          onChange={(date: any) => {
                            setStartDate(date), setchangedDate(true);
                          }}
                        />
                      </div>
                      {/* <TextField showHelp="YYYY-MM-DD" thickness='thin' value={startDate} onChange={(e: any) => setStartDate(e)}></TextField> */}
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
                  name: "Shipped Quantity",
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
                          if (
                            (e.charCodeAt(e.length - 1) >= 48 &&
                              e.charCodeAt(e.length - 1) <= 57) ||
                            e == ""
                          ) {
                            setQuantity(e);
                          }
                        }}
                        value={quantity}
                        onEnter={() => {
                          if (quantity === "") {
                            resetFilter("shipped_qty");
                          } else {
                            prepareFilter();
                          }
                        }}
                      />
                      <Button
                        onClick={() => resetFilter("shipped_qty")}
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
              resetFilter={resetAllFilter}
              onApply={prepareFilter}
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
              iconRound={false}
              // icon={<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#413bbc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>}
            />
            {/* <Button
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
            </Button> */}
            {/* <ChoiceList
              type={"secondary"}
              thickness={"thin"}
              placeholder='Show Columns'
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
                {
                  label: "Source Order Id",
                  value: "source_order_id"
                },
                {
                  label: "Shipment ID",
                  value: "shipment_id"
                },
                { label: "Date", value: "shipped_date" },
                { label: "Quantity", value: "shipped_qty" },
                { label: "View", value: "action" }
              ]}
            ></ChoiceList> */}
          </FlexLayout>
          <FlexLayout spacing={"loose"} halign={"center"} valign={"center"}>
            <div style={{ marginTop: "10px" }}>
              <TextStyles type="neutralText">
                {" "}
                Total Shipment(s): {TotalShip}
              </TextStyles>
            </div>
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
              onChange={(e) => setSelectUpdateCount(e)}
            />
            </div>
            <Pagination
              onEnter={(e) => setpage(e)}
              totalPages={PageCount}
              currentPage={TotalShip === 0 ? 0 : page}
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
                    {(filtertagArr[1] === "fulfillments.shipment_id"
                      ? "Shipment ID"
                      : (
                          filtertagArr[1].charAt(0).toUpperCase() +
                          filtertagArr[1].slice(1)
                        )
                          .replaceAll("_", " ")
                          .replace("qty", "Quantity")
                          .replace("Source order id", "Order ID")
                          .replace("id", "ID")) +
                      " " +
                      (filtertagArr[1] === "created_at" ? "" : condition) +
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
  );
}

export default DI(Ship);
