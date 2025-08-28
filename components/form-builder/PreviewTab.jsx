"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye } from "lucide-react"

export function PreviewTab({ formComponents, renderComponent, setActiveTab }) {
  return (
    <div className="flex-1 p-6">
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Form Preview</CardTitle>
            <Button onClick={() => setActiveTab("publish")}>
              <Eye className="h-4 w-4 mr-2" />
              Publish Form
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          <div className="max-w-2xl mx-auto">
            <form className="space-y-6">
              {formComponents.map((component) => (
                <div key={component.id}>{renderComponent(component)}</div>
              ))}
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
