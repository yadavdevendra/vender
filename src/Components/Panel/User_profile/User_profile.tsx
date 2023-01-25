/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PageHeader,
  Card,
  TextStyles,
  TextField,
  FlexLayout,
  Button,
  Modal,
  Select,
  LRLayout,
  FormChild,
  ToastWrapper,
  Toast,
  ToolTip,
  ChoiceList,
  Switcher,
  TextArea,
} from "@cedcommerce/ounce-ui";
import DatePicker from "react-datepicker";

import moment from "moment";
import React, { useEffect, useState } from "react";
import { DI } from "../../../Core";
import "./user.css";
function User_profile(Props: any): JSX.Element {
  const [user_data, setUser_data] = useState<any>({});
  const [Form_view, setForm_view] = useState({});
  const [modal, setmodal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("");
  const [ModalVal, setModalVal] = useState();
  const [savevalue, setsavevalue] = useState<any>({});
  const [savefile, setsavefile] = useState<any>([]);
  const [country, setcountry] = useState<any>([]); 
  function getUserProfile() {
    Props.di.GET("/connector/get/getUserProfile").then((e: any) => {
      setUser_data(e.data);
      getUserFormView(e.data.admin_home_id)
    });
  }
  function getUserFormView(id:any) {
    Props.di.GET("connector/get/getFormView",{admin_id:id}).then((e: any) => {
      e.data.forEach((ele: any) => {
        if (ele.code == "user_profile") {
          setForm_view(ele.fieldsets);
        }
      });
    });
  }

  const temp = savevalue;
  function selectedval(code: string, e: string) {
    temp["_id"] = user_data["_id"];
    temp[code] = e;
    setsavevalue(temp);
  }

  function getCountryList() {
    Props.di.GET("connector/get/countryStateCity").then((e: any) => {
      e.data.map((m: any) => {
        const val = {
          label: m["name"],
          value: m["name"],
        };
        setcountry((prev: any) => [...prev, val]);
      });
    });
  }
  useEffect(() => {
    getCountryList();
  }, []);

  console.log("user_data:",user_data["_id"]);
  

  function selectedfile(code: string, e: any) {
    const formdata = new FormData();
    formdata.append(code, e);
    formdata.append("_id", user_data["_id"]);

    setsavefile([...savefile, formdata]);
  }

  useEffect(() => {
    getUserProfile();
  }, [modal]);

  return (
    <>
      <PageHeader title="Account Information"></PageHeader>
      {Object.values(Form_view).map((e: any) => {
        let ButtonData = "Manage";
        return (
          <Card key={e.title}>
            <LRLayout title={e.title}>
              <FlexLayout
                wrap="wrap"
                desktopWidth="50"
                mobileWidth="100"
                tabWidth="50"
                spacing="loose"
              >
                {Object.values(e.fields).map((m, i) => {
                  if (e.code != "manage_password") {
                    ButtonData = "Edit";

                    return (
                      <RenderData
                        {...Props}
                        key={i}
                        p={m}
                        user_data={user_data}
                      />
                    );
                  }
                })}
              </FlexLayout>
            </LRLayout>
            <FlexLayout halign="end">
              <ToolTip helpText="Edit" position="left">
                <Button
                  thickness="thin"
                  iconRound={false}
                  onClick={() => {
                    setmodal(!modal);
                    setModalVal(e.code);
                  }}
                  type="Plain"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    height="22px"
                  >
                    <path
                      d="M14.846 1.403l3.752 3.753.625-.626A2.653 2.653 0 0015.471.778l-.625.625zm2.029 5.472l-3.752-3.753L1.218 15.028 0 19.998l4.97-1.217L16.875 6.875z"
                      fill="#413bbc"
                    />
                  </svg>
                </Button>
              </ToolTip>
              {e.code == ModalVal && (
                <Modal
                  modalSize="small"
                  close={() => {
                    setmodal(!modal);
                    setsavevalue({});
                    setsavefile([]);
                  }}
                  heading={e.title}
                  open={modal}
                  primaryAction={{
                    content: "Save",
                    loading: false,
                    onClick: function savedata() {
                      savefile.map((m1: any) => {
                        Props.di
                          .POST(
                            "/connector/get/vendorProfileFileUploader",
                            m1,
                            false,
                            true
                          )
                          .then((e: any) => {
                            getUserProfile();
                            Props.getSetup();
                          });
                      });
                      const pass = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/;
                      if (
                        "password" in savevalue ||
                        "confirm_password" in savevalue
                      ) {
                        if (
                          savevalue["password"] ===
                          savevalue["confirm_password"]
                        ) {
                          if (savevalue["password"].match(pass)) {
                            const savevalue1: any = {
                              data: {
                                _id: savevalue["_id"],
                                old_password: savevalue["old_password"],
                                password: savevalue["password"],
                              },
                            };
                            Props.di
                              .POST("/connector/get/setUserProfile", savevalue1)
                              .then((e: any) => {
                                if (e.success) {
                                  setmodal(!modal);
                                  setToastMsg(e.message);
                                  setShowToast(true);
                                  setToastType("success");
                                } else {
                                  setmodal(!modal);
                                  setToastMsg(e.message);
                                  setShowToast(true);
                                  setToastType("error");
                                }
                              });
                            setsavevalue({});
                            setsavefile([]);
                          }
                        } else {
                          setmodal(!modal);
                          setToastMsg(
                            "Password and confirm password does not match"
                          );
                          setShowToast(true);
                          setToastType("error");
                        }
                      } else {
                        const savevalue1 = { data: savevalue };
                        Props.di
                          .POST("/connector/get/setUserProfile", savevalue1)
                          .then((e: any) => {
                            e.success && setmodal(!modal);
                          });
                        setsavevalue({});
                        setsavefile([]);
                      }
                    },
                  }}
                  secondaryAction={{
                    content: "Cancel",
                    onClick: function close() {
                      setmodal(!modal);
                      setsavevalue({});
                      setsavefile([]);
                    },
                  }}
                >
                  {" "}
                  {
                    <RenderModaldata
                      country={country}
                      p={e.fields}
                      user_data={user_data}
                      selectedval={selectedval}
                      getUserProfile={getUserProfile}
                      selectedfile={selectedfile}
                      endpoint={Props.di.environment.API_ENDPOINT.replace(
                        "/public/",
                        "/"
                      )}
                    />
                  }
                </Modal>
              )}
            </FlexLayout>
            {showToast && (
              <ToastWrapper>
                <Toast
                  type={toastType}
                  message={toastMsg}
                  onDismiss={() => setShowToast(false)}
                  timeout={3000}
                />
              </ToastWrapper>
            )}
          </Card>
        );
      })}
    </>
  );
}
function RenderModaldata(props: {
  country: any;
  p: any;
  user_data: any;
  selectedval: any;
  selectedfile: any;
  getUserProfile: any;
  endpoint: any;
}) {
  const temp = props.p.sort((a: any, b: any) => {
    return a.position - b.position;
  });

  const a = Object.values(temp).map((m: any) => {
    switch (m.type) {
      case "text":
        return (
          <RenderText
            country={props.country}
            m={m}
            user_data={props.user_data}
            selectedval={props.selectedval}
          />
        );
      case "file":
        return (
          <RenderFile
            m={m}
            user_data={props.user_data}
            selectedfile={props.selectedfile}
            endpt={props.endpoint}
          />
        );
      case "textarea":
        return (
          <RenderTextArea
            country={props.country}
            m={m}
            user_data={props.user_data}
            selectedval={props.selectedval}
          />
        );
      case "email":
        return (
          <RenderText
            country={props.country}
            m={m}
            user_data={props.user_data}
            selectedval={props.selectedval}
          />
        );
      case "number":
        return (
          <RenderNumber
            m={m}
            user_data={props.user_data}
            selectedval={props.selectedval}
          />
        );
      case "select":
        return (
          <RenderSelect
            m={m}
            user_data={props.user_data}
            selectedval={props.selectedval}
          />
        );

      case "multi_select":
        return (
          <RenderMultiSelect
            m={m}
            user_data={props.user_data}
            selectedval={props.selectedval}
          />
        );
      case "password":
        return (
          <RenderPassWord
            m={m}
            user_data={props.user_data}
            selectedval={props.selectedval}
          />
        );

      case "date":
        return (
          <RenderDate
            m={m}
            user_data={props.user_data}
            selectedval={props.selectedval}
          />
        );
      case "yes/no":
        return (
          <RenderSelect
            m={m}
            user_data={props.user_data}
            selectedval={props.selectedval}
          />
        );
    }
  });
  return (
    <>
      <FlexLayout childWidth="fullWidth" direction="vertical" spacing="loose">
        {a}
      </FlexLayout>
    </>
  );
}
function RenderData(props: {
  p: any;
  user_data: { [name: string]: string };
  [name: string]: any;
}) {
  let endpoint = "";
  if (props.p.code == "company_banner" || "profile_picture" || "company_logo") {
    if (props.user_data[props.p.code] != undefined)
      endpoint =
        props.di.environment.API_ENDPOINT + props.user_data[props.p.code];
    if (endpoint.search("/public/") > -1) {
      endpoint = endpoint.replace("/public/", "/");
    }
  }

  return (
    <>
      <Card cardType="plain">
        <TextStyles type="SubHeading">{props.p.title} </TextStyles>
        {props.user_data[props.p.code] != "" &&
        (props.p.code == "company_logo" || props.p.code == "company_banner") ? (
          <img height="80px" width="180px" src={endpoint} />
        ) : props.p.code == "profile_picture" ? (
          <img src={endpoint} height="80px" width="180px" />
        ) : (
          <TextStyles>{props.user_data[props.p.code]} </TextStyles>
        )}
      </Card>
    </>
  );
}

function RenderTextArea(props: {
  country: any;
  m: { [name: string]: any };
  user_data: { [name: string]: string };
  selectedval: any;
}): any {
  const [Textval, setTextval] = useState("");
  return (
    <FormChild>
      <TextArea
        readOnly={props.m.editable != true}
        name={props.m.title}
        rows={1}
        type="textarea"
        onChange={(e) => {
          setTextval(e), props.selectedval(props.m.code, e);
        }}
        value={Textval}
      />
    </FormChild>
  );
}
function RenderText(props: {
  country: any;
  m: { [name: string]: any };
  user_data: { [name: string]: string };
  selectedval: any;
}): any {
  const [Error, setError] = useState(false);
  const [Showhelp, setShowhelp] = useState("");
  const validate = {
    username: /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/,
    email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    Letters: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
    number: /^[0-9]?\d{10}$/,
    decimal: /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/,
    url: /^https?:\/\/[a-zA-Z0-9]+\.myshopify\.com\/$/,
    url1: /^[A-Za-z0-9]+\.myshopify\.com$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
  };

  const [val, setval] = useState("");
  const zipRegex = "";
  useEffect(() => {
    setval(props.user_data[props.m.code]);
  }, [props]);
  function handleChange(element: string) {
    setval(element);
    props.selectedval(props.m.code, element);
    switch (props.m.input_validation) {
      case "email":
        if (element.match(validate.email)) {
          setError(false);
          setShowhelp("");
          if (props.m.unique == true) {
            fetch(
              `https://devbackend.cedcommerce.com/home/connector/vendor/validateAttributeUniqueness?marketplace=shopify&${props.m.code}=${element}`
            )
              .then((ele) => ele.json())
              .then((ele) => {
                if (ele.success) {
                  setShowhelp(`${props.m.title} already exists`);
                  setError(true);
                } else {
                  setShowhelp("");
                  setError(false);
                }
              });
          }
        } else {
          setError(true);
          setShowhelp("Please enter valid email id");
        }
        break;

      //   if (props.m.unique == true) {
      //     fetch(
      //       `https://devbackend.cedcommerce.com/home/connector/vendor/validateAttributeUniqueness?marketplace=shopify&${props.m.code}=${element}`
      //     )
      //       .then((e) => e.json())
      //       .then((ele) => {
      //         if (ele.success) {
      //           setShowhelp(`${props.m.title} already exists`);
      //           setError(true);
      //         } else {
      //           setShowhelp("");
      //           setError(false);
      //         }
      //       });
      //   }
      //   else {
      //     setShowhelp(`Enter valid email id. example@email.com`);
      //     setError(true);
      //   }
      // }
      case "number":
        if (element.match(validate.number)) {
          setError(false);
          setShowhelp("");
          if (props.m.unique == true) {
            fetch(
              `https://devbackend.cedcommerce.com/home/connector/vendor/validateAttributeUniqueness?marketplace=shopify&${props.m.code}=${element}`
            )
              .then((e) => e.json())
              .then((ele) => {
                if (ele.success) {
                  setShowhelp(`${props.m.title} already exists`);

                  setError(true);
                } else {
                  setShowhelp("");
                  setError(false);
                }
              });
          }
        } else {
          setShowhelp(`Enter valid ${props.m.title}.`);
          setError(true);
        }
        break;

      case "decimal":
        if (element.match(validate.decimal)) {
          setError(false);
          setShowhelp("");
          if (props.m.unique == true) {
            fetch(
              `https://devbackend.cedcommerce.com/home/connector/vendor/validateAttributeUniqueness?marketplace=shopify&${props.m.code}=${element}`
            )
              .then((e) => e.json())
              .then((ele) => {
                if (ele.success) {
                  setShowhelp(`${props.m.title} already exists`);

                  setError(true);
                } else {
                  setShowhelp("");
                  setError(false);
                }
              });
          }
        } else {
          setShowhelp(`Enter valid ${props.m.title}.`);
          setError(true);
        }
        break;
      case "Letters(a-z ,A-Z) or number(0-9)":
        if (element.match(validate.username)) {
          setError(false);
          setShowhelp("");
          if (props.m.unique == true) {
            fetch(
              `https://devbackend.cedcommerce.com/home/connector/vendor/validateAttributeUniqueness?marketplace=shopify&${props.m.code}=${element}`
            )
              .then((e) => e.json())
              .then((ele) => {
                if (ele.success) {
                  setShowhelp(`${props.m.title} already exists`);

                  setError(true);
                } else {
                  setShowhelp("");
                  setError(false);
                }
              });
          }
        } else {
          setShowhelp(`Enter valid ${props.m.title}.`);
          setError(true);
        }
        break;
      case "url":
        if (element.match(validate.url) || element.match(validate.url1)) {
          setError(false);
          setShowhelp("");
          if (props.m.unique == true) {
            fetch(
              `https://devbackend.cedcommerce.com/home/connector/vendor/validateAttributeUniqueness?marketplace=shopify&${props.m.code}=${element}`
            )
              .then((e) => e.json())
              .then((ele) => {
                if (ele.success) {
                  setShowhelp(`${props.m.title} already exists`);

                  setError(true);
                } else {
                  setShowhelp("");
                  setError(false);
                }
              });
          }
        } else {
          setShowhelp(`Enter valid ${props.m.title}.`);
          setError(true);
        }
        break;

      case "none":
        if (props.m.unique == true) {
          fetch(
            `https://devbackend.cedcommerce.com/home/connector/vendor/validateAttributeUniqueness?marketplace=shopify&${props.m.code}=${element}`
          )
            .then((e) => e.json())
            .then((ele) => {
              if (ele.success) {
                setShowhelp(`${props.m.title} already exists`);

                setError(true);
              } else {
                setShowhelp("");
                setError(false);
              }
            });
        }
        break;
    }
  }

  switch (props.m.title) {
    case "City":
      return (
        <FormChild>
          {props.m.editable === true && (
            <TextField
              name={props.m.title}
              thickness="thin"
              placeHolder={props.m.default}
              readOnly={props.m.editable != true}
              type="text"
              value={val}
              onChange={(e) => {
                setval(e);
                props.selectedval(props.m.code, e);
              }}
            ></TextField>
          )}
        </FormChild>
      );

    case "Zip/Postal Code":
      return (
        <FormChild>
          {props.m.editable === true && (
            <TextField
              name={props.m.title}
              thickness="thin"
              placeHolder={props.m.default}
              readOnly={props.m.editable != true}
              type="text"
              value={val}
              onChange={(e) => {
                setval(e);
                props.selectedval(props.m.code, e);
              }}
            ></TextField>
          )}
        </FormChild>
      );
    case "State":
      return (
        <FormChild>
          {props.m.editable === true && (
            <TextField
              name={props.m.title}
              thickness="thin"
              placeHolder={props.m.default}
              readOnly={props.m.editable != true}
              type="text"
              value={val}
              onChange={(e) => {
                setval(e);
                props.selectedval(props.m.code, e);
              }}
            ></TextField>
          )}
        </FormChild>
      );

    case "Country":
      return (
        <FormChild>
          {props.m.editable === true && (
            <Select
              options={props.country}
              name={props.m.title}
              thickness="thin"
              value={val}
              onChange={(e) => {
                setval(e);
                props.selectedval(props.m.code, e);
              }}
            />
          )}
        </FormChild>
      );

    default:
      return (
        <FormChild>
          {/* {props.m.editable === true && ( */}
          <TextField
            error={Error}
            showHelp={Showhelp}
            name={props.m.title}
            thickness="thin"
            placeHolder={props.m.default}
            readOnly={props.m.editable != true}
            type="text"
            value={val}
            onChange={(e) => {
              handleChange(e);
            }}
          ></TextField>
          {/* )} */}
        </FormChild>
      );
  }
}
/**
 * @function RenderMultiSelect to handle the multi select.
 * @param props consistes of m array , user_data array and selectedVal to storee the saved value.
 */

function RenderMultiSelect(props: {
  m: { [name: string]: string };
  user_data: { [name: string]: string };
  selectedval: any;
}): JSX.Element {
  const [val, setval] = useState<any>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const [arr, setarr] = useState<Array<{ label: string; value: string }>>([]);
  useEffect(() => {
    Object.keys(props.m.options).map((r: any) => {
      arr.push({ label: props.m.options[r], value: r });
    });
  }, []);
  return (
    <FormChild>
      <ChoiceList
        showHelp={true}
        // selectHelp='Add this product to a collection so it’s easy to find in your store.'
        name={props.m.title}
        searchEable={true}
        thickness="thin"
        placeholder="Search for options"
        options={arr}
        value={val}
        onChange={(t) => {
          if (val.includes(t)) {
            const index = val.indexOf(t);
            val.splice(index, 1);
            const c = [...val];
            setval(c);
            props.selectedval(props.m.code, c);
          } else {
            setval((prev: any) => [...prev, t]);
            // prepareData(val)
            props.selectedval(props.m.code, val);
          }
        }}
      />
    </FormChild>
  );
}

// function RenderYesNo(props: {
//   m: { [name: string]: any };
//   user_data: { [name: string]: string };
//   selectedval: any;
// }): JSX.Element {
//   return (
//     <Switcher name={props.m.title} />
//   )
// }

function RenderDate(props: {
  m: { [name: string]: any };
  user_data: { [name: string]: string };
  selectedval: any;
}): JSX.Element {
  const [startDate, setStartDate] = useState<any>(new Date());

  return (
    <FlexLayout direction="vertical" spacing="loose" valign="start">
      <TextStyles type="mediumText">{props.m.title} </TextStyles>
      <DatePicker popperPlacement={"bottom"}  
                         popperModifiers={{
                          flip: {
                              behavior: ["bottom"]
                          },
                          preventOverflow: {
                              enabled: false 
                          },
                          hide: {
                              enabled: false 
                          }
                      }}
        peekNextMonth={true}
        title={props.m.title}
        selected={startDate}
        onChange={(date: any) => {
          setStartDate(date);
          props.selectedval(
            props.m.code,
            moment(date).format("MMMM Do YYYY, h:mm:ss a")
          );

          // setchangedDate(true);
        }}
      />
    </FlexLayout>
  );
}
function RenderPassWord(props: {
  m: { [name: string]: any };
  user_data: { [name: string]: string };
  selectedval: any;
}): JSX.Element {
  const [val, setval] = useState("");
  const pass = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{7,}$/;
  const [err, seterr] = useState(false);
  // useEffect(() => {
  //   val.match(pass) ? seterr(false) : seterr(true);
  // }, [val]);
  return (
    <FormChild>
      {/* {props.m.editable === true && ( */}
      <TextField
        thickness="thin"
        name={props.m.title}
        placeHolder={props.m.title}
        error={err}
        readOnly={props.m.editable != true}
        type="password"
        value={val}
        onChange={(e) => {
          setval(e);
          if (e.match(pass)) {
            props.selectedval(props.m.code, e);
            seterr(false);
          } else {
            seterr(true);
          }
        }}
      ></TextField>
      {/* )} */}
    </FormChild>
  );
}
function RenderNumber(props: {
  m: { [name: string]: any };
  user_data: { [name: string]: string };
  selectedval: any;
}): JSX.Element {
  const [val, setval] = useState("");
  const [help, setHelp] = useState("");
  const [error, setError] = useState(false);
  useEffect(() => {
    setval(props.user_data[props.m.code]);
  }, [props]);
  return (
    <FormChild>
      {/* {props.m.editable === true && ( */}
      <TextField
        thickness="thin"
        name={props.m.title}
        placeHolder={props.m.title}
        // showHelp={help}
        showHelp={help}
        error={props.m.title === "Support Number" ? error : false}
        readOnly={props.m.editable != true}
        type="number"
        value={val}
        onChange={(e) => {
          if (props.m.title === "Support Number") {
            if (/^[0-9]{6,30}$/.test(val)) {
              setHelp("");
              setError(false);
            } else {
              setHelp("Support Number must be between 6 and 30");
              setError(true);
            }
          }
          setval(e);
          props.selectedval(props.m.code, e);
        }}
      ></TextField>
      {/* )} */}
    </FormChild>
  );
}
function RenderFile(props: {
  m: { [name: string]: string };
  user_data: { [name: string]: string };
  selectedfile: any;
  endpt: any;
}): JSX.Element {
  const [val, setval] = useState("");
  const [showToastImage, setShowToast] = useState(false);
  useEffect(() => {
    setval(props.endpt + props.user_data[props.m.code]);
  }, [props, val]);

  return (
    <FormChild>
      <TextStyles type="neutralText">{props.m.title}</TextStyles>
      <FlexLayout spacing="loose" valign="center" halign="center">
        <img height="80px" width="180px" src={val} />
        <input
          type="file"
          id="myfile"
          style={{ textDecoration: "none" }}
          onChange={(event: any) => {
            if (
              event.target.files[0].type === "image/png" ||
              event.target.files[0].type === "image/jpeg" ||
              event.target.files[0].type === "image/jpg" ||
              event.target.files[0].type === "image/gif"
            ) {
              setval(event.target.files[0]);
              props.selectedfile(props.m.code, event.target.files[0]);
            } else {
              setShowToast(true);
            }
          }}
          name="myfile"
        />
      </FlexLayout>
      {showToastImage && (
        <ToastWrapper>
          <Toast
            type="error"
            message={
              "Invalid file. Enter valid file format(jpg, jpeg, png and gif)"
            }
            onDismiss={() => setShowToast(false)}
            timeout={3000}
          />
        </ToastWrapper>
      )}
    </FormChild>
  );
}
function RenderSelect(props: {
  m: { [name: string]: string };
  user_data: { [name: string]: string };
  selectedval: any;
}): JSX.Element {
  const [val, setval] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const [arr, setarr] = useState<Array<{ label: string; value: string }>>([]);
  useEffect(() => {
    setval(props.user_data.company_type);
    Object.keys(props.m.options).map((r: any) => {
      arr.push({ label: props.m.options[r], value: r });
    });
  }, []);
  return (
    <FormChild>
      <Select
        name={props.m.title}
        thickness="thin"
        onChange={(e) => {
          setval(e);
          props.selectedval(props.m.code, e);
        }}
        value={val}
        options={arr}
        placeholder="Select"
        type="none"
      />
    </FormChild>
  );
}

// function RenderMultiSelect(props: {
//   m: { [name: string]: string };
//   user_data: { [name: string]: string };
//   selectedval: any;
// }): JSX.Element {
//   const [val, setval] = useState<any>([]);
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars

//   const [arr, setarr] = useState<Array<{ label: string; value: string }>>([]);
//   useEffect(() => {
//     // setval(props.user_data.company_type);
//     Object.keys(props.m.options).map((r: any) => {
//       arr.push({ label: props.m.options[r], value: r });
//     });
//   }, []);
//   return (
//     <FormChild>
//       {/* <Select
//         name={props.m.title}
//         thickness='thin'
//         onChange={(e) => {
//           setval(e);
//           props.selectedval(props.m.code, e);
//         }}
//         value={val}
//         options={arr}
//         placeholder='Select'
//         type='none'
//       /> */}

//       <ChoiceList
//         showHelp={true}
//         // selectHelp='Add this product to a collection so it’s easy to find in your store.'
//         name={props.m.title}
//         searchEable={true}
//         thickness='thin'
//         placeholder='Search for options'
//         options={arr}
//         value={val}
//         onChange={(t) => {
//           console.log(t);
//           if (val.includes(t)) {
//             const index = val.indexOf(t);
//             val.splice(index, 1);
//             const c = [...val];
//             console.log(c, "cdd");
//             setval(c);
//             props.selectedval(props.m.code, c);
//           } else {
//             setval((prev: any) => [...prev, t]);
//             // prepareData(val)
//             props.selectedval(props.m.code, val);
//           }
//         }}
//       />
//     </FormChild>
//   );
// }

export default DI(User_profile);
