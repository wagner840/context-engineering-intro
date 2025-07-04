"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useBlogs } from "@/hooks/use-blogs";
import { useAnalyticsMetrics } from "@/hooks/use-dashboard";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsPage() {
  const { data: blogs = [], isLoading: blogsLoading } = useBlogs();
  const [blogId, setBlogId] = useState<string | undefined>(blogs[0]?.id);

  // Date range (últimos 30 dias por padrão)
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const { data: metrics = [], isLoading } = useAnalyticsMetrics(
    blogId || "",
    date
      ? {
          start: format(date.from ?? new Date(), "yyyy-MM-dd"),
          end: format(date.to ?? new Date(), "yyyy-MM-dd"),
        }
      : undefined
  );

  // Agrupar métricas por nome
  const metricNames = Array.from(
    new Set(metrics.map((m: any) => m.metric_name))
  );
  const [selectedMetric, setSelectedMetric] = useState<string>("pageviews");

  const chartData = metrics
    .filter((m: any) => m.metric_name === selectedMetric)
    .map((m: any) => ({ date: m.metric_date, value: m.metric_value }))
    .reverse();

  return (
    <div className="px-4 py-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold">Analytics</h1>

        {/* Blog Selector */}
        {blogsLoading ? (
          <Skeleton className="h-10 w-48" />
        ) : (
          <Select value={blogId} onValueChange={setBlogId}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Selecione um blog" />
            </SelectTrigger>
            <SelectContent>
              {blogs.map((b: any) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[260px] justify-start text-left font-normal"
            >
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Escolher intervalo</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        {/* Metric selector */}
        <Select value={selectedMetric} onValueChange={setSelectedMetric}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Métrica" />
          </SelectTrigger>
          <SelectContent>
            {metricNames.map((name) => (
              <SelectItem key={name} value={name} className="capitalize">
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="capitalize">{selectedMetric}</CardTitle>
          <CardDescription>Evolução diária</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
