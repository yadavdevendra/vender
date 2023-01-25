/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { DI, DIProps } from './../../../Core';
import { TextStyles } from '@cedcommerce/ounce-ui';
import * as queryString from "query-string";


function Fail(props: DIProps) {
    function PostData() {
        const data: any = {
            status: "fail",
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
            <section className="loginSignup__Wrapper">
                <TextStyles type='Heading' alignment="center" textcolor='negative'>Payment Failed!</TextStyles>

            </section>
        </div>
    );
}

export default DI(Fail);
