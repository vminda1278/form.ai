"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Type,
  FileText,
  List,
  MessageSquare,
  MousePointer,
  ChevronUp,
  ChevronDown,
  Copy,
  Share,
  Eye,
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

export default function FormBuilder() {
  const [activeTab, setActiveTab] = useState("build")
  const [componentsCollapsed, setComponentsCollapsed] = useState(false)
  const [propertiesCollapsed, setPropertiesCollapsed] = useState(false)
  const [formComponents, setFormComponents] = useState([])
  const [selectedComponent, setSelectedComponent] = useState(null)
  const [isPublished, setIsPublished] = useState(false)
  const [publishedUrl, setPublishedUrl] = useState("")
  const router = useRouter()

  const addComponent = (type) => {
    const newComponent = {
      id: Date.now(),
      type,
      properties: getDefaultProperties(type),
    }
    setFormComponents([...formComponents, newComponent])
    setSelectedComponent(newComponent)
  }

  const getDefaultProperties = (type) => {
    switch (type) {
      case "title":
        return { title: "Form Title", subtitle: "Form description" }
      case "text":
        return { label: "Text Input", placeholder: "Enter text", required: false, helpText: "" }
      case "select":
        return { label: "Select Option", options: ["Option 1", "Option 2"], required: false, helpText: "" }
      case "textarea":
        return { label: "Textarea", placeholder: "Enter your message", rows: 4, required: false, helpText: "" }
      case "button":
        return { text: "Submit", type: "submit", variant: "default" }
      default:
        return {}
    }
  }

  const updateComponentProperty = (componentId, property, value) => {
    setFormComponents(
      formComponents.map((comp) =>
        comp.id === componentId ? { ...comp, properties: { ...comp.properties, [property]: value } } : comp,
      ),
    )
    if (selectedComponent && selectedComponent.id === componentId) {
      setSelectedComponent({ ...selectedComponent, properties: { ...selectedComponent.properties, [property]: value } })
    }
  }

  const removeComponent = (componentId) => {
    setFormComponents(formComponents.filter((comp) => comp.id !== componentId))
    if (selectedComponent && selectedComponent.id === componentId) {
      setSelectedComponent(null)
    }
  }

  const handlePublish = () => {
    setIsPublished(true)
    setPublishedUrl(`https://forms.example.com/${Date.now()}`)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const renderFormPreview = () => (
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
      {formComponents.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Type className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No components added yet</p>
          <p className="text-sm">Add components from the left panel</p>
        </div>
      )}
    </div>
  )

  const renderComponent = (component) => {
    const { type, properties } = component

    switch (type) {
      case "title":
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">{properties.title}</h2>
            <p className="text-gray-600">{properties.subtitle}</p>
          </div>
        )
      case "text":
        return (
          <div className="space-y-2">
            <Label>
              {properties.label} {properties.required && <span className="text-red-500">*</span>}
            </Label>
            <Input placeholder={properties.placeholder} />
            {properties.helpText && <p className="text-sm text-gray-500">{properties.helpText}</p>}
          </div>
        )
      case "select":
        return (
          <div className="space-y-2">
            <Label>
              {properties.label} {properties.required && <span className="text-red-500">*</span>}
            </Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {properties.options.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {properties.helpText && <p className="text-sm text-gray-500">{properties.helpText}</p>}
          </div>
        )
      case "textarea":
        return (
          <div className="space-y-2">
            <Label>
              {properties.label} {properties.required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea placeholder={properties.placeholder} rows={properties.rows} />
            {properties.helpText && <p className="text-sm text-gray-500">{properties.helpText}</p>}
          </div>
        )
      case "button":
        return (
          <Button variant={properties.variant} type={properties.type} className="w-full">
            {properties.text}
          </Button>
        )
      default:
        return null
    }
  }

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
    <div className="h-screen bg-gray-50 flex flex-col relative">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-xl font-semibold">Form Builder</h1>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant={activeTab === "build" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("build")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Build
            </Button>
            <Button
              variant={activeTab === "preview" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("preview")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Preview
            </Button>
            <Button
              variant={activeTab === "publish" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("publish")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Publish
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {activeTab === "build" && (
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

            {/* Right Panel - JSON Structure */}
            <div className="w-80 bg-gray-900 text-white flex flex-col">
              <div className="p-4 border-b border-gray-700">
                <h2 className="font-medium text-green-400">JSON Structure:</h2>
              </div>
              <div className="flex-1 p-4 overflow-auto">
                <pre className="text-sm text-gray-300">
                  <code>
                    {JSON.stringify(
                      {
                        formComponents: formComponents.map((comp) => ({
                          id: comp.id,
                          type: comp.type,
                          properties: comp.properties,
                        })),
                      },
                      null,
                      2,
                    )}
                  </code>
                </pre>
              </div>
            </div>
          </>
        )}

        {activeTab === "preview" && (
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
        )}

        {activeTab === "publish" && (
          <div className="flex-1 p-6">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Publish Form</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isPublished ? (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium mb-4">Ready to publish your form?</h3>
                    <p className="text-gray-600 mb-6">Publishing will make your form available to collect responses.</p>
                    <Button onClick={handlePublish} size="lg">
                      Publish Form
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Eye className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">Form Published Successfully!</h3>
                      <p className="text-gray-600">Your form is now live and ready to collect responses.</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Form URL</Label>
                        <div className="flex gap-2 mt-1">
                          <Input value={publishedUrl} readOnly />
                          <Button variant="outline" onClick={() => copyToClipboard(publishedUrl)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="outline">
                            <Share className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">Embed in your application</Label>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-gray-500">HTML Embed Code</Label>
                            <div className="flex gap-2 mt-1">
                              <Textarea
                                value={`<iframe src="${publishedUrl}" width="100%" height="600" frameborder="0"></iframe>`}
                                readOnly
                                rows={2}
                                className="font-mono text-sm"
                              />
                              <Button
                                variant="outline"
                                onClick={() =>
                                  copyToClipboard(
                                    `<iframe src="${publishedUrl}" width="100%" height="600" frameborder="0"></iframe>`,
                                  )
                                }
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label className="text-xs text-gray-500">React Component</Label>
                            <div className="flex gap-2 mt-1">
                              <Textarea
                                value={`<iframe 
  src="${publishedUrl}" 
  width="100%" 
  height="600" 
  frameBorder="0"
  title="Form"
/>`}
                                readOnly
                                rows={6}
                                className="font-mono text-sm"
                              />
                              <Button
                                variant="outline"
                                onClick={() =>
                                  copyToClipboard(`<iframe 
  src="${publishedUrl}" 
  width="100%" 
  height="600" 
  frameBorder="0"
  title="Form"
/>`)
                                }
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-4">
        <div className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-medium">
          N
        </div>
      </div>
    </div>
  )
}
