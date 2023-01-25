import React from 'react';
import { DI  } from '../../../Core';
// import { PageHeader, Card, TextStyles } from '@cedcommerce/ounce-ui';
import { SourceApp } from '..';

//interface PropsI extends DIProps {};

function App (): JSX.Element {
    return (
        <React.Fragment>
            <SourceApp/>
        </React.Fragment>
    );
}

export default DI(App);