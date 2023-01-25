import { Card, TextStyles } from '@cedcommerce/ounce-ui';
import React from 'react';
import { DI } from './../../../Core';

function Verify() {
    return (
        <div style={{ width: "600px", marginLeft: "300px" }} >
            <Card>
                <TextStyles type='Heading'>Thank you! Your review has been added successfully.</TextStyles>
            </Card>
        </div>
    );
}
export default DI(Verify);
