/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import TextEditor from "./TextEditor";
import { DI, DIProps } from "./../../../Core";
import { Button, Card, FlexLayout, PageHeader } from "@cedcommerce/ounce-ui";

function ComposeMessage(props: DIProps) {
  const [text, settext] = useState<any>("");

  function recieveFromText(text: JSX.Element) {
    settext(text);
  }
  function sendData() {
    props.di.POST("");
  }
  return (
    <div>
      <PageHeader title="Compose" />
      <Card cardType="linkwater">
        <FlexLayout direction="vertical" spacing="loose" wrap="noWrap">
          <TextEditor textToChat={recieveFromText} msgSend={true} />
          <Button
            type="Primary"
            thickness="thin"
            onClick={() => {
              sendData();
            }}
          >
            Send
          </Button>
        </FlexLayout>
      </Card>
    </div>
  );
}

export default DI(ComposeMessage);
