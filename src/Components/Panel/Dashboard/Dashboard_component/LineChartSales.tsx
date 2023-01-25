/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { DI, DIProps } from "./../../../../Core";
import { Line } from "react-chartjs-2";
interface dateProp extends DIProps {
  currency: string;
  selected: string;
}

function LineChartSales(props: dateProp) {
  const [lineDate, setLineDate] = useState([]);

  const [lineMonth, setLineMonth] = useState([]);

  function getData() {
    props.di
      .GET(`frontend/migrator/getMigrationAnalytics?days=${props.selected}`)
      .then((e) => {
        if (e.success) {
          const orderAnalytics: any = [];

          const lineMonths: any = [];

          const linedate: any = [];
          if (e.salesAnalytics) {
            // let length = 0;

            for (let i = 0; i < e.salesAnalytics.length; i++) {
              // const month = renderMonth(e.orderAnalytics[i]._id);
              lineMonths.push(e.salesAnalytics[i]._id);
              linedate.push(e.salesAnalytics[i].Sales.toFixed(2));
            }

            setLineMonth(lineMonths);
            setLineDate(linedate);
            orderAnalytics["length"] = length;
          }
        }
      });
  }

  const productLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: "top",
      align: "left",
      fullWidth: true,
      onHover: function (e: any) {
        e.target.style.cursor = "pointer";
      },
      display: true,
      labels: {
        fontColor: "#444444",
        boxWidth: 10,
        fontSize: 14,
        fontFamily: "Montserrat",
        padding: 14,
        usePointStyle: true,
      },
      hover: {
        onHover: function (e: any) {
          e.target.style.cursor = "pointer";
        },
      },
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            min: 0,
          },
          gridLines: {
            display: true,
            showBorder: false,
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            display: false,
            showBorder: false,
          },
        },
      ],
    },

    tooltips: {
      mode: "index",
      intersect: false,
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  const data = {
    labels: lineMonth,
    datasets: [
      {
        label: `Sales(In ${props.currency})`,
        data: lineDate,
        fill: false,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  useEffect(() => {
    getData();
  }, [props.selected]);

  return (
    <div className={"linechart_jsstyle"}>
      <Line data={data} options={productLineOptions} height={250} />
    </div>
  );
}

export default DI(LineChartSales);
