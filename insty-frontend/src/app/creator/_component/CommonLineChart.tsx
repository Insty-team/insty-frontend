import { CommonLineChartProps } from "@/app/types";
import { Line, Tooltip, XAxis, YAxis } from "recharts";
import { LineChart } from "recharts";
import { ResponsiveContainer } from "recharts";

function CommonLineChart({
	data,
	yAxisLabel = "",
	tooltipLabel = "",
	tooltipUnit = "",
	height = 270,
}: CommonLineChartProps) {
	return (
		<ResponsiveContainer width="100%" height={height}>
			<LineChart data={data}>
				<XAxis
					dataKey="name"
					tickMargin={5}
					tickLine={false}
					padding={{ left: 30, right: 30}}
				/>
				<YAxis
					tickMargin={5}
					tickLine={false}
                    padding={{top: 10, bottom: 10}}
					label={{
						value: yAxisLabel,
						position: "outsideLeft",
						offset: 10,
						style: {
							textAnchor: "middle",
							fontSize: 12,
							fontWeight: "bold",
						},
					}}
				/>
				<Tooltip
					formatter={(value) => [
						`${value.toLocaleString()}${tooltipUnit}`,
						tooltipLabel,
					]}
					labelFormatter={(_, payload) =>
						payload[0]?.payload?.fullLabel || payload[0]?.payload?.name
					}
				/>
				<Line
					type="monotone"
					dataKey="value"
					stroke="#307548"
					strokeWidth={3}
					dot={{
						r: 6,
						stroke: "#307548",
						strokeWidth: 2,
						fill: "#fff",
					}}
					activeDot={{
						r: 8,
						fill: "#fff",
						stroke: "#307548",
						strokeWidth: 3,
					}}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
}

export default CommonLineChart;
