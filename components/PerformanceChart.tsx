'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, Title, SegmentedControl, Group } from '@mantine/core';

interface PerformanceData {
  date: Date;
  value: number;
  dailyChange: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const [timeRange, setTimeRange] = React.useState('1M');

  const timeRanges = {
    '1W': 7,
    '1M': 30,
    '3M': 90,
    '6M': 180,
    '1Y': 365,
  };

  const filteredData = React.useMemo(() => {
    const days = timeRanges[timeRange as keyof typeof timeRanges];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return data.filter((item) => new Date(item.date) >= cutoffDate);
  }, [data, timeRange]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatValue = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  const getChartColor = () => {
    const firstValue = filteredData[0]?.value || 0;
    const lastValue = filteredData[filteredData.length - 1]?.value || 0;
    return lastValue >= firstValue ? '#40c057' : '#fa5252';
  };

  return (
    <Card shadow="sm" p="lg">
      <Group position="apart" mb="md">
        <Title order={3}>Performance</Title>
        <SegmentedControl
          value={timeRange}
          onChange={setTimeRange}
          data={Object.keys(timeRanges).map((key) => ({ label: key, value: key }))}
          size="xs"
        />
      </Group>

      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={filteredData}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={getChartColor()} stopOpacity={0.8} />
              <stop offset="95%" stopColor={getChartColor()} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            minTickGap={50}
          />
          <YAxis
            tickFormatter={formatValue}
            domain={['dataMin', 'dataMax']}
          />
          <Tooltip
            labelFormatter={formatDate}
            formatter={(value: number) => [formatValue(value), 'Value']}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="value"
            stroke={getChartColor()}
            fillOpacity={1}
            fill="url(#colorValue)"
            name="Basket Value"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
} 