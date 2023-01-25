/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, Component } from "react";
import { DI, DIProps } from "../../../Core";
import {
  PageHeader,
  Card,
  TextStyles,
  FlexLayout,
  Button,
  Badge,
  ProgressCircle,
  Toast,
  Skeleton,
} from "@cedcommerce/ounce-ui";
import { Grid } from "./../../../Shared/index";
import EmptyDataFound from "../../../Core/EmptyStates/EmptyDataFound";

let viewAllCount = 0;
let showAll = false;
function Activities(Props: DIProps): JSX.Element {
  const [activities, setactivities] = useState([{}]);
  const [col, setCol] = useState({
    severity: {
      name: "Status",
      visible: true,
    },
    message: {
      name: "Message",
      visible: true,
    },
    updated_at: {
      name: "Date",
      visible: true,
    },
  });
  const [loading, setLoading] = useState(false);
  const [cancelMessage, setcancelMessage] = useState("");
  const [cancelToast, setcancelToast] = useState(false);
  const [showSkelton, setShowSkelton] = useState(true);
  const [noProgressBar, setNoProgressBar] = useState(false);
  const [HideButton, setHideButton] = useState(false);
  const [count, setCount] = useState(3);
  const [toggle, setToggle] = useState(false);
  const [notiMessage, setNotiMessage] = useState("");
  const [activityData, setActivityData] = useState([]);
  const [noData, setNoData] = useState(false);

  function getQueuedTask() {
    Props.di.GET("connector/get/allQueuedTasks").then((e) => {
      setShowSkelton(false);
      if (e.success) {
        if (e.data.rows.length != 0) {
          setActivityData(e.data.rows);
          setNoProgressBar(true);
        } else {
          setNoProgressBar(false);
        }
      }
    });
  }
  function NotiClear() {
    Props.di.GET("connector/get/clearNotifications").then((e) => {
      if (e.success) {
        setHideButton(false);
        setToggle(true);
        setNoData(false);
        setNotiMessage(e.message);
        getData();
        setTimeout(() => {
          getData();
        }, 3000);
      }
    });
  }

  useEffect(() => {
    getData();
    getQueuedTask();
    const interval = setInterval(() => {
      getQueuedTask();
      getData();
    }, 3000);
    return () => {
      clearInterval(interval);
      showAll = false;
    };
  }, []);

  function handleCancelActivity(msg: string, feedId: string) {
    const sendMsg = msg.split(":");
    Props.di
      .POST("/connector/vendor/cancelActivities", {
        marketplace: "shopify",
        feed_id: feedId,
        activity: sendMsg[0].trim(),
      })
      .then((e) => {
        if (e.success) {
          setcancelToast(true);
          getData();
          setcancelMessage(e.message);
        }
      });
  }

  function getData() {
    Props.di
      .GET(
        `connector/get/allNotifications?activePage=0&count=${
          showAll ? viewAllCount : count
        }`
      )
      .then((e) => {
        if (e.success == true && e.data.count != 0) {
          viewAllCount = e.data.count;

          setHideButton(true);
          setNoData(true);
          setLoading(false);

          const temp: any = Object.keys(e.data.rows).map((r) => {
            return {
              severity:
                (e.data.rows[r].severity == "success" && (
                  <Badge size="small" type="Success">
                    Success
                  </Badge>
                )) ||
                (e.data.rows[r].severity == "critical" && (
                  <Badge size="small" type="Error">
                    Aborted
                  </Badge>
                )),
              message: e.data.rows[r].message.replaceAll("_", " "),
              updated_at: e.data.rows[r].updated_at,
            };
          });
          setactivities(temp);
        }
      });
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
        title="Activities"
        action={
          <FlexLayout valign={"center"} spacing="loose">
            <Button
              type="Outlined"
              icon={quesicon}
              iconRound={false}
              thickness="thin"
              onClick={() =>
                window.open(
                  "https://docs.cedcommerce.com/shopify/multivendor-marketplace-solution-vendors/?section=activities-section-of-the-vendor-app"
                )
              }
            >
              Need Help
            </Button>

            {HideButton && (
              <Button
                loading={loading}
                type="Outlined"
                thickness="thin"
                onClick={() => {
                  showAll = !showAll;
                  setCount(viewAllCount);
                  getData();
                  setLoading(true);
                }}
              >
                {showAll ? "Collapse" : "Show All"}
              </Button>
            )}
            {HideButton && (
              <Button
                thickness="thin"
                onClick={() => {
                  NotiClear();
                }}
              >
                Clear All
              </Button>
            )}
          </FlexLayout>
        }
      />

      <ToastWrapper>
        {toggle && (
          <Toast
            type="success"
            message={notiMessage}
            timeout={3000}
            onDismiss={() => {
              setToggle(!toggle);
            }}
          />
        )}
        {cancelToast && (
          <Toast
            type="success"
            message={cancelMessage}
            timeout={3000}
            onDismiss={() => {
              setcancelToast(!cancelToast);
            }}
          />
        )}
      </ToastWrapper>
      <FlexLayout direction="vertical" spacing="extraLoose">
        {noProgressBar ? (
          <Card>
            {Object.values(activityData).map((key: any) => {
              return (
                <>
                  <Card>
                    <FlexLayout direction="vertical" spacing="loose">
                      <FlexLayout
                        halign="fill"
                        spacing="extraLoose"
                        wrap={"noWrap"}
                      >
                        <div>
                          <FlexLayout direction="vertical" spacing="loose">
                            <TextStyles type="SubHeading">
                              {key["message"]
                                .replaceAll("_", " ")
                                .split(":")[0]
                                .charAt(0)
                                .toUpperCase() +
                                key["message"]
                                  .replaceAll("_", " ")
                                  .split(":")[0]
                                  .toLowerCase()
                                  .slice(1) +
                                (key["message"].includes(":")
                                  ? ":" + key["message"].split(":")[1]
                                  : "")}
                            </TextStyles>
                            <TextStyles textcolor="light" type="smallText">
                              {key["created_at"]}
                            </TextStyles>
                          </FlexLayout>
                        </div>
                        <ProgressCircle
                          size={80}
                          percentage={Math.floor(key["progress"])}
                        />
                      </FlexLayout>

                      <Button
                        thickness="thin"
                        type="Danger"
                        onClick={() => {
                          handleCancelActivity(key["message"], key["id"]);
                        }}
                      >
                        Abort
                      </Button>
                      <hr className="text-muted" />
                    </FlexLayout>
                  </Card>
                </>
              );
            })}
          </Card>
        ) : (
          showSkelton && (
            <Skeleton
              height={"20px"}
              line={2}
              type="line"
              width="100%"
              rounded="20px"
            />
          )
        )}
        {showSkelton ? (
          <Skeleton
            height={"20px"}
            line={3}
            type="line"
            width="100%"
            rounded="20px"
          />
        ) : noData ? (
          <Grid columns={col} rows={activities} />
        ) : (
          !noProgressBar && <EmptyDataFound />
        )}
      </FlexLayout>
    </>
  );
}
interface ToastWrapperI {
  children: React.ReactNode;
}
class ToastWrapper extends Component<ToastWrapperI> {
  constructor(props: ToastWrapperI) {
    super(props);
    this.state = {};
  }

  render() {
    return <div className={"inte-toast--Wrapper"}>{this.props.children}</div>;
  }
}
export default DI(Activities);
