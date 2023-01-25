import React, { useState } from "react";
import { DI, DIProps } from "../../../Core";
import { Tabs, PageHeader } from "@cedcommerce/ounce-ui";
import { Switch, Route, Redirect } from "react-router-dom";
import ListSubscription from "./ListSubscription";
import MyPlans from "./MyPlans";


function Subscription_route(Props: DIProps) {
  const [tab, setTab] = useState(
    "/panel/subscription_route/subscription"
  );
  return (
    <div>
      <PageHeader title="Subscription"></PageHeader>
      <Tabs
        onChange={(e) => {
          Props.history.push(e);
          setTab(e);
        }}
        selected={tab}
        value={[
          {
            content: "Plans",
            id: "/panel/subscription_route/myplans",

          },
          {
            content: "Subscription",
            id: "/panel/subscription_route/subscription",

          },
        ]}
      ></Tabs>
      <Switch>
        <Route
          exact
          path="/panel/subscription_route/subscription"
          component={ListSubscription}
        />
        <Route
          exact
          path="/panel/subscription_route/myplans"
          component={MyPlans}
        />
        <Redirect path="**" to="/panel/subscription_route/subscription" />
      </Switch>
    </div>
  );
}

export default DI(Subscription_route);
