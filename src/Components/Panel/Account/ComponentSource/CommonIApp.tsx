import { Button, Modal, Card, FlexLayout } from "@cedcommerce/ounce-ui";
import React, { useState } from "react";
import { DI, DIProps } from "../../../../Core";
import ModalContent from "./ModalContent";
import DisplayCard from "./DisplayCard";
import AddAccountImage from "../../../../assets/img/iconPlus.png";

interface CommonIAppInterface extends DIProps {
  from: string;
}

function CommonIApp(props: CommonIAppInterface): JSX.Element {
  const { connector = [] } = props.redux;

  const [modalStatus, setModalStatus] = useState(false);

  const handleOnClick: () => void = () => {
    setModalStatus(!modalStatus);
  };

  const arr: Array<JSX.Element> = [];
  let len = 0;
  Object.values(connector).forEach((ele) => {
    if (ele.installed != 0) {
      const icon: JSX.Element = (
        <img
          src={props.di.environment.API_ENDPOINT + ele.image}
          alt="fff"
          style={{ width: "60%", height: "50%" }}
        />
      );
      arr[len] = (
        <DisplayCard icon={icon} title={ele.title} toAddbutton={false} />
      );
      len++;
    }
  });
  const icon: JSX.Element = (
    <img src={AddAccountImage} alt="fff" height="50px" />
  );
  return (
    <>
      <Card>
        <br />
        {arr.length > 0 ? null : <ModalContent from={props.from} />}
        <FlexLayout
          childWidth="fullWidth"
          spacing="loose"
          halign="center"
          wrap="wrap"
        >
          {/* fill and wrap */}
          {arr}
          <Button
            halign="Equal"
            icon={icon}
            length="fullBtn"
            onClick={handleOnClick}
            type="Outlined"
          >
            Add new account
          </Button>
        </FlexLayout>
      </Card>
      <Modal
        open={modalStatus}
        heading="Accounts"
        close={handleOnClick}
        modalSize="small"
        // primaryAction={false}
        // secondaryAction={false}
      >
        <ModalContent from={props.from} />
      </Modal>
    </>
  );
}

export default DI(CommonIApp);
