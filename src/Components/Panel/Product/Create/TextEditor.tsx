import React, { Component } from "react";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "draft-js/dist/Draft.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Card, TextStyles } from "@cedcommerce/ounce-ui";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class TextEditor extends Component<{
  TextToAddProduct: any;
  TextById: string;
  saveEdit: any;
}> {
  state = {
    editorState: EditorState.createEmpty(),
  };
  componentDidMount(): void {
    const blocksFromHtml = htmlToDraft(this.props.TextById);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap
    );
    this.setState({ editorState: EditorState.createWithContent(contentState) });
  }
  onEditorStateChange = (editorState: EditorState): void => {
    this.setState({
      editorState,
    });
    const rawContentState = convertToRaw(
      this.state.editorState.getCurrentContent()
    );
    const markup = draftToHtml(rawContentState);
    this.props.TextToAddProduct(markup);
  };

  render(): JSX.Element {
    const { editorState } = this.state;
    return (
      <div>
        <TextStyles type="SubHeading">Description</TextStyles>
        <Card cardType="bordered">
          <Editor
            editorState={editorState}
            readOnly={!this.props.saveEdit}
            // wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
            onEditorStateChange={(e: EditorState) => {
              this.onEditorStateChange(e);
            }}
            toolbar={{
              options: [
                "inline",
                "blockType",
                "fontSize",
                "list",
                "textAlign",
                "image",
                "remove",
                "colorPicker",
              ],
              // inline: { inDropdown: true },
              remove: {
                className: undefined,
                component: undefined,
              },
              blockType: {
                inDropdown: true,
                options: [
                  "Normal",
                  "H1",
                  "H2",
                  "H3",
                  "H4",
                  "H5",
                  "H6",
                  "Blockquote",
                ],
                className: undefined,
                component: undefined,
                dropdownClassName: undefined,
              },
              // // list: { inDropdown: true },
              // // textAlign: { inDropdown: true },

              inline: {
                inDropdown: true,
                className: undefined,
                component: undefined,
                dropdownClassName: undefined,
                options: ["bold", "italic", "underline"],
                // bold: { icon: bold, className: undefined },
                // italic: { icon: italic, className: undefined },
                // underline: { icon: underline, className: undefined },
                // strikethrough: { icon: strikethrough, className: undefined },
                // monospace: { icon: monospace, className: undefined },
                // superscript: { icon: superscript, className: undefined },
                // subscript: { icon: subscript, className: undefined },
              },
              list: {
                inDropdown: false,
                className: undefined,
                component: undefined,
                dropdownClassName: undefined,
                options: ["unordered", "ordered", "indent", "outdent"],
                // unordered: { icon: unordered, className: undefined },
                // ordered: { icon: ordered, className: undefined },
                // indent: { icon: indent, className: undefined },
                // outdent: { icon: outdent, className: undefined },
              },
              // textAlign: {
              //   inDropdown: true,
              //   className: undefined,
              //   component: undefined,
              //   dropdownClassName: undefined,
              //   options: ['left', 'center', 'right'],
              //   // left: { icon: left, className: undefined },
              //   // center: { icon: center, className: undefined },
              //   // right: { icon: right, className: undefined },
              //   // justify: { icon: justify, className: undefined },
              // },
              // colorPicker: { component: Colorpick },
              // image: {
              //   // icon: image,
              //   className: undefined,
              //   component: undefined,
              //   popupClassName: undefined,
              //   urlEnabled: true,
              //   uploadEnabled: true,
              //   alignmentEnabled: true,
              //   uploadCallback: undefined,
              //   previewImage: false,
              //   inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
              //   alt: { present: false, mandatory: false },
              //   defaultSize: {
              //     height: 'auto',
              //     width: 'auto',
              //   },
              // },
            }}
          />
        </Card>
      </div>
    );
  }
}
export default TextEditor;
