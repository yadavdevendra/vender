/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  Card,
  FlexChild,
  FlexLayout,
  PageHeader,
  TextStyles,
} from "@cedcommerce/ounce-ui";
import React, { useEffect, useState } from "react";
import { DI, DIProps } from "./../../../../Core";
import { Grid } from "./../../../../Shared/index";

function ViewShip(props: DIProps) {
  const columns = {
    carrier: {
      name: "Carrier",
      visible: true,
    },
    tracking_number: {
      name: "Tracking Number",
      visible: true,
    },
  };
  const columnsShipped = {
    product_name: {
      name: "Product",
      visible: true,
    },

    sku: {
      name: "SKU",
      visible: true,
    },

    quantity_ordered: {
      name: "Quantity Ordered",
      visible: true,
    },
    quantity: {
      name: "Quantity Shipped",
      visible: true,
    },
  };

  const [Rows, setRows] = useState([{}]);
  const [RowsShipped, setRowsShipped] = useState([{}]);
  const [OrderID, setOrderID] = useState("");
  const [OrderDate, setOrderDate] = useState("");
  const [OrderStatus, setOrderStatus] = useState("");
  const [purchasedFrom, setPurchasedFrom] = useState("");

  const [CustomerName, setCustomerName] = useState("");
  const [Email, setEmail] = useState("");
  const [BillingName, setBillingName] = useState("");
  const [BillingAddress, setBillingAddress] = useState("");
  const [BillingCity, setBillingCity] = useState("");
  const [BillingCountry, setBillingCountry] = useState("");
  const [BillingZip, setBillingZip] = useState("");
  const [BillingState, setBillingState] = useState("");
  const [ShippingAddress, setShippingAddress] = useState("");
  const [ShippingCity, setShippingCity] = useState("");
  const [ShippingName, setShippingName] = useState("");
  const [ShippingState, setShippingState] = useState("");
  const [ShippingZip, setShippingZip] = useState("");
  const [ShippingCountry, setShippingCountry] = useState("");

  function getData() {
    props.di
      .GET(
        "connector/shipment/getAllShipments?shipment_id=" +
          props.match.params.shipment_id
      )
      .then((e) => {
        if (e.success) {
          Object.keys(e.data.rows).map((m) => {
            setOrderDate(e.data.rows[m].created_at);
            setOrderStatus(e.data.rows[m].status);
            setPurchasedFrom(e.data.rows[m].vendor_name);
            setOrderID(e.data.rows[m].source_order_id);
            setCustomerName(e.data.rows[m].client_details.name);
            setEmail(e.data.rows[m].email);
            setBillingName(e.data.rows[m].billing_address.name);
            setBillingAddress(
              e.data.rows[m].billing_address.address1 +
                " " +
                e.data.rows[m].billing_address.address2
            );
            setBillingCity(e.data.rows[m].billing_address.city);
            setBillingCountry(e.data.rows[m].billing_address.country);
            setBillingState(e.data.rows[m].billing_address.province);
            setBillingZip(e.data.rows[m].billing_address.zip);
            setShippingAddress(e.data.rows[m].delivery_details.full_address[0]);
            setShippingName(e.data.rows[m].delivery_details.full_name);
            setShippingState(e.data.rows[m].delivery_details.region);
            setShippingCity(e.data.rows[m].delivery_details.locality);
            setShippingZip(e.data.rows[m].delivery_details.zip);
            setShippingCountry(e.data.rows[m].delivery_details.country);
          });

          const temp = [
            {
              carrier: e.data.rows[0].fulfillments.carrier || "Not Available",
              tracking_number:
                e.data.rows[0].fulfillments.tracking_number || "Not Available",
            },
          ];
          setRows(temp);

          const temp12 = Object.keys(e.data.rows[0].fulfillments.items).map(
            (ele) => {
              // if (
              //   e.data.rows[0].fulfillments.items[ele].id ==
              //   e.data.rows[0].line_items[ele].source_item_id
              // ) {
              return {
                ...e.data.rows[0].fulfillments.items[ele],
                product_name: e.data.rows[0].line_items[ele].product_name,

                sku: e.data.rows[0].line_items[ele].sku,
                quantity_ordered:
                  e.data.rows[0].line_items[ele].quantity_ordered,
                quantity:
                  // e.data.rows[0].fulfillments.items[ele].id ==
                  //   e.data.rows[0].line_items[ele].source_item_id &&
                  e.data.rows[0].fulfillments.items[ele].quantity,
              };
            }
            // }
          );

          setRowsShipped(temp12);
        }
      });
  }
  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <PageHeader>
        <FlexLayout halign="start" spacing="tight" direction={"vertical"}>
          <Button
            type="Plain"
            thickness="thin"
            onClick={() => {
              props.history.push("/ship");
            }}
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
          <TextStyles type="SubHeading">Shipment Details</TextStyles>
        </FlexLayout>
      </PageHeader>

      <FlexLayout
        direction="vertical"
        wrap={"none"}
        spacing={"loose"}
        childWidth={"fullWidth"}
      >
        <Card title="Order & Account Information" cardType="bordered">
          <FlexLayout
            spacing={"extraLoose"}
            halign={"fill"}
            desktopWidth={"50"}
            mobileWidth={"100"}
            tabWidth={"50"}
          >
            <FlexLayout spacing={"loose"} direction={"vertical"}>
              <FlexLayout spacing={"extraLoose"} wrap={"noWrap"}>
                <FlexChild
                  desktopWidth={"50"}
                  mobileWidth={"100"}
                  tabWidth={"50"}
                >
                  <TextStyles type={"mediumText"}>Order ID </TextStyles>
                </FlexChild>
                <FlexChild
                  desktopWidth={"50"}
                  mobileWidth={"100"}
                  tabWidth={"50"}
                >
                  <TextStyles type="neutralText" textcolor="light">
                    {" "}
                    {OrderID || "Not Available"}
                  </TextStyles>
                </FlexChild>
              </FlexLayout>
              <FlexLayout spacing={"extraLoose"} wrap={"noWrap"}>
                <FlexChild
                  desktopWidth={"50"}
                  mobileWidth={"100"}
                  tabWidth={"50"}
                >
                  <TextStyles type={"mediumText"}> Order Date </TextStyles>
                </FlexChild>
                <FlexChild
                  desktopWidth={"50"}
                  mobileWidth={"100"}
                  tabWidth={"50"}
                >
                  <TextStyles type="neutralText" textcolor="light">
                    {OrderDate || "Not Available"}
                  </TextStyles>
                </FlexChild>
              </FlexLayout>
              <FlexLayout spacing={"extraLoose"} wrap={"noWrap"}>
                <FlexChild
                  desktopWidth={"50"}
                  mobileWidth={"100"}
                  tabWidth={"50"}
                >
                  <TextStyles type={"mediumText"}>Order Status </TextStyles>
                </FlexChild>
                <FlexChild
                  desktopWidth={"50"}
                  mobileWidth={"100"}
                  tabWidth={"50"}
                >
                  <TextStyles type="neutralText" textcolor="light">
                    {OrderStatus.charAt(0).toUpperCase() +
                      OrderStatus.slice(1).replace("_", " ")}
                  </TextStyles>
                </FlexChild>
              </FlexLayout>
            </FlexLayout>

            <FlexLayout spacing={"loose"} direction={"vertical"}>
              <FlexLayout spacing={"extraLoose"} wrap={"noWrap"}>
                <FlexChild
                  desktopWidth={"50"}
                  mobileWidth={"100"}
                  tabWidth={"50"}
                >
                  <TextStyles type={"mediumText"}>Customer Name </TextStyles>
                </FlexChild>
                <FlexChild
                  desktopWidth={"50"}
                  mobileWidth={"100"}
                  tabWidth={"50"}
                >
                  <TextStyles type="neutralText" textcolor="light">
                    {CustomerName}
                  </TextStyles>
                </FlexChild>
              </FlexLayout>
              <FlexLayout spacing={"extraLoose"} wrap={"noWrap"}>
                <FlexChild
                  desktopWidth={"50"}
                  mobileWidth={"100"}
                  tabWidth={"50"}
                >
                  <TextStyles type={"mediumText"}>Purchased From </TextStyles>
                </FlexChild>
                <FlexChild
                  desktopWidth={"50"}
                  mobileWidth={"100"}
                  tabWidth={"50"}
                >
                  <TextStyles type="neutralText" textcolor="light">
                    Shopify Store
                  </TextStyles>
                </FlexChild>
              </FlexLayout>
              <FlexLayout spacing={"extraLoose"} wrap={"noWrap"}>
                <FlexChild
                  desktopWidth={"50"}
                  mobileWidth={"100"}
                  tabWidth={"50"}
                >
                  <TextStyles type={"mediumText"}>Email </TextStyles>
                </FlexChild>
                <FlexChild
                  desktopWidth={"50"}
                  mobileWidth={"100"}
                  tabWidth={"50"}
                >
                  <TextStyles type="neutralText" textcolor="light">
                    {Email || "Not Available"}
                  </TextStyles>
                </FlexChild>
              </FlexLayout>
            </FlexLayout>
          </FlexLayout>
        </Card>

        <FlexLayout
          spacing="loose"
          halign="fill"
          desktopWidth={"50"}
          mobileWidth={"100"}
          tabWidth={"50"}
        >
          <Card title="Billing Address" cardType="bordered">
            <FlexLayout direction="vertical" valign="start" spacing="loose">
              <TextStyles type="simpleText" textcolor="light">
                {CustomerName}
              </TextStyles>
              <TextStyles type="simpleText" textcolor="light">
                {BillingAddress}
              </TextStyles>
              <TextStyles type="simpleText" textcolor="light">
                {BillingCity},{BillingState},{BillingZip}
              </TextStyles>
              <TextStyles type="simpleText" textcolor="light">
                {BillingCountry}
              </TextStyles>
            </FlexLayout>
          </Card>
          <Card title="Shipping Address" cardType="bordered">
            <FlexLayout direction="vertical" valign="start" spacing="loose">
              <TextStyles type="simpleText" textcolor="light">
                {ShippingName}
              </TextStyles>
              <TextStyles type="simpleText" textcolor="light">
                {ShippingAddress}
              </TextStyles>
              <TextStyles type="simpleText" textcolor="light">
                {ShippingCity},{ShippingState},{ShippingZip}
              </TextStyles>
              <TextStyles type="simpleText" textcolor="light">
                {ShippingCountry}
              </TextStyles>
            </FlexLayout>
          </Card>
        </FlexLayout>

        {/* 
          <Card title={`Order Information`}>
            <FlexLayout spacing='loose'>
              <FlexLayout spacing='loose' direction='vertical'>

                <TextStyles type='SubHeading' textcolor='light'>
                  Order ID{" "}
                </TextStyles>
                <TextStyles type='SubHeading' textcolor='light'>
                  Order Date{" "}
                </TextStyles>
                <TextStyles type='SubHeading' textcolor='light'>
                  Status{" "}
                </TextStyles>
                <TextStyles type='SubHeading' textcolor='light'>
                  Purchased From{" "}
                </TextStyles>
              </FlexLayout>
              <FlexLayout spacing='loose' direction='vertical'>
                <TextStyles type='SubHeading'>:</TextStyles>

                <TextStyles type='SubHeading'>:</TextStyles>
                <TextStyles type='SubHeading'>:</TextStyles>
                <TextStyles type='SubHeading'>: </TextStyles>
              </FlexLayout>
              <FlexLayout spacing='loose' direction='vertical'>
                <TextStyles type='SubHeading'>
                  {OrderID || "Not Available"}
                </TextStyles>
                <TextStyles type='SubHeading'>
                  {OrderDate || "Not Available"}
                </TextStyles>
                <TextStyles type='SubHeading'>
                  {OrderStatus.charAt(0).toUpperCase() + OrderStatus.slice(1).replace("_", " ") ||
                    "Not Available"}
                </TextStyles>
                <TextStyles type='SubHeading'>
                  {purchasedFrom || "Not Available"}
                </TextStyles>
              </FlexLayout>
            </FlexLayout>
          </Card> */}
        {/* <Card title='Account Information'>
            <FlexLayout spacing='loose'>
              <FlexLayout spacing='loose' direction='vertical'>
                <TextStyles type='SubHeading' textcolor='light'>
                  Customer Name
                </TextStyles>
                <TextStyles type='SubHeading' textcolor='light'>
                  Email
                </TextStyles>
              </FlexLayout>
              <FlexLayout spacing='loose' direction='vertical'>
                <TextStyles type='SubHeading'>:</TextStyles>
                <TextStyles type='SubHeading'>:</TextStyles>
              </FlexLayout>
              <FlexLayout spacing='loose' direction='vertical'>
                <TextStyles type='SubHeading'>
                  {CustomerName || "Not Available"}
                </TextStyles>
                <TextStyles type='SubHeading'>
                  {Email || "Not Available"}
                </TextStyles>
              </FlexLayout>
            </FlexLayout>
          </Card> */}
        <Card title="Shipping Method">
          <FlexLayout valign="start" direction="vertical">
            <Grid rows={Rows} columns={columns} />
          </FlexLayout>
        </Card>
        <Card title="Items Shipped">
          <Grid rows={RowsShipped} columns={columnsShipped} />
        </Card>
      </FlexLayout>
    </div>
  );
}

export default DI(ViewShip);
