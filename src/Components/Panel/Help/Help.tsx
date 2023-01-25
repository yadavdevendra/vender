import React from 'react';
import { DI } from '../../../Core';
import { PageHeader, Card, TextStyles } from '@cedcommerce/ounce-ui';

//interface PropsI extends DIProps {};

function Help (): JSX.Element {
    return (
        <React.Fragment>
            <PageHeader>
                HELP
            </PageHeader>
            <Card>
                <TextStyles>
                    Email : help@cedcommerce.com
                </TextStyles>
            </Card>
        </React.Fragment>
    );
}

export default DI(Help);