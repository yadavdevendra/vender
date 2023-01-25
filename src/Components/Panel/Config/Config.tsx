import React from 'react';
import { DI } from '../../../Core';
import { PageHeader, Card } from '@cedcommerce/ounce-ui';
import { App } from '..';

//interface PropsI extends DIProps {};

function Config(): JSX.Element {
    return (
        <React.Fragment>
            <PageHeader>
                Config
            </PageHeader>
            <Card>
                <App />
            </Card>
        </React.Fragment>
    );
}

export default DI(Config);