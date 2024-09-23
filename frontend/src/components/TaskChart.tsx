"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart"

export const description = "A donut chart with text"

export function TaskChart({ tasksDone, tasksPending }:any) {
  const totalTasks = React.useMemo(() => {
    return tasksDone + tasksPending
  }, [tasksDone, tasksPending])

  const chartData = [
    { status: "Done", count: tasksDone, fill: "hsl(142, 76%, 36%)" },
    { status: "Pending", count: tasksPending, fill: "hsl(var(--destructive))" },
  ]

  const chartConfig = {
    count: {
      label: "Tasks",
    },
    Done: {
      label: "Done",
      color: "hsl(var(--chart-1))",
    },
    Pending: {
      label: "Pending",
      color: "hsl(var(--chart-2))",
    },
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Task Status</CardTitle>
        <CardDescription>Done vs Pending Tasks</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalTasks}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Tasks
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {tasksDone} tasks completed, {tasksPending} tasks pending
        </div>
        <div className="leading-none text-muted-foreground">
          Showing current task status
        </div>
      </CardFooter>
    </Card>
  )
}
