import React, {
  useState,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useCallback,
  use,
} from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Image from "@tiptap/extension-image";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import { all, createLowlight } from "lowlight";
import {
  MarkdownSerializer,
  defaultMarkdownSerializer,
} from "prosemirror-markdown";
import "highlight.js/styles/github-dark.css";
import { DragHandle } from "@tiptap-pro/extension-drag-handle";

import DropdownCard from "./DropdownCard";
import "./Tiptap.css";

import { YSyncExtension } from "./extension/YSyncExtension";

const lowlight = createLowlight(all);

const Tiptap = forwardRef((props, ref) => {
  const {
    onSave,
    yDoc,            // Y.Doc (from TeamNote)
    initialJson,     // 서버에서 가져온 ProseMirror JSON
    ...rest
  } = props;

  // dropdown 명령어
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [commandList, setCommandList] = useState([]);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });

  const [markdown, setMarkdown] = useState("");
  const [selectedNode, setSelectedNode] = useState(null);

  const yXmlFragment = useRef(yDoc.getXmlFragment('prosemirror'));

  // Tiptap Editor 생성
  const editor = useEditor({
    extensions: [
      YSyncExtension(yXmlFragment.current),
      StarterKit.configure({
        codeBlock: false,
        orderedList: false,
        bulletList: false,
        listItem: false,
      }),
      CodeBlockLowlight.configure({ lowlight }),
      Table.configure({
        resizable: true,
        cellMinWidth: 50,
        cellMinHeight: 20,
      }),
      TableRow,
      TableCell,
      TableHeader,
      Image,
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      // (옵션) Markdown 직렬화
      const serializer = new MarkdownSerializer(
        extendedMarkdownSerializerNodes,
        extendedMarkdownSerializerMarks
      );
      const markdownContent = serializer.serialize(editor.state.doc);
      setMarkdown(markdownContent);
      console.log("Markdown content:", editor.getJSON());
      // console.log("Current Y.Doc state:", yDoc.toJSON());
      console.log("Current Y.XmlFragment state:", yXmlFragment.current.toString());

    },
  });

  // ProseMirror Markdown Serializer 확장
  const extendedMarkdownSerializerNodes = {
    ...defaultMarkdownSerializer.nodes,
    bulletList(state, node) {
      state.renderList(node, "   ", () => "* ");
    },
    orderedList(state, node) {
      const start = node.attrs.start || 1;
      const delimiter = ". ";
      state.renderList(node, "   ", (index) => `${start + index}${delimiter}`);
    },
    listItem(state, node) {
      state.renderContent(node);
    },
    codeBlock(state, node) {
      state.write(`\`\`\`${node.attrs.language || ""}\n`);
      state.text(node.textContent, false);
      state.ensureNewLine();
      state.write("```");
      state.closeBlock(node);
    },
    table(state, node) {
      state.write("\n");
      node.forEach((row, _, i) => {
        if (i > 0) state.write("\n");
        state.render(row);
      });
      state.ensureNewLine();
    },
    tableRow(state, node) {
      node.forEach((cell, _, i) => {
        if (i > 0) state.write(" | ");
        state.render(cell);
      });
      state.write(" |");
      state.ensureNewLine();
    },
    tableCell(state, node) {
      state.write(node.textContent.trim());
    },
    tableHeader(state, node) {
      state.write(`**${node.textContent.trim()}**`);
    },
    hardBreak(state, node) {
      state.write("  \n");
    },
  };

  const extendedMarkdownSerializerMarks = {
    ...defaultMarkdownSerializer.marks,
    bold: {
      open: "**",
      close: "**",
      mixable: true,
      expelEnclosingWhitespace: true,
    },
    italic: {
      open: "*",
      close: "*",
      mixable: true,
      expelEnclosingWhitespace: true,
    },
  };

  // slash 명령어
  const commands = [
    {
      label: "table",
      action: (editor) =>
        editor.chain().focus().insertTable({ rows: 2, cols: 2 }).run(),
    },
    {
      label: "image",
      action: (editor) => {
        const imageUrl = prompt("이미지 URL을 입력하세요:");
        if (imageUrl) {
          editor.chain().focus().setImage({ src: imageUrl }).run();
        }
      },
    },
    {
      label: "code block",
      action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    },
  ];

  // slash 명령 실행
  const handleCommandClick = (command) => {
    if (!editor) return;
    command.action(editor);
    setDropdownVisible(false);
  };

  // imperative handle
  useImperativeHandle(ref, () => ({
    handleSave: () => {
      if (!editor) return;
      const jsonContent = editor.getJSON();
      console.log("handleSave =>", jsonContent);
      onSave?.(jsonContent);
    },
  }));

  return (
    <div className="container">
      <div
        className="editor-container border border-gray-300 rounded-md bg-white overflow-hidden no-tailwind"
        style={{ minHeight: "750px", padding: "20px" }}
      >
        {selectedNode && (
          <DragHandle editor={editor} node={selectedNode}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
            </svg>
          </DragHandle>
        )}

        <EditorContent editor={editor} style={{ width: "100%", height: "100%" }} />

        {dropdownVisible && (
          <DropdownCard
            commands={commandList}
            position={dropdownPosition}
            onCommandClick={handleCommandClick}
          />
        )}
      </div>
    </div>
  );
});

export default Tiptap;
