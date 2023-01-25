/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Modal, TextStyles, FlexLayout } from "@cedcommerce/ounce-ui";
import React, { useState, Component, useEffect } from "react";
import { DI, DIProps } from "../../../Core";
import * as queryString from "query-string";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/g;

function Reset(props: DIProps): JSX.Element {
  const t = queryString.parse(props.location.search).token;
  const [ErrorVal, setErrorVal] = useState(false);

  const [ExpiredMessage, setExpiredMessage] = useState("");

  const [ModalOpenSuccess, setModalOpenSuccess] = useState(false);
  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState("");
  const [password, chngUserPassword] = useState("");
  const [ConfirmPassword, chngUserCnfPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ModalOpen, setModalOpen] = useState<boolean>(false);
  const [adminId, setadminId] = useState("");
  const [CnfrmPswrd, setCnfrmPswrd] = useState(false);

  const [error, chngeErr] = useState(false);
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
          props.di.GET(`/user/verifyuser?token=${t}`).then((e) => {
            if (!e.success) {
              setExpiredMessage(e.message);
              setModalOpen(true);
              // setTokenExpire(true);
              // setTimeout(function () { props.history.push('/auth/login'); }, 2000);
            }
          });
        }
      });
  }, []);

  function reset() {
    setLoading(true);
    if (!ErrorVal) {
      if (password == ConfirmPassword && password != "") {
        setCnfrmPswrd(false);
        const data: any = {
          new_password: password,
          token: t,
          admin_id: adminId,
        };
        props.di.POST("user/resetpassword", data).then((e) => {
          if (e.success) {
            setMessage(e.message);
            setModalOpenSuccess(true);
            setToast(true);
          }
          setLoading(false);
        });
      } else {
        chngeErr(true);
        setCnfrmPswrd(true);
      }
    }
  }

  const [HelpText, setHelpText] = useState<any>("");
  function handleValidation(password: string) {
    if (!password.match(passwordRegex)) {
      setErrorVal(true);
      setHelpText(
        "Password should have a minimum of 8 characters with at least one alphabet, one digit, and one special character."
      );
    } else {
      setErrorVal(false);
      setHelpText("");
    }
  }

  return (
    <>
      <ToastWrapper>
        {/* {error && <Toast timeout={3000} message="Password Not Matched" type="error" onDismiss={() => { chngeErr(!error); }} />} */}
        {/* {toast && <Toast timeout={3000} message={message} type="success" onDismiss={() => { setToast(!toast); }} />}
            {TokenExpire && <Toast timeout={3000} message={ExpiredMessage} type="error" onDismiss={() => { setTokenExpire(!TokenExpire); }} />} */}
      </ToastWrapper>
      <section className="loginSignup__Wrapper">
        <div className="header__section pb-4 mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="heading--mediumUp">Reset Password</h2>
          </div>
        </div>
        <form
          onSubmit={(event) => event.preventDefault()}
          className="needs-validation"
          noValidate
        >
          <div className="row">
            <div className="col">
              <div className="form-group floating-label">
                <input
                  type="password"
                  name="password"
                  className={
                    password == ""
                      ? "form-control"
                      : ErrorVal
                      ? "form-control focus-visible invalid-field"
                      : "form-control focus-visible"
                  }
                  value={password}
                  onChange={(e) => {
                    chngUserPassword(e.target.value);
                    handleValidation(e.target.value);
                  }}
                  required
                />
                <label htmlFor="password">Password</label>
                {ErrorVal && (
                  <div className="invalid-feedback invalid-field ml-2">
                    <small id="" className="form-text text-danger mt-2">
                      {HelpText}
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="form-group floating-label">
                <input
                  required
                  name="ConfirmPassword"
                  type="password"
                  className={
                    ConfirmPassword == ""
                      ? "form-control"
                      : CnfrmPswrd
                      ? "form-control focus-visible invalid-field"
                      : "form-control focus-visible"
                  }
                  value={ConfirmPassword}
                  onChange={(e) => {
                    chngUserCnfPassword(e.target.value);
                  }}
                />
                <label htmlFor="ConfirmPassword">Confirm Password</label>

                {CnfrmPswrd && (
                  <div className="invalid-feedback invalid-field ml-2">
                    <small id="" className="form-text text-danger mt-2">
                      Password and Confirm Password do not match
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="form-group ">
            <button
              type="submit"
              className="btn btn-primary btn-block mb-4"
              onClick={() => reset()}
            >
              Reset
            </button>
          </div>
        </form>
      </section>

      <Modal
        modalSize="small"
        heading="Message"
        open={ModalOpen}
        close={() => {
          setModalOpen(!ModalOpen),
            props.history.push(
              `/auth/login/${props.location.pathname.split("/")[3]}`
            );
        }}
      >
        <FlexLayout direction="vertical" valign="start" spacing="loose">
          <TextStyles type="simpleText">{ExpiredMessage}</TextStyles>
          <Button

            // thickness="thin"
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
      <Modal
        modalSize="small"
        heading="Message"
        open={ModalOpenSuccess}
        close={() => setModalOpenSuccess(!ModalOpenSuccess)}
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
    // const children = React.Children.toArray(this.props.children);
    return <div className={"inte-toast--Wrapper"}>{this.props.children}</div>;
  }
}
export default DI(Reset);
