/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, Component, useEffect, FC } from "react";
import { DI, DIProps } from "../../../Core";
import DatePicker from "react-datepicker";
import {
  TextField,
  TextStyles,
  Button,
  FlexLayout,
  Modal,
  Toast,
  Card,
  Skeleton
} from "@cedcommerce/ounce-ui";
import moment from "moment";
import * as queryString from "query-string";

const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]+\.+([a-zA-Z0-9-]+)2*$/;

function Signup(props: any): JSX.Element {
  const validation123 = {
    username: /^(?=[a-zA-Z._]{3,50}$)(?!.*[_.]{2})[^_.].*[^_.]*$/,
    integer: /^[0-9]+$/,
    decimal: /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/,
    // username: /^[a-zA-Z0-9._]*$/,
    email: /^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    Letters: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
    number: /^(\+\d{1,3}[- ]?)?\d{10}$/,
    url: /^https?:\/\/[a-zA-Z0-9]+\.myshopify\.com\/$/,
    url1: /^[A-Za-z0-9]+\.myshopify\.com$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
    // password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/g
  };
  const c = window.location.origin.toString() + "/auth/confirmation?token=";
  const [ModalOpen, setModalOpen] = useState<boolean>(false);
  const [MessageAprvd, setMessageAprvd] = useState("");
  const[AllFieldsRequrired,setAllFieldsRequrired]=useState(false);
  const [Loading, setLoading] = useState(false);
  const [Message, setMessage] = useState("");
  const [TotalLength, setTotalLength] = useState(0);
  const [ToastData, setToastData] = useState(false);
  const [totalVendor, setTotalVendor] = useState(0);
  const [errEmail, Err] = useState(false);
  const [errPass, Err1] = useState(false);
  const [errVali, Err2] = useState(false);
  const [allowedSellers, setAllowedSellers] = useState<any>(0);
  const [confirmationlink, setConfirmationLink] = useState("");
  const [approve, setApprove] = useState("");
  const [fieldset, setFields] = useState<any>({});
  const [title, setTitle] = useState("");
  const [save, setSave] = useState<any>({});
  const [CheckSave, setCheckSave] = useState<any>({});
  const [options, setOptions] = useState([{}]);
  const [ModalOpenAprvd, setModalOpenAprvd] = useState(false);
  const tempSave = save;
  const [MessageModal, setMessageModal] = useState("");
  const [adminId, setadminId] = useState("");
  const [modal, setModal] = useState(false);
  const [CountryCode, setCountryCode] = useState({});
  const [Term, setTerm] = useState("");
  const [TermLink, setTermLink] = useState("");
  const [TermCheck, setTermCheck] = useState(false);
  const [CheckTerm, setCheckTerm] = useState(false)
  const [CFpswrd, setCFpswrd] = useState(false);
  const [SkletonLoding, setSkletonLoding] = useState<boolean>(true)
  // const [TermReq, setTermReq] = useState(false);
  const [ErrorVal, setErrorVal] = useState(false);
  const tempCheckSave = CheckSave;

  useEffect(() => {
    const temp = props.location.pathname.split("/")[3];

    props.di
      .GET(
        `/connector/vendor/getAdminId?admin_shop_id=${props.location.pathname.split("/")[3]
        }`
      )
      .then((e: any) => {
        if (e.success) {

          setadminId(e.admin_id);
          getTotalVendor(e.admin_id);
          setAllowedSellers(e.allowed_seller);
          getData(e.admin_id);
          const data = {
            admin_id: e.admin_id,
            marketplace: "shopify",
          };
          props.di
            .POST("/connector/vendor/vendorAutoApprove", data)
            .then((e: any) => {
              if (e.success) {

                setApprove(e.vendor_auto_approve);
                setTerm(e.require_term_and_cond);
                setTermLink(e.require_term_and_cond_link);
              }
            });
        }
      });


  }, []);

  const countryCode = (value: string) => {
    if (value) {
      tempSave["country_code"] = value;
    }
  };
  function saveData(code: string, value: string): any {
    if (
      queryString.parse(props.location.search).shop_url != undefined ||
      queryString.parse(props.location.search).shop_url != ""
    ) {
      tempSave[code] = value;
      tempSave["shop_url"] = queryString.parse(props.location.search).shop_url;
    } else {
      tempSave[code] = value;
    }

    setSave(tempSave);
  }
  function EnableSaveButton(code: string, value: boolean) {
    tempCheckSave[code] = value;

    setCheckSave(tempCheckSave);
  }
  function validate() {
    TermCheck === false;
    Object.keys(tempSave).forEach((key) => {   
      if (tempSave[key] === ""&&Object.keys(tempSave).length < 7) {
        Err(true);
        Err1(true);
        Err2(true);
      }
    });
    let count = 0;
    Object.keys(tempCheckSave).map((ele) => {
      if (tempCheckSave[ele] == true) {
        count++;
      }
    });
    // if (count == Object.keys(tempCheckSave).length) {
    if (count == TotalLength + 1) {
      // if (
      //   TotalLength - 1 == Object.keys(tempSave).length ||
      //   TotalLength == Object.keys(tempSave).length
      // ) {
      if (tempSave.password != ""&&tempSave.country_code!=undefined) {
        if (tempSave.password == tempSave.confirm_password) {
          setCFpswrd(true);
          Err1(false);
          if (Term == "yes") {
            if (TermCheck == true) {
              if (approve == "no") {
                setCheckTerm(false);
                register();
                const temp =
                  "Thank you for registering. Verify your email to finish the signup.";
                setMessageAprvd(temp);
                setTimeout(function () {
                  setLoading(false);
                }, 5000);
                setTimeout(function () {
                  setModalOpenAprvd(true);
                }, 5000);
              } else {
                register();
              }
            } else {
              setCheckTerm(true)
              setAllFieldsRequrired(true);
            }
          } else {
            if (approve == "no") {
              register();
              const temp =
                "Thank you for registering. Verify your email to finish the signup.";
              setMessageAprvd(temp);
              setTimeout(function () {
                setLoading(false);
              }, 5000);
              setTimeout(function () {
                setModalOpenAprvd(true);
              }, 5000);
            } else {
              register();
            }
          }
        } else {
          Err1(true);
          setAllFieldsRequrired(true);
          setCFpswrd(false);
        }
      } else {
        Err(true);
        setAllFieldsRequrired(true);
      }
    }else{
      setAllFieldsRequrired(true);     
    }
  }

  const getTotalVendor = (id: string) => {
    props.di
      .POST("connector/vendor/getAllVendorCount", { user_id: id })
      .then((data: any) => {
        const sum = data.data.reduce(
          (previousValue: any, currentValue: any) => {
            return previousValue + currentValue.count;
          },
          0
        );
        setTotalVendor(sum);
      });
  };
  function getData(id: any) {
    props.di.GET("/connector/get/getFormView", { admin_id: id }).then((e: any) => {
      if (e.success) {
        setSkletonLoding(false);
        Object.keys(e.data).forEach((j) => {
          if (e.data[j].code === "vendor_registration") {
            const tempfields = e.data[j].fieldsets;
            let count = 0;
            Object.keys(tempfields[0]["fields"]).forEach((ele) => {
              if (tempfields[0]["fields"][ele].required == true) {
                count = count + 1;
              }
            });
            setTotalLength(count);

            // setTotalLength(
            //   Object.keys(tempfields[0].fields).length +
            //   Object.keys(tempfields[1].fields).length
            // );
            // setTotalLength((Object.keys(tempfields[0].fields).length)+)
            // const temp = props.p.sort((a: any, b: any) => {
            //   return a.position - b.position;
            // });
            setFields(tempfields);
            setTitle(e.data[j].title);
          }

          // setTitle(tempTitle);
        });
      }
    });

    props.di
      .GET("shopifyhome/request/getCountriesWithDialCode")
      .then((e: any) => {
        if (e.success) {
          setCountryCode(e.data.country_code);
        }
      });
  }
  /**
   * @function register for Register (Call Api)
   */
  function addNotification() {
    props.di
      .POST("connector/notificationmsg/addNotifications", {
        user_id: adminId,
        message: `New Supplier Registration: New supplier ${tempSave.name} (${tempSave.email}) has registered`,
        url: "/panel/suppliers",
        type: "Account",
      })
      .then((res: any) => {
        // console.log(res);
      });
  }
  function register() {
    addNotification();
    setLoading(true);
    let url = "";
    let data = {};
    setConfirmationLink(c);
    if (
      tempSave.shop_url != "" &&
      Object.keys(tempSave).includes("shop_url") &&
      tempSave.shop_url != undefined
    ) {
      (url =
        "https://devbackend.cedcommerce.com/remote/public/apiconnect/request/commenceAuth?sAppId=3"),
        (data = {
          // admin_id: adminId,
          admin_id: adminId,
          name: tempSave.name,
          fname: tempSave.fname,
          lname: tempSave.lname,
          email: tempSave.email.toLowerCase(),
          country_code: tempSave.country_code,
          phone: tempSave.phone,
          password: tempSave.password,
          confirmation_link: `https://devsupplier.cedcommerce.com/auth/login/${props.location.pathname.split("/")[3]
            }?token=`,
          sParentId: "2",
          status: "under_review",
          vendor_auto_approve: approve,
          shop_url: tempSave.shop_url,
        });
    } else {
      (url =
        "https://devbackend.cedcommerce.com/remote/public/apiconnect/request/auth?sAppId=5"),
        (data = {
          admin_id: adminId,
          name: tempSave.name,
          fname: tempSave.fname,
          lname: tempSave.lname,
          email: tempSave.email.toLowerCase(),
          country_code: tempSave.country_code,
          phone: `${tempSave.country_code} ${tempSave.phone}`,
          password: tempSave.password,
          sParentId: "2",
          status: "under_review",
          confirmation_link: `https://devsupplier.cedcommerce.com/auth/login/${props.location.pathname.split("/")[3]
            }?token=`,
          vendor_auto_approve: approve,
        });
    }

    fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((e) => e.json())
      .then((e) => {
        // addNotification();
        if (e.success) {
          setLoading(false);
          const url = e.url;
          const URLmsg =
            url != undefined && url.replaceAll("+", " ").split("message=")[1];
          // setToastMsg(true);
          // addNotification();
          setMessage(URLmsg);
          setModalOpen(true);
        }
      });
  }
  function handleCheck() {
    setTermCheck(!TermCheck);
    if (!TermCheck == false) {
      setCheckTerm(true);
    }
  }
  return (
    <>
      {
        !SkletonLoding ? (<section className="loginSignup__Wrapper">
          <div className="header__section pb-4 mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="heading--mediumUp">Register</h2>
            </div>
          </div>
          <form
            onSubmit={(event) => event.preventDefault()}
            className="needs-validation"
            noValidate
          >
            {Object.keys(fieldset).map((e) => {
              if (fieldset[e].code == "general") {
                const temp = fieldset[e].fields.sort((a: any, b: any) => {
                  return a.position - b.position;
                });

                return Object.keys(temp).map((j) => {
                  switch (temp[j].type) {
                    case "text":
                      return (
                        <RenderText
                          required={temp[j].required}
                          unique={temp[j].unique}
                          ErrorVal1={ErrorVal}
                          adminId={adminId}
                          props={props}
                          Regex={validation123}
                          title={temp[j].title}
                          save={saveData}
                          code={temp[j].code}
                          validation={temp[j].input_validation}
                          placeholder={temp[j].default}
                          EnableSaveButton={EnableSaveButton}
                        />
                      );
                    case "number":
                      return (
                        <RenderNumber
                          unique={temp[j].unique}
                          required={temp[j].required}
                          EnableSaveButton={EnableSaveButton}
                          country_code={CountryCode}
                          adminId={adminId}
                          props={props}
                          options={options}
                          Regex={validation123}
                          titleNumber={temp[j].title}
                          save={saveData}
                          countryCode={countryCode}
                          code={temp[j].code}
                          validation={temp[j].input_validation}
                          placeholder={temp[j].default}
                        />
                      );
                    case "textarea":
                      return (
                        <RendertextArea
                          required={temp[j].required}
                          unique={temp[j].unique}
                          ErrorVal1={ErrorVal}
                          adminId={adminId}
                          props={props}
                          Regex={validation123}
                          title={temp[j].title}
                          save={saveData}
                          code={temp[j].code}
                          validation={temp[j].input_validation}
                          placeholder={temp[j].default}
                          EnableSaveButton={EnableSaveButton}
                        />
                      );
                    case "date":
                      return (
                        <RenderDate
                          required={temp[j].required}
                          unique={temp[j].unique}
                          ErrorVal1={ErrorVal}
                          adminId={adminId}
                          props={props}
                          Regex={validation123}
                          title={temp[j].title}
                          save={saveData}
                          code={temp[j].code}
                          validation={temp[j].input_validation}
                          placeholder={temp[j].default}
                          EnableSaveButton={EnableSaveButton}
                        />
                      );

                    case "select":
                      return (
                        <RenderSelect
                          EnableSaveButton={EnableSaveButton}
                          required={temp[j].required}
                          title={temp[j].title}
                          options={temp[j].options}
                          code={temp[j].code}
                          save={saveData}
                        />
                      );

                    case "multi_select":
                      return (
                        <RenderMultiSelect
                          EnableSaveButton={EnableSaveButton}
                          required={temp[j].required}
                          title={temp[j].title}
                          options={temp[j].options}
                          code={temp[j].code}
                          save={saveData}
                        />
                      );
                    case "file":
                      return (
                        <RenderFile
                          EnableSaveButton={EnableSaveButton}
                          required={temp[j].required}
                          save={saveData}
                          code={temp[j].code}
                        />
                      );
                    case "yes/no":
                      return (
                        <RenderYesNo
                          EnableSaveButton={EnableSaveButton}
                          required={temp[j].required}
                          title={temp[j].title}
                          save={saveData}
                          code={temp[j].code}
                        />
                      );
                  }
                });
              } else if (fieldset[e].code == "manage_password") {
                return Object.keys(fieldset[e].fields).map((k) => {
                  switch (fieldset[e].fields[k].code) {
                    case "password":
                      return (
                        <RenderPassword
                          CFpswrd={CFpswrd}
                          Regex={validation123}
                          titlePassword={fieldset[e].fields[k].title}
                          save={saveData}
                          code={fieldset[e].fields[k].code}
                          EnableSaveButton={EnableSaveButton}
                        />
                      );
                    case "confirm_password":
                      return (
                        <RenderRepassword
                          error={errPass}
                          CFpswrd={CFpswrd}
                          titleRepassword={fieldset[e].fields[k].title}
                          save={saveData}
                          code={fieldset[e].fields[k].code}
                        />
                      );
                  }
                });
              }
            })}

            <div className="form-group form-check">
              {Term == "yes" && (
                <label className="form-check-label" htmlFor="invalidCheck">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={TermCheck}
                    onClick={() => handleCheck()}
                    id="invalidCheck"
                    required
                  />

                  <span>
                    I have read and accept{" "}
                    <a href={TermLink} target="_blank" rel="noreferrer">
                      Terms & Conditions
                    </a>

                  </span>
                </label>
              )}
              {CheckTerm && (
                <div className="invalid-field ml-2">
                  <small id="" className="form-text text-danger mt-1">
                    You must agree before submitting.
                  </small>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block mb-4 buttonload"
              onClick={() => {
                if (
                  totalVendor < allowedSellers ||
                  allowedSellers === "unlimited"
                ) {
                  validate();
                } else {
                  setToastData(true);
                }
              }}
            >
              {Loading ? (
                // <i className='fa fa-circle-o-notch fa-spin'></i>
                <span className={"inte-dual-ring"}></span>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </section>) : (
          <Card>
            <Skeleton
              line={5}
              rounded="0%"
              type="line"
            />
          </Card>)
      }
      <ToastWrapper>
        {ToastData && (
          <Toast
            type="error"
            message="Supplier limit has reached as per admin's plan. Kindly contact with admin."
            timeout={3000}
            onDismiss={() => setToastData(false)}
          />
        )}

      {AllFieldsRequrired && (
          <Toast
            type="error"
            message="All Fields Are  Required."
            timeout={3000}
            onDismiss={() => setAllFieldsRequrired(false)}
          />
        )}
      </ToastWrapper>

      {Message !== "" && (
        <Modal
          modalSize="small"
          heading="Message"
          open={ModalOpen}
          close={() => {
            setModalOpen(!ModalOpen);
            props.history.push(
              `/auth/login/${props.location.pathname.split("/")[3]}`
            );
          }}
        >
          <FlexLayout direction="vertical" valign="start" spacing="loose">
            <TextStyles type="simpleText">{Message}</TextStyles>
            <Button
              thickness="thin"
              type="Primary"
              onClick={() => {
                props.history.push(
                  `/auth/login/${props.location.pathname.split("/")[3]}`
                );
              }}
            >
              OK
            </Button>
          </FlexLayout>
        </Modal>
      )}

      {MessageAprvd !== "" && (
        <Modal
          modalSize="small"
          heading="Message"
          open={ModalOpenAprvd}
          close={() => setModalOpenAprvd(!ModalOpenAprvd)}
        >
          <FlexLayout direction="vertical" valign="start" spacing="loose">
            <TextStyles type="simpleText">{MessageAprvd}</TextStyles>
            <Button
              thickness="thin"
              type="Primary"
              onClick={() => {
                props.history.push(
                  `/auth/login/${props.location.pathname.split("/")[3]}`
                );
              }}
            >
              OK
            </Button>
          </FlexLayout>
        </Modal>
      )}
      {MessageModal !== "" && (
        <Modal
          modalSize="small"
          heading="Message"
          open={modal}
          close={() => setModal(!Modal)}
        >
          <FlexLayout direction="vertical" valign="start" spacing="loose">
            <TextStyles type="simpleText">{MessageModal}</TextStyles>
            <Button
              thickness="thin"
              type="Primary"
              onClick={() => {
                props.history.push(
                  `/auth/login/${props.location.pathname.split("/")[3]}`
                );
              }}
            >
              OK
            </Button>
          </FlexLayout>
        </Modal>
      )}
    </>
  );
}

interface TextRender {
  required: boolean;
  unique: boolean;
  placeholder: string;
  validation: string;
  Regex: any;
  ErrorVal1: boolean;
  code: string;
  adminId: string;
  title: string;
  save: (a: string, b: string) => any;
  props: any;
  EnableSaveButton(a: string, b: boolean): void;
}
function RenderText({
  validation,
  required,
  unique,
  title,
  ErrorVal1,
  save,
  code,
  Regex,
  props,
  adminId,
  EnableSaveButton,
}: TextRender): any {
  const [ErrorVal, setErrorVal] = useState(false);
  const [Check, setCheck] = useState(false);
  const [value, setValue] = useState("");
  const [helpText, setHelpText] = useState("");

  function handleChange(
    e: any,
    validation: string,
    unique: boolean,
    title: string
  ) { 
    setValue(e);
    switch (validation) {
      case "Letters(a-z ,A-Z) or number(0-9)":
        if (required) {    
          if (e != "") {
            setErrorVal(false);
            setHelpText("");
          } else {
            setErrorVal(true);
            setHelpText("*required");
          }
        }
        if (e.match(Regex.username)) {
          // setErrorVal(false);
          // setHelpText("");
          save(code, e);
          if (required) {
            if (unique) {
              fetch(
                `https://devbackend.cedcommerce.com/remote/public/cedcommercewebapi/request/checkFieldsUniqueness?${code}=${e}&admin_id=${adminId}`
              )
                .then((check) => check.json())
                .then((check) => {
                  if (check.success) {
                    setErrorVal(true);
                    EnableSaveButton(code, false);
                    setHelpText(`${title} already exists`);
                  } else {
                    EnableSaveButton(code, true);

                    setErrorVal(false);
                    setHelpText("");
                  }
                });
            } else {
              EnableSaveButton(code, true);
              setErrorVal(false);
              setHelpText("");
            }
          } else {
            if (unique) {
              fetch(
                `https://devbackend.cedcommerce.com/remote/public/cedcommercewebapi/request/checkFieldsUniqueness?${code}=${e}&admin_id=${adminId}`
              )
                .then((check) => check.json())
                .then((check) => {
                  if (check.success) {
                    setErrorVal(true);
                    EnableSaveButton(code, false);
                    setHelpText(`${title} already exists`);
                  } else {
                    setErrorVal(false);
                    EnableSaveButton(code, true);
                    setHelpText("");
                  }
                });
            } else {
              setErrorVal(false);
              EnableSaveButton(code, true);
              setHelpText("");
            }
          }

          // setErrorVal(false);
          // setHelpText("");
        } else {
          setErrorVal(true);
          setHelpText(`Invalid ${title}`);
          EnableSaveButton(code, false);   
        }
        break;
      case "email":
        if (required) {
          if (e != "") {
            setErrorVal(false);
            save(code, e);
            setHelpText("");
            EnableSaveButton(code, true);
          } else {
            setErrorVal(true);
            setHelpText("*required");
            EnableSaveButton(code, false);
          }
        }
        if (e.match(Regex.email)) {
          // setErrorVal(false);
          // setHelpText("");
          if (required) {
            if (unique) {
              fetch(
                `https://devbackend.cedcommerce.com/remote/public/cedcommercewebapi/request/checkFieldsUniqueness?${code}=${e}&admin_id=${adminId}`
              )
                .then((check) => check.json())
                .then((check) => {
                  if (check.success) {
                    setErrorVal(true);
                    EnableSaveButton(code, false)
                    setHelpText(`${title} already exists`);
                  } else {
                    EnableSaveButton(code, true);

                    setErrorVal(false);
                    setHelpText("");
                  }
                });
            } else {
              EnableSaveButton(code, true);

              setErrorVal(false);
              setHelpText("");
            }
          } else {
            if (unique) {
              fetch(
                `https://devbackend.cedcommerce.com/remote/public/cedcommercewebapi/request/checkFieldsUniqueness?${code}=${e}&admin_id=${adminId}`
              )
                .then((check) => check.json())
                .then((check) => {
                  if (check.success) {
                    setErrorVal(true);
                    EnableSaveButton(code, false)
                    setHelpText(`${title} already exists`);
                  } else {
                    setErrorVal(false);
                    setHelpText("");
                    EnableSaveButton(code, true)
                  }
                });
            } else {
              setErrorVal(false);
              setHelpText("");
              EnableSaveButton(code, true)
            }
          }

          // setErrorVal(false);
          // setHelpText("");
        } else {
          setErrorVal(true);
          setHelpText(`Invalid ${title}`);
          EnableSaveButton(code, false)
        }
        break;
      case "url":
        if (required) {
           EnableSaveButton(code, true);
          if (e != "") {
            setErrorVal(false);
            setHelpText("");
            EnableSaveButton(code, true)
          } else {
            setErrorVal(true);
            setHelpText("*required");
            EnableSaveButton(code, false)
          }
        }

        if (e.match(Regex.url) || e.match(Regex.url1)) {
          // setErrorVal(false);
          // setHelpText("");
          if (required) {
            if (unique) {
              fetch(
                `https://devbackend.cedcommerce.com/remote/public/cedcommercewebapi/request/checkFieldsUniqueness?${code}=${e}&admin_id=${adminId}`
              )
                .then((check) => check.json())
                .then((check) => {
                  if (check.success) {
                    setErrorVal(true);
                    setHelpText(`${title} already exists`);
                    EnableSaveButton(code, false)
                  } else {
                    EnableSaveButton(code, true);

                    setErrorVal(false);
                    setHelpText("");
                  }
                });
            } else {
              EnableSaveButton(code, true);

              setErrorVal(false);
              setHelpText("");
            }
          } else {
            if (unique) {
              fetch(
                `https://devbackend.cedcommerce.com/remote/public/cedcommercewebapi/request/checkFieldsUniqueness?${code}=${e}&admin_id=${adminId}`
              )
                .then((check) => check.json())
                .then((check) => {
                  if (check.success) {
                    setErrorVal(true);
                    setHelpText(`${title} already exists`);
                  } else {
                    setErrorVal(false);
                    setHelpText("");
                  }
                });
            } else {
              setErrorVal(false);
              setHelpText("");
            }
          }

          // setErrorVal(false);
          // setHelpText("");
        } else {
          setErrorVal(true);
          setHelpText(`Invalid ${title}`);
          EnableSaveButton(code, false)
        }
        break;

      case "decimal":
        if (required) {
           EnableSaveButton(code, true);
          if (e != "") {
            setErrorVal(false);
            setHelpText("");
          } else {
            setErrorVal(true);
            setHelpText("*required");
          }
        }

        if (e.match(Regex.decimal)) {
          // setErrorVal(false);
          // setHelpText("");
          if (required) {
            if (unique) {
              fetch(
                `https://devbackend.cedcommerce.com/remote/public/cedcommercewebapi/request/checkFieldsUniqueness?${code}=${e}&admin_id=${adminId}`
              )
                .then((check) => check.json())
                .then((check) => {
                  if (check.success) {
                    setErrorVal(true);
                    setHelpText(`${title} already exists`);
                  } else {
                    EnableSaveButton(code, true);
                    setErrorVal(false);
                    setHelpText("");
                  }
                });
            } else {
              EnableSaveButton(code, true);

              setErrorVal(false);
              setHelpText("");
            }
          } else {
            if (unique) {
              fetch(
                `https://devbackend.cedcommerce.com/remote/public/cedcommercewebapi/request/checkFieldsUniqueness?${code}=${e}&admin_id=${adminId}`
              )
                .then((check) => check.json())
                .then((check) => {
                  if (check.success) {
                    setErrorVal(true);
                    setHelpText(`${title} already exists`);
                  } else {
                    setErrorVal(false);
                    setHelpText("");
                  }
                });
            } else {
              setErrorVal(false);
              setHelpText("");
            }
          }

          // setErrorVal(false);
          // setHelpText("");
        } else {
          setErrorVal(true);
          setHelpText(`Invalid ${title}`);
        }
        break;

      case "integer":
        if (required) {
          if (e != "") {
            setErrorVal(false);
            setHelpText("");
            EnableSaveButton(code, true)
          } else {
            setErrorVal(true);
            setHelpText("*required");
            EnableSaveButton(code, false)
          }
        }
        if (e.match(Regex.integer)) {
          // setErrorVal(false);
          // setHelpText("");
          if (required) {
            if (unique) {
              fetch(
                `https://devbackend.cedcommerce.com/remote/public/cedcommercewebapi/request/checkFieldsUniqueness?${code}=${e}&admin_id=${adminId}`
              )
                .then((check) => check.json())
                .then((check) => {
                  if (check.success) {
                    setErrorVal(true);
                    EnableSaveButton(code, false)
                    setHelpText(`${title} already exists`);
                  } else {
                    EnableSaveButton(code, true);
                    setErrorVal(false);
                    setHelpText("");
                  }
                });
            } else {
              EnableSaveButton(code, true);

              setErrorVal(false);
              setHelpText("");
            }
          } else {
            if (unique) {
              fetch(
                `https://devbackend.cedcommerce.com/remote/public/cedcommercewebapi/request/checkFieldsUniqueness?${code}=${e}&admin_id=${adminId}`
              )
                .then((check) => check.json())
                .then((check) => {
                  if (check.success) {
                    setErrorVal(true);
                    EnableSaveButton(code, false)
                    setHelpText(`${title} already exists`);
                  } else {
                    setErrorVal(false);
                    setHelpText("");
                    EnableSaveButton(code, true)
                  }
                });
            } else {
              setErrorVal(false);
              setHelpText("");
              EnableSaveButton(code, true)
            }
          }

          // setErrorVal(false);
          // setHelpText("");
        } else {
          setErrorVal(true);
          setHelpText(`Invalid ${title}`);
          EnableSaveButton(code, false)
        }
        break;
      case "none":
        if (required) {
          if (e != "") {
            setErrorVal(false);
            EnableSaveButton(code, true);

            setHelpText("");
          } else {
            setErrorVal(true);
            setHelpText("*required");
            EnableSaveButton(code, false)
          }
        }
        break;
    }

    // if (code == "email") {
    //   setValue(e);
    //   save(code, e);
    //   if (validation == "email") {
    //     if (e.match(Regex.email)) {
    //       // setErrorVal(false);
    //       // setHelpText("");
    //       if (unique == true) {
    //         fetch(
    //           `https://devbackend.cedcommerce.com/remote/public/cedcommercewebapi/request/checkFieldsUniqueness?${code}=${e}&admin_id=${adminId}`
    //         )
    //           .then((m) => m.json())
    //           .then((m) => {
    //             if (m.success) {
    //               if (required) {
    //                 EnableSaveButton(code, true);
    //               }
    //               setErrorVal(true);
    //               setCheck(false);
    //               setHelpText(
    //                 `Email ID already exists. Login or choose a different email id.`
    //               );
    //             } else {
    //               if (required) {
    //                 EnableSaveButton(code, false);
    //               }
    //               setHelpText("");

    //               setErrorVal(false);
    //               setCheck(true);
    //             }
    //           });
    //       } else {
    //         setErrorVal(false);
    //         setCheck(true);
    //       }
    //     } else {

    //       setHelpText("Please enter valid email ID e.g. example@gmail.com");
    //       setErrorVal(true);
    //       setCheck(false);

    //       // if (unique === true) {
    //       //   fetch(
    //       //     `https://devbackend.cedcommerce.com/remote/public/cedcommercewebapi/request/checkFieldsUniqueness?${code}=${e}&admin_id=${adminId}`
    //       //   )
    //       //     .then((m) => m.json())
    //       //     .then((m) => {
    //       //       if (m.success) {
    //       //         // save(code, e);
    //       //         if (required) {
    //       //           EnableSaveButton(code, true);

    //       //         }
    //       //         setErrorVal(true);
    //       //         setCheck(false);
    //       //         setHelpText(
    //       //           `Email ID already exists. Login or choose a different email id.`
    //       //         );
    //       //       } else {
    //       //         if (required) {
    //       //           EnableSaveButton(code, false);

    //       //         }
    //       //         setErrorVal(false);
    //       //         setCheck(true);
    //       //       }
    //       //     });
    //       // } else {
    //       //   setErrorVal(false);
    //       //   setCheck(true);
    //       // }

    //     }
    //   }

    // } else if (code == "name") {
    //   if (
    //     (e.charCodeAt(e.length - 1) >= 65 &&
    //       e.charCodeAt(e.length - 1) <= 90) ||
    //     (e.charCodeAt(e.length - 1) >= 97 &&
    //       e.charCodeAt(e.length - 1) <= 122) ||
    //     e.charCodeAt(e.length - 1) == 32 ||
    //     e == ""
    //   ) {
    //     setValue(e.toLowerCase());
    //     save(code, e.toLowerCase());
    //     if (validation == "Letters(a-z ,A-Z) or number(0-9)") {
    //       if (required == true && e === "") {
    //         setErrorVal(true);
    //         setHelpText("*required");
    //       } else if (e.match(Regex.username)) {
    //         setErrorVal(false);
    //         setHelpText("");
    //         if (unique == true) {
    //           fetch(
    //             `https://devbackend.cedcommerce.com/remote/public/cedcommercewebapi/request/checkFieldsUniqueness?${code}=${e}&admin_id=${adminId}`
    //           )
    //             .then((m1) => m1.json())
    //             .then((m1) => {
    //               if (m1.success) {
    //                 if (required == true) {
    //                   EnableSaveButton(code, true);
    //                 }
    //                 setCheck(false);
    //                 setErrorVal(true);
    //                 setHelpText(
    //                   `Username already exists. Login or choose a different username.`
    //                 );
    //               } else {
    //                 if (required == true) {
    //                   EnableSaveButton(code, false);
    //                 }
    //                 setCheck(true);
    //                 setErrorVal(false);
    //               }
    //             });
    //         } else {
    //           setErrorVal(false);
    //           setCheck(true);
    //         }
    //       } else {
    //         // if (unique == true) {
    //         //   fetch(
    //         //     `https://devbackend.cedcommerce.com/remote/public/cedcommercewebapi/request/checkFieldsUniqueness?${code}=${e}&admin_id=${adminId}`
    //         //   )
    //         //     .then((m1) => m1.json())
    //         //     .then((m1) => {
    //         //       if (m1.success) {
    //         //         if (required == true) {
    //         //           EnableSaveButton(code, true);

    //         //         }
    //         //         setCheck(false);
    //         //         setErrorVal(true);
    //         //         setHelpText(
    //         //           `Username already exists. Login or choose a different username.`
    //         //         );
    //         //       } else {
    //         //         if (required == true) {
    //         //           EnableSaveButton(code, false);

    //         //         }
    //         //         setCheck(true);
    //         //         setErrorVal(false);
    //         //       }
    //         //     });
    //         // } else {
    //         //   setErrorVal(false);
    //         //   setCheck(true);
    //         // }
    //         setErrorVal(true);
    //         setHelpText("Must be of 3-18 characters. Allowed characters: a-z.");
    //         setCheck(false);
    //       }
    //     }

    //   }
    // } else if (code == "fname") {
    //   save(code, e);
    //   if (
    //     (e.charCodeAt(e.length - 1) >= 65 &&
    //       e.charCodeAt(e.length - 1) <= 90) ||
    //     (e.charCodeAt(e.length - 1) >= 97 &&
    //       e.charCodeAt(e.length - 1) <= 122) ||
    //     e == ""
    //   )
    //     setValue(e);
    //   if (required == true) {
    //     EnableSaveButton(code, false);

    //   }
    // } else if (code == "lname") {
    //   save(code, e);
    //   if (
    //     (e.charCodeAt(e.length - 1) >= 65 &&
    //       e.charCodeAt(e.length - 1) <= 90) ||
    //     (e.charCodeAt(e.length - 1) >= 97 &&
    //       e.charCodeAt(e.length - 1) <= 122) ||
    //     e == ""
    //   )
    //     if (required == true) {
    //       EnableSaveButton(code, false);

    //     }
    //   setValue(e);
    // } else if (code == "store_url") {
    //   setValue(e);

    //   if (value != "") {
    //     if (e.match(Regex.url) || e.match(Regex.url1)) {
    //       setErrorVal(false);
    //       if (e.includes("http://")) {
    //         e = e.substring(7);
    //       }
    //       save(code, e);
    //     } else {
    //       setErrorVal(true);
    //     }
    //   }
    // } else {
    //   setValue(e);
    //   save(code, e);
    // }
  }

  // http://54.253.224.19/remote/public/cedcommercewebapi/request/checkFieldsUniqueness?name=qwer&admin_id=822
  return (
    <>
      {/* <FormChild> */}
      <div className="row">
        <div className="col">
          <div className="form-group">
            <input
              placeholder={title}
              className={
                value == ""
                  ? "form-control"
                  : ErrorVal
                    ? "form-control is-invalid"
                    : "form-control is-valid"
              }
              autoComplete="new-password"
              type="text"
              value={value}
              onChange={(e: any) => {  
                handleChange(e.target.value, validation, unique, title);
                required &&
                  value === "" &&
                  (setErrorVal(true), setHelpText("*required"));
              }}
              required
            />

            {/* {Check && code == "name" && (
              <div className="validationIcon">
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='50'
                  height='50'
                  viewBox='0 0 50 50'
                  fill='none'
                >
                  <circle cx='25' cy='25' r='25' fill='#E7FFE7' />
                  <path
                    d='M34.3337 18L21.5003 30.8333L15.667 25'
                    stroke='#50CB93'
                    strokeWidth='3'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
            )}

            {Check && code == "email" && (
              <div className='validationIcon'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='50'
                  height='50'
                  viewBox='0 0 50 50'
                  fill='none'
                >
                  <circle cx='25' cy='25' r='25' fill='#E7FFE7' />
                  <path
                    d='M34.3337 18L21.5003 30.8333L15.667 25'
                    stroke='#50CB93'
                    strokeWidth='3'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
            )} */}
            {/* <label htmlFor={title}>{title}</label> */}
            {/* {ErrorVal ? ( */}
            <div className="invalid-feedback ml-2">
              <small id="" className="form-text text-danger mt-2">
                {helpText}
              </small>
            </div>
            {required
              ? value == "" && (
                <div className="invalid-feedback invalid-field ml-2">
                  <small id="" className="form-text text-danger mt-2">
                    *required
                  </small>
                </div>
              )
              : null}

            {/* ) : null} */}
            {/* 
            {required ? code == "name" && value == "" && (
              <div className="invalid-feedback invalid-field ml-2">
                <small id="" className="form-text text-danger mt-2">
                  *required
                </small>
              </div>
            ) : null}

            {required ? code == "email" && value == "" && (
              <div className="invalid-feedback invalid-field ml-2">
                <small id="" className="form-text text-danger mt-2">
                  *required
                </small>
              </div>
            ) : null}
            {required ? code == "fname" && value == "" && (
              <div className="invalid-feedback invalid-field ml-2">
                <small id="" className="form-text text-danger mt-2">
                  *required
                </small>
              </div>
            ) : null}
            {required ? code == "lname" && value == "" && (
              <div className="invalid-feedback invalid-field ml-2">
                <small id="" className="form-text text-danger mt-2">
                  *required
                </small>
              </div>
            ) : null} */}
          </div>
        </div>
      </div>

      {/* </FormChild> */}
    </>
  );
}
function RenderMultiSelect({
  code,
  options,
  save,
  title,
  required,
  EnableSaveButton,
}: any) {
  const [MultiArr, setMultiArr] = useState([]);
  const [ErrorVal, setErrorVal] = useState(false);
  const [Check, setCheck] = useState(false);
  const [value, setValue] = useState("");
  const [helpText, setHelpText] = useState("");
  function handleChange(input: any) {
    if (required) {
      if (input != "") {
        EnableSaveButton(code, true);

        setErrorVal(false);
        setHelpText("");
      } else {
        setErrorVal(true);
        setHelpText("*required");
      }
    }
    const temp: any = [];
    Object.keys(input).map((e, i) => {
      temp.push(input[i].value);
    });
    setMultiArr(temp);
    save(code, temp);
  }
  return (
    <>
      <div className="row">
        <div className="col">
          <div className="form-group floating-label">
            <select
              style={{ height: "50px" }}
              size={4}
              onChange={(event) => handleChange(event.target.selectedOptions)}
              className="form-control focus-visible"
              name={title}
              multiple
            >
              {Object.keys(options).map((ele, index) => {
                return (
                  <option key={index} value={options[ele]}>
                    {options[ele]}
                  </option>
                );
              })}{" "}
            </select>
            <label htmlFor={title}>{title}</label>

            {required
              ? MultiArr.length == 0 && (
                <div className="invalid-feedback invalid-field ml-2">
                  <small id="" className="form-text text-danger mt-2">
                    *required
                  </small>
                </div>
              )
              : null}
          </div>
        </div>
      </div>
    </>
  );
}

function RenderSelect({
  code,
  options,
  save,
  title,
  required,
  EnableSaveButton,
}: any) {
  const [value, setValue] = useState("");
  const [ErrorVal, setErrorVal] = useState(false);
  const [Check, setCheck] = useState(false);
  const [helpText, setHelpText] = useState("");
  function handleChange(input: any) {
    setValue(input);
    save(code, input);
    if (required) {
      if (input != "") {
        EnableSaveButton(code, true);

        setErrorVal(false);
        setHelpText("");
      } else {
        setErrorVal(true);
        setHelpText("*required");
      }
    }
  }

  return (
    <>
      <div className="row">
        <div className="col">
          <div className="form-group floating-label">
            <select
              className="form-control focus-visible"
              name={title}
              value={value}
              onChange={(event) => handleChange(event.target.value)}
            >
              {Object.keys(options).map((ele, index) => {
                return (
                  <option key={index} value={options[ele]}>
                    {options[ele]}
                  </option>
                );
              })}
            </select>

            <label htmlFor={title}>{title}</label>
            {required
              ? value == "" && (
                <div className="invalid-feedback invalid-field ml-2">
                  <small id="" className="form-text text-danger mt-2">
                    *required
                  </small>
                </div>
              )
              : null}
          </div>
        </div>
      </div>
    </>
  );
}
function RenderYesNo({ title, EnableSaveButton, required, code, save }: any) {
  const [ErrorVal, setErrorVal] = useState(false);
  const [Check, setCheck] = useState(false);
  const [helpText, setHelpText] = useState("");
  const [value, setValue] = useState("");
  function handleChange(input: any) {
    setValue(input);
    save(code, input);
    if (required) {
      if (input != "") {
        EnableSaveButton(code, true);

        setErrorVal(false);
        setHelpText("");
      } else {
        setErrorVal(true);
        setHelpText("*required");
      }
    }
  }

  return (
    <>
      <div className="row">
        <div className="col">
          <div className="form-group floating-label">
            <select
              className="form-control focus-visible"
              name={title}
              value={value}
              onChange={(event) => handleChange(event.target.value)}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>

            <label htmlFor={title}>{title}</label>
            {required
              ? value == "" && (
                <div className="invalid-feedback invalid-field ml-2">
                  <small id="" className="form-text text-danger mt-2">
                    *required
                  </small>
                </div>
              )
              : null}
          </div>
        </div>
      </div>
    </>
  );
}

function RenderFile({ required, code, EnableSaveButton, save }: any) {
  const [selectedFile, setSelectedFile] = useState<any>([]);
  const [ErrorVal, setErrorVal] = useState(false);
  const [Check, setCheck] = useState(false);
  const [helpText, setHelpText] = useState("");
  const [value, setValue] = useState("");
  const ChangeHandler = (event: any) => {
    setSelectedFile(event.target.files[0]);
    save(code, event.target.files[0]);
    if (required) {
      EnableSaveButton(code, true);
      if (event.target.files.length != "") {
        setErrorVal(false);
        setHelpText("");
      } else {
        setErrorVal(true);
        setHelpText("*required");
      }
    }
  };
  return (
    <>
      <div className="row">
        <div className="col">
          <div className="form-group floating-label">
            <input id="file-input" type="file" onChange={ChangeHandler} />

            {required
              ? selectedFile.length == 0 && (
                <div className="invalid-feedback invalid-field ml-2">
                  <small id="" className="form-text text-danger mt-2">
                    *required
                  </small>
                </div>
              )
              : null}
          </div>
        </div>
      </div>
    </>
  );
}

function RendertextArea({
  validation,
  required,
  unique,
  title,
  ErrorVal1,
  save,
  code,
  Regex,
  props,
  adminId,
  EnableSaveButton,
}: TextRender): any {
  const [ErrorVal, setErrorVal] = useState(false);
  const [Check, setCheck] = useState(false);
  const [value, setValue] = useState("");
  const [helpText, setHelpText] = useState("");

  function handleChange(input: string, title: string) {
    setValue(input);
    save(code, input);
    if (required) {
      if (input != "") {
        EnableSaveButton(code, true);
        setErrorVal(false);
        setHelpText("");
      } else {
        setErrorVal(true);
        setHelpText("*required");
      }
    }
  }
  return (
    <>
      {/* <FormChild> */}
      <div className="row">
        <div className="col">
          <div className="form-group floating-label">
            <textarea
              rows={3}
              className={
                value == ""
                  ? "form-control"
                  : ErrorVal
                    ? "form-control focus-visible is-invalid"
                    : "form-control focus-visible is-valid"
              }
              autoComplete="on"
              value={value}
              onChange={(e: any) => {   
                handleChange(e.target.value, title);
              }}
              required={required}
            />

            {/* {Check && code == "name" && (
          <div className="validationIcon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              viewBox="0 0 50 50"
              fill="none"
            >
              <circle cx="25" cy="25" r="25" fill="#E7FFE7" />
              <path
                d="M34.3337 18L21.5003 30.8333L15.667 25"
                stroke="#50CB93"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        {Check && code == "email" && (
          <div className="validationIcon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              viewBox="0 0 50 50"
              fill="none"
            >
              <circle cx="25" cy="25" r="25" fill="#E7FFE7" />
              <path
                d="M34.3337 18L21.5003 30.8333L15.667 25"
                stroke="#50CB93"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )} */}
            <label htmlFor={title}>{title}</label>
            {/* {ErrorVal ? ( */}
            <div className="invalid-feedback ml-2">
              <small id="" className="form-text text-danger mt-2">
                {helpText}
              </small>
            </div>

            {required
              ? value == "" && (
                <div className="invalid-feedback invalid-field ml-2">
                  <small id="" className="form-text text-danger mt-2">
                    *required
                  </small>
                </div>
              )
              : null}
            {/* ) : null} */}
            {/* 
        {required ? code == "name" && value == "" && (
          <div className="invalid-feedback invalid-field ml-2">
            <small id="" className="form-text text-danger mt-2">
              *required
            </small>
          </div>
        ) : null}

        {required ? code == "email" && value == "" && (
          <div className="invalid-feedback invalid-field ml-2">
            <small id="" className="form-text text-danger mt-2">
              *required
            </small>
          </div>
        ) : null}
        {required ? code == "fname" && value == "" && (
          <div className="invalid-feedback invalid-field ml-2">
            <small id="" className="form-text text-danger mt-2">
              *required
            </small>
          </div>
        ) : null}
        {required ? code == "lname" && value == "" && (
          <div className="invalid-feedback invalid-field ml-2">
            <small id="" className="form-text text-danger mt-2">
              *required
            </small>
          </div>
        ) : null} */}
          </div>
        </div>
      </div>

      {/* </FormChild> */}
    </>
  );
}

function RenderDate({
  validation,
  required,
  unique,
  title,
  ErrorVal1,
  save,
  code,
  Regex,
  props,
  adminId,
  EnableSaveButton,
}: TextRender): any {
  const [startDate, setStartDate] = useState<any>(new Date());

  return (
    <div className="row">
      <div className="col-3">
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
          selected={startDate}
          onChange={(date: any) => {
            setStartDate(date);
            save(code, moment(date).format("MMMM Do YYYY, h:mm:ss a"));

            // setchangedDate(true);
          }}
        />
      </div>
    </div>
  );
}

function RenderNumber({
  unique,
  required,
  validation,
  country_code,
  titleNumber,
  save,
  EnableSaveButton,
  code,
  Regex,
  placeholder,
  props,
  adminId,
  countryCode,
  options,
}: any): any {
  const [ErrorVal, setErrorVal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [helpText, setHelpText] = useState("");
  const [activeUser, setactiveUser] = useState("");
  const [Change, setChange] = useState("");
  const [Check, setCheck] = useState(false);
  const [ContryCode, setContryCode] = useState<any>();
  function setUser(user_id: string) {
    setChange(user_id);
    setactiveUser(user_id);
  }
  // useEffect(() => {
  //     save(code, activeUser + "-" + phoneNumber);
  // }, []);
  countryCode(ContryCode);
  function handleChange(e: any) {
    if (required) {
       EnableSaveButton(code, true);
      if (e != "") {
        setErrorVal(false);
        setHelpText("");
      } else {
        setErrorVal(true);
        setHelpText("*required");
      }
    }

    if (
      ((e.charCodeAt(e.length - 1) >= 48 && e.charCodeAt(e.length - 1) <= 57) ||
        e == "") &&
      e.length <= 10
    ) {
      if (e.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)) {
        setErrorVal(false);
        setHelpText("");
        if (required) {
          if (unique) {
            fetch(
              `https://devbackend.cedcommerce.com/remote/public/cedcommercewebapi/request/checkFieldsUniqueness?${code}=${e}&admin_id=${adminId}`
            )
              .then((m3) => m3.json())
              .then((m3) => {
                if (m3.success) {
                  setCheck(false);
                  setErrorVal(true);
                  setHelpText(
                    `Phone number already exists. Login or choose a different phone no.`
                  );
                } else {
                  EnableSaveButton(code, true);

                  setCheck(true);
                  setErrorVal(false);
                }
              });
          } else {
            EnableSaveButton(code, true);

            setCheck(true);
            setErrorVal(false);
          }
        } else {
          if (unique) {
            fetch(
              `https://devbackend.cedcommerce.com/remote/public/cedcommercewebapi/request/checkFieldsUniqueness?${code}=${e}&admin_id=${adminId}`
            )
              .then((m3) => m3.json())
              .then((m3) => {
                if (m3.success) {
                  setCheck(false);
                  setErrorVal(true);
                  setHelpText(
                    `Phone number already exists. Login or choose a different phone no.`
                  );
                } else {
                  setCheck(true);
                  setErrorVal(false);
                }
              });
          } else {
            setCheck(true);
            setErrorVal(false);
          }
        }
      } else {
        // if (unique) {

        //   fetch(
        //     `https://devbackend.cedcommerce.com/remote/public/cedcommercewebapi/request/checkFieldsUniqueness?${code}=${e}&admin_id=${adminId}`
        //   )
        //     .then((m3) => m3.json())
        //     .then((m3) => {
        //       if (m3.success) {
        //         EnableSaveButton(code, true);
        //         setCheck(false);
        //         setErrorVal(true);
        //         setHelpText(
        //           `Phone number already exists. Login or choose a different phone no.`
        //         );
        //       } else {
        //         if (required == true) {
        //           EnableSaveButton(code, false);

        //         }
        //         setCheck(true);
        //         setErrorVal(false);
        //       }
        //     });
        // } else {
        //   setCheck(true);
        //   setErrorVal(false);
        // }

        setErrorVal(true);
        setHelpText("Phone number must have 10 digits.e.g. 8754123698");
        setCheck(false);
       
      }

      setPhoneNumber(e);
      save(code, e);
    }
  }
 
  
  return (
    <>
      <div className="row">
        <div className="col-4">
          <select
            className="form-control"
            name=""
            id=""
            placeholder="Country Code"
            value={ContryCode}
            onChange={(e) => {
              e.target.value != "Choose country code" && setContryCode(e.target.value);
            }}
          >
            <option value={"Choose country code"}>
              {`Choose country code`}
            </option>
            {Object.keys(country_code).map((e) => {
              return (
                country_code[e].dial_code !== "" && (
                  <>
                    <option key={e} value={country_code[e].dial_code}>
                      {`${country_code[e].dial_code} ${country_code[e].name}`}
                    </option>
                  </>
                )
              );
            })}
          </select>
          {ContryCode === "Choose country code"
            && (
              <div className="invalid-feedback invalid-field ml-2">
                <small id="" className="form-text text-danger mt-2">
                  *required
                </small>
              </div>
            )
          }

          {/* <div className="form-group floating-label">
            <input
              disabled
              className="form-control"
              type="text"
              // onChange={(e: any) => handleChange(e.target.value)}
              value="Australia +61"
            /> */}
          {/* <label htmlFor={titleNumber}>{titleNumber}</label>
                        {ErrorVal && <div className="invalid-field"> <small id="" className="form-text text-muted mt-2">{helpText}</small></div>
                        } */}
          {/* </div> */}
        </div>

        {/* <AutoComplete
          name="Country Code"
          thickness="thin"
          setUser={setUser}
          onChange={(e) => {
            setChange(e);
          }}
          options={options}
          onEnter={(e: string) => setChange(e)}
          value={Change}
        /> */}
        {/* <select>
          {Object.keys(options).map((m) => {
            <option value={options[m].value}>{options[m].label}</option>;
          })}
        </select> */}

        <div className="col-8">
          <div className="form-group">
            <input
              placeholder={titleNumber}
              className={
                phoneNumber == ""
                  ? "form-control"
                  : ErrorVal
                    ? "form-control is-invalid"
                    : "form-control is-valid"
              }
              type="text"
              onChange={(e: any) => handleChange(e.target.value)}
              value={phoneNumber}
              required={required}
            />
            {/* {Check && (
              <div className='validationIcon'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='50'
                  height='50'
                  viewBox='0 0 50 50'
                  fill='none'
                >
                  <circle cx='25' cy='25' r='25' fill='#E7FFE7' />
                  <path
                    d='M34.3337 18L21.5003 30.8333L15.667 25'
                    stroke='#50CB93'
                    strokeWidth='3'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
            )} */}
            {/* <label htmlFor={titleNumber}>{titleNumber}</label> */}

            {ErrorVal && (
              <div className="invalid-field ml-2">
                {" "}
                <small id="" className="form-text text-danger mt-2">
                  {helpText}
                </small>
              </div>
            )}
            {required
              ? phoneNumber == "" && (
                <div className="invalid-feedback invalid-field ml-2">
                  <small id="" className="form-text text-danger mt-2">
                    *required
                  </small>
                </div>
              )
              : null}
          </div>
        </div>
      </div>
    </>
  );
}

interface pswrd {
  titlePassword: string;
  save: (a: string, b: string) => any;
  code: string;
  Regex: any;
  EnableSaveButton(a: string, b: boolean): void;
  CFpswrd: any;
}

function RenderPassword({
  titlePassword,
  CFpswrd,
  save,
  EnableSaveButton,
  code,
  Regex,
}: pswrd): any {
  const [ErrorVal, setErrorVal] = useState(false);
  const [pswrd, setPswrd] = useState("");
  const [helpText, setHelpText] = useState("");
  const [Check, setCheck] = useState(false);

  function handleCheck() {
    if (!pswrd.match(Regex.password) && pswrd != "") {
      setErrorVal(true);
      setCheck(false);
      setHelpText(
        "Password should have a minimum of 8 characters with at least one alphabet, one digit, and one special character."
      );
      EnableSaveButton(code, false);
    } else {
      setCheck(true);

      setErrorVal(false);
      save(code, pswrd);
      EnableSaveButton(code, true);
      setHelpText("");
    }
  }
  useEffect(() => {
    if (pswrd != "" || pswrd != undefined) {
      setCheck(false);
      handleCheck();
    }
  }, [pswrd]);
  function handleChange(e: any) {
    setPswrd(e);
    handleCheck();
  }

  return (
    <>
      <div className="row">
        <div className="col">
          <div className="form-group">
            <input
              placeholder="Password"
              className={
                pswrd == ""
                  ? "form-control"
                  : ErrorVal
                    ? "form-control invalid-field"
                    : "form-control"
              }
              type="password"
              autoComplete="new-password"
              // showHelp={helpText}
              // error={ErrorVal}
              name={titlePassword}
              value={pswrd}
              onChange={(e: any) => {
                handleChange(e.target.value);
              }}
              required
            />
            {CFpswrd && (
              <div className="validationIcon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="50"
                  height="50"
                  viewBox="0 0 50 50"
                  fill="none"
                >
                  <circle cx="25" cy="25" r="25" fill="#E7FFE7" />
                  <path
                    d="M34.3337 18L21.5003 30.8333L15.667 25"
                    stroke="#50CB93"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
            {/* <label htmlFor={titlePassword}>{titlePassword}</label> */}
            {ErrorVal && (
              <div className="invalid-field ml-2">
                <small id="" className="form-text text-danger mt-2">
                  {helpText}
                </small>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
interface repswrd {
  titleRepassword: string;
  save: (a: string, b: string) => any;
  code: string;
  error: any;
  CFpswrd: any;
}

function RenderRepassword({
  titleRepassword,
  save,
  CFpswrd,
  code,
  error,
}: repswrd): any {
  const [repswrd, setRepswrd] = useState("");
  function handleChange(e: any) {
    setRepswrd(e);
    save(code, e);
  }
  return (
    <>
      {/* <FormChild> */}

      <div className="row">
        <div className="col">
          <div className="form-group">
            <input
              placeholder="Confirm Password"
              className={
                repswrd == ""
                  ? "form-control"
                  : error
                    ? "form-control invalid-field"
                    : "form-control"
              }
              type="password"
              autoComplete="new-password"
              value={repswrd}
              onChange={(e: any) => handleChange(e.target.value)}
              required
            />
            {CFpswrd && (
              <div className="validationIcon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="50"
                  height="50"
                  viewBox="0 0 50 50"
                  fill="none"
                >
                  <circle cx="25" cy="25" r="25" fill="#E7FFE7" />
                  <path
                    d="M34.3337 18L21.5003 30.8333L15.667 25"
                    stroke="#50CB93"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
            {/* <label htmlFor={titleRepassword}>{titleRepassword}</label> */}

            {error && (
              <div className="invalid-field ml-2">
                {" "}
                <small
                  id=""
                  className="form-text text-danger mt-2"
                  style={{ color: "red" }}
                >
                  Password and Confirm Password do not match
                </small>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* </FormChild> */}
    </>
  );
}
// function RenderComp({titleEmail, save, code, regex = ""}:any) {

//     return <>
//         <FormChild>
//             <TextField name={titleRepassword} value={repswrd} onChange={(e) => { setRepswrd(e); save(code, e); }} thickness='thin' />
//         </FormChild>
//     </>;
// }
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

export interface AutoCompleteI {
  options?: any;
  value?: string;
  name?: string;
  onEnter?: (e: string) => void;
  onChange?: (e: string) => void;
  thickness?: "thin" | "";
  setUser?: (e: string) => void;
}

const AutoComplete: FC<AutoCompleteI> = ({
  options = [
    { value: "option1", label: "option1" },
    { value: "option1", label: "option2" },
    { value: "option1", label: "option3" },
    { value: "Abc", label: "Abc" },
    { value: "Apple", label: "Apple" },
    { value: "Computer", label: "Computer" },
  ],
  name = "",
  value = "",
  onEnter = () => {
    return null;
  },
  onChange = () => {
    return null;
  },
  setUser = () => {
    return null;
  },
  thickness = "",
}: AutoCompleteI) => {
  const [showList, setshowList] = useState(true);
  return (
    <React.Fragment>
      {name ? <TextStyles type="SubHeading">{name}</TextStyles> : null}
      <div className="inte__AutoComplete">
        <span
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              setshowList(false);
              onEnter(value);
            }
          }}
        >
          <TextField
            placeHolder="Country Code"
            // showHelp="Enter Country Name/Country code"
            thickness={thickness}
            value={value}
            onChange={(e) => {
              setshowList(true);
              onChange(e);
            }}
          // onEnter={() => {
          //   onEnter;
          // }}
          />
          <ul>
            {showList &&
              value.length > 0 &&
              options
                .filter((e: any) =>
                  e.value.toLowerCase().includes(value.toLowerCase())
                )
                .map((e: any, i: number) => (
                  <li
                    key={i}
                    onClick={() => {
                      setshowList(false);
                      onEnter(e.display);
                      setUser(e.user_id);
                    }}
                  >
                    <TextStyles>{e.label}</TextStyles>
                  </li>
                ))}
          </ul>
        </span>
      </div>
    </React.Fragment>
  );
};

export default DI(Signup);
