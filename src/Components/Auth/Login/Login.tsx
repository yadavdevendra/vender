/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { DI, DIProps } from "../../../Core";
import { useSelector, useDispatch } from "react-redux";
import {
  FlexLayout,
  Toast,
  CheckBox,
  Modal,
  TextStyles,
  Button,
  ToastWrapper,
} from "@cedcommerce/ounce-ui";
import * as queryString from "query-string";
import { environment } from "../../../environments/environment";
import jwtDecode from "jwt-decode";
// interface LoginProp extends DIProps{
//   queryParamsToken:string
// }

function Login(props: any): JSX.Element {
  const dispatchID = useDispatch();
  const [adminId, setadminId] = useState("");
  const [remember, setRemember] = useState<any>(false);
  const [username, chngusername] = useState<any>("");
  const [userpassword, chngUserPass] = useState<any>("");
  const [load, loadingState] = useState(false);
  const [error, chngeErr] = useState(false);
  const [errMsg, chanerrMsg] = useState("");
  const [EmailConfirm, setEmailConfirm] = useState(false);
  const [Success, setSuccess] = useState("");
  const [Message, setMessage] = useState("");

  useEffect(() => {
    autoRedirect();
    if (window.location.href.indexOf("token") == -1) {
      props.di
        .GET(
          `/connector/vendor/getAdminId?admin_shop_id=${
            props.location.pathname.split("/")[3]
          }`
        )
        .then((e: any) => {
          if (e.success) {
            setadminId(e.admin_id);
          }
        });
    } else {
      const token = queryString.parse(props.location.search).token;
      if (token != "") {
        props.di
          .GET(
            `/connector/vendor/getAdminId?admin_shop_id=${
              props.location.pathname.split("/")[3]
            }`
          )
          .then((e: any) => {
            if (e.success) {
              setadminId(e.admin_id);
              props.di
                .GET(`user/verifyuser?token=${token}&admin_id=${e.admin_id}`)
                .then((data: any) => {
                  if (data.success == true) {
                    setEmailConfirm(true);
                    setSuccess("true");
                    setMessage(data.message);
                  } else {
                    setEmailConfirm(true);

                    setSuccess("false");
                    setMessage(data.message);
                  }
                });
            }
          });
      } else {
        setEmailConfirm(true);

        setSuccess("invalid");
        setMessage("Unable to complete your request, please try again later");
      }
    }
  }, []);

  function autoRedirect() {
    const queryParamsToken: any = queryString.parse(
      props.location.search
    ).user_token;
    if (queryParamsToken != null) {
      props.di.globalState.setsessionStorage("user_authenticated", "true");
      const uId: any = jwtDecode(queryParamsToken);
      environment["user_id"] = uId.user_id;
      props.di.globalState.setsessionStorage("vendor_token", queryParamsToken);
      props.history.push("/", props.location.pathname.split("/")[3]);
    }
  }
  /**
   * Function to call LOGIN API
   */
  function SubmitData(): void {
    if (username === "" || userpassword === "") {
      chanerrMsg("Please fill username and password.");
      chngeErr(true);
    } else {
      loadingState(true);
      const url = "user/login";
      const data = {
        panel: "vendor",
        username: username.toLowerCase(),
        password: userpassword,
        admin_id: adminId,
      };
      props.di.POST(url, data).then((e: any) => {
        // const count = useSelector((state) => console.log(state));
        // console.log(count, "cou");
        chanerrMsg(e.message);
        if (e.success == true) {
          const uId: any = jwtDecode(e.data.token);
          environment["user_id"] = uId.user_id;
          props.idByLogin(uId.user_id);
          dispatchID({ type: "SUPPLIER_ID", payload: uId.user_id });
          props.di.globalState.setsessionStorage("user_authenticated", "true");
          props.di.globalState.setsessionStorage("vendor_token", e.data.token);
          props.history.push("/", { sup: 45 });
          console.log("Sami");
          
        } else {
          chngeErr(true);
        }
        loadingState(false);
      });
    }
  }
  function handleRemember() {
    if (remember == true) {
      props.di.globalState.setsessionStorage("checked", remember);
      props.di.globalState.setsessionStorage("username", username);
      props.di.globalState.setsessionStorage("password", userpassword);
    }
  }
  function handleChange(e: string) {
    chngusername(e);
  }
  function rememberMe() {
    const temp: any = window.sessionStorage.getItem("checked");

    if (temp == "true") {
      chngusername(window.sessionStorage.getItem("username"));
      chngUserPass(window.sessionStorage.getItem("password"));
    } else {
      window.sessionStorage.removeItem("username");
      window.sessionStorage.removeItem("password");
    }
  }
  useEffect(() => {
    rememberMe();
  }, []);
  return (
    <>
      <ToastWrapper>
        {" "}
        {error ? (
          <Toast
            timeout={3000}
            message={errMsg}
            type="error"
            onDismiss={() => {
              chngeErr(!error);
            }}
          />
        ) : null}
      </ToastWrapper>
      {Message !== "" && (
        <Modal
          modalSize="small"
          heading="Message"
          open={EmailConfirm}
          close={() => {
            setEmailConfirm(!EmailConfirm),
              props.history.push(
                `/auth/login/${props.location.pathname.split("/")[3]}`
              );
          }}
        >
          <FlexLayout direction="vertical" valign="start" spacing="loose">
            <TextStyles type="simpleText">{Message}</TextStyles>
            <Button
              thickness="thin"
              type="Small"
              onClick={() => {
                setEmailConfirm(!EmailConfirm),
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
      <>
        <section className="loginSignup__Wrapper">
          <div className="header__section pb-4 mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="heading--mediumUp">Login</h2>
            </div>
          </div>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                // className={
                //   username == "" ? "form-control" : "form-control focus-visible"
                // }

                autoComplete="new-password"
                placeholder="Email/Username"
                value={username}
                onChange={(e: any) => handleChange(e.target.value)}
                id="email"
                required
                // autoFocus
                aria-autocomplete="none"
              />
              {/* <label htmlFor='Email'>Email/Username</label> */}
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                // className={
                //   userpassword == ""
                //     ? "form-control"
                //     : "form-control focus-visible"
                // }
                value={userpassword}
                autoComplete="new-password"
                // autoFocus
                onChange={(e) => chngUserPass(e.target.value)}
                id="pwd"
                required
              />
              {/* <label htmlFor='Password'>Password</label> */}
            </div>
            <div className="form-group">
              <FlexLayout halign="fill" spacing="extraLoose">
                <label className="form-check-label">
                  <CheckBox
                    labelVal="Keep me signed in"
                    onClick={() => {
                      setRemember(!remember);
                      handleRemember();
                    }}
                    checked={remember}
                  ></CheckBox>
                </label>
                <small id="" className="form-text text-muted text-right mt-2">
                  <button
                    type="button"
                    className="btn btn-link p-0 fs-14"
                    onClick={() =>
                      props.history.push(
                        `/auth/forgot/${props.location.pathname.split("/")[3]}`
                      )
                    }
                  >
                    Forgot Password
                  </button>
                </small>
              </FlexLayout>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block buttonload"
              onClick={() => {
                SubmitData();
              }}
            >
              {load ? (
                // <i className='fa fa-circle-o-notch fa-spin'></i>
                <span className={"inte-dual-ring"}></span>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </section>
        <br />
      </>
    </>
  );
}

export default DI(Login);