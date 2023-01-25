import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Auth, Panel } from "./Components";
import { DI /* , DIProps  */ } from "./Core";
// import '@cedcommerce/ounce-ui/dist/index.css';
import LandingPage from "./Components/Template/LandingPage";
import "./index.css";
// import { environment } from "./environments/environment";
// import Apps from './Components/App/Apps';
import ErrorAdmin from "./Components/ErrorAdmin/ErrorAdmin";
import { useState } from "react";

// interface PropsI extends DIProps {
//   syncNecessaryInfo: () => void
// }

function App(): JSX.Element {
  // document.body.style.zoom = "90%";
  const [supplierId, setid] = useState<any>();

  const getId = (id: string) => {
    setid(id);
  };
  return (
    <>
      <Switch>
        {/* <Route path="/apps" component={Apps} /> */}
        <Route
          path="/auth/:admin_shop_id"
          render={(routeProps) => {
            return <Auth {...routeProps} getId={getId} />;
          }}
        />
        <Route path="/error" component={ErrorAdmin} />
        <Route path="/home/:admin_shop_id" component={LandingPage} />
        <Route
          path="/"
          render={(routeProps) => {
            return <Panel {...routeProps} ad={supplierId} />;
          }}
        />
        <Redirect from="**" to="/home/:admin_shop_id" />
      </Switch>
    </>
  );
  // <Route path="/home" component={LandingPage} />
}

export default DI(App, { stateNeeded: true });
