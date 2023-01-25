/* eslint-disable react/no-children-prop */
import { Button, Card, TextStyles } from "@cedcommerce/ounce-ui";
import React from "react";
import { DI } from "../../../Core";

function Account(): JSX.Element {
  let account = sessionStorage.getItem("data");
  if (!account) {
    account = "";
  }
  return (
    <div
      className="mt-40"
      style={{ width: "initial", margin: "auto", maxWidth: "700px" }}
    >
      <Card>
        <TextStyles children={`Welcome ${account.toUpperCase()}`} />
        <Button iconAlign="right" type="Plain">
          Add Another Account{" "}
        </Button>
      </Card>
    </div>
  );
}
export default DI(Account);
