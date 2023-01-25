/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Card,
  Filter,
  FlexLayout,
  PageHeader,
  Pagination,
  Select,
  Notification,
  TextStyles,
  Toast,
  ToastWrapper,
  Modal,
} from "@cedcommerce/ounce-ui";
import React, { useState } from "react";
import { DI, DIProps } from "./../../../Core";
import DatePicker from "react-datepicker";
import { Grid } from "./../../../Shared/index";
import "react-datepicker/dist/react-datepicker.css";
import EmptyOrder from "../../../Core/EmptyStates/EmptyOrder";

interface OrederProps extends DIProps {
  currency: string;
}

function OrderReport(props: OrederProps) {
  const columns: any = {
    _id: {
      name: "Interval",
      visible: "true",
      sort: true,
    },
    Orders: {
      name: "Orders",
      visible: "true",
      sort: true,
    },
    Sales_Items: {
      name: "Sales Items",
      visible: "true",
      sort: true,
    },

    Commision: {
      name: "Commission",
      visible: "true",
      sort: true,
    },

    Sales_Shipping: {
      name: "Sales Shipping",
      visible: "true",
      sort: true,
    },

    Sales_Tax: {
      name: "Service Tax",
      visible: "true",
      sort: true,
    },
    Sales_Total: {
      name: "Sales Total",
      visible: "true",
      sort: true,
    },
  };
  const [startDate, setStartDate] = useState(new Date());
  const [EndDate, setEndDate] = useState(new Date());

  const [rows, setRows] = useState([]);

  const [loading, setLoading] = useState(false);
  const [stat, setstat] = useState("");
  const [exportModal, setExportModal] = useState(false);
  const [exportVal, setExportVal] = useState("");
  const [toast, setToast] = useState(false);
  const [sort, setsort] = useState(true);
  const [pageCount, setpageCount] = useState(0);
  const [ToastReportErr, setToastReportErr] = useState(false);

  const [ToastMessage, setToastMessage] = useState("");
  const [ShowExport, setShowExport] = useState(false);
  const [message, setMessage] = useState("");

  const [params, setParams] = useState<any>({
    activePage: 1,
    count: 10,
  });

  function onSortClick() {
    setsort(!sort);
  }

  function submitData(par: any) {
    let Comtot = 0;
    let Ordtot = 0;
    let OrderSaletot = 0;
    let SaleShippingTot = 0;
    let SalestaxTot = 0;
    let total = 0;
    setLoading(true);
    setRows([]);

    props.di.POST("connector/order/OrderReport", par).then((e) => {
      if (e.success) {
        setShowExport(true);
        if (params.count == 10) {
          if (Math.round(e.count / 10) < e.count / 10)
            setpageCount(Math.round(e.count / 10) + 1);
          else setpageCount(Math.round(e.count / 10));
        } else if (params.count == 20) {
          if (Math.round(e.count / 20) < e.count / 20)
            setpageCount(Math.round(e.count / 20) + 1);
          else setpageCount(Math.round(e.count / 20));
        } else if (params.count == 50) {
          if (Math.round(e.count / 50) < e.count / 50)
            setpageCount(Math.round(e.count / 50) + 1);
          else setpageCount(Math.round(e.count / 50));
        } else if (params.count == 100) {
          if (Math.round(e.count / 100) < e.count / 20)
            setpageCount(Math.round(e.count / 100) + 1);
          else setpageCount(Math.round(e.count / 100));
        }

        const temp: any = Object.keys(e.data).map((j) => {
          return {
            ...e.data[j],
            _id: e.data[j]._id,
            Commision: props.currency + " " + e.data[j].Commision.toFixed(2),
            Orders: e.data[j].Orders,
            Sales_Items: e.data[j].Sales_Items,
            Sales_Shipping:
              props.currency + " " + e.data[j].Sales_Shipping.toFixed(2),
            Sales_Tax: props.currency + " " + e.data[j].Sales_Tax.toFixed(2),
            Sales_Total:
              props.currency +
              " " +
              (Math.round(e.data[j].Sales_Total * 100) / 100).toFixed(2),
          };
        });
        Object.keys(e.data).map((k) => {
          Comtot = Comtot + parseFloat(e.data[k].Commision.toFixed(2));
          Ordtot = Ordtot + e.data[k].Orders;
          OrderSaletot = OrderSaletot + e.data[k].Sales_Items;
          SaleShippingTot =
            SaleShippingTot + parseFloat(e.data[k].Sales_Shipping.toFixed(2));
          SalestaxTot =
            SalestaxTot + parseFloat(e.data[k].Sales_Tax.toFixed(2));
          total = total + parseFloat(e.data[k].Sales_Total.toFixed(3));
        });

        const temp1 = {
          _id: <b style={{ fontSize: "15px" }}>Total</b>,
          Commision: (
            <b style={{ fontSize: "15px" }}>
              {props.currency} {Comtot && Comtot.toFixed(2)}
            </b>
          ),
          Orders: <b style={{ fontSize: "15px" }}>{Ordtot}</b>,
          Sales_Items: <b style={{ fontSize: "15px" }}>{OrderSaletot}</b>,
          Sales_Shipping: (
            <b style={{ fontSize: "15px" }}>
              {props.currency} {SaleShippingTot && SaleShippingTot.toFixed(2)}
            </b>
          ),
          Sales_Tax: (
            <b style={{ fontSize: "15px" }}>
              {props.currency} {SalestaxTot && SalestaxTot.toFixed(2)}
            </b>
          ),
          Sales_Total: (
            <b style={{ fontSize: "15px" }}>
              {props.currency} {total.toFixed(2)}
            </b>
          ),
        };

        temp.push(temp1);
        setRows(temp);
      } else {
        setShowExport(false);
        Object.keys(par).length !== 2 && setToastReportErr(true);
        setToastMessage(e.data);
      }
      setLoading(false);
    });
  }
  async function handleSort(key: string, sort: boolean) {
    await Object.keys(params).forEach((ind: string) => {
      if (ind.includes("sort")) {
        delete params[ind];
      }
    });
    if (sort) {
      if (key) params[`sort_key[${key}]`] = 1;
    } else {
      if (key) params[`sort_key[${key}]`] = -1;
    }

    submitData(params);
  }
  function SendData() {
    let dataToSend: any;
    if (stat[0] === "any" || stat[0] == "") {
      dataToSend = {
        startdate: startDate.toISOString().slice(0, 10),
        enddate: EndDate.toISOString().slice(0, 10),
        export_type: exportVal,
      };
    } else {
      dataToSend = {
        startdate: startDate.toISOString().slice(0, 10),
        enddate: EndDate.toISOString().slice(0, 10),
        export_type: exportVal,
        status: stat,
      };
    }
    props.di.POST(`connector/order/OrderReportExport`, dataToSend).then((e) => {
      if (e.success == true) {
        setToast(true);
        setMessage(e.message);
        const endpoint = props.di.environment.API_ENDPOINT.replace(
          "/public/",
          "/"
        );
        window.location.href = endpoint + e.path;
        setExportModal(false);
      } else {
        setToastReportErr(true);
        setExportModal(false);
        setToastMessage("Please Select a File Type First");
      }
    });
  }
  return (
    <div>
      <ToastWrapper>
        {toast && (
          <Toast
            message={message}
            onDismiss={() => setToast(false)}
            type="success"
          />
        )}

        {ToastReportErr && (
          <Toast
            message={ToastMessage}
            onDismiss={() => setToastReportErr(false)}
            type="error"
          />
        )}
      </ToastWrapper>

      <Modal
        modalSize="small"
        heading="Message"
        open={exportModal}
        primaryAction={{
          content: "Download",
          thickness: "thin",
          type: "Primary",
          onClick: () => {
            SendData();
          },
        }}
        close={() => {
          setExportModal(false);
        }}
      >
        <FlexLayout direction="vertical" valign="start" spacing="loose">
          <TextStyles type="simpleText">
            {"Choose a file format to download are report ?"}
          </TextStyles>
          <Select
            thickness="thin"
            options={[
              { label: "CSV", value: "csv" },
              { label: "XLSX", value: "xlsx" },
            ]}
            value={exportVal}
            onChange={(e) => setExportVal(e)}
          />
        </FlexLayout>
      </Modal>
      <PageHeader
        title="Order Report"
        action={
          <FlexLayout spacing="loose">
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
                  "https://docs.cedcommerce.com/shopify/multivendor-marketplace-solution-vendors/?section=reports-section-of-the-vendor-app"
                )
              }
            >
              Need Help
            </Button>
            {ShowExport && (
              <Button
                loading={loading}
                thickness="thin"
                type="Primary"
                onClick={() => setExportModal(true)}
              >
                Export
              </Button>
            )}
          </FlexLayout>
        }
      />

      <div className="mb-5">
        <Notification
          icon={
            <svg
              height="21.589"
              viewBox="0 0 20.802 21.589"
              width="20.802"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="bell" transform="translate(1 1)">
                <path
                  d="M18.668,7.878A6.082,6.082,0,0,0,12.4,2,6.082,6.082,0,0,0,6.134,7.878C6.134,14.735,3,16.694,3,16.694H21.8s-3.134-1.959-3.134-8.816"
                  fill="none"
                  id="Path_32"
                  stroke="#0a0a0a"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  transform="translate(-3 -2)"
                />
                <path
                  d="M13.659,21a1.959,1.959,0,0,1-3.389,0"
                  fill="none"
                  id="Path_33"
                  stroke="#0a0a0a"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  transform="translate(-2.564 -2.387)"
                />
              </g>
            </svg>
          }
          type="success"
        >
          User first has to select filter to view report and then user can
          download it.
        </Notification>
      </div>
      <RenderCardFilter
        pageCount={pageCount}
        {...props}
        params={setParams}
        setStartDate={setStartDate}
        startDate={startDate}
        setEndDate={setEndDate}
        EndDate={EndDate}
        getReport={submitData}
        setstat={setstat}
        stat={stat}
      />

      {rows.length > 0 ? (
        <Grid
          rows={rows}
          columns={columns}
          handleSort={handleSort}
          sort={sort}
          onSortClick={() => onSortClick()}
        />
      ) : (
        <Card>
          {" "}
          <EmptyOrder />
        </Card>
      )}
    </div>
  );
}
interface tableActionI extends DIProps {
  params: any;
  pageCount: any;
  setstat: any;
  setStartDate: any;
  startDate: any;
  setEndDate: any;
  EndDate: any;
  // tempStartDate: any;
  // tempEndDate: any;
  stat: any;
  getReport: (p: any) => void;
}
function RenderCardFilter({
  stat,
  setstat,
  params,
  pageCount,
  setStartDate,
  startDate,
  setEndDate,
  EndDate,

  getReport,
}: tableActionI): JSX.Element {
  const [selectUpdateCount, setSelectUpdateCount] = useState("10");
  const [page, setpage] = useState<any>(1);

  function prepareFilter() {
    let par: any = {};
    if (stat[0] != "any") {
      par = {
        count: selectUpdateCount,
        activePage: page,
        startdate: startDate.toISOString().slice(0, 10),
        enddate: EndDate.toISOString().slice(0, 10),
        status: stat,
      };
    } else {
      par = {
        count: selectUpdateCount,
        activePage: page,
        startdate: startDate.toISOString().slice(0, 10),
        enddate: EndDate.toISOString().slice(0, 10),
      };
    }

    params(par);
    getReport(par);
  }

  function resetAllFilter() {
    const par: any = {
      count: selectUpdateCount,
      activePage: page,
    };
    params(par);
    setEndDate(new Date());
    setStartDate(new Date());
    getReport(par);
  }

  return (
    <Card cardType="linkwater">
      <FlexLayout halign="fill">
        <Filter
          label="Filters"
          disableReset={false}
          type="Small"
          heading={"Filters"}
          onApply={prepareFilter}
          resetFilter={resetAllFilter}
          iconRound={false}
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
          filters={[
            {
              name: "Date",
              children: (
                <FlexLayout
                  halign="start"
                  spacing="loose"
                  childWidth="fullWidth"
                >
                  <FlexLayout
                    direction="vertical"
                    childWidth="fullWidth"
                    spacing="loose"
                  >
                    <>
                      <TextStyles>Start Date </TextStyles>
                      <div
                        className="inte-formElement--Wrap  inte--Textfield__thin  "
                        style={{ width: "100%" }}
                      >
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
                            setStartDate(date);
                          }}
                        />
                      </div>
                    </>
                    <>
                      <TextStyles>End Date </TextStyles>
                      <div
                        className="inte-formElement--Wrap  inte--Textfield__thin  "
                        style={{ width: "100%" }}
                      >
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
                          selected={EndDate}
                          onChange={(date: any) => setEndDate(date)}
                          minDate={new Date(startDate)}
                        />
                      </div>
                    </>
                  </FlexLayout>
                </FlexLayout>
              ),
            },
            {
              name: "Status",
              children: (
                <FlexLayout spacing="loose" valign="start" halign="start">
                  {" "}
                  <Select
                    thickness="thin"
                    options={[
                      { label: "All", value: "any" },
                      { label: "Pending", value: "pending" },
                      { label: "Fulfilled", value: "fulfilled" },
                      {
                        label: "Partially-fulfilled",
                        value: "partially_fulfilled",
                      },
                      { label: "Cancelled", value: "canceled" },
                      {
                        label: "Partially-Refunded",
                        value: "partially_refunded",
                      },
                      {
                        label: "Refunded",
                        value: "refunded",
                      },
                    ]}
                    value={stat[0]}
                    onChange={(e) => {
                      setstat([e]);
                    }}
                  />
                </FlexLayout>
              ),
            },
          ]}
        />

        <FlexLayout spacing="loose">
          <div className="gridselect">
            <Select
              thickness="thin"
              popoverContainer="element"
              type="secondary"
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
            totalPages={pageCount}
            currentPage={pageCount === 0 ? 0 : page}
            onNext={() => {
              setpage(page + 1);
            }}
            onPrevious={() => {
              setpage(page - 1);
            }}
          />
        </FlexLayout>
      </FlexLayout>
    </Card>
  );
}

export default DI(OrderReport);
