/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { DIProps, DI } from "../../Core";
import { Switch, Route, Redirect } from "react-router-dom";
import Login from "./Login/Login";
import Signup from "./SignUp/Signup";
import Forgot from "./Forgot/Forgot";
import Confirmation from "./Conformation/Confirmation";
import Reset from "./Reset/Reset";
import Account from "./Account/Account";
import RequestStatus from "./Show/RequestStatus";
import Review from "./Review/Review";
import Verify from "./Review/Verify";
import * as queryString from "query-string";
import Header from "../Template/HomePage/Header";
import Footer from "../Template/HomePage/Footer";
import InstallAppVerify from "./InstallAppVerify/InstallAppVerify";

interface AuthProps extends DIProps {
  getId: (id: string) => void;
}

function Auth(_props: AuthProps) {
  const [AdminID, setAdminID] = useState("");
  const [footer, setFooter] = useState({});
  const [header, setHeader] = useState("");
  const [logoRedirectTo, setLogoRedirectTo] = useState();

  useEffect(() => {
    if (
      _props.location.pathname !== "/auth/app/verify" &&
      !_props.location.search.includes("user_token")
    ) {
      _props.di.globalState.removesessionStorage("vendor_token");
    }
    if (
      sessionStorage.getItem("admin_shop_id") !==
        _props.location.pathname.split("/")[3] &&
      _props.location.pathname.split("/")[3] != "null"
    ) {
      sessionStorage.setItem(
        "admin_shop_id",
        _props.location.pathname.split("/")[3]
      );
      localStorage.setItem(
        "admin_shop_id",
        _props.location.pathname.split("/")[3]
      );
    } else {
      const newId = localStorage.getItem("admin_shop_id");
      sessionStorage.setItem(
        "admin_shop_id",
        `${localStorage.getItem("admin_shop_id")}`
      );
    }
  }, []);
  function Getdata() {
    _props.di
      .GET(
        `/connector/vendor/getAdminId?admin_shop_id=${
          sessionStorage.getItem("admin_shop_id") ||
          localStorage.getItem("admin_shop_id")
        }`
      )
      .then((e) => {
        if (e.success) {
          _props.di
            .GET(`/connector/config/getLandingPageData?id=${e.admin_id}`)
            .then((m) => {
              if (m.success) {
                setHeader(m.data.Header.Logo);
                setFooter(m.data["Footer"]);
                setLogoRedirectTo(
                  m.data.Header["Header Image Redirection Link URL"]
                );
              }
            });
        } else {
          _props.history.push("/error");
        }
      });
  }

  useEffect(() => {
    Getdata();
  }, []);

  const getIdFromLogin = (id: string) => {
    _props.getId(id);
  };

  return (
    <>
      <main>
        {_props.location.pathname === "/auth/app/verify" ||
        _props.location.pathname === "/auth/review" ? (
          <>{RenderRoutes(getIdFromLogin)}</>
        ) : (
          <>
            <Header
              navbar={header}
              admin_shop_id={_props.location.pathname.split("/")[3]}
            />
            <>{RenderRoutes(getIdFromLogin)}</>
            <Footer footer={footer} />
          </>
        )}
      </main>
    </>
  );
}
function RenderRoutes(getIdFromLogin: (id: string) => void) {
  return (
    <div>
      <Switch>
        <Route
          path="/auth/login/:admin_shop_id"
          render={(routeProps) => {
            return <Login {...routeProps} idByLogin={getIdFromLogin} />;
          }}
        />
        <Route path="/auth/signup/:admin_shop_id" component={Signup} />
        <Route path="/auth/forgot/:admin_shop_id" component={Forgot} />
        <Route
          path="/auth/confirmation/:admin_shop_id"
          component={Confirmation}
        />
        <Route path="/auth/reset/:admin_shop_id" component={Reset} />
        <Route path="/auth/review" component={Review} />
        <Route path="/auth/verify/:message" component={Verify} />
        <Route path="/auth/account" component={Account} />
        <Route path="/auth/app/verify" component={InstallAppVerify} />
        <Route
          path="/auth/show/requestStatus/:message"
          component={RequestStatus}
        />
        {/* <Redirect to="/auth/login/:admin_shop_id" /> */}
      </Switch>
    </div>
  );
}

export default DI(Auth);
