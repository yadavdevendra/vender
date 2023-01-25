import React from "react";
import { DI } from "../../../Core";
import CommoniApp from './ComponentSource/CommonIApp';

function TargetApp(): JSX.Element {

    return (
        <>
            <CommoniApp from="is_target" />
        </>
    );
}
export default DI(TargetApp);
