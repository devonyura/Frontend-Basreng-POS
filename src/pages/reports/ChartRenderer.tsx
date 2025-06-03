// components/ChartRenderer.tsx
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";
import "./ChartRenderer.css";
import { TransactionsReport, ProductSellsReport } from '../../hooks/interfaces';

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#A28CFF", "#FF6B6B", "#4D96FF", "#00B8A9",
  "#FF8C42", "#5E60CE", "#6930C3", "#7400B8",
  "#3F37C9",
];

interface ChartRendererProps {
  transactionsReport?: TransactionsReport | null | undefined;
  productSellsReport?: ProductSellsReport[] | null;
  setWidth: boolean;
}

export const ChartRenderer = React.forwardRef<HTMLDivElement, ChartRendererProps>(
  ({ transactionsReport, productSellsReport, setWidth }, ref) => {

    if (!transactionsReport || Object.keys(transactionsReport).length === 0) {
      return <div>Loading chart...</div>;
    }

    const branchNames: string[] = Object.keys(transactionsReport);

    const barChartData = branchNames.length > 0
      ? transactionsReport[branchNames[0]].map((_, idx) => {
        const rawDate = transactionsReport[branchNames[0]][idx].date;
        const [dayPart, datePart] = rawDate.split(', ');
        const dateWithoutYear = datePart.split(' ').slice(0, 2).join(' ');
        const date = `${dayPart}, ${dateWithoutYear}`;

        const row: Record<string, number | string> = { date };
        branchNames.forEach(branch => {
          const sales = Number(transactionsReport[branch][idx]?.total_sales || 0);
          row[branch] = sales;
        });
        return row;
      })
      : [];

    const branch = branchNames[0]
    const transactions = transactionsReport[branch]

    const startDate = (transactions && transactions[0]?.date) || "";
    let endDate = (transactions && transactions[transactions.length - 1]?.date) || "";
    endDate = (endDate === startDate ? '' : endDate)

    const pieChartData = productSellsReport
      ? productSellsReport.slice(0, 6).map(product => ({
        name: product.product_name,
        value: Number(product.total_sold)
      }))
      : [];

    return (
      <div ref={ref} className="chart-container" style={setWidth ? { width: '100%' } : {}}>
        <h2 className="chart-header">📊 Grafik Laporan {endDate !== '' ? 'dari' : ''}  {startDate} - {endDate}</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={barChartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <Legend
              verticalAlign="top"
              align="center"
              wrapperStyle={{ paddingBottom: '10px' }}
            />
            <XAxis dataKey="date" angle={-50} textAnchor="end" />
            <YAxis tickFormatter={(value) => `${(value as number) / 1_000_000} Juta`} />
            <Tooltip />
            {branchNames.map((branch, index) => (
              <Bar
                key={branch}
                dataKey={branch}
                fill={COLORS[index % COLORS.length]}
                name={branch}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>

        <h3 className="chart-subheader">6 Produk Terlaris {endDate !== '' ? 'dari' : ''} {startDate} - {endDate}</h3>
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
              <Legend
                verticalAlign="top"
                align="center"
                wrapperStyle={{ paddingBottom: '130px' }}
              />
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieChartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
);

ChartRenderer.displayName = "ChartRenderer";
