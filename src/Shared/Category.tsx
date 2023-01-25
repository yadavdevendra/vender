/* eslint-disable @typescript-eslint/no-unused-vars */
import { FlexLayout, Select } from '@cedcommerce/ounce-ui';
import React, { useEffect } from 'react';
import { DI, DIProps } from '../Core/DependencyInjection';

interface CatI extends DIProps {
    path: string;
    marketplace?: string;
    separator?: string;
    flexProps?: OBJI;
}

type OBJI = {
    [name: string]: string;
};

function Category({
    path,
    marketplace = 'cedcommerce',
    separator = '/',
    flexProps = { spacing: 'loose' },
}: CatI): JSX.Element {
    useEffect(() => {
        // Call The Category Api Here
    }, []);
    return (
        <FlexLayout {...flexProps}>
            <Select />
        </FlexLayout>
    );
}

export default DI(Category, { stateNeeded: false });
