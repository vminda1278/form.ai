"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Trash2, User, Bell, Shield } from "lucide-react"

export default function Settings() {
  const router = useRouter()
  const [profile, setProfile] = useState({
    firstName: "Vikas",
    lastName: "",
    email: "vikas@example.com",
    bio: "Form builder enthusiast",
    avatar: "/placeholder.svg?height=80&width=80",
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    formAnalytics: true,
    weeklyReports: false,
    marketingEmails: false,
  })

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    sessionTimeout: "24",
  })

  const handleSaveProfile = () => {
    // Save profile logic here
    alert("Profile saved successfully!")
  }

  const handleSaveNotifications = () => {
    // Save notifications logic here
    alert("Notification preferences saved!")
  }

  const handleSaveSecurity = () => {
    // Save security settings logic here
    alert("Security settings saved!")
  }

  const handleDeleteAccount = () => {
    // Delete account logic here
    alert("Account deletion initiated. You will receive a confirmation email.")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Profile Settings */}
        <Card className="bg-white shadow-sm border-gray-200">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-700" />
              <CardTitle className="text-lg font-semibold text-gray-900">Profile Settings</CardTitle>
            </div>
            <CardDescription className="text-gray-600">Manage your account information and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-900">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  className="border-gray-300 rounded-lg focus:border-gray-400 focus:ring-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-900">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  placeholder="Enter last name"
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  className="border-gray-300 rounded-lg focus:border-gray-400 focus:ring-0 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-900">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="border-gray-300 rounded-lg focus:border-gray-400 focus:ring-0"
              />
            </div>

            <Button onClick={handleSaveProfile} className="bg-black hover:bg-gray-800 text-white rounded-lg px-6 py-2">
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-white shadow-sm border-gray-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-gray-700" />
              <CardTitle className="text-lg font-semibold text-gray-900">Notifications</CardTitle>
            </div>
            <CardDescription className="text-gray-600">Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-900">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive email notifications for form responses</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                  className="data-[state=checked]:bg-black data-[state=unchecked]:bg-gray-200 border-0"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-900">Form Analytics</Label>
                  <p className="text-sm text-gray-500">Enable analytics tracking for your forms</p>
                </div>
                <Switch
                  checked={notifications.formAnalytics}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, formAnalytics: checked })}
                  className="data-[state=checked]:bg-black data-[state=unchecked]:bg-gray-200 border-0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-white shadow-sm border-gray-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-gray-700" />
              <CardTitle className="text-lg font-semibold text-gray-900">Security</CardTitle>
            </div>
            <CardDescription className="text-gray-600">Manage your account security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-900">Connected Accounts</Label>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                    <span className="text-white font-medium text-sm">G</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Google</p>
                    <p className="text-sm text-gray-500">vikas@example.com</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                >
                  Disconnect
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-white shadow-sm border-gray-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              <CardTitle className="text-lg font-semibold text-red-600">Danger Zone</CardTitle>
            </div>
            <CardDescription className="text-gray-600">
              Irreversible actions that will affect your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">Delete Account</h4>
              <p className="text-sm text-red-600 mb-4">
                Once you delete your account, there is no going back. All your forms and data will be permanently
                deleted.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="bg-red-600 hover:bg-red-700 text-white rounded-lg">Delete Account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account and remove all your data
                      from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
