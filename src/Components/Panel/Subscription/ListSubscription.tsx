/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Badge,
  Button,
  Card,
  ChoiceList,
  Filter,
  FlexLayout,
  PageHeader,
  Pagination,
  Select,
  TextField,
  TextStyles,
  Toast,
  ToastWrapper,
} from "@cedcommerce/ounce-ui";
import React, { useEffect, useState } from "react";
import { DI, DIProps } from "./../../../Core";
import * as queryString from "query-string";

import { Grid } from "./../../../Shared/index";
import EmptyDataFound from "../../../Core/EmptyStates/EmptyDataFound";

function ListSubscription(props: DIProps) {
  const [columns, setColumns]: any = useState({
    subscription_id: {
      name: "Subscription ID",
      visible: "true",
    },

    plan_name: {
      name: "Plan Name",
      visible: "true",
    },
    catalog_size: {
      name: "Catalog Size",
      visible: "true",
    },
    // marketplaces: {
    //     name: "Marketplaces",
    //     visible: "true"
    // },
    price: {
      name: "Amount",
      visible: "true",
    },
    subcribed_at: {
      name: "Subscribed At",
      visible: "true",
    },
    renewed_at: {
      name: "Renewed At",
      visible: "true",
    },
    validity: {
      name: "Validity",
      visible: "true",
    },
    status: {
      name: "Status",
      visible: "true",
    },
    view: {
      name: "View",
      visible: "true",
    },
  });
  const [params, setParams] = useState<any>({});
  const [rows, setRows] = useState<any>([]);
  const [total, setTotal] = useState(0);
  // const [Nodata, setNodata] = useState(false);
  const [search, setSearch] = useState("");
  const [visibleColumnValue, setVisibleColumnValue] = useState<any>([
    "subscription_id",
    "plan_name",
    "catalog_size",
    "price",
    "subcribed_at",
    "renewed_at",
    "validity",
    "status",
    "view",
  ]);
  const [page, setpage] = useState(1);
  const [Errortoast, setErrortoast] = useState(false);
  const [gridCount, setGridCount] = useState("10");
  const [toast, setToast] = useState(false);
  const [planName, setPlanName] = useState("");
  const [validity, setValidity] = useState("");
  const [catalog, setCatalog] = useState("");
  const [validityType, setValidityType] = useState("DAY");
  const [status, setStatus] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [Message, setMessage] = useState("");
  const [loading, setloading] = useState(false);

  function getData() {
    setloading(true);
    props.di
      .GET("/connector/subscription/getSubscriptions", {
        ...{
          count: gridCount,
          activePage: page,
        },
        ...params,
      })
      .then((e) => {
        if (e.success) {
          if (e.data.rows.length != 0) {
            // setNodata(false);
            setTotal(e.data.count);
            const temp: any = Object.keys(e.data.rows).map((m) => {
              return {
                subscription_id: (
                  <span style={{ wordBreak: "break-word" }}>
                    {e.data.rows[m].subscription[0].subscription_id}
                  </span>
                ),
                plan_name: e.data.rows[m].subscription[0].plan_name,
                catalog_size: e.data.rows[m].subscription[0].catalog_size,
                // marketplaces: e.data.rows[0].subscription[m].marketplaces.join("\n"),
                price:
                  props.currency + " " + e.data.rows[m].subscription[0].price,
                subcribed_at: (
                  <span style={{ wordBreak: "break-word" }}>
                    {e.data.rows[m].subscription[0].subcribed_at}
                  </span>
                ),
                renewed_at: (
                  <span style={{ wordBreak: "break-word" }}>
                    {e.data.rows[m].subscription[0].renewed_at}
                  </span>
                ),
                validity:
                  e.data.rows[m].subscription[0].validity +
                  " " +
                  (e.data.rows[m].subscription[0].validity_type &&
                  e.data.rows[m].subscription[0].validity_type
                    ? e.data.rows[m].subscription[0].validity_type
                        .replace("DAY", "day(s)")
                        .replace("MONTH", "month(s)")
                    : ""),
                status:
                  e.data.rows[m].subscription[0].status === "cancelled" ? (
                    <Badge size="small" backgroundColor={"#af2cff"}>
                      {e.data.rows[m].subscription[0].status
                        .charAt(0)
                        .toUpperCase() +
                        e.data.rows[m].subscription[0].status.slice(1)}
                    </Badge>
                  ) : e.data.rows[m].subscription[0].status == "expired" ? (
                    <Badge size="small" backgroundColor="#ffce56">
                      {e.data.rows[m].subscription[0].status
                        .charAt(0)
                        .toUpperCase() +
                        e.data.rows[m].subscription[0].status.slice(1)}
                    </Badge>
                  ) : e.data.rows[m].subscription[0].status == "active" ? (
                    <Badge type="Success">
                      {e.data.rows[m].subscription[0].status
                        .charAt(0)
                        .toUpperCase() +
                        e.data.rows[m].subscription[0].status.slice(1)}
                    </Badge>
                  ) : (
                    <Badge size="small" backgroundColor="#ff6384">
                      {e.data.rows[m].subscription[0].status
                        .charAt(0)
                        .toUpperCase() +
                        e.data.rows[m].subscription[0].status.slice(1)}
                    </Badge>
                  ),

                view: e.data.rows[m].subscription[0] && (
                  <Button
                    type="Plain"
                    thickness="thin"
                    onClick={() => {
                      props.history.push(
                        `/subscription/${e.data.rows[m].subscription[0].subscription_id}`
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
            Object.keys(temp).forEach((key) => {
              if (temp[key] === undefined) {
                delete temp[key];
              }
            });
            setRows(temp);
          }
          // else {
          //   setNodata(true);
          // }
          setloading(false);
        }
      });
  }
  // useEffect(() => {
  //   getData();
  // }, [page, gridCount]);

  function columnToggle(visibleCol: any, bool: boolean, objKey: any) {
    const col: any = columns;
    col[objKey].visible = bool;
    // setName(!name);
    setColumns(col);
  }

  useEffect(() => {
    getData();
    if (queryString.parse(props.location.search).status === "true") {
      const data: any = {
        status: "active",
        subscription_id: queryString.parse(props.location.search)
          .subscription_id,
      };
      props.di
        .POST("/connector/subscription/UpdateSubscripionStatus", data)
        .then((e) => {
          if (e.success) {
            getData();
            setMessage(e.data);
            setToast(true);
          }
        });
    } else {
      const data: any = {
        status: "fail",
        subscription_id: queryString.parse(props.location.search)
          .subscription_id,
      };
      props.di
        .POST("/connector/subscription/UpdateSubscripionStatus", data)
        .then((e) => {
          if (e.success) {
            getData();
            setMessage(e.data);
            setErrortoast(true);
          }
        });
    }
  }, [props.currency]);

  const prepareFilter = () => {
    setRows([]);
    const par: any = {};
    if (search) par["filter[subscription_id][3]"] = search;
    if (planName) par["filter[plan_name][3]"] = planName;
    if (validity) {
      par["filter[validity][1]"] = validity;
      par["filter[validity_type][1]"] = validityType;
    }
    if (catalog) par["filter[catalog_size][1]"] = catalog;
    if (priceFilter) par["filter[price][1]"] = priceFilter;
    if (status) par["filter[status][1]"] = status;
    setParams(par);
  };

  const resetFilter = (remove: string) => {
    const par = Object.assign({}, params);
    delete par[`filter[${remove}][3]`];
    delete par[`filter[${remove}][1]`];
    switch (remove) {
      case "plan_name":
        setPlanName("");
        break;
      case "validity":
        setValidity("");
        break;
      case "catalog_size":
        setCatalog("");
        break;
      case "price":
        setPriceFilter("");
      case "status":
        setStatus("");
        break;
      case "subscription_id":
        setSearch("");
      default:
        break;
    }
    setParams(par);
  };

  const resetAllFilter = () => {
    setParams({});
    setPlanName("");
    setValidity("");
    setCatalog("");
    setPriceFilter("");
  };

  useEffect(() => {
    getData();
  }, [page, gridCount, params]);

  return (
    <>
      <PageHeader title="Subscription" />
      <ToastWrapper>
        {toast && (
          <Toast
            message={Message}
            timeout={3000}
            type="success"
            onDismiss={() => {
              setToast(!toast);
            }}
          ></Toast>
        )}
        {Errortoast && (
          <Toast
            message={Message}
            timeout={3000}
            type="error"
            onDismiss={() => {
              setErrortoast(!Errortoast);
            }}
          />
        )}
      </ToastWrapper>
      {/* {Nodata == false ? ( */}
      <Card cardType="linkwater">
        <FlexLayout spacing={"loose"} direction="vertical">
          <FlexLayout spacing={"loose"} halign="fill">
            <FlexLayout spacing={"loose"}>
              <TextField
                placeHolder={"Enter Subscription ID"}
                thickness="thin"
                onChange={(e) => {
                  setSearch(e);
                }}
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
                    name: "Plan Name",
                    children: (
                      <FlexLayout
                        halign="start"
                        spacing="loose"
                        childWidth="fullWidth"
                      >
                        <TextField
                          thickness="thin"
                          type="text"
                          value={planName}
                          onChange={(e) => {
                            setPlanName(e);
                          }}
                          onEnter={() => {
                            prepareFilter();
                          }}
                        />
                        <Button
                          onClick={() => {
                            resetFilter("plan_name");
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
                    name: "Validity",
                    children: (
                      <FlexLayout
                        halign="start"
                        spacing="loose"
                        childWidth="fullWidth"
                      >
                        <TextField
                          type={"text"}
                          thickness="thin"
                          suffix={
                            <Select
                              thickness="thin"
                              options={[
                                { label: "Day(s)", value: "DAY" },
                                { label: "Month(s)", value: "MONTH" },
                              ]}
                              value={validityType}
                              onChange={(e) => {
                                setValidityType(e);
                              }}
                            />
                          }
                          value={validity}
                          onChange={(e) => {
                            setValidity(e);
                          }}
                          onEnter={() => {
                            prepareFilter();
                          }}
                        />
                        <Button
                          onClick={() => {
                            resetFilter("validity");
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
                    name: "Catalog Size",
                    children: (
                      <FlexLayout
                        halign="start"
                        spacing="loose"
                        childWidth="fullWidth"
                      >
                        <TextField
                          thickness="thin"
                          onChange={(e) => {
                            setCatalog(e);
                          }}
                          value={catalog}
                          onEnter={() => {
                            prepareFilter();
                          }}
                        />
                        <Button
                          onClick={() => {
                            resetFilter("catalog_size");
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
                    name: "Amount",
                    children: (
                      <FlexLayout
                        halign="start"
                        spacing="loose"
                        childWidth="fullWidth"
                      >
                        <TextField
                          thickness="thin"
                          onChange={(e) => {
                            setPriceFilter(e);
                          }}
                          value={priceFilter}
                          onEnter={() => {
                            prepareFilter();
                          }}
                        />
                        <Button
                          onClick={() => {
                            resetFilter("price");
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
                    name: "Status",
                    children: (
                      <FlexLayout
                        halign="start"
                        spacing="loose"
                        childWidth="fullWidth"
                      >
                        <Select
                          thickness="thin"
                          options={[
                            { label: "Active", value: "active" },
                            { label: "Expired", value: "expired" },
                            { label: "Cancelled", value: "cancelled" },
                            { label: "Fail", value: "fail" },
                          ]}
                          value={status}
                          onChange={(e) => {
                            setStatus(e);
                          }}
                        />

                        {/* <Button
                          onClick={() => {
                            resetFilter("status")
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
                        </Button> */}
                      </FlexLayout>
                    ),
                  },
                ]}
                resetFilter={() => {
                  resetAllFilter();
                }}
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
                onApply={() => {
                  prepareFilter();
                }}
              />

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
                    label: "Subscription ID",
                    value: "subscription_id",
                  },
                  {
                    label: "Plan Name",
                    value: "plan_name",
                  },
                  {
                    label: "Catalog Size",
                    value: "catalog_size",
                  },
                  { label: "Subscribed At", value: "subcribed_at" },
                  { label: "Renewed At", value: "renewed_at" },
                  { label: "Amount", value: "price" },
                  { label: "Validity", value: "validity" },
                  { label: "Status", value: "status" },
                  { label: "View", value: "view" },
                ]}
              ></ChoiceList>
            </FlexLayout>
            <FlexLayout spacing={"loose"}>
              <TextStyles type="neutralText">
                <div style={{ marginTop: "10px" }}>
                  Total Subscription(s): {total}
                </div>
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
                    { label: "100", value: "100" },
                  ]}
                  value={gridCount}
                  onChange={(e) => {
                    setGridCount(e);
                  }}
                />
              </div>
              <Pagination
                totalPages={total}
                currentPage={total === 0 ? 0 : page}
                onNext={() => {
                  setpage(page + 1);
                }}
                onPrevious={() => {
                  setpage(page - 1);
                }}
              />
            </FlexLayout>
          </FlexLayout>
          {Object.keys(params).length > 0 && (
            <FlexLayout spacing="loose" halign="start">
              {Object.keys(params).map((key: any) => {
                if (
                  key.includes("filter") &&
                  key !== "filter[validity_type][1]"
                ) {
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
                      {filtertagArr[1] +
                        " " +
                        condition +
                        " " +
                        (filtertagArr[1].includes("validity")
                          ? params[key] +
                            " " +
                            validityType
                              .replace("DAY", "day(s)")
                              .replace("MONTH", "month(s)")
                          : params[key])}
                    </Badge>
                  );
                }
              })}
            </FlexLayout>
          )}
        </FlexLayout>
      </Card>
      {rows.length > 0 ? (
        <Grid loading={loading} rows={rows} columns={columns} />
      ) : (
        <Card>
          <EmptyDataFound />
        </Card>
      )}
    </>
  );
}

export default DI(ListSubscription);
