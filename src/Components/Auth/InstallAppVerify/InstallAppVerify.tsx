/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Card,
  FlexLayout,
  TextField,
  TextStyles,
  Toast,
  ToastWrapper,
} from "@cedcommerce/ounce-ui";

import React, { useState } from "react";
import * as queryString from "query-string";

import { DI, DIProps } from "../../../Core";
function InstallAppVerify(props: DIProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailHelptext, setEmailHelptext] = useState("");
  const [paswordHelptext, setPaswordHelptext] = useState("");
  /**
   * @function handleSubmit is used for verify user.
   * @const DataToSend is used to saved data to send with an api to verify the user.
   */

  function saveLoginToken(redirectUrl: string) {
    const url = "user/login";
    const data = {
      panel: "vendor",
      username: username,
      password: password,
      admin_id: "338",
    };
    props.di.POST(url, data).then((e) => {
      if (e.success == true) {
        props.di.globalState.setsessionStorage("user_authenticated", "true");
        props.di.globalState.setsessionStorage("vendor_token", e.data.token);
        window.location.href = redirectUrl;
      }
    });
  }

  function handleSubmit() {
    if (
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(username) &&
      /^(?!\s*$).+/.test(password)
    ) {
      const DataToSend: any = {
        ...{
          email: username,
          password: password,
          admin_id: "338",
        },
        ...queryString.parse(props.location.search),
      };
      fetch(
        "https://devbackend.cedcommerce.com/remote/public/apiconnect/request/commenceAuth?sAppId=3",
        {
          method: "POST",
          body: JSON.stringify(DataToSend),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((result) => {
          if (result.success) {
            saveLoginToken(result.redirect_url);
          } else {
            setToast(true);
            setMessage(result.message);
          }
        });
    } else {
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(username)
        ? setEmailHelptext("")
        : setEmailHelptext("Invalid Email");
      /^(?!\s*$).+/.test(password)
        ? setPaswordHelptext("")
        : setPaswordHelptext("Required");
    }
  }

  return (
    <div style={{ overflowY: "hidden" }}>
      <div
        style={{
          paddingLeft: "170px",
          paddingRight: "170px",
          paddingTop: "10px",
        }}
      >
        <div className="pb-3">
          <TextStyles type="simpleText" alignment="center">
            <a>
              {queryString.parse(props.location.search).shop || "Not Available"}
            </a>
          </TextStyles>
        </div>
        <Card header={"header"}>
          <TextStyles type="HeadingMedium" alignment="center" textcolor="dark">
            Connect With Ozdingo
          </TextStyles>
          <hr className="text-muted" />
          <FlexLayout spacing="extraLoose">
            <FlexLayout halign="start">
              <iframe
                title="YouTube video player"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                width="500"
                height="300"
                src="https://www.youtube.com/embed/tgbNymZ7vqY"
              ></iframe>
            </FlexLayout>

            <FlexLayout halign="end">
              <div className="wrapper">
                <ul className="StepProgress">
                  <li className="StepProgress-item is-done">
                    <strong>
                      If you do not have supplier account in ozdingo then first
                      create account.
                    </strong>
                  </li>
                  <li className="StepProgress-item is-done">
                    <strong>
                      Ozdingo supplier Registration :{" "}
                      <Button
                        type="Plain"
                        thickness="thin"
                        onClick={() => {
                          props.history.push("/auth/signup");
                        }}
                      >
                        Click here
                      </Button>
                    </strong>
                  </li>
                </ul>
              </div>
            </FlexLayout>
          </FlexLayout>
          <hr />
          <div
            style={{
              width: "500px",
              marginLeft: "250px",
              marginTop: "25px",
            }}
          >
            <FlexLayout direction="vertical" spacing="loose">
              <TextStyles type="mediumText">Email</TextStyles>
              <TextField
                type="text"
                error={emailError}
                value={username}
                onChange={(val) => {
                  if (val === "") {
                    setEmailError(true);
                    setEmailHelptext("Required");
                  } else if (
                    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)
                  ) {
                    setEmailError(false);
                    setEmailHelptext("");
                  } else if (
                    !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)
                  ) {
                    setEmailError(true);
                    setEmailHelptext("");
                  }
                  setUsername(val);
                }}
              ></TextField>
              {emailError && (
                <small style={{ color: "red" }}>{emailHelptext}</small>
              )}
              <TextStyles type="mediumText">Password</TextStyles>
              <TextField
                error={passwordError}
                type="password"
                value={password}
                onChange={(val) => {
                  if (val === "") {
                    setPasswordError(true);
                    setPaswordHelptext("Required");
                  } else if (/^(?!\s*$).+/.test(val)) {
                    setPasswordError(false);
                    setPaswordHelptext("");
                  } else if (!/^(?!\s*$).+/.test(val)) {
                    setPasswordError(false);
                    setPaswordHelptext("");
                  }
                  setPassword(val);
                }}
              ></TextField>
              {paswordHelptext && (
                <small style={{ color: "red" }}>{paswordHelptext}</small>
              )}
              <FlexLayout halign="start">
                <Button
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  Connect With Ozdingo
                </Button>
              </FlexLayout>
            </FlexLayout>
          </div>
          <hr />
        </Card>

        {toast && (
          <ToastWrapper>
            <Toast
              message={message}
              type="error"
              onDismiss={() => {
                setToast(false);
              }}
            />
          </ToastWrapper>
        )}
      </div>
    </div>
  );
}
export default DI(InstallAppVerify);
