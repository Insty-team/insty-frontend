//테일윈드 기본 설정
module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extends: {
			colors: {
				"black": {
                    100: "#6B6B6B",
                    200: "#525252",
                    300: "#373737",
                    400: "#1F1F1F",
                    500: "#040404",
                },
                "gray-scale": {
                    50: "#FFFFFF",
                    100: "#DEDEDE",
                    200: "#C4C4C4",
                    300: "#ABABAB",
                    400: "#999999",
                    500: "#808080",
                },
                "primary-blue": {
                    100: "#6EDCE9",
                    200: "#86C9DC",
                    300: "#5FA4CC",
                    400: "#4886B5",
                    500: "#4886B5",
                    600: "#3C4A7E",
                    700: "#262E52"
                },
                "secondary-yellow": {
                    100: "#FED344"
                },
                "secondary-red": {
                    100: "#FF9C9E",
                    200: "#D6757D",
                    300: "#FF4F64",
                },
                "line": {
                    100: "#F2F2F2",
                    200: "#E6E6E6",
                },
                "primary-green": {
                    50: "#FBFAEE",
                    100: "#97CA9B",
                    200: "#6DB69D",
                    300: "#47A6A0",
                    400: "#4AA5A2"
                },
			},
		},
	},
	plugins: [],
};
