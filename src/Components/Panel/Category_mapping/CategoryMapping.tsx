/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, PageHeader, TextStyles } from "@cedcommerce/ounce-ui";
import React, { useEffect } from "react";
import { DI, DIProps } from "./../../../Core";

function CategoryMapping(props: DIProps) {
  function getData() {
    props.di.GET("/connector/get/getAdminandVendorCategory").then((e) => {
      //  console.log(e);
    });
    props.di.GET("/connector/get/categoryMapping").then((e) => {
      // console.log(e);
    });
  }
  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <PageHeader
        title="Category Mapping"
        action={
          <Button type="Primary" thickness="thin">
            Skip
          </Button>
        }
      />
      <TextStyles> heeelo</TextStyles>
    </div>
  );
}

export default DI(CategoryMapping);
