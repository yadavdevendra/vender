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
  ChoiceList,
  TextField,
  TextStyles,
  Modal,
} from "@cedcommerce/ounce-ui";
import React, { useEffect, useState } from "react";
import EmptyDataFound from "../../../Core/EmptyStates/EmptyDataFound";
import { DI, DIProps } from "./../../../Core";
import { Grid } from "./../../../Shared/index";
import DatePicker from "react-datepicker";

function Message(props: DIProps): JSX.Element {
  const [rows, setRows] = useState<any>([]);
  const [TotalCount, setTotalCount] = useState(0);
  const [viewColumnToggle, setViewColumnToggle] = useState(false);
  const [PageCount, setPageCount] = useState(0);
  const [name, setName] = useState(false);
  const [ModalOpen, setModalOpen] = useState(false);
  const [delChatId, setDelChatId] = useState("");
  const [delLoader, setDelLoader] = useState(false);
  const [columns, setColumns] = useState({
    chat_id: {
      name: "Chat ID",
      visible: true,
    },
    Subject: {
      name: "Subject",
      visible: true,
    },
    chat_init_date_time: {
      name: "Date",
      visible: true,
    },

    status: {
      name: "Status",
      visible: true,
    },
    viewBtn: {
      name: "Chat",
      visible: true,
    },
    action: {
      name: "Action",
      visible: true,
    },
  });
  const [params, setParams] = useState({
    activePage: 1,
    count: 10,
  });

  useEffect(() => {
    getData();
  }, [params]);

  function getData() {
    props.di
      .GET("connector/messaging/GetMessgingDetails", {
        ...params,
        ...{ type: "vendor_deleted" },
      })
      .then((e) => {
        if (e.success) {
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
          props.di
            .GET("/connector/messaging/getUnreadMessageCount")
            .then((m) => {
              if (m.success) {
                const temp: any = Object.keys(e.data.rows).map((r) => {
                  return {
                    chat_id: e.data.rows[r].chat_id,
                    Subject: e.data.rows[r].Subject,
                    chat_init_date_time: e.data.rows[r].chat_init_date_time,
                    receiver_id: e.data.rows[r].receiver_id,
                    receivername: e.data.rows[r].receivername,
                    sender_id: e.data.rows[r].sender_id,
                    viewBtn: (
                      <Button
                        thickness="thin"
                        type="Plain"
                        onClick={() => {
                          props.history.push(
                            "/message/" + e.data.rows[r].chat_id,
                            {
                              fromCompose: true,
                              visibilty: true,
                              receiver: e.data.rows[r].sender_id,
                              subject: e.data.rows[r].Subject,
                            }
                          );
                        }}
                      >
                        Chat
                      </Button>
                    ),
                    action: (
                      <Button
                        loading={delLoader}
                        type="PlainDark"
                        onClick={() => {
                          setModalOpen(true);
                          setDelChatId(e.data.rows[r].chat_id);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          height="24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14 4h3a1 1 0 011 1v1H2V5a1 1 0 011-1h3V1.5A1.5 1.5 0 017.5 0h5A1.5 1.5 0 0114 1.5V4zM8 2v2h4V2H8zM3 8h14v10.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 18.5V8zm4 3H5v6h2v-6zm4 0H9v6h2v-6zm2 0h2v6h-2v-6z"
                            fill="red"
                          />
                        </svg>
                      </Button>
                    ),
                    status: "No New Messages.",
                  };
                });

                temp.map((ele: any) => {
                  Object.values(m.data).forEach((unread: any) => {
                    if (ele.chat_id === unread._id.chat_id) {
                      ele.status = unread.unread_message + " New Messages";
                    }
                  });
                });
                setRows(temp);
              }
            });
        }
      });
  }

  useEffect(() => {
    getData();
  }, []);

  function columnToggle(visibleCol: any, bool: boolean, objKey: any) {
    const col: any = columns;
    col[objKey].visible = bool;
    setName(!name);
    setColumns(col);
  }

  const deleteChat = () => {
    setDelLoader(true);
    props.di
      .POST("/connector/messaging/deleteChat", {
        chat_id: delChatId,
        type: "vendor_deleted",
      })
      .then((res) => {
        if (res.success) {
          setDelLoader(false);
          setModalOpen(false);
          getData();
        } else {
          setDelLoader(false);
          setModalOpen(false);
        }
      });
  };

  return (
    <>
      <PageHeader
        title="Chats"
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
                  "https://docs.cedcommerce.com/shopify/multivendor-marketplace-solution-vendors/?section=chats-section-of-the-app"
                )
              }
            >
              Need Help
            </Button>
            <Button
              type="Primary"
              thickness="thin"
              onClick={() => {
                props.history.push("/message/compose", {
                  fromCompose: true,
                });
              }}
            >
              Compose
            </Button>
          </FlexLayout>
        }
      />
      <Modal
        modalSize="small"
        heading="Warning"
        open={ModalOpen}
        close={() => setModalOpen(!ModalOpen)}
      >
        <FlexLayout direction="vertical" valign="start" spacing="loose">
          <TextStyles type="simpleText">
            Are you sure to delete the chat ?
          </TextStyles>
          <Button
            thickness="thin"
            type="Danger"
            onClick={() => {
              deleteChat();
            }}
          >
            Delete
          </Button>
        </FlexLayout>
      </Modal>
      <RenderCardFilter
        {...props}
        params={setParams}
        TotalCount={TotalCount}
        preSetParams={params}
        columnToggle={columnToggle}
        Pagecount={PageCount}
        setViewColumnToggle={() => setViewColumnToggle(!viewColumnToggle)}
      />
      {rows.length !== 0 ? (
        <Grid rows={rows} columns={columns} />
      ) : (
        <Card>
          <EmptyDataFound />
        </Card>
      )}
    </>
  );
}
interface tableActionI extends DIProps {
  params: any;

  setViewColumnToggle: () => void;
  TotalCount: number;
  columnToggle: (val: any, bool: boolean, objKey: any) => any;
  Pagecount: number;
  preSetParams: any;
}
function RenderCardFilter({
  TotalCount,
  Pagecount,
  params,
  columnToggle,
  preSetParams,
}: // setViewColumnToggle,
tableActionI): JSX.Element {
  const [search, updateSearch] = useState("");
  const [ChatID, UpdateChatID] = useState("");
  const [createdAt, setCreatedAt] = useState<any>(new Date());
  const [changedDate, setchangedDate] = useState(false);

  const [visibleColumnValue, setVisibleColumnValue] = useState<any>([
    "viewBtn",
    "Subject",
    "chat_id",
    "chat_init_date_time",
    "status",
    "action",
  ]);
  const [Receiver, UpdateReceiver] = useState("");

  const [filterTag, setFilterTag] = useState<any>("");
  const [page, setpage] = useState(1);
  const [Subject, SetSubject] = useState("");

  const [selectUpdateCount, setSelectUpdateCount] = useState("10");

  useEffect(() => {
    prepareFilter();
  }, [page, selectUpdateCount]);
  function prepareFilter() {
    const par: any = {
      count: selectUpdateCount,
      activePage: page,
    };
    if (search && search.trim() != "") {
      par[`filter[chat_id][1]`] = search;
    }
    if (ChatID.trim() !== "") par[`filter[chat_id][1]`] = ChatID;
    if (createdAt !== "" && changedDate)
      par[`filter[chat_init_date_time][3]`] = createdAt
        .toISOString()
        .slice(0, 10);

    if (Subject.trim() !== "") par[`filter[Subject][3]`] = Subject;

    params(par);
    setFilterTag(par);
  }

  function resetAllFilter() {
    const par: any = {
      count: selectUpdateCount,
      activePage: page,
    };
    if (search || ChatID) delete par[`filter[chat_id][1]`];
    if (Subject) delete par[`filter[Subject][3]`];
    if (createdAt) delete par[`filter[sender_name][3]`];
    if (Receiver) delete par[`filter[receivername][3]`];
    updateSearch("");
    SetSubject("");
    setCreatedAt(new Date());
    setchangedDate(false);
    UpdateChatID("");
    UpdateReceiver("");
    params(par);
    setFilterTag(par);
  }

  const resetFilter = (remove: string) => {
    const par = { ...{}, ...preSetParams };

    delete par[`filter[${remove}][3]`];
    delete par[`filter[${remove}][1]`];
    switch (remove) {
      case "chat_id":
        UpdateChatID("");
        updateSearch("");
        break;
      case "Subject":
        SetSubject("");

        break;
      case "chat_init_date_time":
        setCreatedAt(new Date());
        setchangedDate(false);
        break;
    }
    params(par);
    setFilterTag(par);
  };

  return (
    <Card cardType="linkwater">
      <FlexLayout spacing={"loose"} direction="vertical">
        <FlexLayout spacing={"loose"} halign="fill">
          <FlexLayout spacing={"loose"}>
            <TextField
              placeHolder="Enter Chat ID"
              thickness="thin"
              onChange={(e) => updateSearch(e)}
              value={search}
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
                prepareFilter();
              }}
            />

            <Filter
              type="Small"
              label="Filter"
              disableReset={false}
              filters={[
                {
                  name: "Chat ID",
                  children: (
                    <FlexLayout
                      halign="start"
                      spacing="loose"
                      childWidth="fullWidth"
                    >
                      <TextField
                        thickness="thin"
                        value={ChatID}
                        onChange={(e) => UpdateChatID(e)}
                        onEnter={() => {
                          prepareFilter();
                        }}
                      />
                      <Button
                        onClick={() => resetFilter("chat_id")}
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
                  name: "Subject",
                  children: (
                    <FlexLayout
                      halign="start"
                      spacing="loose"
                      childWidth="fullWidth"
                    >
                      <TextField
                        onEnter={() => {
                          prepareFilter();
                        }}
                        thickness="thin"
                        value={Subject}
                        onChange={(e: any) => {
                          SetSubject(e);
                        }}
                      ></TextField>
                      <Button
                        onClick={() => resetFilter("Subject")}
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
                          selected={createdAt}
                          onChange={(date: any) => {
                            setCreatedAt(date);
                            setchangedDate(true);
                          }}
                        />
                      </div>
                      <Button
                        onClick={() => resetFilter("chat_init_date_time")}
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
              resetFilter={resetAllFilter}
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
                  label: "Status",
                  value: "status",
                },
                {
                  label: "Chat",
                  value: "viewBtn",
                },
                { label: "Subject", value: "Subject" },
                { label: "Chat ID", value: "chat_id" },
                { label: "Date", value: "chat_init_date_time" },
                { label: "Action", value: "action" },
              ]}
            ></ChoiceList>
          </FlexLayout>
          <FlexLayout spacing={"loose"}>
            <div style={{ marginTop: "10px" }}>
              <TextStyles type="neutralText">
                Total Message(s): {TotalCount}
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
                onChange={(e) => {
                  setSelectUpdateCount(e);
                }}
              />
            </div>
            <Pagination
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
                    ? "does not contain"
                    : filtertagArr[2] === "[5]"
                    ? "starts with"
                    : "ends with";
                return (
                  <Badge
                    destroy={() => resetFilter(filtertagArr[1])}
                    type="Success"
                    size="small"
                  >
                    {filtertagArr[1]
                      .replace("chat_id", "Chat ID")
                      .replace("sender_name", "Sender Name")
                      .replace("chat_init_date_time", "Created At")
                      .replace("receiver_id", "Receiver ID") +
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
  );
}

export default DI(Message);
