/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Badge,
  Button,
  Card,
  FlexLayout,
  Modal,
  TextField,
  TextStyles,
  Toast,
} from "@cedcommerce/ounce-ui";
import React, { useEffect, useState, Component } from "react";
import { DI, DIProps } from "../../../Core";
import * as queryString from "query-string";

function Review(props: DIProps) {
  const [PostLoading, setPostLoading] = useState(false);
  const [present, setpresent] = useState(0);
  const [activeColor, setactiveColor] = useState("red");
  const [status, setstatus] = useState(false);
  const [title, setTitle] = useState("");
  const [ModalOpen, setModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  // const [OrderID, setOrderID] = useState("");
  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorToast, setErrorToast] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState("");
  const [PostReview, setPostReview] = useState(false);
  const [userID, setuserID] = useState("");
  const [ToastPost, setToastPost] = useState(false);
  const [postmessage, setpostmessage] = useState("");
  const [length, setLength] = useState(0);
  const [HideHelp, setHideHelp] = useState(false);
  const [HideTitle, setHideTitle] = useState(false);
  const [LengthTitle, setLengthTitle] = useState(0);
  function handleStar(present: number) {
    setstatus(true);
    setpresent(present);
  }

  function verifyData() {
    setLoading(true);
    props.di
      .GET(
        `connector/review/verifyToPostReview?email=${email}&order_id=${
          queryString.parse(props.location.search).order_id
        }&user_id=${queryString.parse(props.location.search).user_id}`
      )
      .then((e) => {
        if (e.success) {
          setToast(true);
          // setOrderID(e.order_id);
          setMessage(e.msg);
          setPostReview(true);
          setTimeout(() => setModalOpen(false), 3000);
          setuserID(e.data);
        } else {
          setPostReview(false);
          setErrorToast(true);
          setErrorMessage(e.msg);
          setTimeout(() => setModalOpen(false), 3000);
        }
        setLoading(false);
      });
  }
  function sendPost() {
    setPostLoading(true);
    const data: any = {
      data: {
        user_id: userID,
        customer_email: email,
        order_id: queryString.parse(props.location.search).order_id,
        stars: present,
        review_description: description,
        review_title: title,
        status: "pending",
      },
      marketplace: "shopify",
    };
    props.di.POST("connector/review/addSellersReview", data).then((e) => {
      if (e.success) {
        setpostmessage(e.data);
        const tempMesaage = e.data;
        setToastPost(true);
        setTimeout(() => {
          props.history.push("/auth/verify/" + tempMesaage);
        }, 3000);
      }
      setPostLoading(false);
    });
  }
  function updateText(param: string) {
    setDescription(param);
    const temp = description.length;
    if (temp <= 10) {
      setHideHelp(true);
      setLength(temp);
    } else {
      setHideHelp(false);
    }
  }
  function updateTitle(param: string) {
    setTitle(param);
    const temp = title.length;
    if (temp <= 3) {
      setHideTitle(true);
      setLengthTitle(temp);
    } else {
      setHideTitle(false);
    }
  }
  return (
    <div style={{ width: "500px", marginLeft: "450px", marginTop: "90px" }}>
      <FlexLayout direction="vertical" spacing="loose">
        <Card>
          <FlexLayout direction="vertical" spacing="extraLoose">
            <TextStyles type="HeadingMedium">
              Rate your recent experience
            </TextStyles>
            <StarRating
              present={present}
              onClick={handleStar}
              size={40}
              activeColor={activeColor}
            />
            {status && (
              <FlexLayout direction="vertical" spacing="loose">
                <TextStyles type="HeadingMedium">
                  Tell us about your experience
                </TextStyles>
                <TextArea
                  thickness="thin"
                  showHelp={
                    10 - length != 0 && HideHelp
                      ? `Type ${10 - length} more characters`
                      : ""
                  }
                  placeHolder="This is where you write your review. Explain what happened, and leave out offensive words. Keep your feedback honest, helpful and constructive."
                  type="textarea"
                  onChange={(e) => updateText(e)}
                  value={description}
                />
                <TextStyles type="HeadingMedium">
                  Give your review a title
                </TextStyles>
                <div style={{ marginLeft: "20px", marginRight: "20px" }}>
                  <TextField
                    placeHolder="Write the title for your review here."
                    thickness="thin"
                    onChange={(e) => updateTitle(e)}
                    showHelp={
                      3 - LengthTitle != 0 && HideTitle
                        ? `Type ${3 - LengthTitle} more characters`
                        : ""
                    }
                    value={title}
                  />
                </div>
              </FlexLayout>
            )}
          </FlexLayout>
        </Card>
        {title != "" && description != "" && (
          <Card>
            <FlexLayout halign="center">
              {PostReview ? (
                <Button
                  loading={PostLoading}
                  thickness="thin"
                  type="Plain"
                  onClick={sendPost}
                >
                  Post Review
                </Button>
              ) : (
                <Button type="Plain" onClick={() => setModalOpen(true)}>
                  Verify to post your review
                </Button>
              )}
            </FlexLayout>
          </Card>
        )}
      </FlexLayout>
      <Modal
        modalSize="small"
        heading="Verify to post your review"
        open={ModalOpen}
        close={() => setModalOpen(!ModalOpen)}
      >
        <div style={{ width: "600px", marginLeft: "200px" }}>
          <Card>
            <FlexLayout direction="vertical" spacing="loose">
              <TextField
                name="Email"
                thickness="thin"
                value={email}
                onChange={(e) => setEmail(e)}
              />
              <FlexLayout childWidth="fullWidth" halign="center">
                <Button
                  length="fullBtn"
                  loading={loading}
                  type="Primary"
                  thickness="thin"
                  onClick={verifyData}
                >
                  Submit
                </Button>
              </FlexLayout>
            </FlexLayout>
          </Card>
          <ToastWrapper>
            {toast && (
              <Toast
                type="success"
                timeout={3000}
                message={message}
                onDismiss={() => setToast(!toast)}
              />
            )}
            {errorToast && (
              <Toast
                type="error"
                timeout={3000}
                message={ErrorMessage}
                onDismiss={() => setErrorToast(!errorToast)}
              />
            )}
            {ToastPost && (
              <Toast
                message={postmessage}
                timeout={3000}
                onDismiss={() => setToastPost(!ToastPost)}
              />
            )}
          </ToastWrapper>
        </div>
      </Modal>
    </div>
  );
}
interface StarRatingI {
  activeColor?: string;
  defaultColor?: string;
  maximum?: number;
  present?: number;
  onClick?: (present: number) => void;
  size?: number;
  spacing?: "none" | "loose" | "extraLoose";
}
const StarRating = ({
  defaultColor = "gray",
  maximum = 5,
  present = 1,
  onClick = () => {
    return null;
  },
  size = 25,
  spacing = "loose",
}: StarRatingI): JSX.Element => {
  const [hover, sethover] = useState(present);
  useEffect(() => {
    sethover(present);
  }, [present]);

  const temp: any = [];
  const [active, setactiveColor] = useState("red");
  useEffect(() => {
    switch (hover) {
      case 1:
        setactiveColor("orangered");
        break;
      case 2:
        setactiveColor("darkorange");
        break;
      case 3:
        setactiveColor("gold");
        break;
      case 4:
        setactiveColor("lawngreen");
        break;
      case 5:
        setactiveColor("darkcyan");
        break;
      default:
        setactiveColor("black");
    }
  }, [hover]);
  for (let index = 1; index <= maximum; index++) {
    temp.push(
      <label
        key={index}
        onMouseEnter={() => sethover(index)}
        onMouseLeave={() => sethover(present)}
        onClick={() => onClick(index)}
      >
        <div
          style={{
            backgroundColor:
              index <= (hover || present)
                ? active || "#FFD700"
                : defaultColor || "lightgray",
            height: (size + 5).toString() + "px",
          }}
        >
          <svg id="svg2" height={size} viewBox="0 0 750 750" version="1.1">
            <g
              id="layer1"
              transform="translate(0 -302.36)"
              stroke="green"
              strokeWidth="1px"
              display="none"
              fill="white"
            >
              <path id="path3961" d="m375 705.67v-296.54" />
              <path id="path3963" d="m375 705.67 282.1-91.66" />
              <path id="path3965" d="m375 705.67 174.31 239.92" />
              <path id="path3967" d="m375 705.67-174.31 239.92" />
              <path id="path3969" d="m375 705.67-282.1-91.66" />
            </g>
            <g id="layer2" display="none">
              <path
                id="path3971"
                d="m92.899 614.01 564.2 0.00001l-456.41 331.58 174.31-536.46 174.31 536.46z"
                transform="translate(0 -302.36)"
                stroke="green"
                strokeWidth="1px"
                fill="white"
              />
            </g>
            <g id="g3016">
              <path
                id="path3018"
                stroke="green"
                strokeWidth="1px"
                fill="white"
                d="m375 106.78-66.562 204.88h-215.53l174.38 126.66-66.6 204.9 174.31-126.63 174.31 126.62-66.594-204.91 174.38-126.66h-215.53l-66.57-204.86z"
              />
            </g>
          </svg>
        </div>
      </label>
    );
  }
  return (
    <React.Fragment>
      <FlexLayout spacing={spacing} halign="start" wrap="wrap">
        {temp.map((e: any) => e)}
      </FlexLayout>
    </React.Fragment>
  );
};
const TextArea = ({
  onChange = () => {
    return "";
  },
  name = "",
  rows = 3,
  error = false,
  ...props
}: TextfieldI): JSX.Element => {
  function getThickness(thickness: "thin" | "" | undefined) {
    switch (thickness) {
      case "thin":
        return "inte--Textfield__thin";
      default:
        return "";
    }
  }
  const tempArr: any = [];
  const [arr, setArr] = useState(tempArr);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleKeyPress = (event: any) => {
    if (event.key === "Enter" && props.onEnter) {
      const temp = arr;
      temp.push(props.value);
      setArr(temp);
      props.value = "";
      props.onEnter();
    }
  };
  const height = rows * 20 + "px";
  const eleThickness = getThickness(props.thickness);
  const errorCss = error ? "inte-formElement--Error" : "";
  return (
    <div>
      <Card>
        {name ? <TextStyles type="SubHeading">{name}</TextStyles> : null}
        <div
          className={`${errorCss} inte-formElement inte-formElementTextfield ${eleThickness}`}
        >
          {props.type == "badge" ? (
            <>
              <FlexLayout spacing="loose" wrap="wrap">
                {arr.map((e: any, i: number) => (
                  <Badge key={i}>{e}</Badge>
                ))}
              </FlexLayout>
              <input
                id={props.id}
                type={props.type}
                style={{
                  opacity: props.readOnly ? "0.6" : "1",
                  border: "none",
                  height: height,
                  width: "100%",
                  outline: "none",
                }}
                value={props.value}
                readOnly={props.readOnly}
                onChange={(e) => {
                  onChange(e.target.value);
                }}
                onKeyPress={handleKeyPress}
                placeholder={props.placeHolder}
              ></input>
            </>
          ) : (
            <textarea
              id={props.id}
              style={{
                opacity: props.readOnly ? "0.6" : "1",
                border: "none",
                // height: height,
                width: "100%",
                outline: "none",
                resize: "vertical",
              }}
              rows={rows}
              value={props.value}
              readOnly={props.readOnly}
              onChange={(e) => {
                onChange(e.target.value);
              }}
              placeholder={props.placeHolder}
            ></textarea>
          )}
        </div>
        {props.showHelp ? (
          <span className={"inte-form__itemHelp"}>{props.showHelp}</span>
        ) : (
          ""
        )}
      </Card>
    </div>
  );
};

TextArea.defaultProps = {
  type: "textarea",
  placeHolder: "Type..",
  value: "",
  thickness: "",
  onFocus: false,
};

export interface TextfieldI {
  onChange?: (e: string) => void;
  value?: string | number;
  name?: string;
  type?: "textarea" | "badge";
  placeHolder?: string;
  showHelp?: string;
  onEnter?: () => void;
  thickness?: "thin" | "";
  onFocus?: boolean;
  readOnly?: boolean;
  id?: string;
  error?: boolean;
  rows?: number;
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

export default DI(Review);
