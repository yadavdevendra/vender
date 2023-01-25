/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  Card,
  CheckBox,
  FlexLayout,
  FormChild,
  PageHeader,
  Select,
  TextField,
  TextStyles,
  Toast,
  ToastWrapper,
} from "@cedcommerce/ounce-ui";
import React, { useEffect, useState, Component } from "react";
// import LineChart from '../Dashboard/Dashboard_component/LineChart';
import { DI, DIProps } from "./../../../Core";
import { Grid } from "./../../../Shared/index";

function Shipment(props: DIProps) {
  const [lineItems, setLineItems] = useState([]);
  const [quant, setQuant] = useState<any>({});
  const [quantArr, setQuantArr] = useState<any>([]);
  const [defaultVal, SetDefaultVal] = useState<number>(1);
  const [OrderDate, setOrderDate] = useState("");
  const [OrderStatus, setOrderStatus] = useState("");
  const [IP, setIP] = useState("");
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
  const [rows, setRows] = useState<any>([]);
  const [Sku, setSku] = useState("");
  const [VendorName, setVendorName] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [comment, setComment] = useState("");
  const [appendComment, setAppendComment] = useState(false);
  const [emailCopy, setEmailCopy] = useState(false);
  const [Items1, setItems] = useState([]);
  const [TargetOrderID, setTargetOrderID] = useState("");
  const [ShippedQuantity, setShippedQuantity] = useState(0);
  const [TotalQuantity, setTotalQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refundRow, setRefundRow] = useState<any>([]);

  const [Message, setMessage] = useState("");
  const [toast, setToast] = useState(false);
  const [ToastError, setToastError] = useState(false);
  const [addTracking, setAddTracking] = useState(false);
  const col1 = {
    source_item_id: {
      name: "Source Item ID",
      visible: true,
    },
    product_name: {
      name: "Product",
      visible: true,
    },
    quantity_ordered: {
      name: "Quantity Ordered",
      visible: true,
    },

    qty_to_ship: {
      name: "Quantity to Ship",
      visible: true,
    },

    quantity: {
      name: "Quantity Shipped",
      visible: true,
    },
    sku: {
      name: "SKU",
      visible: true,
    },
  };

  const col = {
    carrier: {
      name: "Carrier",
      visible: true,
    },
    title: {
      name: "Title",
      visible: true,
    },
    number: {
      name: "Number",
      visible: true,
    },
    action: {
      name: "Action",
      visible: true,
    },
  };
  const refundCols = {
    product: {
      name: "Product",
      visible: true,
    },
    qty: {
      name: "Quantity",
      visible: true,
    },
    price: {
      name: "Price",
      visible: true,
    },
  };

  const rowStatus = {
    carrier: (
      <Select
        value={selectedMethod}
        onChange={(e) => setSelectedMethod(e)}
        thickness="thin"
        options={[
          { label: "Aramex Australia", value: "Aramex Australia" },

          { label: "FedEx", value: "FedEx" },
          { label: "UPS", value: "UPS" },
          { label: "Canada Post,", value: "Canada Post," },
          { label: "USPS", value: "USPS" },
          { label: "DHL Express", value: "DHL Express" },
          { label: "Other", value: "Other" },
        ]}
      />
    ),
    title: (
      <TextField
        thickness="thin"
        value={selectedMethod}
        onChange={(e) => setSelectedMethod(e)}
      />
    ),
    number: (
      <TextField
        thickness="thin"
        type="text"
        value={trackingNumber}
        onChange={(e) => {
          if (
            (e.charCodeAt(e.length - 1) >= 48 &&
              e.charCodeAt(e.length - 1) <= 57) ||
            e == ""
          ) {
            setTrackingNumber(e);
          }
        }}
      />
    ),
    action: (
      <Button
        thickness="thin"
        onClick={() => {
          //   SetDefaultVal(defaultVal - 1);
          setAddTracking(false);
          setTrackingNumber("");
          setSelectedMethod("");
        }}
      >
        Delete
      </Button>
    ),
  };
  function setValue(e: number, id: any): any {
    quant[id] = e;
  }
  useEffect(() => {
    // console.log("quant", quant);
  }, [quant, quantArr]);
  function getData() {
    props.di
      .GET(
        `connector/order/getOrder?user_id=${props.match.params.user_id}&order_id=${props.match.params.order_id}`
      )
      .then((e) => {
        setOrderDate(e.data.created_at);
        setOrderStatus(e.data.status);
        setIP(e.ip);
        setCustomerName(e.data.client_details.name);
        setEmail(e.data.client_details.contact_email);
        setBillingAddress(
          e.data.billing_address.address1 +
            " " +
            e.data.billing_address.address2
        );
        setBillingCity(e.data.billing_address.city);
        setBillingCountry(e.data.billing_address.country);
        setBillingZip(e.data.billing_address.zip);
        setBillingState(e.data.billing_address.province);
        setShippingAddress(e.data.delivery_details.full_address[0]);
        setShippingName(e.data.delivery_details.full_name);
        setShippingState(e.data.delivery_details.region);
        setShippingCity(e.data.delivery_details.locality);
        setShippingZip(e.data.delivery_details.zip);
        setShippingCountry(e.data.delivery_details.country);
        setSku(e.data.line_items[0].sku);
        setVendorName(e.data.vendor_name);
        setTargetOrderID(e.data.target_order_id);
        if (e.data.shipped_qty != undefined)
          setShippedQuantity(e.data.shipped_qty);
        setTotalQuantity(e.data.qty);
        const temp = e.data.line_items;
        setLineItems(temp);
        const items: any = Object.keys(e.data.line_items).map((m) => {
          return {
            source_product_id: e.data.line_items[m].source_product_id,
            source_item_id: e.data.line_items[m].source_item_id,
            quantity: quant[e.data.line_items[m].source_item_id],
            vendor_source_product_id:
              e.data.line_items[m].vendor_source_product_id,
            target_item_id: e.data.line_items[m].target_item_id,
          };
        });

        setItems(items);
        const qtemp: any = [];
        const qotemp: any = [];

        const abc: any = {};
        const refundData: any = {};
        if (Object.keys(e.data).includes("refunded")) {
          Object.values(e.data.refunded[0].items).forEach((ele: any) => {
            refundData[ele["line_item_id"]] = ele["quantity"];
          });
        }
        if (Object.keys(e.data).includes("fulfillments")) {
          e.data.fulfillments.forEach((e: any) => {
            e.items.forEach((e1: any, key: any) => {
              if (abc[e1["id"]]) {
                abc[e1["id"]] = e1.quantity + abc[e1["id"]];
              } else {
                abc[e1["id"]] = e1.quantity ?? 0;
              }
              // abc[e1['id']] = typeof abc[e1['id']] != undefined ?  :
            });
          });
        } else {
          Object.values(e.data.line_items).forEach((e1: any) => {
            abc[e1["source_item_id"]] = 0;
          });
        }
        const rows: any = [];
        const refundRows: any = [];
        Object.keys(e.data.line_items).map((j) => {
          rows.push({
            ...e.data.line_items[j],
            quantity: abc[e.data.line_items[j].source_item_id],
            product_name: (
              <FlexLayout
                valign="center"
                direction="vertical"
                spacing="extraTight"
              >
                <>{e.data.line_items[j].product_name}</>
                <TextStyles textcolor="light">
                  {e.data.line_items[j].title}
                </TextStyles>
              </FlexLayout>
            ),
            quantity_ordered: e.data.line_items[j].quantity_ordered,
            source_item_id: e.data.line_items[j].source_item_id,
            sku: e.data.line_items[j].sku,
            qty_to_ship: e.data.line_items[j] && (
              <RenderTextField
                {...props}
                setValue={setValue}
                quantity={
                  e.data.line_items[j].quantity_ordered -
                  (abc[e.data.line_items[j].source_item_id] != undefined &&
                    abc[e.data.line_items[j].source_item_id]) -
                  ((refundData[e.data.line_items[j].source_item_id] &&
                    refundData[e.data.line_items[j].source_item_id]) ||
                    0)
                }
                srcItemID={e.data.line_items[j].source_item_id}
              />
            ),
          });

          if (Object.keys(e.data).includes("refunded")) {
            Object.values(e.data.refunded[0].items).map((k: any) => {
              if (
                k["line_item_id"] === e.data.line_items[j]["source_item_id"]
              ) {
                refundRows.push({
                  product: (
                    <FlexLayout
                      valign="center"
                      direction="vertical"
                      spacing="extraTight"
                    >
                      <>{e.data.line_items[j].product_name}</>
                      <TextStyles textcolor="light">
                        {e.data.line_items[j].title}
                      </TextStyles>
                    </FlexLayout>
                  ),
                  qty: k["quantity"],
                  price:
                    e.data.line_items[j].currency +
                    " " +
                    e.data.line_items[j].price,
                });
              }
            });
          }
        });
        setRefundRow(refundRows);
        setRows(rows);
      });
  }
  useEffect(() => {
    getData();
  }, []);

  const rows12 = [];
  for (let index = 0; index < defaultVal; index++) {
    rows12.push(rowStatus);
  }

  function prepareData() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    const temp1 = Items1.map((val: any, key: any) => {
      return { ...val, quantity: quant[val["source_item_id"]] };
    });
    // temp['quantity']=e;
    // setItems(temp);
    const temp: any = {
      order_id: TargetOrderID,
      tracking_company: selectedMethod,
      tracking_number: trackingNumber,
      items: temp1,
    };
    const temp2 = [];
    temp2.push(temp);
    const full: any = {
      data: { fulfillments: [...temp2] },
      email: emailCopy,
      append_comment: appendComment,
      comment_text: comment,
    };
    setLoading(true);
    props.di.POST("shopifyhome/request/test", full).then((e) => {
      if (e.success) {
        setToast(true);
        setMessage(e.data);
        setTimeout(
          () =>
            props.history.push("/order/" + props.match.params.order_id, {
              user_id: props.match.params.user_id,
            }),
          3000
        );
      } else {
        setToastError(true);
        setMessage(e.message);
      }
      setLoading(false);
    });
  }

  return (
    <div>
      <ToastWrapper>
        {" "}
        {toast && (
          <Toast
            message={Message}
            type="success"
            timeout={3000}
            onDismiss={() => {
              setToast(!toast);
            }}
          />
        )}
        {ToastError && (
          <Toast
            message={Message}
            type="error"
            timeout={3000}
            onDismiss={() => {
              setToastError(!ToastError);
            }}
          />
        )}
      </ToastWrapper>
      <PageHeader title="New Shipment" />

      <FlexLayout
        wrap="none"
        direction="vertical"
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
            <FlexLayout spacing={"extraLoose"} direction={"vertical"}>
              <FlexLayout spacing={"extraLoose"} halign={"fill"}>
                <TextStyles type={"mediumText"}>Order ID </TextStyles>
                <TextStyles type="neutralText" textcolor="light">
                  {props.match.params.order_id}
                </TextStyles>
              </FlexLayout>
              <FlexLayout spacing={"extraLoose"} halign={"fill"}>
                <TextStyles type={"mediumText"}> Order Date </TextStyles>
                <TextStyles type="neutralText" textcolor="light">
                  {OrderDate || "Not Available"}
                </TextStyles>
              </FlexLayout>
              <FlexLayout spacing={"extraLoose"} halign={"fill"}>
                <TextStyles type={"mediumText"}>Order Status </TextStyles>
                <TextStyles type="neutralText" textcolor="light">
                  {OrderStatus.charAt(0).toUpperCase() +
                    OrderStatus.slice(1).replace("_", " ")}
                </TextStyles>
              </FlexLayout>
              {/* <FlexLayout spacing={"extraLoose"} halign={"fill"}>
                <TextStyles type={"mediumText"}>IP </TextStyles>
                <TextStyles type="neutralText" textcolor="light">
                  {IP || "Not Available"}
                </TextStyles>
              </FlexLayout> */}
            </FlexLayout>

            <FlexLayout spacing={"extraLoose"} direction={"vertical"}>
              <FlexLayout spacing={"extraLoose"} halign={"fill"}>
                <TextStyles type={"mediumText"}>Purchased from </TextStyles>
                <TextStyles type="neutralText" textcolor="light">
                  Shopify Store{" "}
                </TextStyles>
              </FlexLayout>
              <FlexLayout spacing={"extraLoose"} halign={"fill"}>
                <TextStyles type={"mediumText"}>Customer Name </TextStyles>
                <TextStyles type="neutralText" textcolor="light">
                  {CustomerName}
                </TextStyles>
              </FlexLayout>

              <FlexLayout spacing={"extraLoose"} halign={"fill"}>
                <TextStyles type={"mediumText"}>Email </TextStyles>
                <TextStyles type="neutralText" textcolor="light">
                  {Email || "Not Available"}
                </TextStyles>
              </FlexLayout>
            </FlexLayout>
          </FlexLayout>
        </Card>

        <FlexLayout
          spacing="loose"
          wrap="none"
          halign="fill"
          desktopWidth={"50"}
          mobileWidth={"100"}
          tabWidth={"50"}
        >
          <Card title="Billing Address" cardType="bordered">
            <FlexLayout direction="vertical" valign="start" spacing="loose">
              <TextStyles type="simpleText">{CustomerName}</TextStyles>
              <TextStyles type="simpleText">{BillingAddress}</TextStyles>
              <TextStyles type="simpleText">
                {BillingCity},{BillingState},{BillingZip}
              </TextStyles>
              <TextStyles type="simpleText">{BillingCountry}</TextStyles>
            </FlexLayout>
          </Card>
          <Card title="Shipping Address" cardType="bordered">
            <FlexLayout direction="vertical" valign="start" spacing="loose">
              <TextStyles type="simpleText">{ShippingName}</TextStyles>
              <TextStyles type="simpleText">{ShippingAddress}</TextStyles>
              <TextStyles type="simpleText">
                {ShippingCity},{ShippingState},{ShippingZip}
              </TextStyles>
              <TextStyles type="simpleText">{ShippingCountry}</TextStyles>
            </FlexLayout>
          </Card>
        </FlexLayout>

        <div>
          <Card title="Shipping Information" cardType="bordered">
            <FlexLayout direction="vertical" valign="start" spacing="loose">
              {addTracking && <Grid columns={col} rows={rows12} />}

              {!addTracking && (
                <Button
                  thickness="thin"
                  onClick={() => {
                    // SetDefaultVal(defaultVal + 1);
                    setAddTracking(true);
                  }}
                >
                  Add Tracking Number
                </Button>
              )}
            </FlexLayout>
          </Card>
        </div>
        <div>
          <Card title="Items to Ship" cardType="bordered">
            <FlexLayout halign="fill" spacing="loose">
              <Grid rows={rows} columns={col1} />
            </FlexLayout>

            {ShippedQuantity != undefined && (
              <FlexLayout spacing="loose" direction="vertical">
                <TextStyles type="mediumText">
                  Total Shipped Quantity: {ShippedQuantity}
                </TextStyles>
              </FlexLayout>
            )}
          </Card>
        </div>
        {refundRow.length > 0 && (
          <div>
            <Card title="Removed Item" cardType="bordered">
              <FlexLayout halign="fill" spacing="loose">
                <Grid rows={refundRow} columns={refundCols} />
              </FlexLayout>
            </Card>
          </div>
        )}
              <FlexLayout halign="end">
                <Button
                  loading={loading}
                  thickness="thin"
                  onClick={() => {
                    if (
                      trackingNumber.trim() !== "" &&
                      selectedMethod.trim() !== ""
                    ) {
                      prepareData();
                    } else {
                      setToastError(true);
                      setMessage("Please add tracking details.");
                    }
                  }}
                >
                  Submit Shipment{" "}
                </Button>
              </FlexLayout>

        {/* <div>
          <Card title="Shipping Comments" cardType="bordered">
            <FlexLayout
              direction="vertical"
              spacing="extraLoose"
              childWidth="fullWidth"
            >
              <TextField
                name="Comment"
                thickness="thin"
                value={comment}
                onChange={(e) => setComment(e)}
              />
              <TextStyles type="mediumText"> Shipment Option</TextStyles>
              {emailCopy && (
                <CheckBox
                  labelVal="Append Comments"
                  onClick={() => setAppendComment(!appendComment)}
                  checked={appendComment}
                />
              )}
              <CheckBox
                labelVal="Email copy of Shipment"
                onClick={() => setEmailCopy(!emailCopy)}
                checked={emailCopy}
              />
              <FlexLayout halign="end">
                <Button
                  loading={loading}
                  thickness="thin"
                  onClick={() => {
                    if (
                      trackingNumber.trim() !== "" &&
                      selectedMethod.trim() !== ""
                    ) {
                      prepareData();
                    } else {
                      setToastError(true);
                      setMessage("Please add tracking details.");
                    }
                  }}
                >
                  Submit Shipment{" "}
                </Button>
              </FlexLayout>
            </FlexLayout>
          </Card>
        </div> */}
      </FlexLayout>
    </div>
  );
}
interface TextFieldAct extends DIProps {
  setValue: (e: number, id: any) => void;
  // quantity: number

  quantity: number;
  srcItemID: any;
}
function RenderTextField({
  setValue,
  quantity,
  srcItemID,
}: TextFieldAct): JSX.Element {
  const [itemId, setitemId] = useState(srcItemID);
  const [val, setVal] = useState(quantity);
  const [showHelp, setShowHelp] = useState("");
  const [error, setError] = useState(false);
  // if (val > quantity) {
  //     setError(true);
  //     setShowHelp("Quantity to ship must be less than Quantity Ordered");
  // }
  useEffect(() => {
    setValue(quantity, itemId);
  }, []);
  // function notMore(a: any) {
  //     if (a > quantity) {
  //         setError(true);
  //         setShowHelp("Quantity to ship must be less than Quantity Ordered");
  //         setVal(0);

  //     } else {
  //         setError(false);
  //         setShowHelp("");

  //     }
  // }

  return (
    <TextField
      showHelp={showHelp}
      error={error}
      type="text"
      thickness="thin"
      onChange={(e: any) => {
        if (
          (parseInt(e) <= quantity &&
            parseInt(e) >= 0 &&
            e.charCodeAt(e.length - 1) >= 48 &&
            e.charCodeAt(e.length - 1) <= 57) ||
          e == ""
        ) {
          setValue(e, itemId);
          setVal(e);
        }
      }}
      value={val}
    />
  );
}

export default DI(Shipment);
