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
  TextStyles,
  ChoiceList,
  FlexLayout,
  Modal,
  LRLayout,
  FormChild,
  ToastWrapper,
  ToolTip,
  FilePicker,
  Badge,
  Dots,
} from "@cedcommerce/ounce-ui";
import { DI } from "./../../../Core";
import "./Setting.css";

function Setting(Props: any): JSX.Element {
  const [data, setData] = useState<any>({});
  const [Loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [saveData1, setSaveData1] = useState<any>({});
  const [exportVal, setExportVal] = useState("");
  const [dataSave, setdataSave] = useState({});
  const [ShowError, setShowError] = useState(false);

  const temp = saveData1;
  function setSaveData(code: string, value: string) {
    temp[code] = value;
    setSaveData1(temp);
  }

  function getData() {
    Props.di
      .GET(`connector/config/getVendorSetting?framework=${"shopify_vendor"}`)
      .then((e: any) => {
        setData(e.data);
      });
  }

  function setSave() {
    // setLoading(true);

    if (temp["/general/shippingMethods/offline_shipping_active"] == "yes") {
      if (Object.keys(temp).length >= 6) {
        Save();
      } else {
        setShowError(true);
      }
    } else if (
      temp["/general/shippingMethods/offline_shipping_active"] == "no"
    ) {
      if (Object.keys(temp).length == 2) {
        Save();
      }
      Save();
    } else {
      setShowError(true);
    }
  }

  function Save() {
    setLoading(true);

    Props.di
      .POST("connector/config/vendorSetting", {
        Step_completed: true,
        framework: "shopify_vendor",
        data: temp,
      })

      .then((e: any) => {
        if (e.success) {
          setTimeout(() => Props.history.push("/product_import"), 4000);

          setError(true);
          // getData();
          const tem = e.message;
          setMessage(tem);
        }
        setLoading(false);
      });
  }
  useEffect(() => {
    getData();
  }, []);

  const [error, setError] = useState(false);

  return (
    <div className="inte inte-wrapper inte-onbaord">
      <Card>
        <PageHeader
          action={
            <FlexLayout halign="fill">
              <div className="pb-3 pt-3">
                <FlexLayout spacing="loose">
                  <Dots status="completed" />
                  <Dots status="active" />
                  <Dots status="none" />
                </FlexLayout>
              </div>
            </FlexLayout>
          }
          title={
            <TextStyles type="SubHeading">
              STEP{" "}
              <span className="inte__Subheading inte__font--normal inte__text--light">
                2
              </span>{" "}
              / 3
            </TextStyles>
          }
        ></PageHeader>

        {Object.keys(data).map((e, i) => (
          <Card key={i}>
            <LRLayout key={i} title={e}>
              {Object.keys(data[e]).map((e1, i1) => (
                <RenderCard
                  card_title={e}
                  key={i1 + " " + i}
                  i={i1 + " " + i}
                  e={e1}
                  setdataSave={setdataSave}
                  data={data[e][e1]}
                  props={Props}
                  set={setSaveData}
                  setExport={setExportVal}
                  exportVal={exportVal}
                  saveData1={saveData1}
                />
              ))}
            </LRLayout>
          </Card>
        ))}

        <Card cardType={"plain"}>
          <FlexLayout halign={"fill"}>
            <div></div>
            <Button
              content={"Next"}
              loading={Loading}
              type="Primary"
              thickness="thin"
              onClick={() => {
                setSave();

                // setError(!error);
              }}
            ></Button>
          </FlexLayout>
        </Card>
        <ToastWrapper>
          {error && (
            <Toast
              timeout={3000}
              message={message}
              type="success"
              onDismiss={() => {
                setError(!error);
              }}
            />
          )}
          {ShowError && (
            <Toast
              type="error"
              timeout={5000}
              onDismiss={() => setShowError(!ShowError)}
              message={"Please apply all the settings."}
            />
          )}
        </ToastWrapper>
      </Card>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RenderCard({
  e,
  data,
  props,
  set,
  setdataSave,
  setExport,
  exportVal,
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
          saveData1["/general/shippingMethods/offline_shipping_active"] ==
            undefined
        ) {
          return (
            item.code === "/general/shippingMethods/offline_shipping_active"
          );
        } else {
          if (
            saveData1["/general/shippingMethods/ship_to_countries"] == "all" ||
            saveData1["/general/shippingMethods/ship_to_countries"] == undefined
          ) {
            if (item.code === "/general/shippingMethods/allowed_countries") {
              return false;
            }
          }
          if (
            saveData1["/general/shippingMethods/shippig_pickup_status"] ==
              "no" ||
            saveData1["/general/shippingMethods/shippig_pickup_status"] ==
              undefined
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
            saveData1["/general/shippingMethods/default_shipping_rate"] ==
              "none" ||
            saveData1["/general/shippingMethods/default_shipping_rate"] ==
              undefined
          ) {
            if (
              item.code ===
              "/general/shippingMethods/default_shipping_rate_value"
            ) {
              return false;
            }
          }
          if (
            saveData1["/general/shippingMethods/free_shippig_status"] == "no" ||
            saveData1["/general/shippingMethods/free_shippig_status"] ==
              undefined
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
      setdataSave(temp);
    } else {
      setdata1(data);
      setdataSave(data);
    }
  }, [
    saveData1["/general/shippingMethods/offline_shipping_active"],
    saveData1["/general/shippingMethods/default_shipping_rate"],
    saveData1["/general/shippingMethods/ship_to_countries"],
    saveData1["/general/shippingMethods/shippig_pickup_status"],
    saveData1["/general/shippingMethods/free_shippig_status"],
  ]);

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

  useEffect(() => {
    getCountryList();
  }, []);

  const [active_toggle, setActive] = useState(false);

  /**
   * use @constant data1 instead of @constant data when giving for client
   * @constant a is for array of objects which consists of data that will be returned.
   */
  let exportConditionVal = "";
  Object.values(data).map((val: any) => {
    if (val["code"] === "/general/shippingMethods/shippig_condition") {
      exportConditionVal =
        val["value"] === ""
          ? saveData1["/general/shippingMethods/shippig_condition"]
          : val["value"];
    }
  });
  const a = data1.map((e: { [x: string]: string }, index: number) => {
    switch (e["type"]) {
      case "textarea":
        return <RenderText key={index} e={e} setValue={set} />;

      case "text":
        return <RenderText key={index} e={e} setValue={set} />;

      // case "file":
      //   return <RenderFile e={e} props={props} setValue={set} />;

      case "select": {
        return (
          <RenderSelect
            key={index}
            e={e}
            props={props}
            setValue={set}
            saveData1={saveData1}
            setExport={setExport}
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
        return <RenderNumber key={index} e={e} setValue={set} />;
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
        <div className={"mt-10"}>{a.map((e: React.ReactNode) => e)}</div>
      </Accordion>
    </FormChild>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RenderText({ e, setValue }: any) {
  const [fValue, setFvalue] = useState("");
  useEffect(() => {
    setFvalue(e.value);
  }, [e.value]);

  return (
    <div>
      <FlexLayout direction="vertical" spacing="extraTight">
        <TextStyles>
          {
            <span className="inte__text--neutral   none inte__font--normal">
              {e["title"]} <span style={{ color: "red" }}>*</span>
            </span>
          }{" "}
        </TextStyles>

        <TextField
          // name={e["title"]}
          thickness="thin"
          type="text"
          onChange={(r) => {
            setFvalue(r);
            setValue(e.code, r);
          }}
          value={fValue}
        />
      </FlexLayout>
    </div>
  );
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RenderNumber({ e, setValue }: any) {
  const [fValue, setFvalue] = useState(e.value);
  return (
    <div>
      <FlexLayout direction="vertical" spacing="extraTight">
        <TextStyles>
          {
            <span className="inte__text--neutral   none inte__font--normal">
              {e["title"]} <span style={{ color: "red" }}>*</span>
            </span>
          }{" "}
        </TextStyles>
        <TextField
          thickness="thin"
          type="text"
          onChange={(r: any) => {
            if (
              (r.charCodeAt(r.length - 1) >= 48 &&
                r.charCodeAt(r.length - 1) <= 57) ||
              r == ""
            ) {
              setFvalue(r), setValue(e.code, r);
            }
          }}
          value={fValue}
        />
      </FlexLayout>
      <br />
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RenderSelect({ e, setValue, setExport, option }: any) {
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
        <FlexLayout direction="vertical" spacing="extraTight">
          <TextStyles>
            {
              <span className="inte__text--neutral   none inte__font--normal">
                {e["title"]} <span style={{ color: "red" }}>*</span>
              </span>
            }{" "}
          </TextStyles>
          <Select
            // name={e["title"] + "*"}
            selectHelp={"Only products with Active status will be created"}
            thickness="thin"
            type="secondary"
            showHelp={true}
            options={options}
            onChange={(t) => {
              setVal(t), setValue(e.code, t), setExport(t);
            }}
            value={val}
          />
        </FlexLayout>
      ) : (
        <FlexLayout direction="vertical" spacing="extraTight">
          <TextStyles>
            {
              <span className="inte__text--neutral   none inte__font--normal">
                {e["title"]} <span style={{ color: "red" }}>*</span>
              </span>
            }{" "}
          </TextStyles>
          <Select
            // name={e["title"] + "*"}
            thickness="thin"
            type="secondary"
            options={options}
            onChange={(t) => {
              setVal(t), setValue(e.code, t), setExport(t);
            }}
            value={val}
          />
        </FlexLayout>
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
    formData.append("/general/shippingMethods/tbl_rates_import", selectedFile1);
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
        `connector/get/tableRateExport?framework=${"shopify_vendor"}&current_rule=${exportVal}&key=${
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
      <div className={"mb-10"}>
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
              {exportVal === "" && (
                <TextStyles type="smallText">
                  Please select shipping condition before exporting.
                </TextStyles>
              )}
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
                  // handleSubmission();
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
      </div>
    </>
  );
}

export default DI(Setting);
