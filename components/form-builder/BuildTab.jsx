"use client"

import { Button } from "@/components/ui/button"
import { CreateForm } from "@/components/builder/Form"

import {
  Type,
  FileText,
  List,
  MessageSquare,
  MousePointer,
  ChevronUp,
  ChevronDown,
  Settings,
} from "lucide-react"

const componentTypes = [
  { id: "FTTitle", name: "Title", icon: Type, description: "Add a title and subtitle" },
  { id: "FTTextInput", name: "Text Input", icon: FileText, description: "Single line text input" },
  { id: "FTSelect", name: "Select", icon: List, description: "Dropdown selection" },
  { id: "FTTextarea", name: "Textarea", icon: MessageSquare, description: "Multi-line text input" },
  { id: "FTButton", name: "Button", icon: MousePointer, description: "Submit or action button" },
]

export function BuildTab({
  componentsCollapsed,
  setComponentsCollapsed,
  propertiesCollapsed,
  setPropertiesCollapsed,
  formComponents,
  selectedComponent,
  setSelectedComponent,
  addComponent,
  updateComponentProperty,
  removeComponent,
  renderComponent,
}) {
  const renderProperties = () => {
    if (!selectedComponent) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Settings className="h-8 w-8 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">Select a component to edit its properties</p>
        </div>
      )
    }
    const { type, properties } = selectedComponent
    //console.log(JSON.stringify(selectedComponent))
    return CreateForm({'formJSON': properties})
    //console.log("Rendering properties for:", selectedComponent)

  }

  return (
    <>
      {/* Left Panel - Components and Properties */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Components Section */}
        <div className="border-b border-gray-200">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium">Components</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setComponentsCollapsed(!componentsCollapsed)}
                className="h-6 w-6 p-0"
              >
                {componentsCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </Button>
            </div>
            {!componentsCollapsed && (
              <div className="grid grid-cols-2 gap-2">
                {componentTypes.map((component) => (
                  <Button
                    key={component.id}
                    variant="outline"
                    className="h-16 flex flex-col items-center justify-center gap-1 bg-white hover:bg-gray-50 border-gray-300"
                    onClick={() => addComponent(component.id)}
                  >
                    <component.icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{component.name}</span>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Properties Section */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Properties</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPropertiesCollapsed(!propertiesCollapsed)}
                className="h-6 w-6 p-0"
              >
                {propertiesCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          {!propertiesCollapsed && <div className="flex-1 p-4 overflow-auto">{renderProperties()}</div>}
        </div>
      </div>

      {/* Center Panel - Form Preview */}
      <div className="flex-1 bg-white border-r border-gray-200 flex flex-col">
        <div className="flex-1 p-6">
          {formComponents.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No components added yet. Start building your form!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {formComponents.map((component) => (
                <div
                  key={component.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedComponent?.id === component.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedComponent(component)}
                >
                  {renderComponent(component)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
