/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Card,
  FlexLayout,
  PageHeader,
  TextStyles,
  Toast,
} from "@cedcommerce/ounce-ui";
import React, { useEffect, useState, Component } from "react";
import EmptyDataFound from "../../../Core/EmptyStates/EmptyDataFound";
import { DI,} from "./../../../Core";
import { Grid } from "./../../../Shared/index";

function SubsHistory(props: any) {
  const columns: any = {
    subscription_id: {
      name: "Subscription ID",
      visible: "true",
    },

    payer_email: {
      name: "Payer email",
      visible: "true",
    },
    payer_name: {
      name: "Payer Name",
      visible: "true",
    },
    amount_with_breakdown: {
      name: "Price",
      visible: "true",
    },
    status: {
      name: "Status",
      visible: "true",
    },
  };
  const [rows, setRows] = useState<any>([{}]);
  const [SubscriptionDetail, setSubscriptionDetail] = useState<any>({});
  const [loading, setloading] = useState(false);
  const [Loadingcancel, setLoadingcancel] = useState(false);
  const [Toastcancel, setToastcancel] = useState(false);
  const [message, setMesssage] = useState("");

  function getData() {
    props.di
      .GET(
        `/connector/subscription/getSubscriptions?subscription_id=60&activePage=1&filter[subscription_id][1]=${props.match.params.subscription_id}`
      )
      .then((e: any) => {
        if (e.success) {
          setSubscriptionDetail(e.data.rows[0].subscription[0]);
        }
      });
  }

  function getTransactionData() {
    setloading(true);
    props.di
      .GET(
        `connector/subscription/getTransactionsListForSubscription?subscription_id=${props.match.params.subscription_id}`
      )
      .then((e: any) => {
        if (e.success) {
          const temp = Object.keys(e.data).map((ele) => {
            // console.log(e.data[ele] , "dhj" , ele)
            return {
              ...e.data[ele],
              payer_email: (
                <span style={{ wordBreak: "break-word" }}>
                  {" "}
                  {e.data[ele].payer_email || "Not Available"}
                </span>
              ),
              payer_name:
                (e.data[ele].payer_name &&
                  e.data[ele].payer_name.given_name +
                    " " +
                    e.data[ele].payer_name &&
                  e.data[ele].payer_name.surname) ||
                "Not Available",
              amount_with_breakdown:
                (e.data[ele].amount_with_breakdown &&
                  e.data[ele].amount_with_breakdown.gross_amount.currency_code +
                    " " +
                    e.data[ele].amount_with_breakdown &&
                  e.data[ele].amount_with_breakdown.gross_amount.value) ||
                "Not Available",
              status: e.data[ele].status || "Not Available",
            };
          });
          setRows(temp);
        }
        setloading(false);
      });
  }
  function handleCancelSub() {
    setLoadingcancel(true);
    props.di
      .GET(
        `/connector/subscription/cancelSubscription?subscription_id=${props.match.params.subscription_id}`
      )
      .then((e: any) => {
        if (e.success) {
          setToastcancel(true);
          setMesssage(e.message);
          getData();
        }
        setLoadingcancel(false);
      });
  }
  useEffect(() => {
    getTransactionData();
    getData();
  }, []);
  return (
    <>
      <ToastWrapper>
        {Toastcancel && (
          <Toast
            type="error"
            message={message}
            onDismiss={() => {
              setToastcancel(!Toastcancel);
            }}
            timeout={3000}
          />
        )}
      </ToastWrapper>
      <PageHeader
        title="Subscription history"
        action={
          <Button
            type="Primary"
            thickness="thin"
            onClick={() => {
              props.history.push("/subscription");
            }}
          >
            Back
          </Button>
        }
      ></PageHeader>
      <FlexLayout direction="vertical" spacing="loose">
        <Card
          title="Subscription Details"
          action={
            SubscriptionDetail.status == "active" && (
              <Button
                loading={Loadingcancel}
                thickness="thin"
                type="Danger"
                onClick={() => {
                  handleCancelSub();
                }}
              >
                Cancel Subscription
              </Button>
            )
          }
        >
          <FlexLayout spacing="loose" halign="start">
            <FlexLayout
              spacing="loose"
              direction="vertical"
              valign="start"
              halign="start"
            >
              <TextStyles type="neutralText">Subscription ID</TextStyles>
              <TextStyles type="neutralText">Plan Name</TextStyles>
              <TextStyles type="neutralText">Catalog Size</TextStyles>
              <TextStyles type="neutralText">Amount</TextStyles>
              <TextStyles type="neutralText">Subscribed At</TextStyles>
              <TextStyles type="neutralText"> Renewed At</TextStyles>
            </FlexLayout>
            <FlexLayout
              direction="vertical"
              valign="start"
              halign="start"
              spacing="loose"
            >
              <TextStyles type="neutralText">:</TextStyles>
              <TextStyles type="neutralText">:</TextStyles>
              <TextStyles type="neutralText">:</TextStyles>
              <TextStyles type="neutralText">:</TextStyles>
              <TextStyles type="neutralText">:</TextStyles>
              <TextStyles type="neutralText">:</TextStyles>
            </FlexLayout>
            <FlexLayout
              direction="vertical"
              valign="start"
              halign="start"
              spacing="loose"
            >
              <TextStyles type="neutralText">
                {SubscriptionDetail.subscription_id}
              </TextStyles>
              <TextStyles type="neutralText">
                {SubscriptionDetail.plan_name}
              </TextStyles>
              <TextStyles type="neutralText">
                {SubscriptionDetail.catalog_size}
              </TextStyles>
              <TextStyles type="neutralText">
                {props.currency + " " + SubscriptionDetail.price}
              </TextStyles>
              <TextStyles type="neutralText">
                {SubscriptionDetail.subcribed_at}
              </TextStyles>
              <TextStyles type="neutralText">
                {SubscriptionDetail.renewed_at}
              </TextStyles>
            </FlexLayout>
          </FlexLayout>
        </Card>
        <Card title="Transaction History">
          {rows.length !== 0 ? (
            <Grid loading={loading} rows={rows} columns={columns} />
          ) : (
            <EmptyDataFound />
          )}
        </Card>
      </FlexLayout>
    </>
  );
}
interface ToastWrapperI {
  children: React.ReactNode;
}
class ToastWrapper extends Component<ToastWrapperI> {
  constructor(props: ToastWrapperI) {
    super(props);

    this.state = {};
  }

  render() {
    // const children = React.Children.toArray(this.props.children);
    return <div className={"inte-toast--Wrapper"}>{this.props.children}</div>;
  }
}

export default DI(SubsHistory);
