/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Card,
  Filter,
  FlexLayout,
  PageHeader,
  Pagination,
  Select,
  TextStyles,
  Toast,
  ToastWrapper,
  Notification,
  Modal,
} from "@cedcommerce/ounce-ui";
import React, { useState } from "react";
import { DI, DIProps } from "./../../../Core";
import DatePicker from "react-datepicker";
import { Grid } from "./../../../Shared/index";
import "react-datepicker/dist/react-datepicker.css";
import { ObjI } from "../../../Core/@types";
import EmptyData from "../../../Core/EmptyStates/EmptyData";

function ProductReport(props: DIProps) {
  const columns = {
    Interval: {
      name: "Interval",
      visible: true,
    },
    Product: {
      name: "Product",
      visible: true,
    },
    Quanity_Ordered: {
      name: "Total Quantity Sold",
      visible: true,
    },
    SKU: {
      name: "SKU",
      visble: true,
    },
  };
  const [rows, setRows] = useState([]);
  const [exportVal, setExportVal] = useState("");
  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState("");
  // const [LoadingReport, setLoadingReport] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ToastType, setToastType] = useState("success");
  const [startDate, setStartDate] = useState(new Date());
  const [EndDate, setEndDate] = useState(new Date());
  // const Original_month = startDate.getMonth() + 1;
  // const Original_month2 = EndDate.getMonth() + 1;
  const [sort, setsort] = useState(true);
  const [pageCount, setpageCount] = useState(0);
  const [exportModal, setExportModal] = useState(false);
  const [params, setParams] = useState<any>({
    activePage: 1,
    count: 10,
  });

  const [ShowExport, setShowExport] = useState(false);
  function getData(par: ObjI) {
    props.di.GET("connector/product/ProductReport", par).then((e) => {
      if (e.success) {
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

        const temp: any = Object.keys(e.data).map((m) => {
          return {
            ...e.data[m],
            Interval: e.data[m].Interval,
            Product: e.data[m].Product,
            Quanity_Ordered: e.data[m].Quanity_Ordered,
            SKU: e.data[m].SKU == "" ? "No SKU" : e.data[m].SKU,
          };
        });
        setRows(temp);
        setShowExport(true);
      } else {
        setRows([]);
        
        setShowExport(false);
        Object.keys(par).length !== 2 &&setToast(true);;
        setMessage(e.data);
        setToastType("error");
      }
    });
  }
  function sendExportData() {
    setLoading(true);
    props.di
      .GET(
        `connector/product/ProductReportExport?startdate=${startDate
          .toISOString()
          .slice(0, 10)}&enddate=${EndDate.toISOString().slice(
          0,
          10
        )}&export_type=${exportVal}`
      )
      .then((e) => {
        if (e.success) {
          setToast(true);
          setMessage(e.message);
          setToastType("success");

          const endpoint = props.di.environment.API_ENDPOINT.replace(
            "/public/",
            "/"
          );
          window.location.href = endpoint + e.path;
        } else {
          setRows([]);
          setShowExport(false);
          setToast(true);
          setMessage("Please select file format to download");
          setToastType("error");
        }
      });
    setExportModal(false);
    setLoading(false);
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

    getData(params);
  }
  function onSortClick() {
    setsort(!sort);
  }

  return (
    <div>
      <ToastWrapper>
        {toast && (
          <Toast
            message={message}
            onDismiss={() => setToast(false)}
            type={ToastType}
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
            sendExportData();
          },
        }}
        close={() => {
          setExportModal(false);
        }}
      >
        <FlexLayout direction="vertical" valign="start" spacing="loose">
          <TextStyles type="simpleText">
            {"Choose a file format to download a report ?"}
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
        title="Ordered Product Report"
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
      ></PageHeader>

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
        getReport={getData}
        setEndDate={setEndDate}
        EndDate={EndDate}
      />

      {rows.length > 0 ? (
        <Grid
          onSortClick={onSortClick}
          handleSort={handleSort}
          sort={sort}
          rows={rows}
          columns={columns}
        />
      ) : (
        <Card>
          <EmptyData />
        </Card>
      )}
    </div>
  );
}

interface tableActionI extends DIProps {
  params: any;
  pageCount: any;
  setStartDate: any;
  startDate: any;
  setEndDate: any;
  EndDate: any;

  getReport: (p: ObjI) => void;
}

function RenderCardFilter({
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
    const par: ObjI = {
      count: selectUpdateCount,
      activePage: page,
      startdate: startDate.toISOString().slice(0, 10),
      enddate: EndDate.toISOString().slice(0, 10),
    };

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
                <FlexLayout halign="start" spacing="loose">
                  <FlexLayout
                    halign="center"
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
                          onChange={(date: any) => setStartDate(date)}
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

export default DI(ProductReport);
