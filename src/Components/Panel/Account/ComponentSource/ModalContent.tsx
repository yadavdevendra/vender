/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { DI, DIProps } from '../../../../Core';
import DisplayCard from './DisplayCard';
import { FlexLayout, Skeleton, Card } from '@cedcommerce/ounce-ui';


interface ModContinterface extends DIProps {
    from: string,
}

interface ObjI {
    [name: string]: string | number
}

function ModalContent(props: ModContinterface): JSX.Element {

    const { di, from } = props;
    const { connector = [] } = props.redux;

    const arr: Array<JSX.Element> = [];
    let len = 0;

    Object.values(connector).forEach((ele, index: number) => {
        if ((ele[from] == 1) && (ele.installed) == 0) {
            const icon: JSX.Element = <img src={di.environment.API_ENDPOINT + ele.image} alt="fff" style={{ width: '60%', height: '50%' }} />;
            arr[len] = (<DisplayCard key={index} icon={icon} title={ele.title} toAddbutton={true} code={ele.code} />);
            len++;
        }
    });

    return (
        <div className="mb-5 mt-5" style={{ marginBottom: "50px" }}>
            { arr.length === 0 ? RenderSkelton() : null}
            <FlexLayout childWidth="fullWidth" spacing="loose" halign="center" wrap="wrap">
                {arr}
            </FlexLayout>
        </div>
    );
}

function RenderSkelton() {
    return (<>
        <Card>
            <Skeleton
                height="50px"
                line={5}
                type="none"
                width="50px"
            />
        </Card>
    </>);
}

export default DI(ModalContent);
