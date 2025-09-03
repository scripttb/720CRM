"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface MobileTableProps<T> {
  data: T[]
  renderCard: (item: T, index: number) => React.ReactNode
  emptyState?: React.ReactNode
  className?: string
}

export function MobileTable<T>({ 
  data, 
  renderCard, 
  emptyState,
  className 
}: MobileTableProps<T>) {
  if (data.length === 0 && emptyState) {
    return <div className={className}>{emptyState}</div>
  }

  return (
    <div className={cn("space-y-3", className)}>
      {data.map((item, index) => (
        <React.Fragment key={index}>
          {renderCard(item, index)}
          {index < data.length - 1 && <Separator className="md:hidden" />}
        </React.Fragment>
      ))}
    </div>
  )
}

interface ResponsiveTableProps {
  children: React.ReactNode
  mobileView: React.ReactNode
  className?: string
}

export function ResponsiveTable({ 
  children, 
  mobileView, 
  className 
}: ResponsiveTableProps) {
  return (
    <>
      {/* Desktop Table */}
      <div className={cn("hidden md:block", className)}>
        {children}
      </div>
      
      {/* Mobile Cards */}
      <div className="md:hidden">
        {mobileView}
      </div>
    </>
  )
}

interface MobileCardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function MobileCard({ children, className, onClick }: MobileCardProps) {
  return (
    <Card 
      className={cn(
        "cursor-pointer hover:shadow-md transition-shadow",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        {children}
      </CardContent>
    </Card>
  )
}