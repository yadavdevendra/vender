import { Card, TextStyles } from "@cedcommerce/ounce-ui";
import React, { useState, useEffect } from "react";
import * as queryString from "query-string";
import { DI, DIProps } from "../../../Core";

function Confirmation(props: DIProps): JSX.Element {
  const t = queryString.parse(props.location.search).token;
  // const [token, setToken] = useState(t);
  const [success, setSuccess] = useState("");
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (t != "") {
      props.di
        .GET(
          `/connector/vendor/getAdminId?${
            props.location.pathname.split("/")[3]
          }`
        )
        .then((e) => {
          if (e.success) {
            props.di
              .GET(`user/verifyuser?token=${t}&admin_id=${e.admin_id}`)
              .then((data) => {
                if (data.success == true) {
                  setSuccess("true");
                  setTimeout(() => {
                    redirect(
                      `/auth/login/${props.location.pathname.split("/")[3]}`
                    );
                  }, 3000);
                } else {
                  // notify(data.message, true);
                  setSuccess("false");
                }
              });
          }
        });
    } else {
      setSuccess("invalid");

      // notify("Please try again later with valid token.", true);
    }
  }, []);
  function redirect(url: string) {
    props.history.push(url);
  }
  switch (success) {
    case "true":
      return <RenderSuccess />;
    case "false":
      return <RenderFalse />;
    case "invalid":
      return <RenderInvalid />;
    default:
      return <RenderLoading />;
  }
}
function RenderSuccess() {
  return (
    <>
      <section className="loginSignup__Wrapper">
        <Card>
          <TextStyles type="SubHeading">
            Email verification successful, please login to your account.
          </TextStyles>
        </Card>
      </section>
    </>
  );
}
function RenderFalse() {
  return (
    <div className="offset-md-2 offset-sm-2 col-md-8 col-sm-8 col-12 ">
      <section className="loginSignup__Wrapper">
        <Card>
          <div className="row">
            <div className="col-sm-2"></div>
            <div className="col-sm-8 mt-5 mb-5 text-left text-primary">
              <h1 className="text-primary text-center">Unable to confirm</h1>

              <div className="mt-4" style={{ fontSize: "16px" }}>
                <div className="col-sm-12">
                  <span>Email : </span>
                  <a
                    href="mailto:info@cedcoss.com"
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    apps@cedcommerce.com
                  </a>
                </div>
              </div>
              <div className="mt-4" style={{ fontSize: "16px" }}>
                <span>Contact Number :</span>{" "}
                <span style={{ color: "black" }}>
                  +91 5224077802 - ext 37, +91 5224077902 - ext 37
                </span>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
function RenderInvalid() {
  return (
    <div>
      <section className="loginSignup__Wrapper">
        <Card>
          <div className="row">
            <div className="col-sm-2"></div>
            <div className="col-sm-8 mt-5 mb-5 text-left text-primary">
              <h1 className="text-primary text-center">
                Unable to complete your request, please try again later with
                valid token or contact to admin.
              </h1>

              <div className="mt-4" style={{ fontSize: "16px" }}>
                <div className="col-sm-12">
                  {/* <Stack>
                                    <Icon source={EmailMajorMonotone} /> */}
                  <span>Email : </span>
                  <a
                    href="mailto:info@cedcoss.com"
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    apps@cedcommerce.com
                  </a>
                  {/* </Stack> */}
                </div>
              </div>
              <div className="mt-4" style={{ fontSize: "16px" }}>
                {/* <Stack>
                                <Icon source={PhoneInMajorMonotone} /> */}
                <span>Contact Number :</span>{" "}
                <span style={{ color: "black" }}>
                  +91 5224077802 - ext 37, +91 5224077902 - ext 37
                </span>
                {/* </Stack> */}
              </div>
            </div>
            <div className="col-sm-2" />
          </div>
        </Card>
      </section>
    </div>
  );
}
function RenderLoading() {
  return (
    <div className="text-center ">
      {/* <Spinner /> */}
      <br />
      <br />
      Loading...
    </div>
  );
}
export default DI(Confirmation);
