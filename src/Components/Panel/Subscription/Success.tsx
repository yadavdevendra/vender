/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { DI, DIProps } from './../../../Core';
import success from './../../../assets/img/paymentsucces.jpg';
import { FlexLayout, TextStyles } from '@cedcommerce/ounce-ui';
import * as queryString from "query-string";


function Success(props: DIProps) {
    function PostData() {
        const data: any = {
            status: "active",
            subscription_id: queryString.parse(props.location.search).subscription_id
        };
        props.di.POST('/connector/subscription/UpdateSubscripionStatus', data)
            .then((e) => {
                if (e.success) {
                    // console.log(e);
                }
            });

    }
    useEffect(() => {
        PostData();
    }, []);

    return (
        <div>
            <FlexLayout direction="vertical" spacing='extraLoose' valign='center' halign='center' wrap='wrap'>
                <img src={success} width="500" />
                <TextStyles type='Heading' alignment="center" textcolor='positive'>Payment Success!</TextStyles>
            </FlexLayout>
        </div>
    );
}

export default DI(Success);
