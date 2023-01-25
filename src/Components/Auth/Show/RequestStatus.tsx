import React from 'react';
import * as queryString from "query-string";
import { Button, Card, FlexLayout, TextStyles } from '@cedcommerce/ounce-ui';
import { DIProps, DI } from '../../../Core';



function RequestStatus(props: DIProps) {
    // const t = queryString.parse(props.location.search).token;

    const message1 = queryString.parse(props.location.search).message;
    return (
        <div>
            <FlexLayout halign='center' wrap='wrap'>
                <Card cardType='linkwater'>
                    <TextStyles type="SubHeading">{message1}
                    </TextStyles>
                    <div style={{ marginTop: "50px" }}>
                        <Button type='Primary' thickness='thin' onClick={() => props.history.push('/home')}>Home</Button>
                    </div>
                </Card>

            </FlexLayout>
        </div>
    );

}
export default DI(RequestStatus);
