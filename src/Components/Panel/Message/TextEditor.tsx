/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import React, { Component } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "draft-js/dist/Draft.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Card } from "@cedcommerce/ounce-ui";
import draftToHtml from "draftjs-to-html";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class TextEditor extends Component<
  { textToChat: any; msgSend: boolean },
  any
> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(props: any) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
    };
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (prevProps.msgSend !== prevState.msgSend) {
      this.setState({
        msgSend: prevProps.msgSend,
        editorState: EditorState.createEmpty(),
      });
    }
  }

  onEditorStateChange: Function = (editorState: any) => {
    this.setState({
      editorState: editorState,
    });
    const rawContentState = convertToRaw(
      this.state.editorState.getCurrentContent()
    );
    const markup = draftToHtml(rawContentState);
    this.props.textToChat(markup);
  };

  render(): JSX.Element {
    // const { editorState } = this.state;
    return (
      <Card cardType="bordered" title={"Type Message"}>
        <Editor
          // editorStyle={{ width: "40px", height: "40px" }}
          editorState={this.state.editorState}
          // editorClassName="demo-editor"
          placeholder="Type message here..."
          toolbar={{
            options: [
              "inline",
              "blockType",
              "fontSize",
              "fontFamily",
              "history",
              "textAlign",
              "list",
              "image",
              "emoji",
            ],
            image: {
              icon: undefined,
              className: undefined,
              component: undefined,
              popupClassName: undefined,
              urlEnabled: true,
              uploadEnabled: true,
              alignmentEnabled: true,
              // uploadCallback: this._uploadImageCallBack,
              previewImage: true,
              inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
              alt: { present: false, mandatory: false },
              defaultSize: {
                height: "auto",
                width: "auto",
              },
            },
            inline: {
              options: [
                "bold",
                "italic",
                "underline",
                "strikethrough",
                "monospace",
              ],
              bold: { className: "bordered-option-classname" },
              italic: { className: "bordered-option-classname" },
              underline: { className: "bordered-option-classname" },
              strikethrough: { className: "bordered-option-classname" },
              code: { className: "bordered-option-classname" },
            },
            blockType: {
              className: "bordered-option-classname",
            },
            fontSize: {
              className: "bordered-option-classname",
            },
            fontFamily: {
              className: "bordered-option-classname",
            },
          }}
          onEditorStateChange={(e: EditorState) => {
            this.onEditorStateChange(e);
          }}
        />
      </Card>
    );
  }
}
export default TextEditor;
