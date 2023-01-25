/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import { DI, DIProps } from "../../../Core";
import {
  Button,
  Card,
  Pagination,
  FlexLayout,
  TextField,
  Select,
  Filter,
  Badge,
  PageHeader,
  ChoiceList,
} from "@cedcommerce/ounce-ui";
import { Grid } from "../../../Shared/index";
// import Null from "./../Image/null.png";
// import DatePicker from "react-datepicker";
import EmptyDataFound from "../../../Core/EmptyStates/EmptyDataFound";

function View_transaction(Props: DIProps): JSX.Element {
  const [params, setParams] = useState({
    activePage: 1,
    count: 10,
  });
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [TotalCount, setTotalCount] = useState(0);

  const [PageCount, setPageCount] = useState(0);
  const [viewColumnToggle, setViewColumnToggle] = useState(false);
  const [name, setName] = useState(false);
  const [columns, setColumns] = useState({
    transaction_id: {
      name: "Transaction ID",
      visible: true,
    },
    created_at: {
      name: "Date",
      visible: true,
    },
    vendor_amount: {
      name: "Transaction Amount",
      visible: true,
    },
    commission: {
      name: "Commission",
      visible: true,
    },

    marketplace_Fee: {
      name: "Marketplace Fee",
      visible: true,
    },
    service_tax: {
      name: "Service Tax",
      visible: true,
    },
    total_price: {
      name: "Order Total",
      visible: true,
    },

    action: {
      name: "Action",

      visible: true,
    },
  });
  const url = "/connector/transaction/getTransactions";

  function getData() {
    setLoading(true);
    setRows([]);
    Props.di.GET(url, params).then((e) => {
      if (e.success == true && e.data.count != 0) {
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
            ...e.data.rows[j],
            commission:
              Props.currency +
              " " +
              (e.data.rows[j].commission &&
                e.data.rows[j].commission.toFixed(2)),
            vendor_amount:
              Props.currency +
              " " +
              (e.data.rows[j].vendor_amount &&
                e.data.rows[j].vendor_amount.toFixed(2)),
            transaction_id: e.data.rows[j].transaction_id,
            shipment_Fee:
              Props.currency +
              " " +
              (e.data.rows[j].shipment_Fee &&
                e.data.rows[j].shipment_Fee.toFixed(2)),
            price:
              Props.currency +
              " " +
              (e.data.rows[j].total_price &&
                e.data.rows[j].total_price.toFixed(2)),
            marketplace_Fee:
              Props.currency +
              " " +
              (e.data.rows[j].marketplace_Fee &&
                e.data.rows[j].marketplace_Fee.toFixed(2)),
            service_tax:
              Props.currency +
              " " +
              (e.data.rows[j].service_tax &&
                e.data.rows[j].service_tax.toFixed(2)),
            total_price:
              Props.currency +
              " " +
              (e.data.rows[j].total_price &&
                e.data.rows[j].total_price.toFixed(2)),
            action: e.data.rows[j] && (
              <Button
                type="Plain"
                thickness="thin"
                onClick={() => {
                  Props.history.push(
                    "/transaction/complete/" + e.data.rows[j].transaction_id,
                    { currency: Props.currency }
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
      // else {
      //   setNotFound(false);
      // }
      setLoading(false);
    });
  }

  useEffect(() => {
    getData();
  }, [params, Props.currency]);

  function columnToggle(visibleCol: any, bool: boolean, objKey: any) {
    const col: any = columns;
    col[objKey].visible = bool;
    setName(!name);
    setColumns(col);
  }

  return (
    <div>
      <PageHeader
        title="Complete Transaction"
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
        params={setParams}
        preSetParams={params}
        columnToggle={columnToggle}
        Pagecount={PageCount}
        TotalCount={TotalCount}
        setViewColumnToggle={() => setViewColumnToggle(!viewColumnToggle)}
        count={0}
      />

      {rows.length > 0 ? (
        <Grid
          loading={loading}
          columns={columns}
          rows={rows}
          viewColumnToggle={viewColumnToggle}
        />
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
  count: number;
  params: any;
  preSetParams: any;
  Pagecount: any;
  TotalCount: any;
  columnToggle: (val: any, bool: boolean, objKey: any) => any;
  setViewColumnToggle: () => void;
}
function RenderCardFilter({
  columnToggle,
  params,
  preSetParams,
  // setViewColumnToggle,
  TotalCount,
  Pagecount,
}: tableActionI): JSX.Element {
  const selectOptions = [
    { label: "10", value: "10" },
    { label: "20", value: "20" },
    { label: "30", value: "30" },
    { label: "50", value: "50" },
    { label: "100", value: "100" },
    { label: "150", value: "150" },
  ];
  const [selectValue, setSelectValue] = useState("10");
  const [search, updateSearch] = useState("");
  const [transactionID, updateId] = useState("");
  const [marketplaceFee, updateMarketPlaceFee] = useState("");
  const [totalPrice, updateTotalPrice] = useState("");
  const [prc, updatePrice] = useState("");
  const [serviceTax, updateServiceTax] = useState("");
  // const [objSelect1, setObjSelect1] = useState<Array<any>>([]);
  const [page, setpage] = useState(1);
  const [visibleColumnValue, setVisibleColumnValue] = useState<any>([
    "transaction_id",
    "created_at",
    "vendor_amount",
    "commission",
    "marketplace_Fee",
    "service_tax",
    "total_price",
    "action",
  ]);
  const [TransactionAmt, setTransactionAmt] = useState("");
  const [commision, setcommision] = useState("");

  const [filterTag, setFilterTag] = useState<any>(preSetParams);

  useEffect(() => {
    prepareFilter();
  }, [page, selectValue]);

  function prepareFilter() {
    const par: any = {
      ...preSetParams,
      ...{
        count: selectValue,
        activePage: page,
      },
    };
    if (search && search != "") {
      par[`filter[transaction_id][1]`] = search;
    }
    if (transactionID) par[`filter[transaction_id][1]`] = transactionID;
    if (prc) par[`filter[price][3]`] = prc;
    if (TransactionAmt) par[`filter[vendor_amount][1]`] = TransactionAmt;
    if (commision) par[`filter[commission][1]`] = commision;
    if (marketplaceFee) par[`filter[marketplace_Fee][1]`] = marketplaceFee;
    if (serviceTax) par[`filter[service_tax][1]`] = serviceTax;
    if (totalPrice) par[`filter[total_price][1]`] = totalPrice;
    setFilterTag(par);
    params(par);
  }
  function resetFilter(filterData: string) {
    // console.log(filterData, "cj");
    const par: any = {
      ...preSetParams,
      ...{
        count: selectValue,
        activePage: page,
      },
    };
    switch (filterData) {
      case "transaction_id":
        delete par[`filter[transaction_id][1]`];
        updateId("");
        updateSearch("");
        break;
      case "price":
        delete par[`filter[price][3]`];
        updatePrice("");

        break;

      case "marketplace_Fee":
        delete par[`filter[marketplace_Fee][1]`];
        updateMarketPlaceFee("");

        break;

      case "service_tax":
        delete par[`filter[service_tax][1]`];
        updateServiceTax("");

        break;
      case "vendor_amount":
        delete par[`filter[vendor_amount][1]`];
        setTransactionAmt("");
        break;
      case "commission":
        delete par[`filter[commission][1]`];
        setcommision("");
        break;

      case "total_price":
        delete par[`filter[total_price][1]`];
        updateTotalPrice("");
        break;
      default:
        break;
    }

    params(par);
    setFilterTag(par);
  }

  const resetAllFilters = () => {
    const par: any = {
      count: selectValue,
      activePage: page,
    };
    updateTotalPrice("");
    setcommision("");
    setTransactionAmt("");
    updateServiceTax("");
    updateMarketPlaceFee("");
    updatePrice("");
    updateId("");
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
                placeHolder={"Enter ID"}
                thickness="thin"
                onChange={(e) => updateSearch(e)}
                value={search}
                onEnter={() => {
                  if (search == "") {
                    resetFilter("transaction_id");
                  } else {
                    prepareFilter();
                  }
                }}
              />

              <Filter
                type="Small"
                disableReset={false}
                filters={[
                  {
                    name: "Transaction ID",
                    children: (
                      <FlexLayout
                        halign="start"
                        spacing="loose"
                        childWidth="fullWidth"
                      >
                        <TextField
                          thickness="thin"
                          value={transactionID}
                          onChange={(e) => updateId(e)}
                          onEnter={() => {
                            prepareFilter();
                          }}
                        />
                        <Button
                          onClick={() => resetFilter("transaction_id")}
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
                  //   name: "Date",
                  //   children: (
                  //     <FlexLayout
                  //       halign="start"
                  //       spacing="loose"
                  //       childWidth="fullWidth"
                  //     >
                  //       {/* <TextField
                  //         showHelp="YYYY-MM-DD"
                  //         type={"text"}
                  //         thickness="thin"
                  //         value={date}
                  //         onChange={(e) => UpdateDate(e)}
                  //         onEnter={() => {
                  //           prepareFilter();
                  //         }}
                  //       /> */}
                  //       <DatePicker
                  //         className={
                  //           "inte-formElement inte-formElementTextfield"
                  //         }
                  //         selected={date}
                  //         onChange={(date: any) => UpdateDate(date)}
                  //       />
                  //       <Button
                  //         onClick={() => {
                  //           resetFilter();
                  //           UpdateDate(new Date());
                  //         }}
                  //         thickness="thin"
                  //         type="Small"
                  //       >
                  //         <svg
                  //           xmlns="http://www.w3.org/2000/svg"
                  //           viewBox="0 0 20 20"
                  //           height="22"
                  //         >
                  //           <path
                  //             d="M11.414 10l6.293-6.293a1 1 0 10-1.414-1.414L10 8.586 3.707 2.293a1 1 0 00-1.414 1.414L8.586 10l-6.293 6.293a1 1 0 101.414 1.414L10 11.414l6.293 6.293A.998.998 0 0018 17a.999.999 0 00-.293-.707L11.414 10z"
                  //             fill="#413bbc"
                  //           />
                  //         </svg>
                  //       </Button>
                  //     </FlexLayout>
                  //   ),
                  // },
                  {
                    name: "Transaction Amount",
                    children: (
                      <FlexLayout
                        halign="start"
                        spacing="loose"
                        childWidth="fullWidth"
                      >
                        <TextField
                          type={"number"}
                          thickness="thin"
                          value={TransactionAmt}
                          onChange={(e) => setTransactionAmt(e)}
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
                  {
                    name: "Commision",
                    children: (
                      <FlexLayout
                        halign="start"
                        spacing="loose"
                        childWidth="fullWidth"
                      >
                        <TextField
                          type={"number"}
                          value={commision}
                          thickness="thin"
                          onChange={(e) => setcommision(e)}
                          onEnter={() => {
                            prepareFilter();
                          }}
                        />
                        <Button
                          onClick={() => resetFilter("commission")}
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
                    name: "Marketplace Fee",
                    children: (
                      <FlexLayout
                        halign="start"
                        spacing="loose"
                        childWidth="fullWidth"
                      >
                        <TextField
                          thickness="thin"
                          type="number"
                          onChange={(e) => updateMarketPlaceFee(e)}
                          value={marketplaceFee}
                          onEnter={() => {
                            prepareFilter();
                          }}
                        />
                        <Button
                          onClick={() => resetFilter("marketplace_Fee")}
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
                    name: "Service tax",
                    children: (
                      <FlexLayout
                        halign="start"
                        spacing="loose"
                        childWidth="fullWidth"
                      >
                        <TextField
                          type={"text"}
                          thickness="thin"
                          onChange={(e) => updateServiceTax(e)}
                          value={serviceTax}
                          onEnter={() => {
                            prepareFilter();
                          }}
                        />
                        <Button
                          onClick={() => resetFilter("service_tax")}
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
                    name: "Order Total",
                    children: (
                      <FlexLayout
                        halign="start"
                        spacing="loose"
                        childWidth="fullWidth"
                      >
                        <TextField
                          type={"text"}
                          thickness="thin"
                          onChange={(e) => updateTotalPrice(e)}
                          value={totalPrice}
                          onEnter={() => {
                            prepareFilter();
                          }}
                        />
                        <Button
                          onClick={() => {
                            resetFilter("total_price");
                            updateTotalPrice("");
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
                ]}
                resetFilter={resetAllFilters}
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
                iconRound={false}
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
                  {
                    label: "Transaction ID",
                    value: "transaction_id",
                  },

                  { label: "Date", value: "created_at" },
                  { label: "Transaction Amount", value: "vendor_amount" },
                  { label: "View", value: "action" },
                  { label: "Commission", value: "commission" },
                  { label: "Marketplace Fee", value: "marketplace_Fee" },
                  { label: "Service Tax", value: "service_tax" },
                  {
                    label: "Action",
                    value: "action",
                  },
                  { label: "Order Total", value: "total_price" },
                ]}
              ></ChoiceList>
            </FlexLayout>
            <FlexLayout spacing={"loose"}>
              <div className="gridselect">
                <Select
                  thickness="thin"
                  options={selectOptions}
                  popoverContainer="element"
                  onChange={(e) => {
                    setSelectValue(e);
                  }}
                  value={selectValue}
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
            <FlexLayout halign="start" spacing="loose">
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
                      ? "Contains to"
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
                        .replaceAll("_")
                        .replace("total price")
                        .replace("Order total")
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

export default DI(View_transaction);
