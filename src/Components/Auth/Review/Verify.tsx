import { Card, TextStyles } from '@cedcommerce/ounce-ui';
import React from 'react';
import { DI, DIProps } from './../../../Core';

function Verify(props: DIProps) {
    return (
        <div >
            <Card>
                <TextStyles type='HeadingMedium'>{props.match.params.message}</TextStyles>
            </Card>
        </div>
    );
}
export default DI(Verify);
