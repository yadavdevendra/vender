import { PageHeader, Tabs } from '@cedcommerce/ounce-ui';
import React, { useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { DI, DIProps } from './../../../Core';
import OrderReport from './OrderReport';
import ProductReport from './ProductReport';

function Report(props: DIProps) {
    const [tab, setTab] = useState(
        "/panel/report/order_report"
    );
    return (
        <div>
            <PageHeader title='Report' />
            <Tabs
                onChange={(e) => {
                    props.history.push(e);
                    setTab(e);
                }}
                selected={tab}
                value={[
                    {
                        content: "Order Report ",
                        id: "/panel/report/order_report",
                    },
                    {
                        content: "Product Report",
                        id: "/panel/report/product_order",
                    },
                ]}
            ></Tabs>
            <Switch>
                <Route
                    exact
                    path="/panel/report/order_report"
                    component={OrderReport}
                />
                <Route
                    exact
                    path="/panel/report/product_order"
                    component={ProductReport}
                />
                <Redirect path="**" to="/panel/report/order_report" />
            </Switch>

        </div>
    );
}

export default DI(Report);
