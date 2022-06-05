import {
  Assert,
  IsArray,
  IsNumber,
  IsObject,
  IsString,
  IsType,
} from "@paulpopat/safe-type";
import React from "react";
import { Cell, Legend, Pie, PieChart } from "recharts";
import Styled from "styled-components";

const ChartDataTypes = {
  pie: IsArray(IsObject({ key: IsString, value: IsNumber })),
};

type TChartData = typeof ChartDataTypes;
type TChartDataTypes<TKey extends keyof TChartData> = IsType<TChartData[TKey]>;

const Colours = [
  "var(--rainbow-1)",
  "var(--rainbow-2)",
  "var(--rainbow-3)",
  "var(--rainbow-4)",
  "var(--rainbow-5)",
  "var(--rainbow-6)",
  "var(--rainbow-7)",
  "var(--rainbow-8)",
  "var(--rainbow-9)",
  "var(--rainbow-0)",
];

const ChartTypes: {
  [TKey in keyof TChartData]: React.FC<{ data: TChartDataTypes<TKey> }>;
} = {
  pie: ({ data }) => {
    const [highlight, set_highlight] = React.useState("");
    return (
      <PieChart width={400} height={400}>
        <Pie
          dataKey="value"
          isAnimationActive={true}
          data={data.map((d) => ({ name: d.key, value: d.value }))}
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={60}
          paddingAngle={4}
          fill="var(--theme-dark)"
          labelLine={false}
          label={false}
        >
          {data.map((d, index) => (
            <Cell
              key={`cell-${index}`}
              fill={Colours[index % Colours.length]}
              opacity={highlight ? (highlight === d.key ? 1 : 0.5) : 1}
            />
          ))}
        </Pie>
        <Legend
          onMouseEnter={(e) => {
            set_highlight(e.value);
          }}
          onMouseLeave={(e) => {
            set_highlight("");
          }}
        />
      </PieChart>
    );
  },
};

const ChartContainer = Styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Chart: React.FC<{ type: string; data: unknown }> = ({
  type,
  data,
}) => {
  if (!ChartDataTypes[type]) throw new Error("Data type unknown");
  Assert(ChartDataTypes[type], data);
  return (
    <ChartContainer>
      {React.createElement(ChartTypes[type], { data })}
    </ChartContainer>
  );
};
