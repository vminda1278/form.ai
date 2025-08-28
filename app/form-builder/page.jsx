"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BuildTab } from "@/components/form-builder/BuildTab"
import { PreviewTab } from "@/components/form-builder/PreviewTab"
import { PublishTab } from "@/components/form-builder/PublishTab"
import { ArrowLeft } from "lucide-react"

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
    //setFormComponents([...formComponents, newComponent])
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
          <BuildTab
            componentsCollapsed={componentsCollapsed}
            setComponentsCollapsed={setComponentsCollapsed}
            propertiesCollapsed={propertiesCollapsed}
            setPropertiesCollapsed={setPropertiesCollapsed}
            formComponents={formComponents}
            selectedComponent={selectedComponent}
            setSelectedComponent={setSelectedComponent}
            addComponent={addComponent}
            updateComponentProperty={updateComponentProperty}
            removeComponent={removeComponent}
            renderComponent={renderComponent}
          />
        )}

        {activeTab === "preview" && (
          <PreviewTab
            formComponents={formComponents}
            renderComponent={renderComponent}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "publish" && (
          <PublishTab
            isPublished={isPublished}
            publishedUrl={publishedUrl}
            handlePublish={handlePublish}
            copyToClipboard={copyToClipboard}
          />
        )}
      </div>

    </div>
  )
}
