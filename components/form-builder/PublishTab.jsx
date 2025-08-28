"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Share, Eye } from "lucide-react"

export function PublishTab({ 
  isPublished, 
  publishedUrl, 
  handlePublish, 
  copyToClipboard 
}) {
  return (
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
  )
}
