import dayjs from "dayjs";

const getLabels = (type: "1개월" | "6개월" | "1년") => {
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
};

type DateFormatType =
	| "YYYY/MM/DD HH:mm"
	| "YYYY. MM. DD"
	| "YYYY/MM/DD"
	| "HH:mm";
const getFormattedDate = (
	date: string,
	type: DateFormatType = "YYYY. MM. DD"
) => {
	return dayjs(date).format(type);
};

export { getLabels, getFormattedDate };
