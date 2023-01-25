/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Card,
  FlexLayout,
  PageHeader,
  TextStyles,
  Toast,
} from "@cedcommerce/ounce-ui";
import React, { useEffect, useState, Component, useRef } from "react";
import TextEditor from "./TextEditor";
import { DI, DIProps } from "./../../../Core";

function Chat(props: any): JSX.Element {
  const inputFile: any = useRef(null);

  const endpoint = props.di.environment.API_ENDPOINT.replace("/public/", "/");
  const [userID, setUserID] = useState("");
  const [SenderId, setSenderId] = useState("");
  const [toastPdf, setToastPdf] = useState(false);
  const [subject, SetSubject] = useState("");
  const [messagePdf, setMessagePdf] = useState("");
  const [toastImg, setToastImg] = useState(false);
  const [messageImg, setMessageImg] = useState("");
  const [Data, setDataVendor] = useState<any>([{}]);
  const [text, settext] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState("");
  const [msgSend, setMsgSend] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>([]);
  const [selectedFileImg, setSelectedFileImg] = useState<any>([]);
  const [receiverID, setReceiverID] = useState("");
  const [Chatid, setChatid] = useState("");
  const [visible, setVisible] = useState(
    (props.location.state && props.location.state.visibilty) || false
  );
  function getDataVendor() {
    if (props.chatID != undefined && props.chatID != "") {
      props.di
        .GET(`/connector/messaging/receiveMessage?chat_id=${Chatid}`)
        .then((e: any) => {
          if (e.success) {
            const temp = e.data.rows.reverse();
            setDataVendor(temp);
            setMsgSend(false);
            SetSubject(e.data.chat_subject);
            Object.keys(e.data.rows).map((j) => {
              setSenderId(e.data.rows[j].sender_id);
            });
          }
        });
    } else {
      if (Chatid !== "" || props.match.params.chatid) {
        props.di
          .GET(
            `/connector/messaging/receiveMessage?chat_id=${
              props.match.params.chatid || Chatid
            }`
          )
          .then((e: any) => {
            if (e.success) {
              const temp = e.data.rows.reverse();
              setDataVendor(temp);
              setMsgSend(false);
              SetSubject(e.data.chat_subject);
              Object.keys(e.data.rows).map((j) => {
                setSenderId(e.data.rows[j].sender_id);
              });
            }
          });
      }
    }
  }

  useEffect(() => {
    getDataVendor();
  }, []);

  function recieveFromText(text: JSX.Element) {
    settext(text);
  }
  const ChangeHandler = (event: any) => {
    if (event.target.files) {
      const files = event.target.files;
      Object.keys(files).map((e) => {
        setSelectedFile((prev: any) => [...prev, files[e]]);
      });
    }
  };
  const ChangeHandlerImg = (event: any) => {
    if (event.target.files[0]) {
      const files = event.target.files[0];
      setSelectedFileImg((prev: any) => [...prev, files]);
    }
  };
  function sendFile() {
    Object.values(selectedFile).map((file: any) => {
      const formData: any = new FormData();
      formData.append(
        "message_type",
        file.type.includes("image") ? "image" : "pdf"
      );
      formData.append(
        "chat_id",
        !(props.location.state && props.location.state.visibilty)
          ? Chatid
          : props.match.params.chatid
      );
      formData.append("receiver", receiverID);
      formData.append("message_file", file);
      props.di
        .POST("/connector/messaging/sendMessage", formData, false, true)
        .then((e: any) => {
          if (e.success) {
            // setToastPdf(true);
            // setMessagePdf(e.data);
            getDataVendor();
            setSelectedFile([]);
          }
        });
    });
  }
  function getUserID() {
    props.di.GET("frontend/app/getUserDetails").then((e: any) => {
      if (e.success) {
        setUserID(e.data.admin_home_id);
      }
    });
  }
  useEffect(() => {
    getUserID();
    // scrollToBottom();

    props.di.GET("connector/get/getMyAdminId").then((e: any) => {
      if (e.success) {
        setReceiverID(e.data.admin_id);
      }
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    });
  }, [Data]);

  const scrollToBottom = () => {
    const objDiv: any = document.getElementById("msgDiv");

    if (objDiv) {
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  };

  function sendMessage() {
    const objSend = {
      chat_id: !(props.location.state && props.location.state.visibilty)
        ? Chatid
        : props.match.params.chatid,
      receiver: receiverID,

      message_type: "text",
      message: text,
    };

    setLoading(true);
    props.di
      .POST("/connector/messaging/sendMessage", objSend)
      .then((e: any) => {
        if (e.success) {
          // setToast(true);
          // setMessage(e.data);
          getDataVendor();
          setMsgSend(true);
          setSelectedFile([]);

          settext("");
        }
        setLoading(false);
      });
  }

  useEffect(() => {
    if (Chatid !== "" && receiverID !== "" && text !== "") {
      sendMessage();
      sendFile();
    }
  }, [Chatid, receiverID]);
  function createChat() {
    setLoading(true);
    props.di.GET("connector/get/getMyAdminId").then((e: any) => {
      if (e.success) {
        setReceiverID(e.data.admin_id);
        const data = {
          subject: props.subject,
          receiver: e.data.admin_id,
        };
        props.di
          .GET(
            `/connector/messaging/getAllUsersList?search_data=${e.data.admin_id}`
          )
          .then((ele: any) => {
            if (ele.success) {
              const data = {
                subject: props.subject,
                receiver: e.data.admin_id,
              };
              props.di
                .POST(`/connector/messaging/initiateMessage`, data)
                .then((e: any) => {
                  if (e.success) {
                    setChatid(e.data.chat_id);
                    setToast(true);
                    setMessage(e.message);

                    props.recieveVisble(visible);
                  }
                });
            }
          });
      }
      setLoading(false);
    });
  }

  useEffect(() => {
    readMessage();
  }, [Data]);

  function readMessage() {
    const unreadMsg: any = [];

    Data.map((msg: any, index: number) => {
      if (msg.status === "unread") {
        unreadMsg.push({ chat_id: msg.chat_id, message_id: msg.message_id });
      }
    });

    if (unreadMsg.length > 0) {
      props.di
        .POST(`connector/messaging/ChangeMessageStatus`, {
          status: "read",
          data: unreadMsg,
        })
        .then((e: any) => {
          // console.clear();
        });
    }
  }
  console.log("props.callMethod:",props.callMethod);
  

  return (
    <>
 {!props.callMethod&&(<PageHeader
        title="Chat"
        action={
          <Button
            onClick={() => {
              props.history.push("/message");
            }}
            type="Plain"
          >
            Back
          </Button>
        }
      />)}

      <ToastWrapper>
        {toast && (
          <Toast
            type="success"
            message={message}
            timeout={3000}
            onDismiss={() => setToast(!toast)}
          />
        )}
        {toastImg && (
          <Toast
            type="success"
            message={messageImg}
            timeout={3000}
            onDismiss={() => setToastImg(!toastImg)}
          />
        )}
        {toastPdf && (
          <Toast
            type="success"
            message={messagePdf}
            timeout={3000}
            onDismiss={() => setToastPdf(!toastPdf)}
          />
        )}
      </ToastWrapper>

      {props.location.state && props.location.state.fromCompose && visible && (
        <Card title={`Subject: ${subject.toUpperCase()}`}>
          <div
            id="msgDiv"
            style={{
              height: "400px",
              overflowY: "auto",
              backgroundColor: "rgb(249,246,240)",
            }}
          >
            {Object.keys(Data).map((r: any) => {
              const time = new Date(Data[r].vendor_time)
                .toString()
                .split("GMT")[0];
              switch (Data[r].message_type) {
                case "text":
                  if (userID === Data[r].sender_id) {
                    return (
                      <RenderTextAdmin
                        message={Data[r].message}
                        date_time={time}
                      />
                    );
                  } else {
                    return (
                      <RenderText message={Data[r].message} date_time={time} />
                    );
                  }
                case "pdf":
                  if (userID !== Data[r].sender_id) {
                    return (
                      <RenderPdfVendor
                        endpoint={endpoint}
                        message={Data[r].message}
                        date_time={time}
                      />
                    );
                  } else {
                    return (
                      <RenderPdfAdmin
                        endpoint={endpoint}
                        message={Data[r].message}
                        date_time={time}
                      />
                    );
                  }

                case "doc":
                  if (userID !== Data[r].sender_id) {
                    return (
                      <RenderPdfVendor
                        endpoint={endpoint}
                        message={Data[r].message}
                        date_time={time}
                      />
                    );
                  } else {
                    return (
                      <RenderPdfAdmin
                        endpoint={endpoint}
                        message={Data[r].message}
                        date_time={time}
                      />
                    );
                  }

                case "image":
                  if (userID === Data[r].sender_id) {
                    return (
                      <RenderImage
                        endpoint={endpoint}
                        message={Data[r].message}
                        date_time={time}
                      />
                    );
                  } else {
                    return (
                      <RenderImageAdmin
                        endpoint={endpoint}
                        message={Data[r].message}
                        date_time={time}
                      />
                    );
                  }
              }
            })}
          </div>
        </Card>
      )}

      <Card cardType="plain">
        <FlexLayout direction="vertical" spacing="loose" wrap="noWrap">
          <TextEditor textToChat={recieveFromText} msgSend={msgSend} />
          <FlexLayout halign="fill">
            <FlexLayout spacing="loose" direction="vertical">
              <div
                className="image_upload"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    inputFile.current.click();
                  }
                }}
              >
                <label
                  htmlFor="file-input"
                  ref={inputFile}
                  className="inte-btn inte-btnExtraNarrow inte-btn--Outlined inte-btn--hasIcon"
                >
                  <span className="inte-btn__icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      height="20"
                      width="20"
                    >
                      <path
                        d="M5.243 20a5.228 5.228 0 01-3.707-1.533A5.213 5.213 0 010 14.759c0-1.402.546-2.719 1.536-3.708l9.515-9.519a5.25 5.25 0 018.553 1.7A5.21 5.21 0 0120 5.24a5.208 5.208 0 01-1.535 3.708l-4.258 4.26a3.124 3.124 0 01-5.092-1.012A3.098 3.098 0 018.879 11c0-.835.324-1.619.914-2.208l4.5-4.501a1 1 0 111.414 1.414l-4.5 4.501a1.112 1.112 0 00-.328.794A1.114 1.114 0 0012 12.12c.297 0 .582-.118.793-.327l4.258-4.26A3.223 3.223 0 0018 5.24c0-.866-.337-1.681-.949-2.293a3.248 3.248 0 00-4.586 0L2.95 12.465A3.224 3.224 0 002 14.76c0 .866.338 1.68.95 2.293a3.248 3.248 0 004.586 0l1.757-1.758a1 1 0 111.414 1.414L8.95 18.467A5.236 5.236 0 015.243 20z"
                        fill="#5C5F62"
                      />
                    </svg>
                  </span>
                  <span className="inte__text">Upload File</span>
                </label>
                <input
                  className="img_inpt"
                  multiple
                  id="file-input"
                  type="file"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/pdf , .pdf , image/*"
                  onChange={ChangeHandler}
                />
              </div>
              <FlexLayout halign="start" spacing="loose">
                {selectedFile.length >= 0 &&
                  selectedFile.map((e: Blob, i: number) => {
                    return (
                      <div key={i} className="fileimage">
                        <span className="DelBtn Btn-overImage " tabIndex={1}>
                          <Button
                            iconRound={true}
                            thickness="thin"
                            type="Plain"
                            onClick={() => {
                              const c = selectedFile.filter(
                                (e: string, k: number) => k != i
                              );
                              setSelectedFile(c);
                            }}
                          >
                            {
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                width="18"
                              >
                                <path
                                  d="M11.414 10l6.293-6.293a1 1 0 10-1.414-1.414L10 8.586 3.707 2.293a1 1 0 00-1.414 1.414L8.586 10l-6.293 6.293a1 1 0 101.414 1.414L10 11.414l6.293 6.293A.998.998 0 0018 17a.999.999 0 00-.293-.707L11.414 10z"
                                  fill="#000000"
                                />
                              </svg>
                            }
                          </Button>
                        </span>

                        {e.type.includes("image") ? (
                          <img
                            src={URL.createObjectURL(e)}
                            width="50px"
                            height="50px"
                          />
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="50"
                            height="50"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#707070"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-file-text"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                          </svg>
                        )}
                      </div>
                    );
                  })}
              </FlexLayout>
            </FlexLayout>
          </FlexLayout>
        </FlexLayout>
      </Card>
      <FlexLayout spacing="loose" halign="fill">
        <></>
        <div
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              if (
                props.location.state &&
                props.location.state.fromCompose &&
                !visible
              ) {
                setVisible(true);
                createChat();
              } else {
                if (text !== "") {
                  sendMessage();
                }
                sendFile();
              }
            }
          }}
        >
          <FlexLayout valign="center" spacing="tight">
            <Button
              loading={loading}
              disable={text !== "" && props.subject !== "" ? false : true}
              type="Primary"
              thickness="thin"
              onClick={() => {
                if (props.location.state.fromCompose && !visible) {
                  setVisible(true);
                  createChat();
                } else {
                  if (text !== "") {
                    sendMessage();
                  }
                  sendFile();
                }
              }}
            >
              Send
            </Button>
          </FlexLayout>
        </div>
      </FlexLayout>
    </>
  );
}
interface text {
  message: string;
  date_time: string;
}

function RenderText({ message, date_time }: text): any {
  return (
    <>
      <FlexLayout halign="end">
        <div
          className="mt-30 mr-20"
          style={{
            borderTopRightRadius: "30px",
            borderBottomLeftRadius: "30px",
            borderTopLeftRadius: "30px",
            backgroundColor: "rgb(249,246,240)",
          }}
        >
          <Card cardType="linkwater">
            <FlexLayout direction="vertical" spacing="loose">
              <div dangerouslySetInnerHTML={{ __html: message }}></div>
              <TextStyles type="mediumText"></TextStyles>
              <TextStyles type="smallText" textcolor="light">
                {date_time}
              </TextStyles>
            </FlexLayout>
          </Card>
        </div>
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
    return <div className={"inte-toast--Wrapper"}>{this.props.children}</div>;
  }
}
function RenderTextAdmin({ message, date_time }: any) {
  return (
    <>
      <FlexLayout halign="start">
        <div className="mt-30 mb-20 ml-20">
          <Card cardType="linkwater">
            <FlexLayout direction="vertical" spacing="loose">
              <div dangerouslySetInnerHTML={{ __html: message }}></div>
              <TextStyles type="neutralText"></TextStyles>
              <TextStyles type="smallText" textcolor="light">
                {date_time}
              </TextStyles>
            </FlexLayout>
          </Card>
        </div>
      </FlexLayout>
    </>
  );
}

function RenderPdfAdmin({ message, date_time, endpoint }: any) {
  function openLink() {
    window.open(endpoint + message);
  }
  return (
    <>
      <div className="mt-30 mb-20 ml-20">
        <FlexLayout halign="start">
          <Card cardType="linkwater">
            <FlexLayout direction="vertical" spacing="loose">
              <Button type="Plain" thickness="thin" onClick={openLink}>
                Download DOC
              </Button>
              <TextStyles type="smallText" textcolor="light">
                {date_time}
              </TextStyles>
            </FlexLayout>
          </Card>
        </FlexLayout>
      </div>
    </>
  );
}

function RenderPdfVendor({ message, date_time, endpoint }: any) {
  function openLink() {
    window.open(endpoint + message);
  }
  return (
    <>
      <div className="mt-30 mb-20 ml-20">
        <FlexLayout halign="end">
          <Card cardType="linkwater">
            <FlexLayout direction="vertical" spacing="loose">
              <Button type="Plain" thickness="thin" onClick={openLink}>
                Download DOC
              </Button>
              <TextStyles type="smallText" textcolor="light">
                {date_time}
              </TextStyles>
            </FlexLayout>
          </Card>
        </FlexLayout>
      </div>
    </>
  );
}

function RenderImageAdmin({ message, date_time, endpoint }: any) {
  return (
    <>
      <div className="mt-30 mb-20 ml-20">
        <FlexLayout halign="end">
          <Card cardType="linkwater">
            <FlexLayout direction="vertical" spacing="loose">
              <img src={endpoint + message} width="300px" />
              <TextStyles type="smallText" textcolor="light">
                {date_time}
              </TextStyles>
            </FlexLayout>
          </Card>
        </FlexLayout>
      </div>
    </>
  );
}
function RenderImage({ message, date_time, endpoint }: any) {
  return (
    <>
      <div className="mt-30 mb-20 ml-20">
        <FlexLayout halign="start">
          <Card cardType="linkwater">
            <FlexLayout direction="vertical" spacing="loose">
              <img src={endpoint + message} width="300px" />
              <TextStyles type="smallText" textcolor="light">
                {date_time}
              </TextStyles>
            </FlexLayout>
          </Card>
        </FlexLayout>
      </div>
    </>
  );
}

export default DI(Chat);
