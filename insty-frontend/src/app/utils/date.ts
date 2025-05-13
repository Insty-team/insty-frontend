import dayjs from "dayjs";

function getLabels(type: "1개월" | "6개월" | "1년") {
	const labels = [];
	const now = dayjs();

	if (type === "1개월") {
		for (let i = 4; i >= 0; i--) {
			labels.push(now.subtract(i, "week").format("M월 D일"));
		}
	} else if (type === "6개월") {
		for (let i = 5; i >= 0; i--) {
			labels.push(now.subtract(i, "month").format("YY년 M월"));
		}
	} else if (type === "1년") {
		for (let i = 11; i >= 0; i--) {
			labels.push(now.subtract(i, "month").format("M월"));
		}
	}

	return labels;
}

export { getLabels };
