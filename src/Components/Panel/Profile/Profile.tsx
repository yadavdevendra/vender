import React, { useState } from "react";
import {
  Button,
  Card,
  PageHeader,
  Select,
  TextField,
  FormChild,
  TextStyles,
} from "@cedcommerce/ounce-ui";
import { DI, DIProps } from "./../../../Core";

function Profile(Props: DIProps): JSX.Element {
  const [name, setName] = useState("");
  const [select, setSelection] = useState("");

  function redirect(path: string) {
    Props.history.push(path);
  }
  return (
    <div>
      <PageHeader title="Profile"></PageHeader>
      <Card>
        <FormChild>
          <TextStyles type="SubHeading">Profile Name</TextStyles> <br />
          <TextField
            thickness={"thin"}
            type="text"
            value={name}
            onChange={(e) => {
              setName(e);
            }}
            placeHolder={"Enter Profile's name"}
          />{" "}
          <br />
          <Select
            options={[{ label: "Shopify", value: "1" }]}
            value={select}
            onChange={(e) => {
              setSelection(e);
            }}
          />{" "}
          <br />
          <Button
            thickness={"thin"}
            type="Outlined"
            onAction={() => {
              redirect("/panel/createprofile");
            }}
          >
            Next
          </Button>
        </FormChild>
      </Card>
    </div>
  );
}

export default DI(Profile);
