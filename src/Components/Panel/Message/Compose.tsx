/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  Card,
  FlexLayout,
  PageHeader,
  TextField,
  TextStyles,
  Toast,
} from "@cedcommerce/ounce-ui";
import React, { Component, FC, useEffect, useState, useRef } from "react";
import { DI, DIProps } from "./../../../Core";
import Chat from "./Chat";
// import TextEditor from './TextEditor';

function Compose(props: DIProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState(false);
  const [ErrorToast, setErrorToast] = useState(false);
  const [visible, setVisible] = useState(true);

  const [receiverID, setReceiverID] = useState("");
  const [Chatid, setChatid] = useState("");
  const [callMethod, setCallMethod] = useState(true);

  function recieveVisble(visible: any) {
    setVisible(visible);
  }

  return (
    <>
      <PageHeader
        title={visible ? "Compose" : "Chat"}
        action={
          <Button
            type="Plain"
            onClick={() => {
              props.history.push("/message");
            }}
          >
            Back
          </Button>
        }
      />
      <ToastWrapper>
        {ErrorToast && (
          <Toast
            type="error"
            message="UserID and subject required"
            timeout={3000}
            onDismiss={() => {
              setErrorToast(!ErrorToast);
            }}
          />
        )}
        {toast && (
          <Toast
            type="success"
            message={message}
            timeout={3000}
            onDismiss={() => {
              setToast(!toast);
            }}
          />
        )}
      </ToastWrapper>
      <Card>
        <FlexLayout direction="vertical" spacing="loose" wrap="noWrap">
          {visible ? (
            <Card cardType="plain">
              <FlexLayout direction="vertical" spacing="loose">
                <TextField
                  placeHolder="Subject"
                  name="Subject"
                  onEnter={()=>setCallMethod(true)}
                  onChange={(e) => {
                    setSubject(e);
                  }}
                  thickness="thin"
                  type="text"
                  value={subject}
                />
              </FlexLayout>
            </Card>
          ) : (
            <></>
          )}

          <Chat
            chatID={Chatid}
            subject={subject}
            receiverID={receiverID}
            recieveVisble={recieveVisble}
            callMethod={callMethod}
          />
        </FlexLayout>
      </Card>
    </>
  );
}

export interface AutoCompleteI {
  options?: any;
  value?: string;
  name?: string;
  onEnter?: (e: string) => void;
  onChange?: (e: string) => void;
  thickness?: "thin" | "";
  setUser?: (e: string) => void;
}

const AutoComplete: FC<AutoCompleteI> = ({
  options = [
    { value: "option1", label: "option1" },
    { value: "option1", label: "option2" },
    { value: "option1", label: "option3" },
    { value: "Abc", label: "Abc" },
    { value: "Apple", label: "Apple" },
    { value: "Computer", label: "Computer" },
  ],
  name = "",
  value = "",
  onEnter = () => {
    return null;
  },
  onChange = () => {
    return null;
  },
  setUser = () => {
    return null;
  },
  thickness = "",
}: AutoCompleteI) => {
  const [showList, setshowList] = useState(true);
  return (
    <React.Fragment>
      {name ? <TextStyles type="SubHeading">{name}</TextStyles> : null}
      <div className="inte__AutoComplete">
        <span
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              setshowList(false);
              onEnter(value);
            }
          }}
        >
          <TextField
            placeHolder="Username"
            showHelp="Enter Username/UserID/Email"
            thickness={thickness}
            value={value}
            onChange={(e) => {
              setshowList(true);
              onChange(e);
            }}
          />
          <ul>
            {showList &&
              value.length > 0 &&
              options.length > 0 &&
              options
                .filter(
                  (e: any) =>
                    Object.keys(e).length > 0 &&
                    e.value.toLowerCase().includes(value.toLowerCase())
                )
                .map((e: any, i: number) => (
                  <li
                    key={i}
                    onClick={() => {
                      setshowList(false);
                      onEnter(e.display);
                      setUser(e.user_id);
                    }}
                  >
                    <TextStyles>{e.label}</TextStyles>
                  </li>
                ))}
          </ul>
        </span>
      </div>
    </React.Fragment>
  );
};
interface ToastWrapperI {
  children: React.ReactNode;
}
class ToastWrapper extends Component<ToastWrapperI> {
  constructor(props: ToastWrapperI) {
    super(props);

    this.state = {};
  }

  render() {
    return <div className={"inte-toast--Wrapper"}>{this.props.children}</div>;
  }
}
export default DI(Compose);
