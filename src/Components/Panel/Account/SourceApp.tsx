import React from "react";
import { DI } from "../../../Core";
import CommoniApp from './ComponentSource/CommonIApp';

function SourceApp(): JSX.Element {

    return (
        <>
            <CommoniApp from="is_source" />
        </>
    );
}
export default DI(SourceApp);
