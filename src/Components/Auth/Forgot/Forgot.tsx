/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  FlexLayout,
  Toast,
  FormChild,
  Modal,
  TextStyles,
  ToastWrapper,
} from "@cedcommerce/ounce-ui";
import React, { useState, Component, useEffect } from "react";
import { DI, DIProps } from "../../../Core";
import * as queryString from "query-string";

function Forgot(props: DIProps): JSX.Element {
  const mailformat =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]+\.+([a-zA-Z0-9-]+)2*$/;

  // const [loading, setLoading] = useState(false);
  const [ErrorType, SetErrorType] = useState("");
  const [userEmail, chnguserEmail] = useState("");
  const [adminId, setadminId] = useState("");
  const [errEmail, Err] = useState(false);
  const [message, setMessage] = useState("");
  const [MailSent, setMail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ModalOpen, setModalOpen] = useState<boolean>(false);

  function fetchUser(): void {
    const url = "forgot?username=" + userEmail;
    props.di.GET(url).then((e) => {
      if (e.success == true) {
        props.history.push(
          `/auth/login/${props.location.pathname.split("/")[3]}`
        );
      }
    });
  }
  useEffect(() => {
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
  }, []);

  function fetchEmail(): void {
    const url = "user/forgot";
    setLoading(true);
    const data = {
      email: userEmail,
      reset_link: `${location.href.split("/auth")[0]}.au/auth/reset?token=`,
      admin_id: adminId,
    };
    props.di.POST(url, data).then((e) => {
      if (e.success) {
        // setMail(true);
        setModalOpen(true);
        SetErrorType("success");
        setMessage(e.message);
        // setTimeout(() => { props.history.push("/template/home"); }, 2000);
      } else {
        setModalOpen(true);

        // setMail(true);
        SetErrorType("error");
        setMessage(e.message);
      }
      setLoading(false);
    });
  }
  const [Error, SetError] = useState(false);
  const [ErrorVal, setErrorVal] = useState(false);
  function EmainVal(): void {
    const mailformat =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]+\.+([a-zA-Z0-9-]+)2*$/;
    userEmail.match(mailformat) ? fetchEmail() : fetchUser();
  }

  return (
    <div>
      <ToastWrapper>
        {" "}
        {MailSent && (
          <Toast
            timeout={3000}
            message={message}
            type={ErrorType}
            onDismiss={() => {
              setMail(!MailSent);
            }}
          />
        )}
        {errEmail && (
          <Toast
            timeout={3000}
            message="Not Valid Email"
            type={ErrorType}
            onDismiss={() => {
              Err(!errEmail);
            }}
          />
        )}
      </ToastWrapper>
      <section className="loginSignup__Wrapper">
        <div className="header__section pb-4 mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="heading--mediumUp">Forgot Password</h2>
          </div>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className={"needs-validation"}
          noValidate
        >
          <div className="form-group floating-label">
            <input
              required
              type="text"
              placeholder="Registered Email ID"
              // className={Error ? "form-control is-invalid" : "form-control focus-visible"}
              className={
                userEmail == ""
                  ? "form-control"
                  : ErrorVal
                  ? "form-control focus-visible is-invalid"
                  : "form-control focus-visible"
              }
              autoComplete="new-password"
              value={userEmail}
              onChange={(e) => {
                chnguserEmail(e.target.value);
                if (e.target.value.match(mailformat)) {
                  setErrorVal(false);
                } else {
                  setErrorVal(true);
                }
              }}
              id="pwd"
            />
            {/* <label htmlFor="Email ID">Registered Email ID</label> */}
            {userEmail != "" ? (
              <div className="invalid-feedback ml-2">
                <small id="" className="form-text text-danger mt-2">
                  Enter valid email ID.
                </small>
              </div>
            ) : (
              <div className="invalid-feedback ml-2">
                <small id="" className="form-text text-danger mt-2">
                  required*
                </small>
              </div>
            )}
          </div>

          <div className="form-group">
            <button
              type="submit"
              className="btn btn-primary btn-block"
              onClick={() => EmainVal()}
            >
              {" "}
              Send Email
            </button>
          </div>
        </form>
      </section>

      {/* </Card> */}
      <Modal
        modalSize="small"
        heading="Message"
        open={ModalOpen}
        close={() => setModalOpen(!ModalOpen)}
      >
        <FlexLayout direction="vertical" valign="start" spacing="loose">
          <TextStyles type="simpleText">{message}</TextStyles>
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
    </div>
  );
}

export default DI(Forgot);
