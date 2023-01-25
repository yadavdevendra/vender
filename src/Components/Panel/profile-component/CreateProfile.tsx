import React from "react";
import { DI } from "./../../../Core";
import { Card, PageHeader } from "@cedcommerce/ounce-ui";
import Cedcategory from "./Cedcategory";
import QueryBuilder from "./QueryBuilder";

function CreateProfile(): JSX.Element {
  return (
    <div>
      <PageHeader title="Create Profile"></PageHeader>
      <Card>
        <Cedcategory />
      </Card>
      <Card>
        <QueryBuilder />
      </Card>
    </div>
  );
}

export default DI(CreateProfile);
