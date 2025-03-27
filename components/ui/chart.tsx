"use client"

import type * as React from "react"

const Chart = ({ children }: { children: React.ReactNode }) => {
  return <div className="recharts-wrapper">{children}</div>
}

const ChartContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col">{children}</div>
}

const ChartTooltip = ({ children }: { children: React.ReactNode }) => {
  return <div className="recharts-tooltip-wrapper">{children}</div>
}

const ChartTooltipContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="recharts-tooltip-content">{children}</div>
}

const ChartTooltipItem = ({ label, value, color }: { label: string; value: string; color: string }) => {
  return (
    <div className="recharts-tooltip-item">
      <span className="recharts-tooltip-item-name">{label}</span>
      <span className="recharts-tooltip-item-separator">:</span>
      <span className="recharts-tooltip-item-value">{value}</span>
    </div>
  )
}

const ChartTooltipTitle = ({ children }: { children: React.ReactNode }) => {
  return <div className="recharts-tooltip-title">{children}</div>
}

const ChartLegend = () => {
  return <div className="recharts-legend"></div>
}

export { Chart, ChartContainer, ChartTooltip, ChartTooltipContent, ChartTooltipItem, ChartTooltipTitle, ChartLegend }

