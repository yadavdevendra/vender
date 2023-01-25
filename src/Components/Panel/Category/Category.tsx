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
  TextArea,
  TextField,
  TextStyles,
  Toast,
  ToastWrapper,
} from "@cedcommerce/ounce-ui";
import React, { useEffect, useState } from "react";
import { DI, DIProps } from "./../../../Core";
import { Grid } from "../../../Shared/index";
// import Null from "./../Image/null.png";
import DatePicker from "react-datepicker";
// import EmptyData from "../../../Core/EmptyStates/EmptyData";
import EmptyDataFound from "../../../Core/EmptyStates/EmptyDataFound";

interface categoryProps extends DIProps {
  isCategoryRequested: string;
}
function Category(Props: categoryProps) {
  const [ToastMsg, setToastMsg] = useState(false);
  const [columns, setColumns] = useState({
    name: {
      name: "Title",

      visible: true,

      enableMobileImage: false,
    },
    description: {
      name: "Description",

      visible: true,
    },
    requested_at: {
      name: "Requested at",

      visible: true,
    },

    status: {
      name: "Status",
      visible: true,
      enableMobileImage: false,
    },
    delete: {
      name: "Action",
      visible: true,
    },
  });
  const [Rows, setRows] = useState<Array<any>>([]);
  const [delModal, setDelModal] = useState(false);
  const [modal, setmodal] = useState(false);
  const [descp, setdescp] = useState("");
  const [Message, setMessage] = useState("");
  const [categ, setcateg] = useState("");
  const [PageCount, setPageCount] = useState(0);
  const [params, setParams] = useState<any>({});
  const [search, setSearch] = useState("");
  const [page, setpage] = useState(1);
  const [gridCount, setGridCount] = useState("10");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [desc, setDesc] = useState("");
  const [reqAt, setReqAt] = useState("");
  const [toastType, setToastType] = useState("");
  const [startDate, setStartDate] = useState<any>(null);
  const [changedDate, setchangedDate] = useState(false);
  const [delUserId, setDelUserId] = useState("");
  const [delCategoryId, setDelCategoryId] = useState("");
  const [delLoader, setDelLoader] = useState(false);
  const [totalData, setTotalData] = useState(0);

  const [visibleColumnValue, setVisibleColumnValue] = useState<any>([
    "name",
    "description",
    "requested_at",
    "status",
    "delete",
  ]);
  const [NoProduct, setNoProduct] = useState(true);
  function handleDelete() {
    const array: any = [];
    const data = {
      category_id: delCategoryId,
      user_id: delUserId,
    };
    const datatemp: any = { data: [...array, data] };
    Props.di.POST("/connector/get/deleteCategory", datatemp).then((e: any) => {
      if (e.success) {
        fetch();
        setToastMsg(true);
        setToastType("success");
        setMessage(e.data);
        setDelModal(false);
        setDelLoader(false);
      } else {
        setToastMsg(true);
        setToastType("error");
        setMessage(e.message);
        setDelModal(false);
        setDelLoader(false);
      }
    });
  }

  function fetch() {
    Props.di
      .GET("connector/get/getRequestedCategoryList", {
        ...{
          count: gridCount,
          activePage: page,
          marketplace: "shopify_vendor",
        },
        ...params,
      })
      .then((e: any) => {
        if (e.success) {
          setTotalData(e.data.end);
          if (e.data.rows.length == 0) {
            setNoProduct(false);
          } else {
            setNoProduct(true);
          }
          const arr: any[] = [];
          e.data.rows.map((m: any) => {
            const obj = {
              name: m["name"] || "Not Available",
              description: m.metafields["description"] || "Not Available",
              status: (
                <Badge
                  type={m.status == "disapproved" ? "Error" : "Success"}
                  backgroundColor={m.status === "pending" ? "#ffce56" : ""}
                >
                  {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                </Badge>
              ),
              requested_at: m.metafields["requested_at"] || "Not Available",
              disapprove_reason:
                m.metafields["disapprove_reason"] || "Not Available",
              vendor_name: m.metafields["vendor_name"] || "Not Available",
              vendor_email: m.metafields["vendor_email"] || "Not Available",
              // category_id: m.metafields['category_id'],
              marketplace: m.marketplace || "Not Available",
              delete: m && (
                <Button
                  type="Plain"
                  onClick={
                    () => {
                      setDelModal(true);
                      setDelCategoryId(m.metafields.category_id);
                      setDelUserId(m.metafields.user_id);
                    }
                    // handleDelete(m.metafields.category_id, m.metafields.user_id)
                  }
                  thickness="thin"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    height="22"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14 4h3a1 1 0 011 1v1H2V5a1 1 0 011-1h3V1.5A1.5 1.5 0 017.5 0h5A1.5 1.5 0 0114 1.5V4zM8 2v2h4V2H8zM3 8h14v10.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 18.5V8zm4 3H5v6h2v-6zm4 0H9v6h2v-6zm2 0h2v6h-2v-6z"
                      fill="#5C5F62"
                    />
                  </svg>
                </Button>
              ),
            };
            arr.push(obj);
          });

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

          setRows(arr);
        }
      });
    setcateg("");
    setdescp("");
  }
  useEffect(() => {
    fetch();
  }, [params, gridCount, page]);

  const prepareFilter = () => {
    setRows([]);
    const par: any = {};
    if (search) par["filter[name][3]"] = search;
    if (title) par["filter[name][3]"] = title;
    if (desc) par["filter[metafields.description][3]"] = desc;
    if (reqAt) par["filter[metafields.requested_at][1]"] = reqAt;
    if (status) par["filter[status][1]"] = status;
    if (startDate && changedDate)
      par[`filter[metafields.requested_at][1]`] = new Date(startDate)
        .toISOString()
        .slice(0, 10);
    setParams(par);
  };

  const resetFilter = (remove: string) => {
    const par = Object.assign({}, params);
    delete par[`filter[${remove}][3]`];
    delete par[`filter[${remove}][1]`];
    switch (remove) {
      case "name":
        setTitle("");
        setSearch("");
        break;
      case "metafields.description":
        setDesc("");
        break;
      case "status":
        setStatus("");
        break;
      case "metafields.requested_at":
        setStartDate(new Date());
        setchangedDate(false);
      default:
        break;
    }
    setParams(par);
  };

  const resetAllFilter = () => {
    setParams({});
    setTitle("");
    setReqAt("");
    setDesc("");
    setStatus("");
    setSearch("");
    setStartDate(null);
    setchangedDate(false);
  };
  function columnToggle(visibleCol: any, bool: boolean, objKey: any) {
    const col: any = columns;
    col[objKey].visible = bool;
    // setName(!name);
    setColumns(col);
  }

  return (
    <>
      <ToastWrapper>
        {ToastMsg && (
          <Toast
            message={Message}
            timeout={3000}
            onDismiss={() => setToastMsg(!ToastMsg)}
            type={toastType}
          />
        )}
      </ToastWrapper>
      <PageHeader
        title="Collections"
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
                  "https://docs.cedcommerce.com/shopify/multivendor-marketplace-solution-vendors/?section=collection-section-of-the-vendor-app"
                )
              }
            >
              Need Help
            </Button>
            {Props.isCategoryRequested === "yes" && (
              <Button
                onClick={() => {
                  setmodal(!modal);
                }}
                thickness="thin"
              >
                Request
              </Button>
            )}
          </FlexLayout>
        }
      ></PageHeader>

      <Modal
        modalSize="small"
        primaryAction={{
          loading: delLoader,
          thickness: "thin",
          content: "Delete",
          onClick: () => {
            setDelLoader(true);
            handleDelete();
          },
        }}
        close={() => {
          setDelModal(false);
        }}
        heading="Delete Category"
        open={delModal}
      >
        <Card>Are you sure that you want to delete a category ?</Card>
      </Modal>

      <Modal
        modalSize="small"
        close={() => {
          setmodal(!modal);
        }}
        heading="Add Category"
        open={modal}
        primaryAction={{
          disable: descp == "" || categ == "" ? true : false,
          type: "Primary",
          thickness: "thin",
          content: "Submit",
          onClick: () => {
            Props.di
              .GET(
                "connector/get/requestCategory?category=" +
                  categ +
                  "&description=" +
                  descp
              )
              .then((e: any) => {
                if (e.success) {
                  setmodal(false);
                  setToastMsg(true);
                  setMessage(e.data);
                  setToastType("success");
                } else {
                  setmodal(false);
                  setToastMsg(true);
                  setMessage(e.message);
                  setToastType("error");
                }
                fetch();
              });
          },
        }}
        secondaryAction={{
          disable: descp == "" || categ == "" ? true : false,
          type: "Outlined",
          thickness: "thin",
          content: "Reset",
          onClick: () => {
            setdescp("");
            setcateg("");
          },
        }}
      >
        <FlexLayout
          direction="vertical"
          childWidth="fullWidth"
          spacing="loose"
          wrap="wrap"
        >
          <TextField
            name={
              <FlexLayout>
                <>Category</>
                <span style={{ color: "red" }}>*</span>
              </FlexLayout>
            }
            thickness="thin"
            value={categ}
            onChange={(e) => {
              setcateg(categ.length ? e : e.trim());
            }}
          />

          <div style={{
            position: "relative"
          }}>
            <TextArea
              name="Description"
              thickness="thin"
              rows={2}
              value={descp}
              onChange={(e) => {
                setdescp(descp.length ? e : e.trim());
              }}
            />
            <span style={{
              color:"red",
              position: "absolute",
              top: 0,
              left: "14%"
            }}>*</span>
          </div>
        </FlexLayout>
        {/* <div style={{ marginTop: "50px" }}>
            <FlexLayout halign="end" spacing="loose">
              <Button
                type="Primary"
                thickness="thin"
                disable={descp == "" && categ == ""}
                onClick={() => {
                  setdescp("");
                  setcateg("");
                }}
              >
                Reset
              </Button>
              <Button
                type="Primary"
                thickness="thin"
                disable={descp == "" || categ == ""}
                onClick={() => {
                  Props.di
                    .GET(
                      "connector/get/requestCategory?category=" +
                      categ +
                      "&description=" +
                      descp
                    )
                    .then((e: any) => {
                      if (e.success) {
                        setmodal(false);
                        setToastMsg(true);
                        setMessage(e.data);
                        setToastType("success");
                      } else {
                        setmodal(false);
                        setToastMsg(true);
                        setMessage(e.message);
                        setToastType("error");
                      }
                      fetch();
                    });
                }}
              >
                Submit
              </Button>
            </FlexLayout>
          </div> */}
      </Modal>

      <Card cardType="linkwater">
        <FlexLayout spacing={"loose"} direction="vertical">
          <FlexLayout spacing={"loose"} halign="fill" valign="center">
            <FlexLayout spacing={"loose"}>
              <TextField
                placeHolder={"Enter Collection Tilte"}
                thickness="thin"
                suffix={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    height={20}
                    onClick={() => prepareFilter()}
                  >
                    <path d="M8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm9.707 4.293-4.82-4.82a5.968 5.968 0 0 0 1.113-3.473 6 6 0 0 0-12 0 6 6 0 0 0 6 6 5.968 5.968 0 0 0 3.473-1.113l4.82 4.82a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414z" />
                  </svg>
                }
                onChange={(e) => {
                  setSearch(e);
                }}
                value={search}
                onEnter={() => {
                  if (search.trim() === "") {
                    resetFilter("name");
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
                    name: "Title",
                    children: (
                      <FlexLayout
                        halign="start"
                        spacing="loose"
                        childWidth="fullWidth"
                      >
                        <TextField
                          thickness="thin"
                          type="text"
                          value={title}
                          onChange={(e) => {
                            setTitle(e);
                          }}
                          onEnter={() => {
                            prepareFilter();
                          }}
                        />
                        <Button
                          onClick={() => {
                            resetFilter("name");
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
                    name: "Description",
                    children: (
                      <FlexLayout
                        halign="start"
                        spacing="loose"
                        childWidth="fullWidth"
                      >
                        <TextField
                          type={"text"}
                          thickness="thin"
                          value={desc}
                          onChange={(e) => {
                            setDesc(e);
                          }}
                          onEnter={() => {
                            prepareFilter();
                          }}
                        />
                        <Button
                          onClick={() => {
                            resetFilter("description");
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
                    name: "Requested At",
                    children: (
                      <FlexLayout
                        valign="center"
                        spacing="loose"
                        childWidth="fullWidth"
                      >
                        {/* <TextField
                          thickness="thin"
                          onChange={(e) => {
                            setReqAt(e);
                          }}
                          value={reqAt}
                          onEnter={() => {
                            prepareFilter();
                          }}
                        /> */}
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
                              setchangedDate(true);
                            }}
                          />
                        </div>
                        <Button
                          onClick={() => {
                            resetFilter("requested_at");
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
                            { label: "Approved", value: "approved" },
                            { label: "Disapproved", value: "disapproved" },
                            { label: "Pending", value: "pending" },
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
                    label: "Title",
                    value: "name",
                  },
                  {
                    label: "Description",
                    value: "description",
                  },
                  { label: "Requested At", value: "requested_at" },
                  { label: "Status", value: "status" },
                  { label: "Action", value: "delete" },
                ]}
              ></ChoiceList>
            </FlexLayout>
            <FlexLayout spacing={"loose"}>
              <TextStyles type="neutralText">
                <div style={{ margin: "10px" }}>
                  Total category(s): {totalData}
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
                totalPages={totalData}
                currentPage={Rows.length === 0 ? 0 : page}
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
                      ? "contains"
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
                      {(
                        filtertagArr[1].charAt(0).toUpperCase() +
                        filtertagArr[1].slice(1)
                      )
                        .replace("Metafields.description", "Description")
                        .replace("Metafields.requested_at", "Requested At") +
                        " " +
                        condition +
                        " " +
                        params[key]}
                    </Badge>
                  );
                }
              })}
            </FlexLayout>
          )}
        </FlexLayout>
      </Card>
      {NoProduct ? (
        <Grid rows={Rows} columns={columns} />
      ) : (
        <Card>
          {" "}
          <EmptyDataFound></EmptyDataFound>
        </Card>
      )}
    </>
  );
}

export default DI(Category);
