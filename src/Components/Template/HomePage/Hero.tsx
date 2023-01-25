/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { DI } from "./../../../Core";

function Hero(props: any) {
  function handlesignup() {
    if (sessionStorage.getItem("vendor_token") == null) {
      props.history.push(`/auth/signup`);
    } else {
      props.history.push("/dashboard");
    }
  }
  return (
    <>
      <section className="hero__section section">
        <div className="hero__section--textWrapper text-center">
          <h1 className="main__heading mb-5">{props.header["Heading"]}</h1>
          <h4 className="heading--medium mb-3">{props.header["Subheading"]}</h4>

          {/* <button
            type="button"
            className="btn btn-primary mt-5"
            onClick={() => {
              handlesignup();
            }}
          >
            Register Now
          </button> */}
        </div>
      </section>
    </>
  );
}

export default DI(Hero);
