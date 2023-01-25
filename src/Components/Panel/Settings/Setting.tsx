/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  TextField,
  Select,
  Accordion,
  PageHeader,
  Toast,
  ChoiceList,
  FlexLayout,
  Modal,
  LRLayout,
  FormChild,
  ToastWrapper,
  Skeleton,
} from "@cedcommerce/ounce-ui";
import { DI } from "./../../../Core";
import "./Setting.css";

function Setting(Props: any): JSX.Element {
  const [data, setData] = useState<any>({});
  const [Loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [apiEyeToggle, setApiEyeToggle] = useState(false);
  const [tokenEyeToggle, setTokenEyeToggle] = useState(false);
  const [saveData1, setSaveData1] = useState<any>({});
  const [loader, setLoader] = useState(false);
  const [modal, setModal] = useState(false);
  const [exportVal, setExportVal] = useState("");
  const [validOrNot, setValidOrNot] = useState(true);
  const [syncLoader, setSyncLoader] = useState<boolean>();
  const [renderToggle, setRenderToggle] = useState(false);
  const [skeltonShow, setSkeltonShow] = useState(true);
  const [type, setType] = useState("");
  const [connectShopify, setConnectShopify] = useState(false);
  const [error, setError] = useState(false);
  const [Apikey, setApikey] = useState("");
  const [shopUrl, setShopUrl] = useState("");
  const [SecretKey, setSecretKey] = useState("");
  const [sharedsecretKey, setsharedsecretKey] = useState("");
  const temp = saveData1;

  function setSaveData(code: string, value: string) {
    temp[code] = value;
    setSaveData1(temp);
    setRenderToggle(!renderToggle);
  }

  function getData() {
    Props.di
      .GET(`connector/config/getVendorSetting?framework=${"shopify_vendor"}`)
      .then((e: any) => {
        if (e.success) {
          if (Props.connected === "yes") {
            setData(e.data);
          } else {
            const settingData = e.data;
            delete settingData["Product Setting"];
            setData(e.data);
          }
          const shippingObj: any = {};
          setSkeltonShow(false);
          Object.values(e.data["Shipping Methods"]["Offline Shipping"]).map(
            (key: any) => {
              shippingObj[key.code] = key["value"];
              setSaveData1(shippingObj);
            }
          );
        }
      });
  }

  function setSave() {
    setLoading(true);
    if (validOrNot) {
      Props.di
        .POST("connector/config/vendorSetting", {
          framework: "shopify_vendor",
          data: temp,
        })

        .then((e: any) => {
          if (e.success) {
            Props.getUserDetails();

            setError(true);
            getData();
            const tem = e.message;
            setMessage(tem);
            setType("success");
          }
          setLoading(false);
        });
    } else {
      setError(true);
      setType("error");
      setLoading(false);
      setMessage("Please fill details correctly.");
    }
  }

  useEffect(() => {
    getData();
    Props.hideButton && Props.validSecretKey && validateTokenData();
    Props.getUserDetails();
  }, []);

  const handleOpen = () => {
    setModal(!modal);
  };

  function sendShopURL() {
    setLoader(true);
    if (shopUrl != "" && shopUrl.includes(".myshopify.com") != true) {
      // setToastUrl(true);
    } else {
      // props.history.push('/panel/categoryMapping');
      setLoading(true);
      const data = {
        shop_url: shopUrl,
        api_key: Apikey,
        access_token: SecretKey,
        shared_secret_key: sharedsecretKey,
      };
      Props.di.POST("/frontend/app/connectWithShopify", data).then((e: any) => {
        if (e.success) {
          // window.open(e.redirect_url)
          // setConnectionToast(true);

          Props.getUserDetails();
          // setHideButton(true);
          setMessage(e.message);
          setError(true);
          setType("success");
          setModal(false);
          setLoader(false);
        } else {
          // setConnectionToastError(true);
          // setHideButton(false)
          setLoader(false);
          setError(true);
          setType("error");
          setMessage(e.message);
        }
        setLoading(false);
      });
    }
  }

  const validateTokenData = () => {
    Props.di
      .GET("frontend/admin/getAllVendorsShops", {
        count: 10,
        activePage: 1,
        "filter[_id][1]": Props.remoteShopId,
      })
      .then((e: any) => {
        if (e.success) {
          setApikey(e.data[0].api_key || "");
          setShopUrl(e.data[0].shop_url || "");
          setsharedsecretKey(e.data[0].secret_key || "");
          setSecretKey(e.data[0].token || "");
        }
      });
  };

  const ShippingSync = () => {
    Props.di
      .GET("connector/vendor/syncPriceForLiveProducts", {
        user_id: Props.vendorUserId,
        marketplace: "shopify",
      })
      .then((e: any) => {
        setSyncLoader(false);
        if (e.success) {
          Props.getUserDetails();
          setType("success");
          setError(true);
          setMessage(e.message);
          // setTimeout(() => {
          //   Props.history.push("/log");
          // }, 1000);
        } else {
          setType("error");
          setError(true);
          setMessage(e.message);
        }
      });
  };

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
      <Modal
        modalSize="small"
        close={handleOpen}
        heading="Connect with shopify"
        open={modal}
      >
        <div>
          <FlexLayout direction="vertical" spacing="loose">
            <TextField
              type="text"
              thickness="thin"
              value={shopUrl}
              onChange={(e) => setShopUrl(e.trim())}
              name={"Enter Shop URL"}
              showHelp="Example: abc.myshopify.com"
            ></TextField>
            <TextField
              thickness="thin"
              type="text"
              value={Apikey}
              name="API key"
              autocomplete="new-password"
              onChange={(e) => {
                setApikey(e.trim());
              }}
            ></TextField>
            <TextField
              thickness="thin"
              type={apiEyeToggle ? "text" : "password"}
              name="Shared Secret Key"
              suffix={
                apiEyeToggle ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    height={20}
                    onClick={() => {
                      setApiEyeToggle(false);
                    }}
                  >
                    <path d="M10 12a2 2 0 0 0 2-2c0-.178-.03-.348-.074-.512l5.781-5.781a.999.999 0 1 0-1.414-1.414l-2.61 2.61a7.757 7.757 0 0 0-3.683-.903c-5.612 0-7.837 5.399-7.929 5.628a1.017 1.017 0 0 0 0 .744c.054.133.835 2.011 2.582 3.561l-2.36 2.36a.999.999 0 1 0 1.414 1.414l5.781-5.781c.164.043.334.074.512.074zm-4-2a4 4 0 0 1 4-4c.742 0 1.432.208 2.025.561l-1.513 1.513a2.004 2.004 0 0 0-.512-.074 2 2 0 0 0-2 2c0 .178.031.347.074.511l-1.513 1.514a3.959 3.959 0 0 1-.561-2.025zm10.145-3.144-2.252 2.252c.064.288.106.585.106.893a4 4 0 0 1-4 4 3.97 3.97 0 0 1-.89-.108l-1.682 1.68a7.903 7.903 0 0 0 2.573.427c5.613 0 7.837-5.399 7.928-5.629a1.004 1.004 0 0 0 0-.742c-.044-.111-.596-1.437-1.784-2.773z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    height={20}
                    onClick={() => {
                      setApiEyeToggle(true);
                    }}
                  >
                    <path d="M17.928 9.628c-.091-.229-2.317-5.628-7.928-5.628s-7.838 5.399-7.93 5.628a1.017 1.017 0 0 0 0 .744c.093.229 2.319 5.628 7.93 5.628s7.837-5.399 7.928-5.628a1.017 1.017 0 0 0 0-.744zm-7.928 4.372a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6a2 2 0 1 0 .002 4.001 2 2 0 0 0-.003-4.001z" />
                  </svg>
                )
              }
              value={sharedsecretKey}
              autocomplete="new-password"
              onChange={(e) => setsharedsecretKey(e.trim())}
            ></TextField>
            <TextField
              thickness="thin"
              type={tokenEyeToggle ? "text" : "password"}
              name="Access Token"
              value={SecretKey}
              suffix={
                tokenEyeToggle ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    height={20}
                    onClick={() => {
                      setTokenEyeToggle(false);
                    }}
                  >
                    <path d="M10 12a2 2 0 0 0 2-2c0-.178-.03-.348-.074-.512l5.781-5.781a.999.999 0 1 0-1.414-1.414l-2.61 2.61a7.757 7.757 0 0 0-3.683-.903c-5.612 0-7.837 5.399-7.929 5.628a1.017 1.017 0 0 0 0 .744c.054.133.835 2.011 2.582 3.561l-2.36 2.36a.999.999 0 1 0 1.414 1.414l5.781-5.781c.164.043.334.074.512.074zm-4-2a4 4 0 0 1 4-4c.742 0 1.432.208 2.025.561l-1.513 1.513a2.004 2.004 0 0 0-.512-.074 2 2 0 0 0-2 2c0 .178.031.347.074.511l-1.513 1.514a3.959 3.959 0 0 1-.561-2.025zm10.145-3.144-2.252 2.252c.064.288.106.585.106.893a4 4 0 0 1-4 4 3.97 3.97 0 0 1-.89-.108l-1.682 1.68a7.903 7.903 0 0 0 2.573.427c5.613 0 7.837-5.399 7.928-5.629a1.004 1.004 0 0 0 0-.742c-.044-.111-.596-1.437-1.784-2.773z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    height={20}
                    onClick={() => {
                      setTokenEyeToggle(true);
                    }}
                  >
                    <path d="M17.928 9.628c-.091-.229-2.317-5.628-7.928-5.628s-7.838 5.399-7.93 5.628a1.017 1.017 0 0 0 0 .744c.093.229 2.319 5.628 7.93 5.628s7.837-5.399 7.928-5.628a1.017 1.017 0 0 0 0-.744zm-7.928 4.372a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6a2 2 0 1 0 .002 4.001 2 2 0 0 0-.003-4.001z" />
                  </svg>
                )
              }
              onChange={(e) => setSecretKey(e.trim())}
            ></TextField>

            <Button
              loading={loader}
              onClick={() => {
                sendShopURL();
              }}
            >
              Submit
            </Button>
          </FlexLayout>
        </div>
      </Modal>
      <PageHeader
        title="Configurations"
        action={
          <Button
            type="Outlined"
            icon={quesicon}
            iconRound={false}
            thickness="thin"
            onClick={() =>
              window.open(
                "https://docs.cedcommerce.com/shopify/multivendor-marketplace-solution-vendors/?section=configurations-section-of-the-vendor-app"
              )
            }
          >
            Need Help
          </Button>
        }
      />
      {skeltonShow && (
        <Skeleton
          height={"20px"}
          line={10}
          type="line"
          width="100%"
          rounded="20px"
        />
      )}
      {!skeltonShow && Props.connected === "yes" && (
        <Card>
          <LRLayout title="Shopify Settings">
            <FormChild>
              <Accordion
                active={connectShopify}
                title={"Connect with shopify"}
                onClick={() => {
                  setConnectShopify(!connectShopify);
                }}
              >
                {Props.hideButton && !Props.validSecretKey ? (
                  <Button
                    iconRound={false}
                    iconAlign="left"
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        height="20"
                      >
                        <path
                          d="M14 8c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2zm-6 6c0 1.103-.897 2-2 2s-2-.897-2-2 .897-2 2-2 2 .897 2 2zm6-12c-1.858 0-3.411 1.28-3.857 3H10c-2.757 0-5 2.243-5 5v.142c-1.721.447-3 2-3 3.858 0 2.206 1.794 4 4 4s4-1.794 4-4c0-1.858-1.279-3.411-3-3.858V10c0-1.654 1.346-3 3-3h.143c.446 1.72 1.999 3 3.857 3 2.206 0 4-1.794 4-4s-1.794-4-4-4z"
                          fill="#f5f4fd"
                        />
                      </svg>
                    }
                    onClick={() => {
                      handleOpen();
                    }}
                  >
                    Connect with shopify
                  </Button>
                ) : (
                  <Button
                    thickness="thin"
                    type="Small"
                    icon={
                      <svg
                        height="22.027"
                        viewBox="0 0 22.416 22.027"
                        width="22.416"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g
                          id="check-circle"
                          transform="translate(-0.998 -0.982)"
                        >
                          <path
                            d="M22,11.08V12a10,10,0,1,1-5.93-9.14"
                            data-name="Path 35"
                            fill="none"
                            id="Path_35"
                            stroke="#53bf62"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                          <path
                            d="M22,4,12,14.01l-3-3"
                            data-name="Path 36"
                            fill="none"
                            id="Path_36"
                            stroke="#53bf62"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          />
                        </g>
                      </svg>
                    }
                  >
                    Connected With Shopify
                  </Button>
                )}
              </Accordion>
            </FormChild>
          </LRLayout>
        </Card>
      )}

      {!skeltonShow &&
        Object.keys(data).map((e, i) => (
          <Card
            key={i}
            // primaryAction={
            //   e === "Shipping Methods" &&
            //   Props.vendorId && (
            //     <Button
            //       content="Sync Products"
            //       thickness="thin"
            //       loading={syncLoader}
            //       onClick={() => {
            //         setSyncLoader(true);
            //         ShippingSync();
            //       }}
            //     >
            //       Sync Products
            //     </Button>
            //   )
            // }

            primaryAction={
              e === "Shipping Methods" &&
              Props.vendorId && {
                loading: syncLoader,
                thickness: "thin",
                content: "Sync Products",
                onClick: () => {
                  setSyncLoader(true);
                  ShippingSync();
                },
              }
            }
          >
            <LRLayout
              key={i}
              title={
                // e === "Shipping Methods" && Props.vendorId ? (
                //   <FlexLayout
                //     direction="none"
                //     spacing="extraLoose"
                //     halign="center"
                //     valign="center"
                //   >
                //     <span
                //       style={{
                //         fontSize: "24px",
                //         fontWeight: 700,
                //       }}
                //     >
                //       {e}
                //     </span>
                //     <Button
                //       thickness="thin"
                //       loading={syncLoader}
                //       onClick={() => {
                //         setSyncLoader(true);
                //         ShippingSync();
                //       }}
                //     >
                //       Sync Products
                //     </Button>
                //   </FlexLayout>
                // ) : (
                e
                // )
              }
            >
              {Object.keys(data[e]).map((e1, i1) => (
                <RenderCard
                  card_title={e}
                  key={i1 + " " + i}
                  i={i1 + " " + i}
                  e={e1}
                  data={data[e][e1]}
                  props={Props}
                  set={setSaveData}
                  setValidOrNot={setValidOrNot}
                  setExport={setExportVal}
                  exportVal={exportVal}
                  saveData1={saveData1}
                />
              ))}
            </LRLayout>
          </Card>
        ))}

      {!skeltonShow && (
        <Card cardType={"plain"}>
          <FlexLayout halign={"fill"}>
            <div></div>
            <Button
              content={"Save"}
              loading={Loading}
              type="Primary"
              thickness="thin"
              onClick={() => {
                setSave();
              }}
            ></Button>
          </FlexLayout>
        </Card>
      )}

      <ToastWrapper>
        {error && (
          <Toast
            timeout={3000}
            message={message}
            type={type}
            onDismiss={() => {
              setError(!error);
            }}
          />
        )}
      </ToastWrapper>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RenderCard({
  e,
  data,
  props,
  set,
  setExport,
  exportVal,
  setValidOrNot,
  saveData1,
}: any): JSX.Element {
  const [data1, setdata1] = useState<any>([]);

  let temp: any = [];
  useEffect(() => {
    if (e === "Offline Shipping") {
      temp = data.filter((item: any) => {
        if (
          saveData1["/general/shippingMethods/offline_shipping_active"] ==
            "no" ||
          saveData1["/general/shippingMethods/offline_shipping_active"] == ""
        ) {
          return (
            item.code === "/general/shippingMethods/offline_shipping_active"
          );
        } else {
          if (
            saveData1["/general/shippingMethods/ship_to_countries"] == "all"
          ) {
            if (item.code === "/general/shippingMethods/allowed_countries") {
              return false;
            }
          }
          if (
            saveData1["/general/shippingMethods/default_shipping_rate"] ==
              "no" ||
            saveData1["/general/shippingMethods/default_shipping_rate"] == ""
          ) {
            if (
              item.code ===
              "/general/shippingMethods/default_shipping_rate_value"
            ) {
              return false;
            }
          }
          if (
            saveData1["/general/shippingMethods/shippig_pickup_status"] == "no"
          ) {
            if (
              [
                "/general/shippingMethods/shippig_condition",
                "/general/shippingMethods/tbl_rates_export",
                "/general/shippingMethods/tbl_rates_import",
              ].includes(item.code)
            ) {
              return false;
            }
          }
          if (
            saveData1["/general/shippingMethods/weight_based_shipping"] ==
              "no" ||
            saveData1["/general/shippingMethods/weight_based_shipping"] == ""
          ) {
            if (
              [
                "/general/shippingMethods/rates_export",
                "/general/shippingMethods/rates_import",
              ].includes(item.code)
            ) {
              return false;
            }
          }
          if (
            saveData1["/general/shippingMethods/default_shipping_rate"] ==
            "none"
          ) {
            if (
              item.code ===
              "/general/shippingMethods/default_shipping_rate_value"
            ) {
              return false;
            }
          }
          if (
            saveData1["/general/shippingMethods/free_shippig_status"] == "no"
          ) {
            if (
              item.code ===
              "/general/shippingMethods/minimum_order_amount_for_free_shipping"
            ) {
              return false;
            }
          }
          if (
            saveData1["/general/shippingMethods/free_shippig_status"] == "no"
          ) {
            if (
              item.code ===
              "/general/shippingMethods/minimum_order_amount_for_free_shipping"
            ) {
              return false;
            }
          }
          return true;
        }
      });
      setdata1(temp);
    } else {
      setdata1(data);
    }
  }, [
    saveData1["/general/shippingMethods/offline_shipping_active"],
    saveData1["/general/shippingMethods/default_shipping_rate"],
    saveData1["/general/shippingMethods/ship_to_countries"],

    saveData1["/general/shippingMethods/weight_based_shipping"],
    saveData1["/general/shippingMethods/shippig_pickup_status"],
    saveData1["/general/shippingMethods/free_shippig_status"],
  ]);

  // useEffect(() => {
  //   if (e === "Bank Transfer") {
  //     if (
  //       data[0].value === "no" ||
  //       saveData1["/general/transactionSetting/bank_transfer_status"] === "no"
  //     ) {
  //       data= data
  //     }
  //   }
  // }, [saveData1["/general/transactionSetting/bank_transfer_status"]]);

  const [country, setcountry] = useState<any>([]);
  const [state, setstate] = useState<any>([]);
  const [city, setcity] = useState<any>([]);
  function getCountryList() {
    state.splice(0);
    country.splice(0);
    city.splice(0);
    props.di.GET("connector/get/countryStateCity").then((e: any) => {
      e.data.map((m: any) => {
        const val = {
          label: m["name"],
          value: m["iso2"],
        };
        setcountry((prev: any) => [...prev, val]);
      });
    });
  }
  // function getCountryStateList(countrycode: string) {
  //   state.splice(0);
  //   city.splice(0);
  //   props.di
  //     .GET("connector/get/countryStateCity?country_code=" + countrycode)
  //     .then((e: any) => {
  //       Object.values(e.data[0].states).map((m: any) => {
  //         const val = {
  //           label: m["name"],
  //           value: m["name"],
  //         };
  //         setstate((prev: any) => [...prev, val]);
  //       });
  //     });
  // }
  // useEffect(() => {
  //   props.di.GET("connector/config/getVendorSetting?framework=shopify_vendor")
  //     .then((e: any) => {
  //       if (e.success) {
  //         setenableOfflineShip(e.data["Shipping Methods"]["Offline Shipping"][0].value);
  //       }
  //     });
  // }, [enableOfflineShip]);
  // function getCountryStateCityList(countrycode: string, statecode: string) {
  //   city.splice(0);
  //   props.di
  //     .GET(
  //       "connector/get/countryStateCity?country_code=" +
  //       countrycode +
  //       "&state_code=" +
  //       statecode
  //     )
  //     .then((e: any) => {
  //       Object.values(e.data.Cities).map((m: any) => {
  //         const val = {
  //           label: m["name"],
  //           value: m["name"],
  //         };
  //         setcity((prev: any) => [...prev, val]);
  //       });
  //     });
  // }
  useEffect(() => {
    getCountryList();
  }, []);
  // useEffect(() => {
  //   if (saveData1["/general/shipping_setting/country"] != "") {
  //     getCountryStateList(saveData1["/general/shipping_setting/country"]);
  //   }
  // }, [set]);
  // useEffect(() => {
  //   if (saveData1["/general/shipping_setting/state_province"] != "") {
  //     getCountryStateCityList(
  //       saveData1["/general/shipping_setting/country"],
  //       saveData1["/general/shipping_setting/state_province"]
  //     );
  //   }
  // }, [set]);
  const [active_toggle, setActive] = useState(false);

  //

  /**
   * use @constant data1 instead of @constant data when giving for client
   * @constant a is for array of objects which consists of data that will be returned.
   */
  let exportConditionVal = "";
  let transactionActive = "";
  Object.values(data).map((val: any) => {
    if (val["code"] === "/general/shippingMethods/shippig_condition") {
      exportConditionVal =
        val["value"] === ""
          ? saveData1["/general/shippingMethods/shippig_condition"]
          : val["value"];
    }
    if (val["code"] === "/general/transactionSetting/bank_transfer_status") {
      transactionActive =
        val["value"] === ""
          ? saveData1["/general/transactionSetting/bank_transfer_status"]
          : val["value"];
    }
  });
  const a = data1.map((e: { [x: string]: string }, index: number) => {
    switch (e["type"]) {
      case "textarea":
        return <RenderText key={index} e={e} setValue={set} />;

      case "text":
        return (
          <RenderText
            key={index}
            e={e}
            setValue={set}
            setValidOrNot={setValidOrNot}
            saveData1={saveData1}
            transactionActive={
              saveData1["/general/transactionSetting/bank_transfer_status"] ||
              transactionActive
            }
          />
        );

      // case "file":
      //   return <RenderFile e={e} props={props} setValue={set} />;

      case "select": {
        // let optionval;
        // if (e.code == "/general/shipping_setting/country") {
        //   optionval = country;
        // } else if (e.code == "/general/shipping_setting/state_province") {
        //   optionval = state;
        // } else if (e.code == "/general/shipping_setting/city") {
        //   if (state.length == 0) {
        //     city.splice(0);
        //   }
        //   optionval = city;
        // }

        return (
          <RenderSelect
            key={index}
            e={e}
            props={props}
            setValue={set}
            saveData1={saveData1}
            setExport={setExport}
            setValidOrNot={setValidOrNot}
            // option={optionval}
          />
        );
      }
      case "button":
        return (
          <RenderButton
            key={index}
            e={e}
            exportVal={exportConditionVal}
            props={props}
          />
        );

      case "multiselect":
        return (
          <RenderMultiSelect
            key={index}
            e={e}
            setValue={set}
            option={country}
          />
        );

      case "number":
        return (
          <RenderNumber
            key={index}
            e={e}
            setValue={set}
            setValidOrNot={setValidOrNot}
          />
        );
    }
  });
  return (
    <FormChild>
      <Accordion
        active={active_toggle}
        title={e}
        onClick={() => {
          setActive(!active_toggle);
        }}
      >
        <div className="mt-10">{a.map((e: React.ReactNode) => e)}</div>
      </Accordion>
    </FormChild>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RenderText({
  e,
  setValue,
  setValidOrNot,
  transactionActive,
  saveData1,
}: any) {
  const [fValue, setFvalue] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [valid, setValid] = useState(false);
  useEffect(() => {
    setFvalue(e.value);
  }, [e.value]);
  useEffect(() => {
    if (transactionActive === "no") {
      setErrorMsg("");
      setValid(true);
      setValidOrNot(true);
    }
  }, [transactionActive]);

  // useEffect(() => {
  //   if (
  //     saveData1["/general/transactionSetting/bank_name"] &&
  //     saveData1["/general/transactionSetting/bank_name"].length < 3
  //   ) {
  //     setErrorMsg("Enter minimum 3 characters.");
  //     setValid(false);
  //     setValidOrNot(false);
  //   }
  // }, [
  //   saveData1["/general/transactionSetting/bank_name"],
  //   saveData1["/general/transactionSetting/bank_transfer_status"],
  // ]);
  return e["title"] === "Bank Name" ||
    e["title"] === "Bank Account Holder Name" ||
    e["title"] === "BSB number" ||
    e["title"] === "Bank Account Number" ? (
    <div>
      {transactionActive === "yes" && (
        <TextField
          name={e["title"]}
          thickness="thin"
          type="text"
          error={error}
          onChange={(r) => {
            if (
              (e.code === "/general/transactionSetting/bank_name" ||
                e.code === "/general/transactionSetting/bank_account_name" ||
                e.code === "/general/transactionSetting/bank_account_number") &&
              transactionActive === "yes"
            ) {
              if (r.length > 2 && r !== "") {
                setFvalue(r);
                setValue(e.code, r);
                setErrorMsg("");
                setValid(true);
                setValidOrNot(true);
              } else {
                setFvalue(r);
                setValue(e.code, r);
                setValidOrNot(false);
                setErrorMsg("Enter minimum 3 characters.");
              }
            } else if (
              e.code === "/general/transactionSetting/bsb_number" &&
              transactionActive === "yes"
            ) {
              if (/[0-9]{3}-?[0-9]{3}/.test(r) && r !== "") {
                setFvalue(r);
                setValue(e.code, r);
                setErrorMsg("");
                setValidOrNot(true);
              } else {
                setFvalue(r);
                setValue(e.code, r);
                setValidOrNot(false);
                setErrorMsg("Please enter valid BSB number");
              }
            } else {
              setFvalue(r);
              setValue(e.code, r);
              setValidOrNot(true);
              setValid(true);
              setErrorMsg("");
            }
          }}
          value={fValue}
        />
      )}
      <span style={{ color: "red" }} className="p-1">
        {errorMsg}
      </span>
    </div>
  ) : (
    <div>
      <TextField
        name={e["title"]}
        thickness="thin"
        type="text"
        error={error}
        onChange={(r) => {
          setFvalue(r);
          setValue(e.code, r);
        }}
        value={fValue}
      />
      <span style={{ color: "red" }} className="p-1">
        {errorMsg}
      </span>
    </div>
  );
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RenderNumber({ e, setValue, setValidOrNot }: any) {
  const [fValue, setFvalue] = useState(e.value);
  const [errorMsg, setErrorMsg] = useState("");

  return (
    <div>
      <TextField
        name={e["title"]}
        thickness="thin"
        type="text"
        error={
          e.code === "/general/shippingMethods/default_shipping_rate_value" &&
          errorMsg !== ""
        }
        onChange={(r: any) => {
          if (
            r === "" &&
            e.code === "/general/shippingMethods/default_shipping_rate_value"
          ) {
            setValidOrNot(false);
            setErrorMsg("Default Shipping Value can't be blank");
            setFvalue(r), setValue(e.code, r);
          } else {
            if (/^\s*(?=.*[1-9])\d*(?:\.\d{0,2})?\s*$/.test(r) || r == "") {
              setValidOrNot(true);
              setErrorMsg("");
              setFvalue(r), setValue(e.code, r);
            }
          }
        }}
        value={fValue}
      />
      <span style={{ color: "red" }} className="p-1">
        {errorMsg}
      </span>
      {/* </Card> */}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RenderSelect({
  e,
  setValue,
  setExport,
  option,
  key,
  props,
  setValidOrNot,
}: any) {
  const [arr, setarr] = useState<Array<{ label: string; value: string }>>([]);
  const [val, setVal] = useState(e.value);
  const options = Object.keys(e.options).map((r) => {
    return { label: e.options[r], value: r };
  });

  useEffect(() => {
    setExport(val);
  }, [val]);

  return (
    <>
      {e["title"] ==
      "Enable automatic product creation on the app from Shopify" ? (
        <Select
          showHelp={true}
          key={key}
          selectHelp={"Only products with Active status will be created"}
          name={e["title"]}
          thickness="thin"
          type="secondary"
          options={options}
          onChange={(t) => {
            setVal(t), setValue(e.code, t), setExport(t);
          }}
          value={val}
        />
      ) : (
        <Select
          name={e["title"]}
          thickness="thin"
          type="secondary"
          key={key}
          showHelp={true}
          selectHelp={
            <span
              style={{ cursor: "pointer", color: "blue" }}
              onClick={() => {
                window.location.href =
                  props.di.environment.API_ENDPOINT.replace("/public/", "/") +
                  e["download_path"];
              }}
            >
              {e["download_path"] ? "Download sample CSV" : ""}
            </span>
          }
          options={Object.keys(e.options).map((r) => {
            return { label: e.options[r], value: r };
          })}
          onChange={(t) => {
            if (e.code === "/general/shippingMethods/default_shipping_rate") {
              if (t === "yes") {
                setValidOrNot(false);
              } else {
                setValidOrNot(true);
              }
            }
            setVal(t), setValue(e.code, t), setExport(t);
          }}
          value={val}
        />
      )}
      <br />
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RenderMultiSelect({ e, setValue, option }: any) {
  const [arr, setarr] =
    useState<Array<{ label: string; value: string }>>(option);
  const [val, setVal] = useState<Array<string>>([]);
  useEffect(() => {
    if (e.value != "") {
      setVal(e.value.split(","));
    }
    Object.keys(e.options).map((r: string) =>
      arr.push({ label: e.options[r], value: r })
    );
  }, []);
  useEffect(() => {
    setarr(option);
  }, [option]);
  useEffect(() => {
    setValue(e.code, val);
  }, [val]);

  return (
    <>
      {/* <Card> */}
      <ChoiceList
        showBadges={true}
        searchEable={true}
        name={e["title"]}
        options={arr}
        value={val}
        thickness="thin"
        type="secondary"
        onChange={(e) => {
          if (val.includes(e)) {
            const index = val.indexOf(e);
            val.splice(index, 1);
            const c = [...val];
            setVal(c);
          } else {
            setVal((prev) => [...prev, e]);
          }
        }}
      />

      <br />
      {/* </Card> */}
    </>
  );
}
function RenderButton({ props, e, exportVal }: any) {
  // const endpoint = props.di.environment.API_ENDPOINT;
  const [selectedFile1, setSelectedFile1] = useState<any>({});
  const [isSelected1, setIsSelected1] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [message1, setMessage1] = useState("");
  const [ErrToast1, setErrToast1] = useState(false);
  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState("");
  const [tableRateKey, setTableRateKey] = useState("");
  const [ErrToast, setErrToast] = useState(false);
  const [ImportLoading, setImportLoading] = useState(false);
  const endpoint = props.di.environment.API_ENDPOINT.replace("/public/", "/");
  const changeHandler = (event: any) => {
    setSelectedFile1(event.target.files[0]);
    setIsSelected1(true);
  };

  const [toast1, setToast1] = useState(false);

  function handleSubmission() {
    setImportLoading(true);
    const formData = new FormData();

    formData.append(tableRateKey, selectedFile1);
    formData.append("framework", "shopify_vendor");

    props.di
      .POST("/connector/get/tableRateImport", formData, false, true)
      .then((e: any) => {
        if (e.success == true) {
          setToast1(true);
          setMessage1(e.message);
          setIsSelected(false);
        } else {
          setErrToast1(true);
          setMessage1(e.message);
          setIsSelected(false);
        }
        setImportLoading(false);
      });
  }

  // const [url, setUrl] = useState("");
  function getData1() {
    props.di
      .GET(
        `connector/get/tableRateExport?framework=${"shopify_vendor"}&current_rule=weight_based&key=${
          e.code
        }`
      )
      .then((e: any) => {
        if (e.success) {
          setToast(true);
          const d = e.data.file_url;
          // window.open(endpoint + d);
          window.location.href = endpoint + d;
          // setUrl("https://devbackend.cedcommerce.com/home/"+d);
          setMessage(e.message);
        } else {
          setErrToast(true);
          setMessage(e.message);
        }
      });
  }

  return (
    <>
      <ToastWrapper>
        {toast && (
          <Toast
            type="success"
            message={message}
            timeout={3000}
            onDismiss={() => setToast(!toast)}
          />
        )}
        {ErrToast && (
          <Toast
            type="error"
            message={message}
            timeout={3000}
            onDismiss={() => setErrToast(!ErrToast)}
          />
        )}
      </ToastWrapper>
      <FlexLayout halign="fill" spacing="loose">
        <div>
          <FlexLayout direction="vertical" spacing="loose">
            <Button
              iconRound={false}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  height="22"
                >
                  <path
                    d="M10.707 2.293a.999.999 0 00-1.414 0l-3 3a.999.999 0 101.414 1.414L9 5.414V13a1 1 0 102 0V5.414l1.293 1.293a.999.999 0 101.414-1.414l-3-3zM3 16a1 1 0 100 2h14a1 1 0 100-2H3z"
                    fill="#5C5F62"
                  />
                </svg>
              }
              onClick={() => {
                getData1();
                // NewWin(),
                // setToast(!toast);
              }}
              type="Outlined"
              thickness="thin"
            >
              {" "}
              Export CSV{" "}
            </Button>
            {/* {exportVal === "" && (
              <TextStyles type="smallText">
                Please select shipping condition before exporting.
              </TextStyles>
            )} */}
          </FlexLayout>
        </div>

        <div>
          <FlexLayout direction="none" halign="start" spacing="loose">
            <Button
              loading={ImportLoading}
              iconRound={false}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  height="22"
                >
                  <path
                    d="M13.707 10.707a.999.999 0 10-1.414-1.414L11 10.586V3a1 1 0 10-2 0v7.586L7.707 9.293a.999.999 0 10-1.414 1.414l3 3a.999.999 0 001.414 0l3-3zM3 16a1 1 0 100 2h14a1 1 0 100-2H3z"
                    fill="#5C5F62"
                  />
                </svg>
              }
              onClick={() => {
                setTableRateKey(e.code);
                setIsSelected(true);
              }}
              thickness="thin"
              type="Outlined"
            >
              Import CSV
            </Button>
            <Modal
              modalSize="small"
              primaryAction={{
                loading: false,
                content: "Import",
                onClick: () => {
                  handleSubmission();
                },
              }}
              secondaryAction={{
                onClick: () => {
                  setIsSelected(false);
                },
              }}
              heading="Import Csv"
              open={isSelected}
              close={() => setIsSelected(!isSelected)}
            >
              <FlexLayout>
                <input
                  multiple
                  id="file-input"
                  accept={".csv"}
                  type="file"
                  onChange={changeHandler}
                />
              </FlexLayout>
            </Modal>

            {/* {isSelected ? (
            <div>
              <TextStyles>Filename: {selectedFile.name}</TextStyles>
              <TextStyles>Filetype: {selectedFile.type}</TextStyles>
              <TextStyles>Size in bytes : {selectedFile.size}</TextStyles>
            
            </div>
          ) : (
              <TextStyles>Select File to show details</TextStyles>
            )} */}
          </FlexLayout>
          <ToastWrapper>
            {toast1 && (
              <Toast
                type="success"
                message={message1}
                timeout={3000}
                onDismiss={() => setToast1(!toast1)}
              />
            )}
            {ErrToast1 && (
              <Toast
                type="error"
                message={message1}
                timeout={3000}
                onDismiss={() => setErrToast1(!ErrToast1)}
              />
            )}
          </ToastWrapper>
        </div>
      </FlexLayout>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// function RenderFile({ props, e }: any): JSX.Element {
//   const [selectedFile1, setSelectedFile1] = useState<any>({});
//   const [isSelected1, setIsSelected1] = useState(false);
//   const [message1, setMessage1] = useState("");
//   const [ErrToast1, setErrToast1] = useState(false);
//   const changeHandler = (event: any) => {
//     setSelectedFile1(event.target.files[0]);
//     setIsSelected1(true);
//   };

//   const [toast1, setToast1] = useState(false);

//   function handleSubmission() {
//     const formData = new FormData();
//     formData.append(e.code, selectedFile1);
//     formData.append("framework", "shopify_vendor");

//     props.di
//       .POST("/connector/get/tableRateImport", formData, false, true)
//       .then((e: any) => {
//         if (e.success == true) {
//           setToast1(true);
//           setMessage1(e.message);
//         } else {
//           setErrToast1(true);
//           setMessage1(e.message);
//         }
//       });
//   }

//   return (
//     <div style={{ marginTop: "10px" }}>
//       <FlexLayout direction='none' halign='start' spacing="loose">
//         <div className='image_upload'>
//           <label htmlFor='file-input'>
//             <svg
//               xmlns='http://www.w3.org/2000/svg'
//               viewBox='0 0 20 20'
//               height='25'
//             >
//               <path
//                 d='M5.243 20a5.228 5.228 0 01-3.707-1.533A5.213 5.213 0 010 14.759c0-1.402.546-2.719 1.536-3.708l9.515-9.519a5.25 5.25 0 018.553 1.7A5.21 5.21 0 0120 5.24a5.208 5.208 0 01-1.535 3.708l-4.258 4.26a3.124 3.124 0 01-5.092-1.012A3.098 3.098 0 018.879 11c0-.835.324-1.619.914-2.208l4.5-4.501a1 1 0 111.414 1.414l-4.5 4.501a1.112 1.112 0 00-.328.794A1.114 1.114 0 0012 12.12c.297 0 .582-.118.793-.327l4.258-4.26A3.223 3.223 0 0018 5.24c0-.866-.337-1.681-.949-2.293a3.248 3.248 0 00-4.586 0L2.95 12.465A3.224 3.224 0 002 14.76c0 .866.338 1.68.95 2.293a3.248 3.248 0 004.586 0l1.757-1.758a1 1 0 111.414 1.414L8.95 18.467A5.236 5.236 0 015.243 20z'
//                 fill='#5C5F62'
//               />
//             </svg>
//           </label>
//           <input
//             multiple
//             id='file-input'
//             accept={".csv"}
//             type='file'
//             onChange={changeHandler}
//           />
//           <FlexLayout halign='start' spacing='loose'>
//             {selectedFile1.length >= 0 &&
//               selectedFile1.map((e: string, i: number) => {
//                 return (
//                   <div key={i} className='container'>
//                     {/* <FlexLayout halign='start' spacing='loose'> */}

//                     <span className='DelBtn'>
//                       <Button
//                         thickness='thin'
//                         type='Plain'
//                         onClick={() => {
//                           const c = selectedFile1.filter(
//                             (e: string, k: number) => k != i
//                           );
//                           setSelectedFile1(c);
//                         }}
//                       >
//                         {
//                           <svg
//                             xmlns='http://www.w3.org/2000/svg'
//                             viewBox='0 0 20 20'
//                             height='15'
//                           >
//                             <path
//                               d='M11.414 10l6.293-6.293a1 1 0 10-1.414-1.414L10 8.586 3.707 2.293a1 1 0 00-1.414 1.414L8.586 10l-6.293 6.293a1 1 0 101.414 1.414L10 11.414l6.293 6.293A.998.998 0 0018 17a.999.999 0 00-.293-.707L11.414 10z'
//                               fill='#5C5F62'
//                             />
//                           </svg>
//                         }
//                       </Button>
//                     </span>
//                     <img
//                       src={URL.createObjectURL(e)}
//                       width='50px'
//                       height='50px'
//                     />
//                   </div>
//                 );
//               })}
//           </FlexLayout>
//         </div>

//         {/* <input accept={".csv"} type="file" onChange={changeHandler} /> */}
//         <Button
//           iconRound={false}
//           icon={
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 20 20"
//               height="22"
//             >
//               <path
//                 d="M13.707 10.707a.999.999 0 10-1.414-1.414L11 10.586V3a1 1 0 10-2 0v7.586L7.707 9.293a.999.999 0 10-1.414 1.414l3 3a.999.999 0 001.414 0l3-3zM3 16a1 1 0 100 2h14a1 1 0 100-2H3z"
//                 fill="#5C5F62"
//               />
//             </svg>
//           }
//           onClick={() => {
//             handleSubmission();
//           }}
//           thickness="thin"
//           type="Outlined"
//         >
//           Import
//             </Button>
//         {/* <Modal heading="Import " open={isSelected} close={() => setIsSelected(!isSelected)} >
//           <TextStyles>Filename: {selectedFile.name}</TextStyles>
//           <TextStyles>Filetype: {selectedFile.type}</TextStyles>
//           <TextStyles>Size in bytes : {selectedFile.size}</TextStyles>
//         </Modal> */}

//         {/* {isSelected ? (
//             <div>
//               <TextStyles>Filename: {selectedFile.name}</TextStyles>
//               <TextStyles>Filetype: {selectedFile.type}</TextStyles>
//               <TextStyles>Size in bytes : {selectedFile.size}</TextStyles>

//             </div>
//           ) : (
//               <TextStyles>Select File to show details</TextStyles>
//             )} */}

//       </FlexLayout>
//       <ToastWrapper>
//         {toast1 && (
//           <Toast
//             type="success"
//             message={message1}
//             timeout={3000}
//             onDismiss={() => setToast1(!toast1)}
//           />
//         )}
//         {ErrToast1 && (
//           <Toast
//             type="error"
//             message={message1}
//             timeout={3000}
//             onDismiss={() => setErrToast1(!ErrToast1)}
//           />
//         )}
//       </ToastWrapper>
//     </div>
//   );
// }

export default DI(Setting);
