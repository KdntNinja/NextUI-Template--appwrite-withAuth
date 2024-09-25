import React from "react";
import { CSSProperties } from "react";

interface TypographyProps {
	children: React.ReactNode;
	h1?: boolean;
	h2?: boolean;
	color?: "primary" | "error" | "default";
	style?: CSSProperties;
}

const Typography: React.FC<TypographyProps> = ({
	children,
	h1,
	h2,
	color,
	style,
}) => {
	let Tag: keyof JSX.IntrinsicElements = "p";
	if (h1) Tag = "h1";
	if (h2) Tag = "h2";

	const colorStyle =
		color === "primary"
			? { color: "blue" }
			: color === "error"
				? { color: "red" }
				: {};

	return <Tag style={{ ...colorStyle, ...style }}>{children}</Tag>;
};

export default Typography;
