/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { DI } from "./../../../Core";

function Footer(props: any) {
  return (
    <div>
      <footer>
        <p className="m-0">{props.footer.Content}</p>
      </footer>
    </div>
  );
}

export default DI(Footer);
