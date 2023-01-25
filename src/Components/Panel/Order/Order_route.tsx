import { PageHeader, Tabs } from '@cedcommerce/ounce-ui';
import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { DI, DIProps } from './../../../Core';
import Order from './Order';
import Ship from './Shipment/Ship';


function Order_route(Props: DIProps) {
    const [Tab, setTab] = useState("");
    useEffect(() => {
        setTab("/panel/order_route/order_grid");
        Props.history.push("/panel/order_route/order_grid");
      }, []);
    return (
        <div>
            <PageHeader title="Orders" />
            <Tabs
                onChange={(e) => {
                    Props.history.push(e);
                    setTab(e);
                }}
                selected={Tab}
                value={[
                    {
                        content: "Orders",
                        id: "/panel/order_route/order_grid",
                    },
                    {
                        content: "Shipments",
                        id: "/panel/order_route/ship_grid",
                    },
                ]}
            ></Tabs>
            <Switch>
                <Route
                    exact
                    path="/panel/order_route/order_grid"
                    component={Order}
                />
                <Route
                    exact
                    path="/panel/order_route/ship_grid"
                    component={Ship}
                />
                <Redirect path="**" to="/panel/order_route/order_grid" />
            </Switch>

        </div>
    );
}

export default DI(Order_route);
