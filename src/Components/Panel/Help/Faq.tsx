import React, { useEffect, useState } from "react";
import { DI, DIProps } from "../../../Core";
import {
  PageHeader,
  Card,
  Accordion,
  Skeleton,
  FlexLayout,
} from "@cedcommerce/ounce-ui";
// import Null from "./../Image/null.png";
import EmptyDataFound from "../../../Core/EmptyStates/EmptyDataFound";

function Faq(props: DIProps): JSX.Element {
  const [activeQues, setActiveQues] = useState<Array<boolean>>([]);
  const [faqData, setFaqData] = useState([]);
  const [skeltonView, setSkeltonView] = useState(true);
  useEffect(() => {
    getAdminId();
  }, []);

  const getAdminId = () => {
    props.di
      .GET(
        `/connector/vendor/getAdminId?admin_shop_id=${sessionStorage.getItem(
          "admin_shop_id"
        )}`
      )
      .then((e: any) => {
        if (e.success) {
          getFaqs(e.admin_id);
        }
      });
  };
  const getFaqs = (adminId: string) => {
    setSkeltonView(false);
    props.di
      .GET(`connector/vendor/getfaqs?admin_id=${adminId}`)
      .then((result) => {
        if (result.success) {
          const faqBools: Array<boolean> = Array(result.data.length).fill(
            false
          );
          setActiveQues(faqBools);
          setFaqData(result.data);
        }
      });
  };
  return (
    <React.Fragment>
      <PageHeader title="FAQs" />
      <Card>
        <FlexLayout direction="vertical" spacing="loose">
          {skeltonView ? (
            <Skeleton height={"25px"} line={10} type="line" width="100%" />
          ) : faqData.length === 0 ? (
            <Card>
              <EmptyDataFound />
            </Card>
          ) : (
            faqData.map((QA: Record<string, string>, index: number) => {
              return (
                <div key={index}>
                  <FlexLayout direction="vertical" spacing="loose">
                    <Accordion
                      key={index}
                      active={activeQues[index]}
                      onClick={() => {
                        const quesBools: Array<boolean> = activeQues.slice(0);
                        quesBools[index] = !activeQues[index];
                        setActiveQues(quesBools);
                      }}
                      title={QA.ques}
                      useDefaultUI
                    >
                      <Card>
                        <div dangerouslySetInnerHTML={{ __html: QA.ans }}></div>
                      </Card>
                    </Accordion>
                  </FlexLayout>
                </div>
              );
            })
          )}
        </FlexLayout>
      </Card>
    </React.Fragment>
  );
}

export default DI(Faq);
