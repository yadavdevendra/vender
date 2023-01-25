/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { DI, DIProps } from "./../../../Core";

interface NavbarContent extends DIProps {
  navbar: any;
  admin_shop_id: string;
  header: string;
  logoRedirectTo: string;
}
function Header(props: NavbarContent) {
  function handlelogin() {
    if (sessionStorage.getItem("vendor_token") == null) {
      props.history.push(
        `/auth/login/${
          props.admin_shop_id || props.location.pathname.split("/")[3]
        }`
      );
    } else {
      props.history.push("/dashboard");
    }
  }

  function handlesignup() {
    if (sessionStorage.getItem("vendor_token") == null) {
      props.history.push(
        `/auth/signup/${
          props.admin_shop_id || props.location.pathname.split("/")[3]
        }`
      );
    } else {
      props.history.push("/dashboard");
    }
  }

  return (
    <>
      <nav className="navbar navbar-expand-md justify-content-between ">
        {/* <!-- Brand --> */}
        <span
          style={{ cursor: "pointer" }}
          onClick={() =>
            props.history.push(
              `/home/${
                props.admin_shop_id || props.location.pathname.split("/")[3]
              }`
            )
          }
        >
          {props.navbar != "" && props.navbar != "" && (
            <img
              src={`https://devbackend.cedcommerce.com/home${props.navbar}`}
              alt="logo"
              width="50"
              height="50"
            />
          )}
        </span>

        <div className="d-flex">
          {!location.pathname.includes("login") ? (
            <button
              type="button"
              className="btn btn-primary mr-3 fs-16"
              onClick={() => handlelogin()}
            >
              Login
            </button>
          ) : null}

          {!location.pathname.includes("signup") ? (
            <button
              type="button"
              className="btn btn-outline-primary fs-16"
              onClick={() => handlesignup()}
            >
              Register
            </button>
          ) : null}
        </div>
      </nav>
    </>
  );
}

export default DI(Header);
