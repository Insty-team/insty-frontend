"use client";

import { ICommand } from "@uiw/react-md-editor";
import { CodeXml, Heading1, Heading2, Heading3, List } from "lucide-react";

export const mdEditorCommands: ICommand[] = [
	{
		name: "title1",
		keyCommand: "title1",
		buttonProps: { "aria-label": "Insert title1" },
		icon: <Heading1 size={18} />,
		execute: (state, api) => {
			let modifyText = `# ${state.selectedText}\n`;
			if (!state.selectedText) modifyText = `# `;
			api.replaceSelection(modifyText);
		},
	},
	{
		name: "title2",
		keyCommand: "title2",
		buttonProps: { "aria-label": "Insert title2" },
		icon: <Heading2 size={18} />,
		execute: (state, api) => {
			let modifyText = `## ${state.selectedText}\n`;
			if (!state.selectedText) modifyText = `## `;
			api.replaceSelection(modifyText);
		},
	},
	{
		name: "title3",
		keyCommand: "title3",
		buttonProps: { "aria-label": "Insert title3" },
		icon: <Heading3 size={18} />,
		execute: (state, api) => {
			let modifyText = `### ${state.selectedText}\n`;
			if (!state.selectedText) modifyText = `### `;
			api.replaceSelection(modifyText);
		},
	},
	{
		name: "unorderedList",
		keyCommand: "unorderedList",
		buttonProps: { "aria-label": "Insert unordered list" },
		icon: <List size={18} />,
		execute: (state, api) => {
			const modifyText = state.selectedText
				? state.selectedText
						.split("\n")
						.map((line) => `- ${line}`)
						.join("\n")
				: "- ";
			api.replaceSelection(modifyText);
		},
	},
	{
		name: "codeBlock",
		keyCommand: "codeBlock",
		buttonProps: { "aria-label": "Insert code block" },
		icon: <CodeXml size={18} />,
		execute: (state, api) => {
			const selected = state.selectedText || "";
			const wrapped = selected
				? `\`\`\`\n${selected}\n\`\`\`\n`
				: "```\n\n```\n";
			api.replaceSelection(wrapped);
		},
	},
];
