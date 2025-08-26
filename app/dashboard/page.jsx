"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Home, Settings, LogOut, ChevronLeft, ChevronRight, Plus, FileText } from "lucide-react"

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const router = useRouter()

  const handleNewForm = () => {
    router.push("/form-builder")
  }

  const handleLogout = () => {
    router.push("/")
  }

  const handleSettings = () => {
    router.push("/settings")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 bg-purple-600">
                    <AvatarFallback className="bg-purple-600 text-white font-medium">V</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Vikas</p>
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="h-8 w-8 p-0"
              >
                {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4">
            <nav className="space-y-2">
              <Button variant="ghost" className={`w-full justify-start ${sidebarCollapsed ? "px-2" : "px-3"}`}>
                <Home className="h-4 w-4" />
                {!sidebarCollapsed && <span className="ml-2">Home</span>}
              </Button>
            </nav>
          </div>

          {/* Bottom Navigation */}
          <div className="p-4 border-t border-gray-200">
            <div className="space-y-2">
              <Button
                variant="ghost"
                className={`w-full justify-start ${sidebarCollapsed ? "px-2" : "px-3"}`}
                onClick={handleSettings}
              >
                <Settings className="h-4 w-4" />
                {!sidebarCollapsed && <span className="ml-2">Settings</span>}
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 ${sidebarCollapsed ? "px-2" : "px-3"}`}
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                {!sidebarCollapsed && <span className="ml-2">Logout</span>}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Home</h1>
            <Button onClick={handleNewForm} className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white">
              <Plus className="h-4 w-4" />
              New form
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {/* Empty State */}
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No forms created yet</h2>
            <p className="text-gray-500 mb-6 max-w-md">
              You currently have not created any forms. Get started by building your first form to collect responses
              from your audience.
            </p>
            <Button onClick={handleNewForm} size="lg" className="bg-black hover:bg-gray-800 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Click here to start building your first form
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
