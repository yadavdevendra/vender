/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import { Card, FlexLayout, Select } from "@cedcommerce/ounce-ui";
import { DI, DIProps } from "../../../../Core";
import { Doughnut } from "react-chartjs-2";
import LineChart from "./LineChart";
import LineChartSales from "./LineChartSales";
import EmptyDataFound from "../../../../Core/EmptyStates/EmptyDataFound";
import EmptyOrder from "../../../../Core/EmptyStates/EmptyOrder";
import EmptySales from "../../../../Core/EmptyStates/EmptySales";
import jwt_decode from "jwt-decode";
interface order_record extends DIProps {
  order_id: number;
  customer: string;
  date: number;
  action: string;
  total: number;
  temp1: number;
}

function Dashboard_content(Props: any): JSX.Element {
  const [product1, setProduct] = useState([]);
  const [selectDate, setSelectDate] = useState("30");
  const [selectDate2, setSelectDate2] = useState("30");
  const [order1, setOrder] = useState([]);
  const [Liveproduct, setLiveproduct] = useState(0);
  const [Transaction, setTransaction] = useState([]);
  const [analyticOrder, setAnalyticOrder] = useState(true);
  const [analyticProduct, setAnalyticProduct] = useState(true);
  const [totalOrders, settotalOrders] = useState(0);
  const [TotalProduct, setTotalProduct] = useState(0);

  const [totalEarn, settotalEarn] = useState(0);
  const [totalSales, settotalSales] = useState(0);
  const [TotalOrder, setTotalOrder] = useState(0);
  useEffect(() => {
    const ar: any = [];
    let count = 0;
    const transaction: any = [];
    const orders: any = [];
    const product: any = [];
    const products: any = [];
    Props.di.GET(`frontend/migrator/getMigrationAnalytics`).then((e: any) => {
      if (e.success) {
        if (e.data.order.Total_Earn.length != 0)
          settotalEarn(e.data.order.Total_Earn[0].Total_Earn);
        if (e.data.order.Total_Sales != 0)
          settotalSales(e.data.order.Total_Sales[0].Total_Sales);
        if (e.data.order.imported.length != 0) {
          let tempOrder = 0;
          Object.keys(e.data.order.imported).forEach((ele) => {
            tempOrder = tempOrder + e.data.order.imported[ele].count;
          });
          setTotalOrder(tempOrder);
        }

        if (Object.keys(e.data.order).length != 0) {
          const temp: any = [0, 0];
          // if (e.data.order.imported[0].count != undefined)
          //   settotalOrders(e.data.order.imported[0].count);

          setAnalyticOrder(true);

          Object.keys(e.data.order).map((ele) => {
            if (ele === "Total_Earn" && e.data.order["Total_Earn"].length != 0)
              temp[0] =
                e.data.order["Total_Earn"][0].Total_Earn &&
                e.data.order["Total_Earn"][0].Total_Earn.toFixed(2);

            if (
              ele === "Payment_Due" &&
              e.data.order["Payment_Due"].length != 0
            )
              temp[1] =
                e.data.order["Payment_Due"][0].Total_pending_amount &&
                e.data.order["Payment_Due"][0].Total_pending_amount.toFixed(2);
          });

          setTransaction(temp);
        } else {
          setAnalyticOrder(false);
        }
        if (e.data.order.imported.length == 0) {
          setAnalyticOrder(false);
        } else {
          setAnalyticOrder(true);
        }
        const temp0 = Object.keys(e.data.product).map((ele) => {
          return e.data.product[ele][0].count;
        });
        let t = 0;
        temp0.map((ele) => {
          t = t + ele;
        });
        if (t != 0) {
          setAnalyticProduct(true);
        } else {
          setAnalyticProduct(false);
        }

        Object.keys(e.data).forEach((keys) => {
          if (keys == "order") {
            Object.values(e.data[keys]["imported"]).forEach((val: any) => {
              ar[val["_id"]] = val["count"];
              count = count + val["count"];
            });
          }
          let tempCount = 0;
          if (keys == "product") {
            Object.keys(e.data[keys]).forEach((key) => {
              if (key === "live") {
                product["live"] = e.data[keys][key][0]["count"];
                setLiveproduct(e.data[keys][key][0]["count"]);
                tempCount = tempCount + e.data[keys][key][0]["count"];
              }
              if (key === "pending") {
                product["pending"] = e.data[keys][key][0]["count"];
                tempCount = tempCount + e.data[keys][key][0]["count"];
              }
              if (key === "inactive") {
                product["inactive"] = e.data[keys][key][0]["count"];
                // tempCount = tempCount + e.data[keys][key][0]["count"];
              }
              if (key === "rejected") {
                product["rejected"] = e.data[keys][key][0]["count"];
                tempCount = tempCount + e.data[keys][key][0]["count"];
              }
              if (key === "imported") {
                product["imported"] = e.data[keys][key][0]["count"];
                tempCount = tempCount + e.data[keys][key][0]["count"];
              }
            });
            setTotalProduct(tempCount);
          }

          orders[0] = ar["refunded"] ? ar["refunded"] : 0;
          orders[1] = ar["canceled"] ? ar["canceled"] : 0;
          orders[2] = ar["pending"] ? ar["pending"] : 0;
          orders[3] = ar["fulfilled"] ? ar["fulfilled"] : 0;
          orders[4] = ar["partially_fulfilled"] ? ar["partially_fulfilled"] : 0;
          products[0] = product["live"];
          products[1] = product["pending"];
          products[2] = product["inactive"];
          products[3] = product["rejected"];
          products[4] = product["imported"];
          transaction[0] = product["Payment_Due"] || 0;
          transaction[1] = product["Total_Earn"] || 0;
        });
        // setTransaction(transaction);
        setProduct(products);
        setOrder(orders);
      }
    });
  }, [selectDate]);
  const data2 = {
    labels: ["Live", "Pending", "Inactive", "Rejected", "Imported"],
    datasets: [
      {
        data: product1,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#af2cff",
          "#6db21a",
        ],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#af2cff"],
        hoverBorderColor: ["#FF6384", "#36A2EB", "#FFCE56", "#af2cff"],
        hoverBorderWidth: [4, 4, 4, 4],
        weight: 1,
      },
    ],
    text: "100%",
  };
  const data3 = {
    labels: ["Total Earn", "Payment Due"],

    datasets: [
      {
        data: Transaction,
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
        hoverBorderColor: ["#FF6384", "#36A2EB"],
        hoverBorderWidth: [4, 4],
      },
    ],

    text: "100%",
  };
  const data1 = {
    labels: [
      "Refunded",
      "Cancel",
      "Pending",
      "Fulfilled",
      "Partially-Fulfilled",
    ],

    datasets: [
      {
        data: order1,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#6db21a",
          "#ff5900",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#6db21a",
          "#ff5900",
        ],
        hoverBorderColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#6db21a",
          "#ff5900",
        ],
        hoverBorderWidth: [4, 4, 4, 4, 4, 4],
      },
    ],

    text: "100%",
  };
  const data1Nodata = {
    labels: ["No data Found"],
    datasets: [
      {
        data: [1],
        backgroundColor: ["grey"],
        hoverBackgroundColor: ["grey"],
        hoverBorderColor: ["grey"],
      },
    ],
    text: "100%",
  };
  const data2Nodata = {
    labels: ["No data found"],
    datasets: [
      {
        data: [],
        backgroundColor: ["grey"],
        hoverBackgroundColor: ["grey"],
        hoverBorderColor: ["grey"],
      },
    ],
    text: "100%",
  };
  const orderOptions = {
    responsive: true,

    maintainAspectRatio: true,
    legend: {
      position: "bottom",
      align: "left",
      fullWidth: true,
      display: true,
      onHover: function (e: any) {
        e.target.style.cursor = "pointer";
      },
      labels: {
        fontColor: "#444444",
        boxWidth: 10,
        fontSize: 12,
        fontFamily: "Montserrat",
        usePointStyle: true,
      },
    },
    hover: {
      onHover: function (e: any) {
        e.target.style.cursor = "pointer";
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };
  const EarningOption = {
    maintainAspectRatio: true,

    responsive: true,

    legend: {
      position: "bottom",
      align: "left",
      fullWidth: true,
      onHover: function (e: any) {
        e.target.style.cursor = "pointer";
      },
      display: true,
      labels: {
        fontColor: "#444444",
        boxWidth: 10,
        fontSize: 12,
        fontFamily: "Montserrat",

        usePointStyle: true,
      },
    },
    hover: {
      onHover: function (e: any) {
        e.target.style.cursor = "pointer";
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  const productOption = {
    maintainAspectRatio: true,

    responsive: true,
    legend: {
      position: "bottom",
      align: "center",
      fullWidth: true,
      onHover: function (e: any) {
        e.target.style.cursor = "pointer";
      },
      display: true,
      labels: {
        fontColor: "#444444",
        boxWidth: 10,
        fontSize: 12,
        fontFamily: "Montserrat",
        // padding: 10,
        usePointStyle: true,
      },
    },

    hover: {
      onHover: function (e: any) {
        e.target.style.cursor = "pointer";
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };
  return (
    <FlexLayout direction="vertical">
      <div>
        <FlexLayout direction="vertical" spacing="loose">
          <Card cardType={"plain"}>
            <FlexLayout
              spacing="loose"
              desktopWidth={"33"}
              tabWidth={"100"}
              mobileWidth={"100"}
            >
              {/* <Card title={`Total Products: ${TotalProduct}`}>
                {analyticProduct ? (
                  <Doughnut
                    data={data2}
                    options={productOption}
                    width={250}

                  />
                ) : (
                    <Doughnut
                      data={data2Nodata}
                      options={productOption}
                      width={250}

                    />
                  )}
              </Card> */}
              <Card title={`Live Products: ${Liveproduct}`}>
                {analyticProduct ? (
                  <Doughnut data={data2} options={productOption} width={250} />
                ) : (
                  // <Doughnut
                  //   data={data2Nodata}
                  //   options={productOption}
                  //   width={250}
                  // />
                  <EmptyDataFound></EmptyDataFound>
                )}
              </Card>
              {/* <Card title={`Total Orders:  ${TotalOrder}`}>

                {analyticOrder ? (
                  <Doughnut
                    data={data1}
                    options={orderOptions}
                    width={250}
                  />
                ) : (
                    <Doughnut
                      data={data1Nodata}
                      options={orderOptions}
                      width={250}
                    />
                  )}
              </Card> */}
              <Card
                title={`Total Sales: ${Props.currency}  ${
                  totalSales && totalSales.toFixed(2)
                }`}
              >
                {analyticOrder ? (
                  <div className={"linechart_jsstyle"}>
                    <Doughnut data={data1} options={orderOptions} width={250} />
                  </div>
                ) : (
                  // <Doughnut
                  //   data={data1Nodata}
                  //   options={orderOptions}
                  //   width={250}
                  // />
                  <EmptySales />
                )}
              </Card>
              <Card
                title={`Total Earning: ${Props.currency} ${
                  totalEarn && totalEarn.toFixed(2)
                }`}
              >
                {analyticOrder ? (
                  <div className={"linechart_jsstyle"}>
                    <Doughnut
                      data={data3}
                      options={EarningOption}
                      width={250}
                    />
                  </div>
                ) : (
                  // <Doughnut
                  //   data={data1Nodata}
                  //   options={EarningOption}
                  //   width={250}
                  // />
                  <EmptyDataFound />
                )}
              </Card>
            </FlexLayout>
          </Card>

          <Card cardType={"plain"}>
            <FlexLayout
              spacing="loose"
              desktopWidth={"50"}
              tabWidth={"100"}
              mobileWidth={"100"}
            >
              <Card
                title={`Orders over time `}
                action={
                  <div className="grossselect">
                    {" "}
                    <Select
                      popoverContainer="element"
                      value={selectDate}
                      thickness="thin"
                      onChange={(e) => setSelectDate(e)}
                      placeholder="Duration"
                      options={[
                        { label: "Last 7 days", value: "7" },
                        { label: "Last 1 month", value: "30" },
                        { label: "Last 1 year", value: "365" },
                        { label: "Last 2 years", value: "730" },
                      ]}
                    ></Select>
                  </div>
                }
              >
                <div className={"linechart_jsstyle"}>
                  <LineChart selected={selectDate} height={250} />
                </div>
              </Card>

              <Card
                title="Sales over time"
                action={
                  <div className="grossselect">
                    <Select
                      popoverContainer="element"
                      value={selectDate2}
                      thickness="thin"
                      onChange={(e) => setSelectDate2(e)}
                      options={[
                        { label: "Last 7 days", value: "7" },
                        { label: "Last 1 month", value: "30" },
                        { label: "Last 1 year", value: "365" },
                        { label: "Last 2 years", value: "730" },
                      ]}
                    ></Select>
                  </div>
                }
              >
                <div className={"linechart_jsstyle"}>
                  <LineChartSales
                    selected={selectDate2}
                    height={250}
                    currency={Props.currency}
                  />
                </div>
              </Card>
            </FlexLayout>
          </Card>
        </FlexLayout>
      </div>
    </FlexLayout>
  );
}

export default DI(Dashboard_content);
