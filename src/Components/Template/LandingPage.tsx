import React, { useEffect } from "react";
import { DI, DIProps } from "../../Core";
import { Switch, Route, Redirect } from "react-router-dom";
import HomePage from "./HomePage/HomePage";
import "./landingpage.css";

function LandingPage(_props: DIProps): JSX.Element {
  useEffect(() => {
    _props.di
      .GET(
        `/connector/vendor/getAdminId?admin_shop_id=${_props.match.params.admin_shop_id}`
      )
      .then((e) => {
        if (e.success) {
          _props.di
            .GET(`/connector/config/getLandingPageData?id=${e.admin_id}`)
            .then((e) => {
              if (!e.success) {
                _props.di.globalState.removesessionStorage("vendor_token");
              }
            });
        }
      });
  }, []);
  return (
    <div>
      <Switch>
        <Route
          path="/home/:admin_shop_id"
          render={() => {
            return <HomePage {..._props.match.params} />;
          }}
        />

        <Redirect to="/home/:admin_shop_id" />
      </Switch>
    </div>
  );
}

export default DI(LandingPage);
