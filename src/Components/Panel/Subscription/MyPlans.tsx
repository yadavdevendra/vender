/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Badge,
  Button,
  Card,
  ChoiceList,
  Filter,
  FlexLayout,
  Modal,
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
import { Grid } from "./../../../Shared/index";
import * as queryString from "query-string";

import EmptyDataFound from "../../../Core/EmptyStates/EmptyDataFound";

interface planProps extends DIProps {
  currency: string;
}

function MyPlans(props: planProps) {
  const [Rows, setRows] = useState([]);
  const [page, setpage] = useState(1);
  const [toast, setToast] = useState(false);
  const [Message, setMessage] = useState("");
  const [total, setTotal] = useState(0);
  const [visibleColumnValue, setVisibleColumnValue] = useState([
    "plan_name",
    "catalog_size",
    "description",
    "validity",
    "price",
    "purchase",
  ]);
  const [modalOpen, setmodalOPen] = useState(false);
  const [params, setParams] = useState<any>({});
  const [PlanCode, setPlanCode] = useState("");
  const [gridCount, setGridCount] = useState("10");
  const [Fname, setFname] = useState("");
  const [Lname, setLname] = useState("");
  const [Email, setEmail] = useState("");
  const [loading1, setloading] = useState(false);
  const [ModalSubscription, setModalSubscription] = useState(false);
  const [PlanCodeModal, setPlanCodeModal] = useState("");
  const [CatalogSize, setCatalogSize] = useState("");
  const [Price, setPrice] = useState();
  const [SubscribedAt, setSubscribedAt] = useState("");
  const [FnamePaypal, setFnamePaypal] = useState("");
  const [SirnamePaypal, setSirnamePaypal] = useState("");
  const [emailPaypal, setemailPaypal] = useState("");
  const [LoadingPurchase, setLoadingPurchase] = useState(false);
  const [Errortoast, setErrortoast] = useState(false);
  const [ErrorPurchase, setErrorPurchase] = useState("");
  const [planName, setPlanName] = useState("");
  const [validity, setValidity] = useState("");
  const [validityType, setValidityType] = useState("DAY");
  const [catalog, setCatalog] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [ErrPurchase, setErrPurchase] = useState(false);
  const [columns, setColumns]: any = useState({
    plan_name: {
      name: "Plan Name",
      visible: "true",
    },
    catalog_size: {
      name: "Catalog Size",
      visible: "true",
    },
    description: {
      name: "Description",
      visible: "true",
    },
    validity: {
      name: "Validity",
      visible: "true",
    },
    trial: {
      name: "Trial Period",
      visible: "true",
    },
    price: {
      name: "Price",
      visible: "true",
    },
    purchase: {
      name: "Buy",
      visible: "true",
    },
  });
  // const columns: any = {

  // };
  // BuyPlan(e.data.rows[m].plan_code);

  useEffect(() => {
    getData();
  }, [page, gridCount, params]);

  function getData() {
    setloading(true);
    setRows([]);
    props.di
      .GET("/connector/plans/getAllPlans", {
        ...{
          count: gridCount,
          activePage: page,
        },
        ...params,
      })
      .then((e) => {
        if (e.success) {
          setTotal(e.data.count);
          const temp: any = Object.keys(e.data.rows).map((m) => {
            return {
              plan_name: e.data.rows[m].plan_name,
              catalog_size: e.data.rows[m].catalog_size,
              price: props.currency + " " + e.data.rows[m].price,
              validity:
                e.data.rows[m].validity +
                " " +
                e.data.rows[m].validityType
                  .replace("DAY", "day(s)")
                  .replace("MONTH", "month(s)"),

              trial: e.data.rows[m].trial
                ? e.data.rows[m].trial +
                  " " +
                  e.data.rows[m].trialType
                    .replace("DAY", "day(s)")
                    .replace("MONTH", "month(s)")
                : "Not Available",
              description: e.data.rows[m].description,
              purchase: e.data.rows[m] && (
                <Button
                  type="Plain"
                  thickness="thin"
                  onClick={() => {
                    handlesubscription(e.data.rows[m].plan_code);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    height="22"
                  >
                    <path
                      d="M0 1.5A1.5 1.5 0 011.5 0h17A1.5 1.5 0 0120 1.5v6A1.5 1.5 0 0118.5 9h-5.889a1.5 1.5 0 01-1.5-1.5V5.111a1.111 1.111 0 10-2.222 0V7.5a1.5 1.5 0 01-1.5 1.5H1.5A1.5 1.5 0 010 7.5v-6z"
                      fill="#413bbc"
                    />
                    <path
                      d="M7 5a3 3 0 016 0v4.384a.5.5 0 00.356.479l2.695.808a2.5 2.5 0 011.756 2.748l-.633 4.435A2.5 2.5 0 0114.699 20H6.96a2.5 2.5 0 01-2.27-1.452l-2.06-4.464a2.417 2.417 0 01-.106-1.777c.21-.607.719-1.16 1.516-1.273 1.035-.148 2.016.191 2.961.82V5zm3-1a1 1 0 00-1 1v7.793c0 1.39-1.609 1.921-2.527 1.16-.947-.784-1.59-.987-2.069-.948a.486.486 0 00.042.241l2.06 4.463A.5.5 0 006.96 18h7.74a.5.5 0 00.494-.43l.633-4.434a.5.5 0 00-.35-.55l-2.695-.808A2.5 2.5 0 0111 9.384V5a1 1 0 00-1-1z"
                      fill="#413bbc"
                    />
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
        setloading(false);
      });
  }
  function handlesubscription(plan_code: string) {
    props.di
      .GET("/connector/subscription/getSubscriptionSettings")
      .then((e) => {
        if (!e.success) {
          setmodalOPen(true);
          setPlanCode(plan_code);
        } else {
          setPlanCode(plan_code);

          setFnamePaypal(e.data.paypal_fname);
          setSirnamePaypal(e.data.paypal_sirname);
          setemailPaypal(e.data.paypal_email);
          if (e.data.active_subscription.length != 0) {
            setModalSubscription(true);
            setPlanCodeModal(e.data.active_subscription[0].plan_code);
            setCatalogSize(e.data.active_subscription[0].catalog_size);
            setSubscribedAt(e.data.active_subscription[0].subcribed_at);
            setPrice(e.data.active_subscription[0].price);
          } else {
            const data = {
              plan_code: plan_code,
              marketplace: "shopify",
              paypal_email: e.data.paypal_email,
              paypal_fname: e.data.paypal_fname,
              paypal_sirname: e.data.paypal_sirname,
            };
            props.di
              .POST("/connector/subscription/purchasePlan", data)
              .then((ele) => {
                if (ele.success) {
                  window.open(ele.url);
                } else {
                  setErrPurchase(true);
                  setErrorPurchase(ele.data);
                }
              });
          }
        }
      });
  }
  const [LoadingExpired, setLoadingExpired] = useState(false);
  function ExpiredSubscritption() {
    setLoadingExpired(true);
    const data = {
      plan_code: PlanCode,
      marketplace: "shopify",
      paypal_email: emailPaypal,
      paypal_fname: FnamePaypal,
      paypal_sirname: SirnamePaypal,
    };
    props.di.POST("/connector/subscription/purchasePlan", data).then((ele) => {
      if (ele.success) {
        window.open(ele.url, "_self");
      } else {
        setErrPurchase(true);
        setErrorPurchase(ele.data);
      }
      setLoadingExpired(false);
    });
  }
  function handleClose() {
    setModalSubscription(!ModalSubscription);
  }

  function handlePurchase() {
    setLoadingPurchase(true);
    const data = {
      plan_code: PlanCode,
      marketplace: "shopify",
      paypal_email: Email,
      paypal_fname: Fname,
      paypal_sirname: Lname,
    };
    props.di.POST("/connector/subscription/purchasePlan", data).then((e) => {
      if (e.success) {
        setmodalOPen(false);
        window.open(e.url);
      } else {
        setErrPurchase(true);
        setErrorPurchase(e.data);
      }
      setLoadingPurchase(false);
    });
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
            setMessage(e.data);
            setToast(true);
            getData();
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
            setMessage(e.data);
            setErrortoast(true);
            getData();
          }
        });
    }
  }, []);

  function columnToggle(visibleCol: any, bool: boolean, objKey: any) {
    const col: any = columns;
    col[objKey].visible = bool;
    // setName(!name);
    setColumns(col);
  }

  const prepareFilter = () => {
    const par: any = {};
    if (planName) par["filter[plan_name][3]"] = planName;
    if (validity) {
      par["filter[validity][1]"] = validity;
      par["filter[validityType][1]"] = validityType;
    }
    if (catalog) par["filter[catalog_size][1]"] = catalog;
    if (priceFilter) par["filter[price][1]"] = priceFilter;
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
        break;
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

  return (
    <div>
      <PageHeader title="Purchase Plan" />
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
        {ErrPurchase && (
          <Toast
            timeout={3000}
            message={ErrorPurchase}
            type="error"
            onDismiss={() => setErrPurchase(!ErrPurchase)}
          />
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
      <Modal
        modalSize="small"
        open={ModalSubscription}
        close={handleClose}
        heading="Your current plan will be expired"
      >
        <FlexLayout halign="start" spacing="loose">
          <FlexLayout direction="vertical" spacing="loose">
            <TextStyles type="neutralText">Plan Code</TextStyles>
            <TextStyles type="neutralText">Catalog</TextStyles>
            <TextStyles type="neutralText">Price</TextStyles>
            <TextStyles type="neutralText">Subscribed At</TextStyles>
          </FlexLayout>
          <FlexLayout direction="vertical" spacing="loose">
            <TextStyles type="neutralText">:</TextStyles>
            <TextStyles type="neutralText">:</TextStyles>
            <TextStyles type="neutralText">:</TextStyles>
            <TextStyles type="neutralText">:</TextStyles>
          </FlexLayout>
          <FlexLayout direction="vertical" spacing="loose">
            <TextStyles type="neutralText">{PlanCodeModal}</TextStyles>
            <TextStyles type="neutralText">{CatalogSize}</TextStyles>
            <TextStyles type="neutralText">
              {props.currency + " " + Price}
            </TextStyles>
            <TextStyles type="neutralText">{SubscribedAt}</TextStyles>
          </FlexLayout>
        </FlexLayout>
        <div style={{ marginTop: "100px" }}>
          <FlexLayout spacing="loose" valign="center" halign="start">
            <TextStyles type="neutralText">
              Do you want to continue?{" "}
            </TextStyles>
            <Button
              thickness="thin"
              type="Outlined"
              onClick={() => {
                setModalSubscription(!ModalSubscription);
              }}
            >
              No
            </Button>
            <Button
              loading={LoadingExpired}
              thickness="thin"
              type="Primary"
              onClick={() => {
                ExpiredSubscritption();
              }}
            >
              Yes
            </Button>
          </FlexLayout>
        </div>
      </Modal>

      <Card cardType="linkwater">
        <FlexLayout spacing={"loose"} direction="vertical">
          <FlexLayout spacing={"loose"} halign="fill">
            <FlexLayout spacing={"loose"}>
              <TextField
                placeHolder={"Enter Plan Name"}
                thickness="thin"
                onChange={(e) => {
                  setPlanName(e);
                }}
                value={planName}
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
                          thickness="thin"
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
                    name: "Price",
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
              {/* <Button type="Secondary" thickness="thin" onClick={setViewColumnToggle}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" height="22"><path fill="#413bbc" fillRule="evenodd" d="M19.928 9.629C17.791 4.286 13.681 1.85 9.573 2.064c-4.06.21-7.892 3.002-9.516 7.603L-.061 10l.118.333c1.624 4.601 5.455 7.393 9.516 7.603 4.108.213 8.218-2.222 10.355-7.565l.149-.371-.149-.371zM10 15a5 5 0 100-10 5 5 0 000 10z" /><circle fill="#413bbc" cx="10" cy="10" r="3" /></svg>

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
                    label: "Plan Name",
                    value: "plan_name",
                  },
                  {
                    label: "Catalog",
                    value: "catalog_size",
                  },
                  { label: "Validity", value: "validity" },
                  { label: "Price", value: "price" },
                  { label: "Description", value: "description" },
                  { label: "Buy", value: "purchase" },
                ]}
              ></ChoiceList>
            </FlexLayout>
            <FlexLayout spacing={"loose"}>
              <TextStyles type="neutralText">
                <div style={{ marginTop: "10px" }}>Total Plans(s): {total}</div>
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
                  key !== "filter[validityType][1]"
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
      {Rows.length !== 0 ? (
        <Grid loading={loading1} rows={Rows} columns={columns} />
      ) : (
        <Card>
          <EmptyDataFound />
        </Card>
      )}
      {/* <PageHeader title="My Plan" /> */}
      <Modal
        modalSize="small"
        heading="PayPal Details"
        open={modalOpen}
        close={() => setmodalOPen(!open)}
      >
        <FlexLayout childWidth="fullWidth" direction="vertical" spacing="loose">
          <TextField
            name="First Name"
            value={Fname}
            onChange={(e) => {
              setFname(e);
            }}
            thickness="thin"
          />
          <TextField
            name="Last Name"
            value={Lname}
            onChange={(e) => {
              setLname(e);
            }}
            thickness="thin"
          />
          <TextField
            name="Email"
            value={Email}
            onChange={(e) => {
              setEmail(e);
            }}
            thickness="thin"
          />
          <Button
            thickness="thin"
            loading={LoadingPurchase}
            onClick={() => handlePurchase()}
          >
            Submit
          </Button>
        </FlexLayout>
      </Modal>
    </div>
  );
}

export default DI(MyPlans);
