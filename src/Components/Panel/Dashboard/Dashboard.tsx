/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { DI } from "../../../Core";
import { PageHeader, Button } from "@cedcommerce/ounce-ui";
import Dashboard_content from "./Dashboard_component/Dashboard_content";

//interface PropsI extends DIProps {};

function Dashboard(props: any): JSX.Element {
  return (
    <>
      <PageHeader
        title="Dashboard"
        action={
          <Button
            type="Outlined"
            icon={
              <svg
                style={{ display: "flex" }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                height="20"
              >
                <path
                  fillRule="evenodd"
                  d="M0 10C0 4.478 4.478 0 10 0c5.523 0 10 4.478 10 10 0 5.523-4.477 10-10 10-5.522 0-10-4.477-10-10zm11.125 2.002H8.989v-.141c.01-1.966.492-2.254 1.374-2.782.093-.056.19-.114.293-.178.73-.459 1.292-1.038 1.292-1.883 0-.948-.743-1.564-1.666-1.564-.851 0-1.657.398-1.712 1.533H6.304C6.364 4.693 8.18 3.5 10.294 3.5c2.306 0 3.894 1.447 3.894 3.488 0 1.382-.695 2.288-1.805 2.952l-.238.144c-.79.475-1.009.607-1.02 1.777V12zm.17 3.012a1.344 1.344 0 01-1.327 1.328 1.32 1.32 0 01-1.328-1.328 1.318 1.318 0 011.328-1.316c.712 0 1.322.592 1.328 1.316z"
                  fill="#000000"
                />
              </svg>
            }
            iconRound={false}
            thickness="thin"
            onClick={() =>
              window.open(
                "https://docs.cedcommerce.com/shopify/multivendor-marketplace-solution-vendors/?section=dashboard-of-the-vendor-app"
              )
            }
          >
            Need Help
          </Button>
        }
      ></PageHeader>
      <Dashboard_content currency={props.currency} />
    </>
  );
}

export default DI(Dashboard);
