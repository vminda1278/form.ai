"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Type,
  FileText,
  List,
  MessageSquare,
  MousePointer,
  ChevronUp,
  ChevronDown,
  Plus,
  Trash2,
  Settings,
} from "lucide-react"

const componentTypes = [
  { id: "title", name: "Title", icon: Type, description: "Add a title and subtitle" },
  { id: "text", name: "Text Input", icon: FileText, description: "Single line text input" },
  { id: "select", name: "Select", icon: List, description: "Dropdown selection" },
  { id: "textarea", name: "Textarea", icon: MessageSquare, description: "Multi-line text input" },
  { id: "button", name: "Button", icon: MousePointer, description: "Submit or action button" },
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

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Properties</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeComponent(selectedComponent.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {type === "title" && (
          <>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={properties.title}
                onChange={(e) => updateComponentProperty(selectedComponent.id, "title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Input
                value={properties.subtitle}
                onChange={(e) => updateComponentProperty(selectedComponent.id, "subtitle", e.target.value)}
              />
            </div>
          </>
        )}

        {(type === "text" || type === "select" || type === "textarea") && (
          <>
            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                value={properties.label}
                onChange={(e) => updateComponentProperty(selectedComponent.id, "label", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Required</Label>
              <Select
                value={properties.required ? "true" : "false"}
                onValueChange={(value) => updateComponentProperty(selectedComponent.id, "required", value === "true")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">No</SelectItem>
                  <SelectItem value="true">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Help Text</Label>
              <Input
                value={properties.helpText}
                onChange={(e) => updateComponentProperty(selectedComponent.id, "helpText", e.target.value)}
                placeholder="Optional help text"
              />
            </div>
          </>
        )}

        {(type === "text" || type === "textarea") && (
          <div className="space-y-2">
            <Label>Placeholder</Label>
            <Input
              value={properties.placeholder}
              onChange={(e) => updateComponentProperty(selectedComponent.id, "placeholder", e.target.value)}
            />
          </div>
        )}

        {type === "textarea" && (
          <div className="space-y-2">
            <Label>Rows</Label>
            <Select
              value={properties.rows.toString()}
              onValueChange={(value) => updateComponentProperty(selectedComponent.id, "rows", Number.parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="6">6</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {type === "select" && (
          <div className="space-y-2">
            <Label>Options</Label>
            {properties.options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...properties.options]
                    newOptions[index] = e.target.value
                    updateComponentProperty(selectedComponent.id, "options", newOptions)
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newOptions = properties.options.filter((_, i) => i !== index)
                    updateComponentProperty(selectedComponent.id, "options", newOptions)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newOptions = [...properties.options, `Option ${properties.options.length + 1}`]
                updateComponentProperty(selectedComponent.id, "options", newOptions)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </div>
        )}

        {type === "button" && (
          <>
            <div className="space-y-2">
              <Label>Button Text</Label>
              <Input
                value={properties.text}
                onChange={(e) => updateComponentProperty(selectedComponent.id, "text", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Button Type</Label>
              <Select
                value={properties.type}
                onValueChange={(value) => updateComponentProperty(selectedComponent.id, "type", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="submit">Submit</SelectItem>
                  <SelectItem value="button">Button</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Button Style</Label>
              <Select
                value={properties.variant}
                onValueChange={(value) => updateComponentProperty(selectedComponent.id, "variant", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </div>
    )
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
