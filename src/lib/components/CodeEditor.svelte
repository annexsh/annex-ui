<script lang="ts">
	import { json } from '@codemirror/lang-json';
	import type { Diagnostic } from '@codemirror/lint';
	import { linter, lintKeymap } from '@codemirror/lint';
	import type { EditorView } from '@codemirror/view';
	import {
		crosshairCursor,
		drawSelection,
		dropCursor,
		highlightSpecialChars,
		keymap,
		rectangularSelection
	} from '@codemirror/view';
	import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
	import {
		bracketMatching,
		defaultHighlightStyle,
		foldGutter,
		foldKeymap,
		indentOnInput,
		syntaxHighlighting
	} from '@codemirror/language';
	import { EditorState } from '@codemirror/state';
	import CodeMirror from 'svelte-codemirror-editor';
	import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
	import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
	import { createTheme } from 'thememirror';
	import { tags as t } from '@lezer/highlight';

	export let value: string;
	export let readonly = false;
	export let editable = true;
	export let disabled = false;
	export let jsonLang = false;

	const chalky = '#e5c07b',
		coral = '#e06c75',
		cyan = '#56b6c2',
		invalid = '#ffffff',
		ivory = '#abb2bf',
		stone = '#7d8799',
		sage = '#98c379',
		whiskey = '#d19a66',
		violet = '#c678dd',
		highlightBackground = '#2c313a',
		backgroundDark = '#374151',
		borderDark = '#46515f',
		backgroundlight = '#f9fafb',
		borderLight = '#d1d5dbff',
		foreground = '#abb2bf',
		selection = '#3E4451',
		cursor = '#528bff';

	const jsonDarkTheme = createTheme({
		variant: 'dark',
		settings: {
			background: backgroundDark,
			foreground: foreground,
			caret: cursor,
			selection: selection,
			lineHighlight: highlightBackground,
			gutterBackground: backgroundDark,
			gutterForeground: stone
		},
		styles: [
			{
				tag: t.invalid,
				color: invalid
			},
			{
				tag: t.comment,
				color: stone
			},
			{
				tag: t.variableName,
				color: sage
			},
			{
				tag: [t.string, t.special(t.brace)],
				color: cyan
			},
			{
				tag: t.number,
				color: chalky
			},
			{
				tag: t.bool,
				color: whiskey
			},
			{
				tag: t.null,
				color: stone
			},
			{
				tag: t.keyword,
				color: violet
			},
			{
				tag: t.operator,
				color: cyan
			},
			{
				tag: t.className,
				color: chalky
			},
			{
				tag: t.definition(t.typeName),
				color: ivory
			},
			{
				tag: t.typeName,
				color: chalky
			},
			{
				tag: t.angleBracket,
				color: '#bad0f847'
			},
			{
				tag: t.tagName,
				color: coral
			},
			{
				tag: t.attributeName,
				color: coral
			}
		]
	});

	const jsonLightTheme = createTheme({
		variant: 'light',
		settings: {
			background: backgroundlight,
			foreground: foreground,
			caret: cursor,
			selection: selection,
			lineHighlight: highlightBackground,
			gutterBackground: backgroundlight,
			gutterForeground: stone
		},
		styles: [
			{
				tag: t.invalid,
				color: invalid
			},
			{
				tag: t.comment,
				color: stone
			},
			{
				tag: t.variableName,
				color: sage
			},
			{
				tag: [t.string, t.special(t.brace)],
				color: cyan
			},
			{
				tag: t.number,
				color: chalky
			},
			{
				tag: t.bool,
				color: whiskey
			},
			{
				tag: t.null,
				color: stone
			},
			{
				tag: t.keyword,
				color: violet
			},
			{
				tag: t.operator,
				color: cyan
			},
			{
				tag: t.className,
				color: chalky
			},
			{
				tag: t.definition(t.typeName),
				color: ivory
			},
			{
				tag: t.typeName,
				color: chalky
			},
			{
				tag: t.angleBracket,
				color: '#bad0f847'
			},
			{
				tag: t.tagName,
				color: coral
			},
			{
				tag: t.attributeName,
				color: coral
			}
		]
	});


	let theme = jsonLightTheme;
	const isDarkTheme = document.documentElement.classList.contains('dark');
	if (isDarkTheme) {
		theme = jsonDarkTheme;
	}

	// JSON Linter function to highlight syntax errors
	function jsonLinter(view: EditorView): Diagnostic[] {
		const diagnostics: Diagnostic[] = [];
		try {
			JSON.parse(view.state.doc.toString());
		} catch (e) {
			if (e instanceof SyntaxError && e.message.match(/position (\d+)/)) {
				const position = +e.message.match(/position (\d+)/)![1];
				diagnostics.push({
					from: position - 1,
					to: position,
					severity: 'error',
					message: e.message
				});
			}
		}
		return diagnostics;
	}

	const extensionsPlain = [
		theme,
		EditorState.allowMultipleSelections.of(true),
		rectangularSelection(),
		crosshairCursor()
	];

	const extensionsJson = [
		json(),
		theme,
		EditorState.allowMultipleSelections.of(true),
		rectangularSelection(),
		crosshairCursor(),
		linter(jsonLinter),
		highlightSpecialChars(),
		history(),
		foldGutter(),
		drawSelection(),
		dropCursor(),
		indentOnInput(),
		syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
		bracketMatching(),
		closeBrackets(),
		autocompletion(),
		highlightSelectionMatches(),
		keymap.of([
			...closeBracketsKeymap,
			...defaultKeymap,
			...searchKeymap,
			...historyKeymap,
			...foldKeymap,
			...completionKeymap,
			...lintKeymap
		])
	];
</script>

<CodeMirror
	bind:value
	bind:readonly
	bind:editable
	basic={false}
	extensions={jsonLang ? extensionsJson : extensionsPlain}

	styles={{
		"&": {
				height: "100%",
				minHeight: readonly ? '0px' : '200px',
				borderRadius: "1rem",
				border: `solid 2px ${isDarkTheme ? borderDark :borderLight }`,
				cursor: disabled ? 'not-allowed' : 'auto',
				opacity: disabled ? 0.5 : 1,
		},
		".cm-content": {
		  margin: `${jsonLang ? "10px 0px 10px 0px" : "10px 5px 10px 5px"}`,
    	caretColor: cursor
  	},
		".cm-gutters": {
			margin: "10px 0px 10px 4px",
			color: stone,
			borderRadius: "1rem",
			border: `solid 3px ${isDarkTheme ? backgroundDark :backgroundlight }`,
		},
	}}
/>