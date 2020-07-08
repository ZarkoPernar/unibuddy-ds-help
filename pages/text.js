import React, {useState, useEffect, useRef} from "react";
import styled, {css, createGlobalStyle} from "styled-components";
import Popover, {positionDefault} from "@reach/popover";
import {
	Combobox,
	ComboboxInput,
	ComboboxPopover,
	ComboboxList,
	ComboboxOption,
	ComboboxOptionText,
} from "@reach/combobox";

const GlobalStyle = createGlobalStyle`
	body,
	html {
		margin: 0;
		padding: 0;
    }
    *,
    *:before,
    *:after {
        box-sizing: border-box;
	}
`;

const sharedStyles = css`
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
		Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
	display: block;
	font-size: 16px;
	line-height: 1.3;
	width: 400px;
	height: 400px;
	border: 1px solid #ccc;
	background: white;
	margin: 0;
	padding: 0;
	border-radius: 0;
`;

const Container = styled.div`
	display: flex;
`;

const HighlightText = styled.span`
	display: inline-block;
	background-color: red;
`;

const Highlight = ({children}) => {
	const ref = useRef(null);
	// useEffect(() => {
	// 	const rect = ref.current.getBoundingClientRect();
	// 	console.log(rect);
	// }, []);

	return <HighlightText ref={ref}>{children}</HighlightText>;
};

const MentionContainer = styled.span`
	display: inline-block;
	height: 10px;
	width: 10px;
	vertical-align: top;
`;

const Mention = ({onSelect}) => {
	const ref = useRef(null);
	const inputRef = useRef(null);

	return (
		<MentionContainer ref={ref}>
			{/* <Popover targetRef={ref} position={positionDefault}> */}
			<Combobox openOnFocus onSelect={onSelect} aria-labelledby="demo">
				<ComboboxInput autoFocus ref={inputRef} />
				<ComboboxPopover>
					<ComboboxList>
						<ComboboxOption value="Apple" />
						<ComboboxOption value="Banana" />
						<ComboboxOption value="Orange" />
						<ComboboxOption value="Pineapple" />
						<ComboboxOption value="Kiwi" />
					</ComboboxList>
				</ComboboxPopover>
			</Combobox>
			{/* </Popover> */}
		</MentionContainer>
	);
};

const TextArea = styled.textarea`
	${sharedStyles}
`;

const FakeTextArea = styled.div`
	${sharedStyles}

	overflow-y: auto;
	white-space: pre-wrap;
	word-break: break-word;
	pointer-events: none;
	background: transparent;
	position: absolute;
	top: 0;
	left: 0;
`;

export default function Text() {
	const fakeRef = useRef(null);
	const ref = useRef(null);
	const [text, setText] = useState("");
	const [selection, setSelection] = useState(null);
	const [atPosition, setAtPosition] = useState(0);
	const onChange = (e) => {
		setText(e.target.value);
	};
	const onKeyUp = (e) => {
		if (e.key === "@") {
			setAtPosition(ref.current.selectionStart);
		}
	};

	const onSelectAt = (val) => {
		const firstPart = text.substring(0, atPosition);
		const lastPart = text.substring(atPosition, text.length);

		setAtPosition(0);
		setText(firstPart + val + lastPart);

		ref.current.focus();
		setSelection({start: atPosition - 1, end: atPosition + val.length});
		requestAnimationFrame(() => {
			ref.current.selectionStart = atPosition + val.length;
			ref.current.selectionEnd = atPosition + val.length;
		});
	};

	const onScroll = (e) => {
		fakeRef.current.scrollTop = e.target.scrollTop;
	};

	const onSelect = ({target: {selectionStart, selectionEnd}}) => {
		if (!selectionStart) return;
		setSelection({start: selectionStart, end: selectionEnd});
	};

	let parts;
	if (selection && selection.start !== selection.end) {
		const firstPart = text.substring(0, selection.start);
		const highlightedPart = text.substring(selection.start, selection.end);
		const lastPart = text.substring(selection.end, text.length);

		if (highlightedPart.includes("\n")) {
		} else {
			parts = [
				firstPart,
				<Highlight>{highlightedPart}</Highlight>,
				lastPart,
			];
		}
	}

	if (atPosition) {
		const firstPart = text.substring(0, atPosition);
		const lastPart = text.substring(atPosition + 1, text.length);

		parts = [firstPart, <Mention onSelect={onSelectAt} />, lastPart];
	}

	return (
		<Container>
			<GlobalStyle />
			<TextArea
				ref={ref}
				onKeyUp={onKeyUp}
				onSelect={onSelect}
				onScroll={onScroll}
				onChange={onChange}
				value={text}
			></TextArea>
			<FakeTextArea ref={fakeRef}>{parts ? parts : text}</FakeTextArea>
		</Container>
	);
}
