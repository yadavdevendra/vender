/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { DI, DIProps } from "../../../Core";
import {
  Tabs,
  PageHeader,
  Button,
  Modal,
  Radio,
  ToolTip,
} from "@cedcommerce/ounce-ui";
import { Switch, Route } from "react-router-dom";
import Request_Transaction from "./Request_Transaction";
import View_transaction from "./View_transaction";
import { useEffect } from "react";
function Transaction_route(Props: DIProps) {
  const [tab, setTab] = useState("");
  const [ModalClose, setModalClose] = useState(false);
  const [FileType, setFileType] = useState("");

  useEffect(() => {
    setTab("/panel/transaction_route/request_transaction");
    Props.history.push("/panel/transaction_route/request_transaction");
  }, []);
  return (
    <div>
      <PageHeader
        title="Transactions"
        action={
          <ToolTip helpText="Export Transactions" position="left">
            <Button
              type="Plain"
              thickness="thin"
              onClick={() => setModalClose(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                height="22"
              >
                <path
                  d="M10.707 2.293a.999.999 0 00-1.414 0l-3 3a.999.999 0 101.414 1.414L9 5.414V13a1 1 0 102 0V5.414l1.293 1.293a.999.999 0 101.414-1.414l-3-3zM3 16a1 1 0 100 2h14a1 1 0 100-2H3z"
                  fill="#413bbc"
                />
              </svg>
            </Button>
          </ToolTip>
        }
      ></PageHeader>
      <Tabs
        onChange={(e) => {
          Props.history.push(e);
          setTab(e);
        }}
        selected={tab}
        value={[
          {
            content: "Pending Transaction",
            id: "/panel/transaction_route/request_transaction",
          },
          {
            content: "Complete Transaction",
            id: "/panel/transaction_route/view_transaction",
          },
        ]}
      ></Tabs>
      <Switch>
        <Route
          exact
          path="/panel/transaction_route/view_transaction"
          render={(routeProps) => (
            <View_transaction {...routeProps} currency={Props.currency} />
          )}
        />
        <Route
          exact
          path="/panel/transaction_route/request_transaction"
          component={Request_Transaction}
        />
        {/* <Redirect path="**" to="/panel/transaction_route/request_transaction" /> */}
      </Switch>
      <Modal
        modalSize="small"
        heading="Export Transaction"
        open={ModalClose}
        close={() => {
          setModalClose(!ModalClose);
        }}
        primaryAction={{
          content: "Export",
          onClick: function handleExport() {
            const params = {
              marketplace: "shopify",

              export_type: FileType,
            };
            Props.di
              .POST(
                "connector/transaction/exportAllCompleteTransactions",
                params
              )
              .then((e: any) => {
                if (e.success) {
                  const endpoint = Props.di.environment.API_ENDPOINT.replace(
                    "/public/",
                    "/"
                  );
                  window.open(endpoint + e.path);
                  setModalClose(false);
                }
              });
          },
        }}
      >
        <Radio
          onClick={() => {
            setFileType("csv");
          }}
          name="file"
          labelVal="CSV"
        />
        <Radio
          onClick={() => {
            setFileType("XLS");
          }}
          name="file"
          labelVal="XLS"
        />
      </Modal>
    </div>
  );
}

export default DI(Transaction_route);
