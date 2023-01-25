/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Badge,
  Button,
  Card,
  FlexChild,
  FlexLayout,
  TextStyles,
} from "@cedcommerce/ounce-ui";
import React, { useEffect, useState } from "react";
import { DI } from "./../../../Core";
import { Grid } from "./../../../Shared/index";
const col = {
  product_name: {
    name: "Product",
    visible: true,
  },
  quantity_ordered: {
    width: "50px",
    name: "Quantity",
    visible: true,
  },
  price: {
    name: "Price/item",
    visible: true,
  },
  sku: {
    name: "SKU",
    visible: true,
  },
  rate: {
    name: "Tax Rate",
    visble: true,
  },
};

function ViewOrder(props: any) {
  const [showTemp, setShowTemp] = useState(true);
  const [netAmount1, setNetAmount] = useState<any>(0);
  const [OrderDate, setOrderDate] = useState("");
  const [OrderStatus, setOrderStatus] = useState("");
  const [delayFee, setDelayFee] = useState(0);
  const [CustomerName, setCustomerName] = useState("");
  const [Email, setEmail] = useState("");
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
  const [rows, setRows] = useState([{}]);
  const [marketPlaceFee, setMarketPlaceFee] = useState(0);
  const [GrandTotal, setGrandTotal] = useState<any>(0);
  const [serviceTax, setServiceTax] = useState(0);
  const [commission, setCommission] = useState(0);
  const [Price, setPrice] = useState(0);
  const [Discount, setDiscount] = useState<any>(0);
  const [currency, setCurrency] = useState(props.currency);
  const [taxInclusion, setTaxInclusion] = useState(false);
  const [TotalTax, setTotalTax] = useState(0);
  const [ShippingFees, setShippingFees] = useState(0);
  function getData() {
    // let temp = 0;
    props.di
      .GET(
        `connector/order/getOrder?user_id=${props.location.state.user_id}&order_id=${props.match.params.order_id}`
      )
      .then((e: any) => {
        setOrderDate(e.data.created_at);
        setOrderStatus(e.data.status);

        setCustomerName(e.data.client_details && e.data.client_details.name);
        setEmail(e.data.email);
        setBillingAddress(
          (e.data.billing_address &&
            e.data.billing_address.address1 +
              " " +
              e.data.billing_address.address2) ||
            "Not Available"
        );
        setBillingCity(e.data.billing_address && e.data.billing_address.city);
        setBillingCountry(
          e.data.billing_address && e.data.billing_address.country
        );
        setBillingZip(e.data.billing_address && e.data.billing_address.zip);
        setBillingState(
          e.data.billing_address && e.data.billing_address.province
        );
        setShippingAddress(
          e.data.delivery_details && e.data.delivery_details.full_address[0]
        );
        setShippingName(
          e.data.delivery_details && e.data.delivery_details.full_name
        );
        setShippingState(
          e.data.delivery_details && e.data.delivery_details.region
        );
        setShippingCity(
          e.data.delivery_details && e.data.delivery_details.locality
        );
        setShippingZip(e.data.delivery_details && e.data.delivery_details.zip);
        setShippingCountry(
          e.data.delivery_details && e.data.delivery_details.country
        );
        setCommission(e.data.commission);
        setServiceTax(e.data.service_tax);
        setPrice(e.data.subtotal_price.toFixed(2));
        setDelayFee(e.data.delayed_fulfillment_fine || 0.0);
        setMarketPlaceFee(e.data.marketplace_Fee);

        setGrandTotal(e.data.vendor_amount.toFixed(2));
        setDiscount(e.data.discount_price.toFixed(2));
        setTotalTax(e.data.total_tax.toFixed(2));
        setTaxInclusion(e.data.taxes_included && e.data.taxes_included);
        setShippingFees(e.data.shipping_details[0].price.toFixed(2));

        // temp = e.data.commission + e.data.marketplace_Fee + e.data.total_tax;
        // const netTemp = e.data.total_price - temp;
        // setNetAmount(e.data.total_price - (e.data.commission + e.data.marketplace_Fee + e.data.total_tax));
        // setNetAmount(netTemp);
        setNetAmount(
          (
            e.data.total_price -
            (e.data.commission + e.data.marketplace_Fee + e.data.total_tax)
          ).toFixed(2)
        );
        const showTemp = Object.keys(e.data).includes("shipped_qty");

        // if(Object.values(e.data).map(()))

        if (showTemp == true && e.data.shipped_qty != e.data.qty) {
          setShowTemp(true);
        } else if (showTemp == false) {
          setShowTemp(true);
        } else if (showTemp == true && e.data.shipped_qty == e.data.qty) {
          setShowTemp(false);
        }

        const rows = Object.keys(e.data.line_items).map((j) => {
          return {
            ...e.data.line_items[j],
            product_name: e.data.line_items[j].product_name,
            price:
              `${currency}` +
              " " +
              (e.data.line_items[j].price &&
                e.data.line_items[j].price.toFixed(2)),
            quantity_ordered: e.data.line_items[j].quantity_ordered,
            rate:
              ((e.data.line_items[j].tax_lines != null ||
                e.data.line_items[j].tax_lines != undefined) &&
                e.data.line_items[j].tax_lines.rate) ||
              "Not Available",
            sku: e.data.line_items[j].sku,
            // discount: e.data.line_items[j].discount_applications[0].value_type == "percentage" ? e.data.line_items[j].discount_applications[0].value + "%" : e.data.currency + " " + e.data.line_items[j].discount_applications[0].value,
            // raw_total: e.data.line_items[j].price + e.data.line_items[j].tax_lines.rate
          };
        });
        setRows(rows);
      });
  }

  useEffect(() => {
    getData();
  }, [netAmount1]);
  return (
    <div>
      {/* <PageHeader> */}
      <div className={"mb-20"}>
        <FlexLayout spacing={"extraLoose"} halign="fill" valign={"center"}>
          <FlexLayout halign="start" spacing="tight" direction={"vertical"}>
            <Button
              thickness="thin"
              type="Plain"
              onClick={() => {
                props.history.push("/order");
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
            <TextStyles type="SubHeading">{"View Order"}</TextStyles>
          </FlexLayout>
          <FlexLayout spacing={"extraLoose"}>
            {
            props.hideShipButton &&
            OrderStatus != "canceled" &&
            OrderStatus !== "fulfilled" &&
            OrderStatus !== "refunded" ? (
              <Button
                //  disable={disableBtn}
                type={"Primary"}
                thickness="thin"
                onClick={() => {
                  props.history.push(
                    "/order/shipment/" +
                      props.location.state.user_id +
                      "/" +
                      props.match.params.order_id
                  );
                }}
              >
                Ship
              </Button>
            ) : null}
          </FlexLayout>
        </FlexLayout>
      </div>
      {/* 
      </PageHeader> */}

      <FlexLayout
        direction="vertical"
        wrap={"none"}
        spacing={"loose"}
        childWidth={"fullWidth"}
      >
        <div>
          <Card title="General Information" cardType="bordered">
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
                      {props.match.params.order_id}
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
                      {OrderDate}
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
                    <Badge
                      type={
                        OrderStatus == "pending"
                          ? "Info"
                          : OrderStatus == "fulfilled"
                          ? "Success"
                          : OrderStatus == "partially_fulfilled"
                          ? "partialSuccess"
                          : OrderStatus == "error"
                          ? "Warning"
                          : OrderStatus == "skipped"
                          ? "partialError"
                          : OrderStatus == "canceled"
                          ? "Error"
                          : OrderStatus == "partially_refunded"
                          ? "partialWarning"
                          : OrderStatus == "refunded"
                          ? "Pending"
                          : undefined
                      }
                    >
                      {OrderStatus.charAt(0).toUpperCase() +
                        OrderStatus.slice(1).replace("_", " ")}
                    </Badge>
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
                    <TextStyles type={"mediumText"}>Purchased from </TextStyles>
                  </FlexChild>
                  <FlexChild
                    desktopWidth={"50"}
                    mobileWidth={"100"}
                    tabWidth={"50"}
                  >
                    <TextStyles type="neutralText" textcolor="light">
                      Shopify Store{" "}
                    </TextStyles>
                  </FlexChild>
                </FlexLayout>
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
                      {CustomerName || "Not Available"}
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

            {/* <FlexLayout spacing="extraLoose" halign={"center"} childWidth="fullWidth">
              <FlexLayout spacing="loose" direction="vertical">
                <TextStyles type="SubHeading" textcolor="light">Order ID</TextStyles>
                <TextStyles type="SubHeading" textcolor="light">
                  Order Date{" "}
                </TextStyles>
                <TextStyles type="SubHeading" textcolor="light">
                  Order Status{" "}
                </TextStyles>

              </FlexLayout>
              <FlexLayout spacing="loose" direction="vertical">
                <TextStyles type="SubHeading">:</TextStyles>
                <TextStyles type="SubHeading">:</TextStyles>

                <TextStyles type="SubHeading">:</TextStyles>
              </FlexLayout>
              <FlexLayout spacing="loose" direction="vertical">
                <TextStyles type="SubHeading">
                  {props.match.params.order_id}
                </TextStyles>
                <TextStyles type="SubHeading">{OrderDate}</TextStyles>
                <TextStyles type="SubHeading">{(OrderStatus).charAt(0).toUpperCase() + OrderStatus.slice(1).replace("_", " ")} </TextStyles>
              </FlexLayout>

              <FlexLayout spacing="loose" >
                <FlexLayout spacing="loose" direction="vertical">
                  <TextStyles type="SubHeading" textcolor="light">
                    Purchased from{" "}
                  </TextStyles>
                  <TextStyles type="SubHeading" textcolor="light">
                    Customer Name{" "}
                  </TextStyles>
                  <TextStyles type="SubHeading" textcolor="light">
                    Email{" "}
                  </TextStyles>
                </FlexLayout>
                <FlexLayout spacing="loose" direction="vertical">
                  <TextStyles type="SubHeading">: </TextStyles>
                  <TextStyles type="SubHeading">:</TextStyles>
                  <TextStyles type="SubHeading">:</TextStyles>

                </FlexLayout>
                <FlexLayout spacing="loose" direction="vertical">
                  <TextStyles type="SubHeading"> Shopify Store </TextStyles>

                  <TextStyles type="SubHeading">{CustomerName}</TextStyles>
                  <TextStyles type="SubHeading">{Email} </TextStyles>
                </FlexLayout>
              </FlexLayout>
            </FlexLayout> */}
          </Card>
        </div>

        {/* <Card title="Address Information" cardType="bordered"> */}

        {/* </Card> */}

        {/* <Card title='Payment & Shipping Method' cardType='bordered'>
                    <FlexLayout spacing='loose' halign='start'>

                        <FlexLayout direction='vertical' valign='start' spacing='loose'>
                            <TextStyles type="SubHeading">Payment Information:</TextStyles>
                            <TextStyles type="SubHeading">Cash On Delivery</TextStyles>
                            <TextStyles type='neutralText'>The order was placed in USD</TextStyles>

                        </FlexLayout>
                        <FlexLayout direction='vertical' valign='start' spacing='loose'>
                            <TextStyles type="SubHeading">Shipping & Handling Information:</TextStyles>
                            <TextStyles type="SubHeading">freeShipping $0.00</TextStyles>
                        </FlexLayout>
                    </FlexLayout>
                </Card> */}
        <Card title="Items Ordered" cardType="bordered">
          <Grid rows={rows} columns={col} />
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
              <TextStyles type={"neutralText"} textcolor={"light"}>
                {CustomerName || "Not Available"}
              </TextStyles>
              <TextStyles type={"neutralText"} textcolor={"light"}>
                {BillingAddress || "Not Available"}
              </TextStyles>
              <TextStyles type={"neutralText"} textcolor={"light"}>
                {BillingCity || "Not Available"},
                {BillingState || "Not Available"},
                {BillingZip || "Not Available"}
              </TextStyles>
              <TextStyles type={"neutralText"} textcolor={"light"}>
                {BillingCountry || "Not Available"}
              </TextStyles>
            </FlexLayout>
          </Card>
          <Card title="Shipping Address" cardType="bordered">
            <FlexLayout direction="vertical" valign="start" spacing="loose">
              <TextStyles type={"neutralText"} textcolor={"light"}>
                {ShippingName || "Not Available"}
              </TextStyles>
              <TextStyles type={"neutralText"} textcolor={"light"}>
                {ShippingAddress || "Not Available"}
              </TextStyles>
              <TextStyles type={"neutralText"} textcolor={"light"}>
                {ShippingCity || "Not Available"},
                {ShippingState || "Not Available"},
                {ShippingZip || "Not Available"}
              </TextStyles>
              <TextStyles type={"neutralText"} textcolor={"light"}>
                {ShippingCountry || "Not Available"}
              </TextStyles>
            </FlexLayout>
          </Card>
        </FlexLayout>

        <FlexLayout
          spacing="loose"
          halign="fill"
          desktopWidth={"50"}
          mobileWidth={"100"}
          tabWidth={"50"}
        >
          <Card title="Admin Charges" cardType="bordered">
            <FlexLayout
              spacing={"loose"}
              direction={"vertical"}
              childWidth={"fullWidth"}
            >
              <FlexLayout spacing={"extraLoose"} halign={"fill"}>
                <TextStyles type={"mediumText"}>
                  Fullfillment Delay Fee
                </TextStyles>
                <TextStyles type={"neutralText"} textcolor={"light"}>
                  {" "}
                  {currency} {delayFee.toFixed(2)}
                </TextStyles>
              </FlexLayout>
              <FlexLayout spacing={"extraLoose"} halign={"fill"}>
                <TextStyles type={"mediumText"}>Service Tax</TextStyles>
                <TextStyles type={"neutralText"} textcolor={"light"}>
                  {" "}
                  {currency} {serviceTax.toFixed(2)}
                </TextStyles>
              </FlexLayout>
              <FlexLayout spacing={"extraLoose"} halign={"fill"}>
                <TextStyles type={"mediumText"}>commission</TextStyles>
                <TextStyles type={"neutralText"} textcolor={"light"}>
                  {" "}
                  {currency} {commission.toFixed(2)}
                </TextStyles>
              </FlexLayout>
              <FlexLayout spacing={"extraLoose"} halign={"fill"}>
                <TextStyles type={"mediumText"}>Marketplace Fee</TextStyles>
                <TextStyles type={"neutralText"} textcolor={"light"}>
                  {" "}
                  {currency} {marketPlaceFee.toFixed(2)}
                </TextStyles>
              </FlexLayout>
              <hr />
              <FlexLayout spacing={"extraLoose"} halign={"fill"}>
                <TextStyles type={"mediumText"}>Total Charges</TextStyles>
                <TextStyles type={"neutralText"} textcolor={"light"}>
                  {" "}
                  {currency}{" "}
                  {(
                    delayFee +
                    commission +
                    serviceTax +
                    marketPlaceFee
                  ).toFixed(2)}
                </TextStyles>
              </FlexLayout>
            </FlexLayout>
          </Card>
          <Card title="Order Total" cardType="bordered">
            <FlexLayout
              spacing={"loose"}
              direction={"vertical"}
              childWidth={"fullWidth"}
            >
              <FlexLayout spacing={"extraLoose"} halign={"fill"}>
                <TextStyles type={"mediumText"}>Subtotal</TextStyles>
                <TextStyles type={"neutralText"} textcolor={"light"}>
                  {" "}
                  {currency} {Price}
                </TextStyles>
              </FlexLayout>
              <FlexLayout spacing={"extraLoose"} halign={"fill"}>
                <TextStyles type={"mediumText"}>Discount</TextStyles>
                <TextStyles type={"neutralText"} textcolor={"light"}>
                  {" "}
                  - {currency} {Discount}
                </TextStyles>
              </FlexLayout>
              <FlexLayout spacing={"extraLoose"} halign={"fill"}>
                <TextStyles type={"mediumText"}>Total Tax</TextStyles>
                <TextStyles type={"neutralText"} textcolor={"light"}>
                  {currency} {TotalTax} {taxInclusion ? "(Included)" : ""}
                </TextStyles>
              </FlexLayout>
              <FlexLayout spacing={"extraLoose"} halign={"fill"}>
                <TextStyles type={"mediumText"}>Shipping Fees</TextStyles>
                <TextStyles type={"neutralText"} textcolor={"light"}>
                  {currency} {ShippingFees}
                </TextStyles>
              </FlexLayout>
              <FlexLayout spacing={"extraLoose"} halign={"fill"}>
                <TextStyles type={"mediumText"}>Admin Charges</TextStyles>
                <TextStyles type={"neutralText"} textcolor={"light"}>
                  - {currency}{" "}
                  {delayFee + serviceTax + commission + marketPlaceFee}
                </TextStyles>
              </FlexLayout>
              <hr />
              <FlexLayout spacing={"extraLoose"} halign={"fill"}>
                <TextStyles type={"mediumText"}>Total Earning</TextStyles>
                <TextStyles type={"neutralText"} textcolor={"light"}>
                  {" "}
                  {currency} {GrandTotal}
                </TextStyles>
              </FlexLayout>
            </FlexLayout>
          </Card>
        </FlexLayout>
      </FlexLayout>
    </div>
  );
}

export default DI(ViewOrder);
