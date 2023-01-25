/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Badge,
  Button,
  Card,
  FlexLayout,
  PageHeader,
  TextStyles,
} from "@cedcommerce/ounce-ui";
import React, { useEffect, useState } from "react";
import { DI, DIProps } from "./../../../Core";
function GetTransaction(Props: DIProps) {
  const [transactionData, setTransactionData] = useState<any>([]);
  function getData() {
    Props.di
      .GET(
        "/connector/transaction/getTransactionById?transaction_id=" +
          Props.match.params.id
      )
      .then((e) => {
        if (e.success) {
          setTransactionData(e.data.rows);
        }
      });
  }
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <PageHeader
        title="View Transactions"
        action={
          <Button
            thickness="thin"
            type="Plain"
            onClick={() => {
              Props.history.goBack();
            }}
          >
            Back
          </Button>
        }
      />
      <Card cardType="bordered">
        <FlexLayout
          spacing="extraLoose"
          mobileWidth="100"
          tabWidth="100"
          desktopWidth="50"
        >
          <FlexLayout spacing={"extraLoose"} wrap="noWrap" halign={"fill"}>
            <TextStyles type={"mediumText"}>Supplier Name</TextStyles>
            <TextStyles type={"neutralText"} textcolor="light">
              {transactionData[0] &&
                transactionData[0]["vendor_name"].charAt(0) +
                  transactionData[0]["vendor_name"].slice(1)}
            </TextStyles>
          </FlexLayout>
          <FlexLayout spacing={"extraLoose"} wrap="noWrap" halign={"fill"}>
            <TextStyles type={"mediumText"}>Supplier ID</TextStyles>
            <TextStyles type={"neutralText"} textcolor="light">
              {transactionData[0] && transactionData[0]["user_id"]}
            </TextStyles>
          </FlexLayout>

          {/* <FlexLayout spacing={"extraLoose"} wrap="noWrap" halign={"fill"}>
            <TextStyles type={"mediumText"}>
              Bank Account Name
            </TextStyles>
            <TextStyles type={"neutralText"} textcolor="light">
              {transactionData["bank_account_name"]}
            </TextStyles>
          </FlexLayout> */}

          {/* <FlexLayout spacing={"extraLoose"} wrap="noWrap" halign={"fill"}>
            <TextStyles type={"mediumText"}>
              Bank Account Number
            </TextStyles>
            <TextStyles type={"neutralText"} textcolor="light">
              {transactionData["bank_account_number"]}
            </TextStyles>
          </FlexLayout> */}

          {/* <FlexLayout spacing={"extraLoose"} wrap="noWrap" halign={"fill"}>
            <TextStyles type={"mediumText"}>
              Bank Name
            </TextStyles>
            <TextStyles type={"neutralText"} textcolor="light">
              {transactionData["bank_name"]}
            </TextStyles>
          </FlexLayout> */}

          {/* <FlexLayout spacing={"extraLoose"} wrap="noWrap" halign={"fill"}>
            <TextStyles type={"mediumText"}>
              Bank Swift Code
            </TextStyles>
            <TextStyles type={"neutralText"} textcolor="light">
              {transactionData["bank_swift_code"]}
            </TextStyles>
          </FlexLayout> */}

          {/* <FlexLayout spacing={"extraLoose"} wrap="noWrap" halign={"fill"}>
            <TextStyles type={"mediumText"}>
              Bsb Number
            </TextStyles>
            <TextStyles type={"neutralText"} textcolor="light">
              {transactionData["bsb_number"]}
            </TextStyles>
          </FlexLayout> */}

          <FlexLayout spacing={"extraLoose"} wrap="noWrap" halign={"fill"}>
            <TextStyles type={"mediumText"}>Supplier Amount</TextStyles>

            <TextStyles type={"neutralText"} textcolor="light">
              {transactionData[0] &&
                transactionData[0].currency +
                  " " +
                  transactionData[0]["vendor_amount"]}
            </TextStyles>
          </FlexLayout>

          <FlexLayout spacing={"extraTight"} wrap="noWrap" halign={"fill"}>
            <TextStyles type={"mediumText"}>Transaction ID</TextStyles>
            <TextStyles type={"neutralText"} textcolor="light">
              {transactionData[0] && transactionData[0]["transaction_id"]}
            </TextStyles>
          </FlexLayout>
          <FlexLayout spacing={"extraTight"} wrap="noWrap" halign={"fill"}>
            <TextStyles type={"mediumText"}>Transaction Message</TextStyles>
            <TextStyles type={"neutralText"} textcolor="light">
              {transactionData[0] && transactionData[0]["transaction_msg"]}
            </TextStyles>
          </FlexLayout>
          <FlexLayout spacing={"extraTight"} wrap="noWrap" halign={"fill"}>
            <TextStyles type={"mediumText"}>Payment ID</TextStyles>
            <TextStyles type={"neutralText"} textcolor="light">
              {(transactionData[0] && transactionData[0]["paymentId"]) ||
                "Not Available"}
            </TextStyles>
          </FlexLayout>
          <FlexLayout spacing={"extraTight"} wrap="noWrap" halign={"fill"}>
            <TextStyles type={"mediumText"}>Transaction Created At</TextStyles>
            <TextStyles type={"neutralText"} textcolor="light">
              {transactionData[0] &&
                transactionData[0]["transaction_created_at"]}
            </TextStyles>
          </FlexLayout>
          <FlexLayout spacing={"extraLoose"} wrap="noWrap" halign={"fill"}>
            <TextStyles type={"mediumText"}>Commission</TextStyles>
            <TextStyles type={"neutralText"} textcolor="light">
              {transactionData[0] &&
                transactionData[0].currency +
                  " " +
                  transactionData[0]["commission"]}
            </TextStyles>
          </FlexLayout>
          <FlexLayout spacing={"extraLoose"} wrap="noWrap" halign={"fill"}>
            <TextStyles type={"mediumText"}>Marketplace Fee</TextStyles>
            <TextStyles type={"neutralText"} textcolor="light">
              {transactionData[0] &&
                transactionData[0].currency +
                  " " +
                  transactionData[0]["marketplace_Fee"]}
            </TextStyles>
          </FlexLayout>
          <FlexLayout spacing={"extraLoose"} wrap="noWrap" halign={"fill"}>
            <TextStyles type={"mediumText"}>Service Tax</TextStyles>
            <TextStyles type={"neutralText"} textcolor="light">
              {transactionData[0] &&
                transactionData[0].currency +
                  " " +
                  transactionData[0]["service_tax"]}
            </TextStyles>
          </FlexLayout>
          <FlexLayout spacing={"extraLoose"} wrap="noWrap" halign={"fill"}>
            <TextStyles type={"mediumText"}>Total Price</TextStyles>
            <TextStyles type={"neutralText"} textcolor="light">
              {transactionData[0] &&
                transactionData[0].currency +
                  " " +
                  transactionData[0]["total_price"]}
            </TextStyles>
          </FlexLayout>
          <FlexLayout spacing={"extraLoose"} wrap="noWrap" halign={"fill"}>
            <TextStyles type={"mediumText"}>Status</TextStyles>

            <Badge type="Success">
              {transactionData[0] && transactionData[0]["transaction_status"]}
            </Badge>
          </FlexLayout>
        </FlexLayout>
      </Card>
    </>
  );
}

export default DI(GetTransaction);
