/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import AddProducts from "./Create/AddProducts";
import { PageHeader, FlexLayout, Button } from "@cedcommerce/ounce-ui";
import { DI } from "../../../Core";

function Create(Props: any): JSX.Element {
  const [title, setTitle] = useState("");
  return (
    <div>
      <PageHeader
        sticky={"sticky"}
        title={title != "" ? title : "Create Product"}
        // title={title != "" && title}
        action={
          <Button
            thickness="thin"
            onClick={() => {
              Props.history.push("/products", {
                setActivePage: Props.location.state.activePage,
                reApplyFilter: Props.location.state.appliedFilter,
              });
            }}
          >
            Back
          </Button>
        }
      >
        <FlexLayout halign="fill"></FlexLayout>
      </PageHeader>
      {/* Create Product */}
      {/* {console.log(Props.currency, Props, "Create")} */}
      <>
        <AddProducts setTitle={setTitle} currency={Props.currency} />
      </>
    </div>
  );
}

export default DI(Create);
