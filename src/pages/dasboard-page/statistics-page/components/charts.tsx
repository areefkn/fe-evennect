"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { RevenueData } from "./types";

interface ChartProps {
  data: RevenueData[];
}

export default function RevenueChart({ data }: ChartProps) {
  if (data.length === 0) {
    return <p className="text-center text-gray-500">Data tidak ditemukan</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(v) => `Rp${v.toLocaleString("id-ID")}`} />
        <Tooltip
          formatter={(value) => `Rp${Number(value).toLocaleString("id-ID")}`}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#8884d8"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
