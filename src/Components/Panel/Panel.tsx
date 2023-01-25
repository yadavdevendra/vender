/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useContext,
  useEffect,
  useRef,
  Component,
  useState,
} from "react";
import * as moment from "moment";
import "moment-timezone";

import { DI, DIProps } from "../../Core";
import {
  FlexLayout,
  Modal,
  Sidebar,
  PageHeader,
  Topbar,
  Card,
  BodyHeader,
  PageLoader,
  BodyLayout,
  Skeleton,
  Button,
  TextField,
  Toast,
  TextStyles,
  Popover,
} from "@cedcommerce/ounce-ui";
import { menu, subMenu } from "./Menu";
import { StepData } from "./Onboarding/Step";
import { Route, Switch, Redirect } from "react-router-dom";
import User_profile from "./User_profile/User_profile";
import {
  Dashboard,
  Product,
  Config,
  Onboarding,
  Activities,
  Faq,
  Help,
  Create,
} from "./";
import { syncNecessaryInfo, syncConnectorInfo } from "../../Actions";
import Setting from "./Settings/Setting";
import Edit from "./Product/Edit/Edit";
import Transaction_route from "./Transaction/Transaction_route";
import CreateProfile from "./profile-component/CreateProfile";
import Category from "./Category/Category";
import Mapping from "./Mapping/Mapping";
import ViewOrder from "./Order/ViewOrder";
import Shipment from "./Order/Shipment";
import { StoreDispatcher } from "../..";
import Report from "./Report/Report";
import Ship from "./Order/Shipment/Ship";
import ViewShip from "./Order/Shipment/ViewShip";
import Message from "./Message/Message";
import Chat from "./Message/Chat";
import Compose from "./Message/Compose";
import ComposeMessage from "./Message/ComposeMessage";
import Subscription_route from "./Subscription/Subscription_route";
import GetTransaction from "./Transaction/GetTransaction";
import SubsHistory from "./Subscription/SubsHistory";
import CategoryMapping from "./Category_mapping/CategoryMapping";

import ImageZip from "./Product/Image_Zip/ImageZip";
import Order from "./Order/Order";
import View_transaction from "./Transaction/View_transaction";
import Request_Transaction from "./Transaction/Request_Transaction";
import OrderReport from "./Report/OrderReport";
import ProductReport from "./Report/ProductReport";
import MyPlans from "./Subscription/MyPlans";
import ListSubscription from "./Subscription/ListSubscription";
import Product_import from "./Product/Product_Import/Product_import";

import "moment-timezone";
import ViewVariant from "./Product/Create/ViewVariant";
import OnboardingSettings from "./Onboarding_settings/OnboardingSettings";
import { environment } from "../../environments/environment";
import { store } from "../../Reducers";

interface PanelProps extends DIProps {
  name?: string;
  syncNecessaryInfo: () => void;
  syncConnectorInfo: () => void;
  adminId: any;
  sup_id: any;
}
function Panel(props: PanelProps): JSX.Element {
  environment["user_id"] = props.redux.sup_id;
  const [adminId, setAdminId] = useState(props.location.state);

  const [vendorId, setVendorId] = useState<any>();
  const [vendorUserId, setVendorUserId] = useState<any>();
  const [hideShipButton, setHideShipButton] = useState(true);
  const [Menu, setMenu] = useState<any>([]);
  const [currency, setCurrency] = useState<any>("");
  const [DataEnable, setDataEnable] = useState({});
  const [loading, setLoading] = useState(false);
  const [toastUrl, setToastUrl] = useState(false);
  const [hideButton, setHideButton] = useState(false);
  const [shopUrl, setShopUrl] = useState("");
  const [profileName, setProfileName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const [NoModal, setNoModal] = useState(false);
  const [requestCategory, setRequestCategory] = useState("");
  const [connected, setConnected] = useState("");
  const [modView, SetmodView] = useState(false);
  const hasBeenCalled = useRef(false);
  const { basic = { stepActive: "0" } }: any = props.redux;
  const [step, setStep] = useState(0);
  const dispacher = useContext(StoreDispatcher);
  const [notifyActive, setnotifyActive] = useState(false);
  const [UnreadNotification, setUnreadNotification] = useState(0);
  const [data, setData] = useState<any>([{}]);
  const [PopoverActive, setPopoverActive] = useState(false);
  const [Apikey, setApikey] = useState("");
  const [SecretKey, setSecretKey] = useState("");
  const [MessageConnect, setMessage] = useState("");
  const [ConnectionToast, setConnectionToast] = useState(false);
  const [sharedsecretKey, setsharedsecretKey] = useState("");
  const [ConnectionToastError, setConnectionToastError] = useState(false);
  const [locale, setLocale] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [userName, setUserName] = useState("");
  const [validSecretKey, setValidateSecret] = useState(false);
  // const { LOGIN_STATUS = { status: 'LOGIN' } } = props.redux;

  // useConstructor();
  /**
   * @hooks useffect for enabling and disabling the menu icons.
   */

  useEffect(() => {
    getUserDetails();
  }, []);

  useEffect(() => {
    let endpoint = "";
    endpoint = props.di.environment.API_ENDPOINT.replace("/public/", "/");
    step !== 4 &&
      props.di.GET("/frontend/app/getStepCompleted").then((e) => {
        setProfileName(e.name);
        setProfilePicture(endpoint + e.profile_picture);
        setStep(e.data);
      });
  }, [step]);

  const getUserDetails = () => {
    props.di.GET("frontend/app/getUserDetails").then((e) => {
      if (e.success) {
        setDataEnable(e.data);
        setCurrency(e.currency);
        setLocale(e.data.primary_locale);
        setProfileName(e.data.name);
        setRequestCategory(e.supplier_category_enable);
        setProfilePicture(
          props.di.environment.API_ENDPOINT.replace("/public/", "/") +
            e.data.profile_picture
        );
        setTimeZone(e.data.iana_timezone);
        setUserName(e.data.myshopify_domain || "");
        // let temp = [];
        setHideShipButton(e["supplier_can_ship"] === "yes" ? true : false);
        setVendorUserId(e.user_id);
        Object.keys(e.data).includes("shipping_markup_changed")
          ? setVendorId(true)
          : setVendorId(undefined);
        Object.keys(e.data).includes("myshopify_domain")
          ? setHideButton(false)
          : setHideButton(true);

        Object.keys(e.data).includes("validate_secret_key")
          ? setValidateSecret(e.data["validate_secret_key"])
          : setValidateSecret(false);

        setConnected(e.seller_private_app_enable);
        if (
          e.supplier_membership_enable == "no" &&
          e.supplier_chat_enable == "no" &&
          e.supplier_category_enable == "no"
        ) {
          let temp = Object.keys(menu).map((element: any) => {
            if (
              menu[element].content != "Category" &&
              menu[element].content != "Chat" &&
              menu[element].content != "Membership"
            ) {
              return menu[element];
            }
          });
          temp = temp.filter(function (element) {
            return element !== undefined;
          });
          setMenu(temp);
        }
        if (
          e.supplier_membership_enable == "no" &&
          e.supplier_chat_enable == "no" &&
          e.supplier_category_enable == "yes"
        ) {
          let temp = Object.keys(menu).map((element: any) => {
            if (
              menu[element].content != "Chat" &&
              menu[element].content != "Membership"
            ) {
              return menu[element];
            }
          });
          temp = temp.filter(function (element) {
            return element !== undefined;
          });
          setMenu(temp);
        }
        if (
          e.supplier_membership_enable == "no" &&
          e.supplier_chat_enable == "yes" &&
          e.supplier_category_enable == "yes"
        ) {
          let temp = Object.keys(menu).map((element: any) => {
            if (menu[element].content != "Membership") {
              return menu[element];
            }
          });
          temp = temp.filter(function (element) {
            return element !== undefined;
          });
          setMenu(temp);
        }
        if (
          e.supplier_membership_enable === "yes" &&
          e.supplier_chat_enable === "yes" &&
          e.supplier_category_enable === "yes"
        ) {
          let temp = Object.keys(menu).map((element: any) => {
            return menu[element];
          });
          temp = temp.filter(function (element) {
            return element !== undefined;
          });
          setMenu(temp);
        }
        if (
          e.supplier_membership_enable === "yes" &&
          e.supplier_chat_enable === "yes" &&
          e.supplier_category_enable === "no"
        ) {
          let temp = Object.keys(menu).map((element: any) => {
            if (menu[element].content != "Category") {
              return menu[element];
            }
          });
          temp = temp.filter(function (element) {
            return element !== undefined;
          });
          setMenu(temp);
        }
        if (
          e.supplier_membership_enable == "yes" &&
          e.supplier_chat_enable == "no" &&
          e.supplier_category_enable == "no"
        ) {
          let temp = Object.keys(menu).map((element: any) => {
            if (
              menu[element].content != "Category" &&
              menu[element].content != "Chat"
            ) {
              return menu[element];
            }
          });
          temp = temp.filter(function (element) {
            return element !== undefined;
          });
          setMenu(temp);
        }
        if (
          e.supplier_membership_enable == "no" &&
          e.supplier_chat_enable == "yes" &&
          e.supplier_category_enable == "no"
        ) {
          let temp = Object.keys(menu).map((element: any) => {
            if (
              menu[element].content != "Category" &&
              menu[element].content != "Membership"
            ) {
              return menu[element];
            }
          });
          temp = temp.filter(function (element) {
            return element !== undefined;
          });
          setMenu(temp);
        }
        // setMenu(temp);
      }
    });
  };

  useEffect(() => {
    dispacher({
      type: "user_id",
      state: {
        user_id: props.match.params.uId,
      },
    });
    con();
  }, []);

  async function con(): Promise<void> {
    if (hasBeenCalled.current) return;
    await props.syncConnectorInfo(); //ADD AWAIT DURING PRODUCTION
    await props.syncNecessaryInfo(); //ADD AWAIT DURING PRODUCTION
    hasBeenCalled.current = true;
    if (hasBeenCalled) return;
  }
  useEffect(() => {
    props.di.GET("/connector/notificationmsg/getNotifications").then((e) => {
      if (e.success) {
        setData(e.data.rows);
        setUnreadNotification(e.data.unread_noti);
      }
    });
  }, []);
  useEffect(() => {
    if (step === 4) {
      renderApp();
    }
  }, [basic.stepActive, step]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onChange(e: any): void {
    props.history.push(e.path);
  }

  function getCurrentPath(path: string) {
    const newpAth = path.split("/").splice(0, 3).join("/");
    return newpAth;
  }

  const BodyRender =
    parseInt(basic.stepActive) > StepData.length ? (
      renderApp()
    ) : (
      <BodyLayout>
        <Onboarding />
      </BodyLayout>
    );

  return (
    <>
      {parseInt(basic.stepActive) === 1 && connected === "no" ? (
        (window.location.href = "https://www.shopify.com/partners")
      ) : parseInt(basic.stepActive) === 4 ||
        step === 4 ||
        connected === "yes" ? (
        renderApp()
      ) : parseInt(basic.stepActive) === 2 || step === 2 ? (
        renderRoutes()
      ) : parseInt(basic.stepActive) === 3 || step === 3 ? (
        renderRoutes()
      ) : basic.stepActive === false ? (
        props.history.push(
          `/auth/login/${sessionStorage.getItem("admin_shop_id")||localStorage.getItem("admin_shop_id")}`
        )
      ) : (
        <RenderSkeleton />
      )}

      {/* {parseInt(basic.stepActive) > StepData.length ? (
      // <AppWrapper>
      
        renderApp()
      
        // <Onboarding/>
        // </AppWrapper>
      
      ) : (
        <RenderSkeleton />
      )} */}
    </>
  );

  function handleOpen() {
    if (NoModal == false) {
      SetmodView(!modView);
    } else {
      props.di
        .GET("frontend/app/connectWithShopify")
        .then((e) => window.open(e.redirect_url));
    }
  }
  function sendShopURL() {
    if (shopUrl != "" && shopUrl.includes(".myshopify.com") != true) {
      setToastUrl(true);
    } else {
      // props.history.push('/panel/categoryMapping');
      setLoading(true);
      const data = {
        shop_url: shopUrl,
        api_key: Apikey,
        secret_key: SecretKey,
        shared_secret_key: sharedsecretKey,
      };
      props.di.POST("/frontend/app/connectWithShopify", data).then((e) => {
        if (e.success) {
          // window.open(e.redirect_url)
          setConnectionToast(true);
          setMessage(e.message);
          SetmodView(false);
        } else {
          setConnectionToastError(true);

          setMessage(e.message);
        }
        setLoading(false);
      });
    }
  }

  function renderApp(): JSX.Element {
    function Getnotifications() {
      props.di.GET("/connector/notificationmsg/getNotifications").then((e) => {
        if (e.success) {
          setData(e.data.rows);
          setUnreadNotification(e.data.unread_noti);
        }
      });
    }

    function timeSince(date: any) {
      const timeAgo = moment.tz(date, timeZone);
      return timeAgo.fromNow();
    }
    function handleRedirect(url: string, id: number) {
  
      if(url.charAt(0)=="/"){
        props.history.push(`${url}`)
      }else{
        props.history.push(`/${url}`)
      }
       
      // url.includes("message")
      //   ? props.history.push(url.replace("/panel/", ""), {
      //       fromCompose: true,
      //       visibilty: true,
      //     })
      //   : props.history.push(url.replace("/panel/", ""));
      setnotifyActive(false);
      const data = {
        id: id,
        read: "true",
      };
      props.di
        .POST("/connector/notificationmsg/readUnreadNotifications", data)
        .then((e) => {
          if (e.success) {
          }
        });
    }
    function handleUnread(id: number) {
      const data = {
        id: id,
        unread: "true",
      };
      props.di
        .POST("/connector/notificationmsg/readUnreadNotifications", data)
        .then((e) => {
          if (e.success) {
            Getnotifications();
          }
        });
    }

    function handleClearAll() {
      props.di
        .GET("/connector/notificationmsg/clearAllNotifications")
        .then((e) => {
          if (e.success) {
            setnotifyActive(false);
          }
        });
    }
    
    return (
      <>
        <Topbar
          connectRight={
            <FlexLayout halign="end" spacing="extraLoose">
              <Popover
                popoverWidth={220}
                open={notifyActive}
                popoverContainer="element"
                activator={
                  <Button
                    type="Plain"
                    onClick={() => {
                      setnotifyActive(!notifyActive);
                      Getnotifications();
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      height="27"
                    >
                      <path
                        d="M10 0a1 1 0 011 1v2.032l-.001.021-.002.03A6.002 6.002 0 0116 9c0 3.093.625 4.312 1.599 6.21l.034.068c.17.33-.07.722-.442.722H2.809a.496.496 0 01-.442-.722l.034-.068C3.375 13.312 4 12.093 4 9a6.002 6.002 0 015.003-5.918l-.002-.04A.835.835 0 019 3V1a1 1 0 011-1zM12 18a2 2 0 01-4 0h4z"
                        fill="#5C5F62"
                      />
                    </svg>
                    <span
                      style={{
                        right: "-4px",
                        top: "-4px",
                        background: "#413bbc",
                        color: "rgb(255, 255, 255)",
                        borderRadius: "50%",
                        fontSize: "10px",
                        fontWeight: 600,
                        padding: "3px",
                        position: "absolute",
                      }}
                    >
                      {UnreadNotification.toString().length<=2?UnreadNotification:`${99}+`}
                    </span>
                  </Button>
                }
              >
                <div
                  style={{
                    padding: "10px 0 15px",
                  }}
                >
                  <FlexLayout halign="fill" spacing="extraLoose">
                    <TextStyles content={"Notifications"} type="neutralText" />
                    <span
                      onClick={() => {
                        handleClearAll();
                      }}
                      className="underline-on-hover"
                    >
                      {" "}
                      <TextStyles
                        type="smallText"
                        textcolor="light"
                        content="Clear All"
                      />{" "}
                    </span>
                  </FlexLayout>
                </div>
                <div
                  style={{
                    overflowY: "auto",
                    backgroundColor: "white",
                    maxHeight: "250px",
                  }}
                  className="notification"
                >
                  {Object.keys(data).map((e: any, i) => {
                    if (data[e].type == "Chat") {
                      return (
                        <div
                          key={i}
                          style={{
                            paddingLeft: "10px",
                            paddingBottom: "10px",
                            marginTop: "15px",
                            marginBottom: "5px",
                            backgroundColor:
                              data[e].read_status === true
                                ? "white"
                                : "#e4e3f8",
                          }}
                          onClick={() =>
                            handleRedirect(data[e].url, data[e]._id)
                          }
                        >
                          <FlexLayout
                            halign="start"
                            spacing={"tight"}
                            wrap={"noWrap"}
                          >
                            <Button type="Plain" thickness="thin">
                              {" "}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="15"
                                height="15"
                                viewBox="0 0 30 30"
                                fill="none"
                              >
                                <path
                                  d="M26.25 14.375C26.2543 16.0249 25.8688 17.6524 25.125 19.125C24.243 20.8897 22.8872 22.374 21.2093 23.4116C19.5314 24.4493 17.5978 24.9993 15.625 25C13.9752 25.0043 12.3476 24.6189 10.875 23.875L3.75 26.25L6.125 19.125C5.38116 17.6524 4.9957 16.0249 5 14.375C5.00076 12.4022 5.55076 10.4686 6.5884 8.79072C7.62603 7.11285 9.11032 5.75699 10.875 4.87504C12.3476 4.1312 13.9752 3.74573 15.625 3.75004H16.25C18.8554 3.89378 21.3163 4.99349 23.1614 6.83861C25.0065 8.68373 26.1063 11.1446 26.25 13.75V14.375Z"
                                  stroke="#707070"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </Button>
                            <FlexLayout
                              direction="vertical"
                              spacing={"extraTight"}
                            >
                              <TextStyles
                                utility="inte--textLeft"
                                content={data[e].message}
                              />
                              <FlexLayout
                                halign="start"
                                spacing={"extraTight"}
                                valign={"center"}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  height="13"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm2.293-4.707a.997.997 0 01-.707-.293l-2.293-2.293A.997.997 0 019 10V6a1 1 0 112 0v3.586l2 2a.999.999 0 01-.707 1.707z"
                                    fill="#8D99A4"
                                  />
                                </svg>
                                <TextStyles
                                  type="smallText"
                                  textcolor="light"
                                  content={timeSince(
                                    new Date(data[e].datetime).getTime()
                                  )}
                                />
                                {data[e].read_status === true && (
                                  <span
                                    onClick={() => handleUnread(data[e]._id)}
                                    className="underline-on-hover"
                                  >
                                    {" "}
                                    <TextStyles
                                      type="smallText"
                                      textcolor="light"
                                      content="Mark as Unread"
                                    />{" "}
                                  </span>
                                )}
                                <Button type="Plain" thickness="thin">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    height="15"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M14 4h3a1 1 0 011 1v1H2V5a1 1 0 011-1h3V1.5A1.5 1.5 0 017.5 0h5A1.5 1.5 0 0114 1.5V4zM8 2v2h4V2H8zM3 8h14v10.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 18.5V8zm4 3H5v6h2v-6zm4 0H9v6h2v-6zm2 0h2v6h-2v-6z"
                                      fill="#5C5F62"
                                      height="15"
                                    />
                                  </svg>
                                </Button>
                              </FlexLayout>
                            </FlexLayout>
                          </FlexLayout>
                        </div>
                      );
                    } else if (data[e].type == "Collection") {
                      return (
                        <div
                          key={i}
                          className="Notification-onHover"
                          style={{
                            padding: "10px",
                            marginBottom: "5px",
                            backgroundColor:
                              data[e].read_status === true
                                ? "white"
                                : "#e4e3f8",
                          }}
                          onClick={() =>
                            handleRedirect(data[e].url, data[e]._id)
                          }
                        >
                          <FlexLayout
                            halign="start"
                            spacing={"tight"}
                            wrap={"noWrap"}
                          >
                            <Button type="Plain" thickness="thin">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                height="15"
                              >
                                <path
                                  d="M6.948.001C7.342.001 7.72.16 8 .44l1.477 1.68-3.638 4.12a3.568 3.568 0 00-.872 2.33V18H2.487a1.48 1.48 0 01-1.051-.44A1.507 1.507 0 011 16.5V6.62a1.497 1.497 0 01.377-1l3.48-4L5.897.44A1.48 1.48 0 016.949.001zM14.04 2.44l4.58 5.13c.247.275.383.631.381 1v9.93c0 .399-.159.78-.441 1.062a1.51 1.51 0 01-1.065.439H8.456a1.509 1.509 0 01-1.033-.457A1.497 1.497 0 017 18.5V8.62a1.487 1.487 0 01.382-1l3.524-4.001 1.005-1.18a1.51 1.51 0 012.128 0zm-1.9 5.807a1.51 1.51 0 001.901-.186 1.497 1.497 0 00-.489-2.447 1.512 1.512 0 00-1.641.325 1.498 1.498 0 00.228 2.308z"
                                  fill="#5C5F62"
                                />
                              </svg>
                            </Button>
                            <FlexLayout
                              direction="vertical"
                              spacing={"extraTight"}
                            >
                              <TextStyles
                                utility="inte--textLeft"
                                content={data[e].message}
                              />
                              <FlexLayout
                                halign="start"
                                spacing={"extraTight"}
                                valign={"center"}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  height="13"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm2.293-4.707a.997.997 0 01-.707-.293l-2.293-2.293A.997.997 0 019 10V6a1 1 0 112 0v3.586l2 2a.999.999 0 01-.707 1.707z"
                                    fill="#8D99A4"
                                  />
                                </svg>
                                <TextStyles
                                  utility="inte--textLeft"
                                  type="smallText"
                                  textcolor="light"
                                  content={timeSince(
                                    new Date(data[e].datetime).getTime()
                                  )}
                                />
                                {data[e].read_status === true && (
                                  <span
                                    onClick={() => handleUnread(data[e]._id)}
                                    className="underline-on-hover"
                                  >
                                    {" "}
                                    <TextStyles
                                      utility="inte--textLeft"
                                      type="smallText"
                                      textcolor="light"
                                      content="Mark as Unread"
                                    />{" "}
                                  </span>
                                )}
                              </FlexLayout>
                            </FlexLayout>
                          </FlexLayout>
                        </div>
                      );
                    } else if (data[e].type == "Product") {
                      return (
                        <div
                          key={i}
                          className="Notification-onHover"
                          style={{
                            padding: "10px",
                            marginBottom: "5px",
                            backgroundColor:
                              data[e].read_status === true
                                ? "white"
                                : "#e4e3f8",
                          }}
                          onClick={() =>
                            handleRedirect(data[e].url, data[e]._id)
                          }
                        >
                          <FlexLayout
                            halign="start"
                            spacing={"tight"}
                            wrap={"noWrap"}
                          >
                            <Button type="Plain" thickness="thin">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                height="15"
                              >
                                <path
                                  d="M10.293 1.293A1 1 0 0111 1h7a1 1 0 011 1v7a1 1 0 01-.293.707l-9 9a1 1 0 01-1.414 0l-7-7a1 1 0 010-1.414l9-9zM15.5 6a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                                  fill="#5C5F62"
                                />
                              </svg>
                            </Button>
                            <FlexLayout
                              direction="vertical"
                              spacing={"extraTight"}
                            >
                              <TextStyles
                                utility="inte--textLeft"
                                content={data[e].message}
                              />
                              <FlexLayout
                                halign="start"
                                spacing={"extraTight"}
                                valign={"center"}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  height="13"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm2.293-4.707a.997.997 0 01-.707-.293l-2.293-2.293A.997.997 0 019 10V6a1 1 0 112 0v3.586l2 2a.999.999 0 01-.707 1.707z"
                                    fill="#8D99A4"
                                  />
                                </svg>
                                <TextStyles
                                  utility="inte--textLeft"
                                  textcolor="light"
                                  type="smallText"
                                  content={timeSince(
                                    new Date(data[e].datetime).getTime()
                                  )}
                                />
                                {data[e].read_status === true && (
                                  <span
                                    onClick={() => handleUnread(data[e]._id)}
                                    className="underline-on-hover"
                                  >
                                    {" "}
                                    <TextStyles
                                      utility="inte--textLeft"
                                      type="smallText"
                                      textcolor="light"
                                      content="Mark as Unread"
                                    />{" "}
                                  </span>
                                )}
                              </FlexLayout>
                            </FlexLayout>
                          </FlexLayout>
                        </div>
                      );
                    } else if (data[e].type == "Account") {
                      return (
                        <div
                          key={i}
                          className="Notification-onHover"
                          style={{
                            padding: "10px",
                            marginBottom: "5px",
                            backgroundColor:
                              data[e].read_status === true
                                ? "white"
                                : "#e4e3f8",
                          }}
                          onClick={() =>
                            handleRedirect(data[e].url, data[e]._id)
                          }
                        >
                          <FlexLayout
                            halign="start"
                            spacing="tight"
                            wrap={"noWrap"}
                          >
                            <Button type="Plain" thickness="thin">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                height="15"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 0c5.514 0 10 4.486 10 10s-4.486 10-10 10S0 15.514 0 10 4.486 0 10 0zm6.24 15a7.99 7.99 0 01-12.48 0 7.99 7.99 0 0112.48 0zM10 10a3 3 0 100-6 3 3 0 000 6z"
                                  fill="#5C5F62"
                                />
                              </svg>
                            </Button>
                            <FlexLayout
                              direction="vertical"
                              spacing={"extraTight"}
                            >
                              <TextStyles
                                utility="inte--textLeft"
                                content={data[e].message}
                              />
                              <FlexLayout
                                halign="start"
                                spacing={"extraTight"}
                                valign={"center"}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  height="13"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm2.293-4.707a.997.997 0 01-.707-.293l-2.293-2.293A.997.997 0 019 10V6a1 1 0 112 0v3.586l2 2a.999.999 0 01-.707 1.707z"
                                    fill="#8D99A4"
                                  />
                                </svg>
                                <TextStyles
                                  utility="inte--textLeft"
                                  textcolor="light"
                                  type="smallText"
                                  content={timeSince(
                                    new Date(data[e].datetime).getTime()
                                  )}
                                />
                                {data[e].read_status === true && (
                                  <span
                                    onClick={() => handleUnread(data[e]._id)}
                                    className="underline-on-hover"
                                  >
                                    {" "}
                                    <TextStyles
                                      utility="inte--textLeft"
                                      type="smallText"
                                      textcolor="light"
                                      content="Mark as Unread"
                                    />{" "}
                                  </span>
                                )}
                              </FlexLayout>
                            </FlexLayout>
                          </FlexLayout>
                        </div>
                      );
                    } else if (data[e].type == "Order") {
                      return (
                        <div
                          key={i}
                          className="Notification-onHover"
                          style={{
                            padding: "10px",
                            marginBottom: "5px",
                            backgroundColor:
                              data[e].read_status === true
                                ? "white"
                                : "#e4e3f8",
                          }}
                          onClick={() =>
                            handleRedirect(data[e].url, data[e]._id)
                          }
                        >
                          <FlexLayout
                            halign="start"
                            spacing="tight"
                            wrap={"noWrap"}
                          >
                            <Button type="Plain" thickness="thin">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                height="15"
                              >
                                <path
                                  d="M11 1a1 1 0 10-2 0v7.586L7.707 7.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 8.586V1z"
                                  fill="#5C5F62"
                                />
                                <path
                                  d="M3 14V3h4V1H2.5A1.5 1.5 0 001 2.5v15A1.5 1.5 0 002.5 19h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0017.5 1H13v2h4v11h-3.5c-.775 0-1.388.662-1.926 1.244l-.11.12A1.994 1.994 0 0110 16a1.994 1.994 0 01-1.463-.637l-.111-.12C7.888 14.664 7.275 14 6.5 14H3z"
                                  fill="#5C5F62"
                                />
                              </svg>
                            </Button>
                            <FlexLayout
                              direction="vertical"
                              spacing={"extraTight"}
                            >
                              <TextStyles
                                utility="inte--textLeft"
                                content={data[e].message}
                              />
                              <FlexLayout
                                halign="start"
                                spacing={"extraTight"}
                                valign={"center"}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  height="13"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm2.293-4.707a.997.997 0 01-.707-.293l-2.293-2.293A.997.997 0 019 10V6a1 1 0 112 0v3.586l2 2a.999.999 0 01-.707 1.707z"
                                    fill="#8D99A4"
                                  />
                                </svg>
                                <TextStyles
                                  utility="inte--textLeft"
                                  textcolor="light"
                                  type="smallText"
                                  content={timeSince(
                                    new Date(data[e].datetime).getTime()
                                  )}
                                />
                                {data[e].read_status === true && (
                                  <span
                                    onClick={() => handleUnread(data[e]._id)}
                                    className="underline-on-hover"
                                  >
                                    {" "}
                                    <TextStyles
                                      utility="inte--textLeft"
                                      type="smallText"
                                      textcolor="light"
                                      content="Mark as Unread"
                                    />{" "}
                                  </span>
                                )}
                              </FlexLayout>
                            </FlexLayout>
                          </FlexLayout>
                        </div>
                      );
                    } else if (data[e].type == "Transaction") {
                      return (
                        <div
                          key={i}
                          className="Notification-onHover"
                          style={{
                            padding: "10px",
                            marginBottom: "5px",
                            backgroundColor:
                              data[e].read_status === true
                                ? "white"
                                : "#e4e3f8",
                          }}
                          onClick={() =>
                            handleRedirect(data[e].url, data[e]._id)
                          }
                        >
                          <FlexLayout
                            halign="start"
                            spacing="tight"
                            wrap={"noWrap"}
                          >
                            <Button type="Plain" thickness="thin">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="15"
                                height="15"
                                viewBox="0 0 30 30"
                                fill="none"
                              >
                                <path
                                  d="M15 1.25V28.75"
                                  stroke="#707070"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M21.25 6.25H11.875C10.7147 6.25 9.60188 6.71094 8.78141 7.53141C7.96094 8.35188 7.5 9.46468 7.5 10.625C7.5 11.7853 7.96094 12.8981 8.78141 13.7186C9.60188 14.5391 10.7147 15 11.875 15H18.125C19.2853 15 20.3981 15.4609 21.2186 16.2814C22.0391 17.1019 22.5 18.2147 22.5 19.375C22.5 20.5353 22.0391 21.6481 21.2186 22.4686C20.3981 23.2891 19.2853 23.75 18.125 23.75H7.5"
                                  stroke="#707070"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </Button>
                            <FlexLayout
                              direction="vertical"
                              spacing={"extraTight"}
                            >
                              <TextStyles
                                utility="inte--textLeft"
                                content={data[e].message}
                              />
                              <FlexLayout halign="start" spacing={"extraTight"}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="15"
                                  height="15"
                                  viewBox="0 0 30 30"
                                  fill="none"
                                >
                                  <path
                                    d="M15 1.25V28.75"
                                    stroke="#707070"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M21.25 6.25H11.875C10.7147 6.25 9.60188 6.71094 8.78141 7.53141C7.96094 8.35188 7.5 9.46468 7.5 10.625C7.5 11.7853 7.96094 12.8981 8.78141 13.7186C9.60188 14.5391 10.7147 15 11.875 15H18.125C19.2853 15 20.3981 15.4609 21.2186 16.2814C22.0391 17.1019 22.5 18.2147 22.5 19.375C22.5 20.5353 22.0391 21.6481 21.2186 22.4686C20.3981 23.2891 19.2853 23.75 18.125 23.75H7.5"
                                    stroke="#707070"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <TextStyles
                                  utility="inte--textLeft"
                                  textcolor="light"
                                  type="smallText"
                                  content={timeSince(
                                    new Date(data[e].datetime).getTime()
                                  )}
                                />
                                {data[e].read_status === true && (
                                  <span
                                    onClick={() => handleUnread(data[e]._id)}
                                    className="underline-on-hover"
                                  >
                                    {" "}
                                    <TextStyles
                                      type="smallText"
                                      textcolor="light"
                                      content="Mark as Unread"
                                    />{" "}
                                  </span>
                                )}
                              </FlexLayout>
                            </FlexLayout>
                          </FlexLayout>
                        </div>
                      );
                    } else if (data[e].type == "Membership") {
                      return (
                        <div
                          key={i}
                          className="Notification-onHover"
                          style={{
                            padding: "10px",
                            marginBottom: "5px",
                            backgroundColor:
                              data[e].read_status === true
                                ? "white"
                                : "#e4e3f8",
                          }}
                          onClick={() =>
                            handleRedirect(data[e].url, data[e]._id)
                          }
                        >
                          <FlexLayout
                            halign="start"
                            spacing={"tight"}
                            wrap={"noWrap"}
                          >
                            <Button type="Plain" thickness="thin">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="15"
                                height="15"
                                viewBox="0 0 30 30"
                                fill="none"
                              >
                                <path
                                  d="M15 18.75C19.8325 18.75 23.75 14.8325 23.75 10C23.75 5.16751 19.8325 1.25 15 1.25C10.1675 1.25 6.25 5.16751 6.25 10C6.25 14.8325 10.1675 18.75 15 18.75Z"
                                  stroke="#707070"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M10.2625 17.3625L8.75 28.75L15 25L21.25 28.75L19.7375 17.35"
                                  stroke="#707070"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </Button>
                            <FlexLayout
                              direction="vertical"
                              spacing={"extraTight"}
                            >
                              <TextStyles
                                utility="inte--textLeft"
                                content={data[e].message}
                              />
                              <FlexLayout
                                halign="start"
                                spacing="extraTight"
                                valign={"center"}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  height="13"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm2.293-4.707a.997.997 0 01-.707-.293l-2.293-2.293A.997.997 0 019 10V6a1 1 0 112 0v3.586l2 2a.999.999 0 01-.707 1.707z"
                                    fill="#8D99A4"
                                  />
                                </svg>
                                <TextStyles
                                  utility="inte--textLeft"
                                  textcolor="light"
                                  type="smallText"
                                  content={timeSince(
                                    new Date(data[e].datetime).getTime()
                                  )}
                                />
                                {data[e].read_status === true && (
                                  <span
                                    onClick={() => handleUnread(data[e]._id)}
                                    className="underline-on-hover"
                                  >
                                    {" "}
                                    <TextStyles
                                      utility="inte--textLeft"
                                      type="smallText"
                                      textcolor="light"
                                      content="Mark as Unread"
                                    />{" "}
                                  </span>
                                )}
                              </FlexLayout>
                            </FlexLayout>
                          </FlexLayout>
                        </div>
                      );
                    }
                  })}
                </div>
              </Popover>
            </FlexLayout>
          }
          connectLeft={
            <>
              <img width={"40"} src="https://i.imgur.com/u8AMF3B.png" />
            </>
          }
          // connectLeft={
          //   <b style={{ fontSize: "16px" }} className="pl-4">
          //     {"Welcome " +
          //       userName.charAt(0).toUpperCase() +
          //       userName.slice(1)}
          //   </b>
          // }
          account={{
            name: profileName,
            userPopoverMenu: (
              <>
                <FlexLayout
                  childWidth="fullWidth"
                  direction="vertical"
                  spacing="loose"
                  valign="center"
                >
                  <Button
                    type="Plain"
                    onClick={() => {
                      props.history.push("/profile");
                    }}
                  >
                    Account
                  </Button>
                  <Button
                    type="Plain"
                    onClick={() => {
                      props.di.globalState.removesessionStorage("vendor_token");
                      props.history.push(
                        `/auth/login/${sessionStorage.getItem("admin_shop_id")||localStorage.getItem("admin_shop_id")}`
                      );
                    }}
                  >
                    Log out
                  </Button>
                </FlexLayout>
              </>
            ),
            // image: profilePicture
          }}
        />

        <Modal
          modalSize="small"
          close={handleOpen}
          heading="Connect with shopify"
          open={modView}
        >
          {" "}
          <div>
            <FlexLayout direction="vertical" spacing="loose">
              <TextField
                type="text"
                thickness="thin"
                value={shopUrl}
                onChange={(e) => setShopUrl(e)}
                name={"Enter Shop URL"}
                showHelp="Example: abc.myshopify.com"
              ></TextField>
              <TextField
                thickness="thin"
                type="text"
                value={Apikey}
                name="API key"
                onChange={(e) => {
                  setApikey(e);
                }}
              ></TextField>
              <TextField
                thickness="thin"
                type="password"
                name="Shared Secret Key"
                value={sharedsecretKey}
                onChange={(e) => setsharedsecretKey(e)}
              ></TextField>
              <TextField
                thickness="thin"
                type="password"
                name="App Password"
                value={SecretKey}
                onChange={(e) => setSecretKey(e)}
              ></TextField>

              <Button
                loading={loading}
                onClick={() => {
                  sendShopURL();
                }}
              >
                Submit
              </Button>
            </FlexLayout>
          </div>
        </Modal>

        {toastUrl && (
          <Toast
            message="Please enter valid Url"
            onDismiss={() => setToastUrl(!toastUrl)}
            timeout={3000}
          />
        )}
        {Menu.length != 0 && (
          <Sidebar
            subMenu={subMenu}
            path={getCurrentPath(props.location.pathname)}
            menu={Menu}
            // menu={(RemoveMemberIcon == "no") ? menuWithoutMember : menu}
            onChange={(e) => onChange(e)}
          />
        )}

        <ToastWrapper>
          {ConnectionToastError && (
            <Toast
              message={MessageConnect}
              onDismiss={() => setConnectionToastError(!ConnectionToastError)}
              type="error"
            />
          )}
          {ConnectionToast && (
            <Toast
              message={MessageConnect}
              onDismiss={() => setConnectionToast(!ConnectionToast)}
              type="success"
            ></Toast>
          )}
        </ToastWrapper>
        <BodyLayout>{renderRoutes()}</BodyLayout>
      </>
    );
  }

  function renderRoutes(): JSX.Element {
    return sessionStorage.getItem("vendor_token") ? (
      <Switch>
        <Route
          exact
          path="/dashboard"
          render={(routeProps) => (
            <Dashboard {...routeProps} currency={currency} />
          )}
        />
        <Route
          exact
          path="/products"
          render={(routeProps) => (
            <Product {...routeProps} connected={connected} />
          )}
        />
        <Route exact path="/products/create" component={Create} />
        <Route exact path="/products/image_grid" component={ImageZip} />
        {connected === "yes" && (
          <Route
            exact
            path="/product_import"
            render={(routeProps) => (
              <Product_import {...routeProps} step={step} />
            )}
          />
        )}

        <Route exact path="/products/:id" component={Create} />
        <Route
          exact
          path="/products/:id/:source_marketplace/:user_id"
          component={Edit}
        />

        <Route exact path="/order" component={Order} />
        <Route exact path="/ship" component={Ship} />
        <Route
          exact
          path="/order/:order_id"
          render={(routeProps) => (
            <ViewOrder
              {...routeProps}
              hideShipButton={hideShipButton}
              currency={currency}
            />
          )}
        />
        <Route
          exact
          path="/order/shipment/:user_id/:order_id"
          component={Shipment}
        />
        <Route exact path="/ship/:shipment_id" component={ViewShip} />
        <Route exact path="/panel/config" component={Config} />
        <Route exact path="/log" component={Activities} />
        <Route exact path="/panel/help" component={Help} />
        <Route exact path="/panel/report" component={Report} />
        <Route
          exact
          path="/report/order"
          render={(routeProps) => (
            <OrderReport {...routeProps} currency={currency} />
          )}
        />
        <Route exact path="/report/product" component={ProductReport} />

        <Route
          exact
          path="/panel/categoryMapping"
          component={CategoryMapping}
        />

        <Route exact path="/faq" component={Faq} />
        <Route
          exact
          path="/category"
          render={(routeProps) => (
            <Category {...routeProps} isCategoryRequested={requestCategory} />
          )}
        />
        <Route
          exact
          path="/onboarding_settings"
          render={(routeProps) => (
            <OnboardingSettings
              {...routeProps}
              hideButton={hideButton}
              currency={currency}
            />
          )}
        />
        <Route
          exact
          path="/setting"
          render={(routeProps) => (
            <Setting
              {...routeProps}
              hideButton={hideButton}
              connected={connected}
              vendorId={vendorId}
              vendorUserId={vendorUserId}
              validSecretKey={validSecretKey}
              getUserDetails={getUserDetails}
            />
          )}
        />
        <Route
          exact
          path="/profile"
          render={(routeProps) => (
            <User_profile
              {...routeProps}
              getSetup={() => {
                renderApp();
              }}
            />
          )}
        />
        <Route exact path="/panel/mapping" component={Mapping} />
        <Route exact path="/panel/createprofile" component={CreateProfile} />
        <Route
          path="/panel/transaction_route"
          render={(routeProps) => (
            <Transaction_route {...routeProps} currency={currency} />
          )}
        />
        <Route
          exact
          path="/transaction/pending"
          render={(routeProps) => (
            <Request_Transaction {...routeProps} currency={currency} />
          )}
        />
        <Route
          exact
          path="/transaction/complete"
          render={(routeProps) => (
            <View_transaction {...routeProps} currency={currency} />
          )}
        />

        <Route
          exact
          path="/transaction/complete/:id"
          component={GetTransaction}
        />
        <Route
          path="/subscription/:subscription_id"
          render={(routeProps) => (
            <SubsHistory {...routeProps} currency={currency} />
          )}
        />
        <Route path="/panel/report" component={Report} />
        <Route
          path="/panel/subscription_route"
          component={Subscription_route}
        />
        <Route exact path="/variant" component={ViewVariant} />
        <Route
          path="/subscription"
          render={(routeProps) => (
            <ListSubscription {...routeProps} currency={currency} />
          )}
        />
        <Route
          exact
          path="/myplans"
          render={(routeProps) => (
            <MyPlans {...routeProps} currency={currency} />
          )}
        />
        {/* <Route exact path="/panel/review" component={Review} />
        <Route exact path="/panel/verify" component={Verify} /> */}
        <Route exact path="/message" component={Message} />
        <Route exact path="/message/compose" component={Compose} />
        <Route
          exact
          path="/panel/message/composeMessage"
          component={ComposeMessage}
        />
        <Route exact path="/message/:chatid" component={Chat} />

        {parseInt(basic.stepActive) === 2 || step === 2 ? (
          <Redirect path="**" to="/onboarding_settings" />
        ) : parseInt(basic.stepActive) === 3 || step === 3 ? (
          <Redirect path="**" to="/product_import" />
        ) : parseInt(basic.stepActive) === 4 || connected === "yes" ? (
          <Redirect path="**" to="/dashboard" />
        ) : (
          <RenderSkeleton />
        )}
      </Switch>
    ) : (
      <Switch>
        <Redirect
          to={`/auth/login/${sessionStorage.getItem("admin_shop_id")||localStorage.getItem("admin_shop_id")}`}
        />
      </Switch>
    );
  }
}

function RenderSkeleton() {
  return (
    <BodyLayout>
      <PageHeader>Loading....</PageHeader>
      <PageLoader />
      <Card>
        <BodyHeader title="Loading...." />
        <br />
        <Skeleton line={4} type={"line"} width={""} height="" />
        <br />
        <Skeleton line={2} type={"line"} width={""} height="" />
        <br />
        <Skeleton line={4} type={"line"} width={""} height="" />
      </Card>
    </BodyLayout>
  );
}

export default DI(Panel, { func: { syncNecessaryInfo, syncConnectorInfo } });
interface ToastWrapperI {
  children: React.ReactNode;
}
class ToastWrapper extends Component<ToastWrapperI> {
  constructor(props: ToastWrapperI) {
    super(props);

    this.state = {};
  }

  render() {
    // const children = React.Children.toArray(this.props.children);
    return <div className={"inte-toast--Wrapper"}>{this.props.children}</div>;
  }
}
