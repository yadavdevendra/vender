import {
  Button,
  Card,
  CheckBox,
  FlexLayout,
  FormChild,
  PageHeader,
  Select,
  TextField,
} from "@cedcommerce/ounce-ui";
import React, { useEffect} from "react";
import { DI } from "./../../../../Core";

function ViewVariant(props: any) {
  useEffect(() => {
    if (
      props.location.state.weight_unit == "oz" ||
      props.location.state.weight_unit == "OUNCE"
    ) {
    
    } else if (
      props.location.state.weight == "g" ||
      props.location.state.weight == "GRAMS"
    ) {
     
    } else if (
      props.location.state.weight == "kg" ||
      props.location.state.weight == "KILOGRAMS"
    ) {
 
    } else if (
      props.location.state.weight == "lb" ||
      props.location.state.weight == "POUNDS"
    ) {
   
    }
  }, []);
  return (
    <div>
      <PageHeader title={props.location.state.variant_title}>
        <Button
          type="Plain"
          thickness="thin"
          onClick={() => props.history.goBack()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            height="22"
          >
            <path
              d="M19 9H3.661l5.997-5.246a1 1 0 00-1.316-1.506l-8 7c-.008.007-.011.018-.019.025a.975.975 0 00-.177.24c-.018.03-.045.054-.059.087a.975.975 0 000 .802c.014.033.041.057.059.088.05.087.104.17.177.239.008.007.011.018.019.025l8 7a.996.996 0 001.411-.095 1 1 0 00-.095-1.411L3.661 11H19a1 1 0 000-2z"
              fill="#413bbc"
            />
          </svg>
        </Button>
      </PageHeader>
      <Card title="Pricing" cardType="bordered">
        <FlexLayout
          halign="start"
          spacing="loose"
          childWidth="fullWidth"
          desktopWidth="50"
        >
          <TextField
            readOnly={true}
            value={props.location.state.price}
            name="Price"
            thickness="thin"
          />
          <TextField
            readOnly={true}
            value={props.location.state.comapre_at_price}
            name="Compare At Price"
            thickness="thin"
          />
        </FlexLayout>
      </Card>
      <Card cardType="bordered" title="Inventory">
        <FormChild>
          <FlexLayout
            halign="start"
            spacing="loose"
            childWidth="fullWidth"
            desktopWidth="50"
          >
            <TextField
              readOnly={true}
              value={props.location.state.sku}
              name="SKU (Stock Keeping Unit)"
              thickness="thin"
            />
            <TextField
              readOnly={true}
              value={props.location.state.barcode}
              name="Barcode (ISBN, UPC, GTIN, etc.)"
              thickness="thin"
            />
          </FlexLayout>
        </FormChild>
        <FormChild>
          <FlexLayout direction="vertical" spacing="loose" valign="start">
            <CheckBox
              labelVal="Track quantity"
              checked={props.location.state.inventory_tracked}
              onClick={() => {
                console.log("object");
              }}
            />
            {props.location.state.inventory_tracked && (
              <CheckBox
                labelVal="Continue selling when out of stock"
                checked={
                  props.location.state.inventory_policy != "deny" ? true : false
                }
                onClick={() => {
                  console.log("object");
                }}
              />
            )}
          </FlexLayout>
        </FormChild>

        <hr />
        <FlexLayout halign="start">
          <FormChild>
            <TextField
              readOnly={true}
              value={props.location.state.quantity}
              name="Quantity"
              thickness="thin"
            />
          </FormChild>
        </FlexLayout>
      </Card>
      <Card title="Shipping">
        <FormChild>
          <CheckBox
            labelVal="This is a physical product"
            checked={props.location.state.requires_shipping}
            onClick={() => console.log("object")}
          />
          <hr />
        </FormChild>

        {props.location.state.requires_shipping && (
          <FormChild>
            <FlexLayout halign="start" spacing="tight">
              <TextField
                value={props.location.state.weight}
                readOnly={true}
                name="Weight"
                thickness="thin"
              ></TextField>
              <div style={{ marginTop: "31px" }}>
                <Select
                  disabled={true}
                  thickness="thin"
                  options={[
                    {
                      label: "kg",
                      value: "1",
                    },
                    {
                      label: "g",
                      value: "2",
                    },
                    {
                      label: "lb",
                      value: "3",
                    },
                    {
                      label: "oz",
                      value: "4",
                    },
                  ]}
                  value={
                    props.location.state.weight_unit === "oz" ||
                    props.location.state.weight_unit === "OUNCE"
                      ? "4"
                      : props.location.state.weight_unit === "g" ||
                        props.location.state.weight_unit === "GRAMS"
                      ? "2"
                      : props.location.state.weight_unit === "kg" ||
                        props.location.state.weight_unit === "KILOGRAMS"
                      ? "1"
                      : props.location.state.weight_unit === "lb" ||
                        props.location.state.weight_unit === "POUNDS"
                      ? "3"
                      : "2"
                  }
                  onChange={() => console.log("object")}
                />
              </div>
            </FlexLayout>
          </FormChild>
        )}
      </Card>
    </div>
  );
}

export default DI(ViewVariant);
