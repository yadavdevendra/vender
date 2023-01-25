/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { DI, DIProps } from "../../../Core";
import {
  PageHeader,
  Card,
  TextStyles,
  FlexLayout,
  Dots,
  Button
} from "@cedcommerce/ounce-ui";

import { StepData } from "./Step";
import { App } from "..";

//interface PropsI extends DIProps {};

function Onboarding(Props: DIProps): JSX.Element {
  const { basic = { stepActive: "1" } } = Props.redux;

  let currentStep = parseInt(basic["stepActive"]) - 1;

  if (currentStep < 0) currentStep = 0;

  const renderCurrentStep = (): React.ReactNode => {
    switch (currentStep) {
      case 0:
        return <App />;
        break;
      case 1:
        return <App />;
        break;
      default:
        return <p>Hello</p>;
    }
  };

  return (
    <div>
      <div
        style={{
          width: "70%",
          height: "57%",
          // paddingTop: "10px",

          position: "absolute",
          top: "0",
          bottom: "0",
          left: "0",
          right: "0",
          margin: "auto"
        }}
      >
        <Card>
          <div className='pl-5 pt-5'>
            <FlexLayout halign='fill'>
              <TextStyles type='SubHeading'>
                STEP <span className='text-muted'>1</span> / 2
              </TextStyles>
              <div className='pr-5 pt-5'>
                <FlexLayout spacing='loose'>
                  <Dots status='active' />
                  <Dots status='none' />
                </FlexLayout>
              </div>
            </FlexLayout>
          </div>
          <div className='pl-5 pt-5'>
            <FlexLayout direction='vertical'>
              <TextStyles type='HeadingMedium'>
                Welcome {Props.redux.basic.name}!
              </TextStyles>
              <TextStyles textcolor='dark' type='simpleText'>
                Please connect your shopify store
              </TextStyles>
            </FlexLayout>
          </div>
          <div
            style={{
              marginTop: "170px"
            }}
            className='pr-5'
          >
            <FlexLayout direction='vertical'>
              <FlexLayout halign='end' spacing='loose'>
                <Button
                  thickness='thin'
                  onClick={() => {
                    window.location.href = "https://www.shopify.com/partners";
                  }}
                >
                  Connect
                </Button>
                {/* <Button type='Outlined' thickness='thin'>
                  Next
                </Button> */}
              </FlexLayout>
              {/* <FlexLayout halign='end' spacing='loose'>
                <TextStyles textcolor='dark' type='simpleText'>
                  By clicking on the Connect you agree our{" "}
                  <span style={{ color: "blue" }}>terms and conditions</span>
                </TextStyles>
              </FlexLayout> */}
            </FlexLayout>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default DI(Onboarding);
