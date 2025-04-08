import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  triggerText?: string;
}

export function GoogleMapsSetupInstructions({ triggerText = "How to fix Google Maps" }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">{triggerText}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">How to fix Google Maps API key restrictions</DialogTitle>
          <DialogDescription>
            Follow these steps to authorize the domain for your Google Maps API key
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          <div className="rounded-lg border border-amber-100 dark:border-amber-800/30 overflow-hidden">
            <div className="bg-amber-50/50 dark:bg-amber-900/20 px-4 py-3 border-b border-amber-100 dark:border-amber-800/30">
              <h3 className="font-medium text-amber-800 dark:text-amber-300">Error Explanation</h3>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800">
              <p className="text-gray-700 dark:text-gray-300 mb-3">The error <code className="text-red-500 dark:text-red-400 font-mono bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded">RefererNotAllowedMapError</code> occurs when your Google Maps API key is restricted to specific domains, but your current domain is not on the allowed list.</p>
              <p className="text-gray-700 dark:text-gray-300">In this case, you need to add <code className="font-mono bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded">https://sumanrao.databutton.app</code> to your API key's allowed domains.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Steps to fix the issue:</h3>
            
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2 flex-shrink-0">
                    <span className="text-xs font-bold">1</span>
                  </div>
                  <h4 className="font-medium">Go to Google Cloud Console</h4>
                </div>
                <div className="p-4 bg-white dark:bg-gray-900">
                  <p className="text-gray-700 dark:text-gray-300 mb-3">Access the Google Cloud Console and navigate to your project.</p>
                  <a 
                    href="https://console.cloud.google.com/google/maps-apis/credentials" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80"
                  >
                    <span>Open Google Cloud Console</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 17L17 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 7H17V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2 flex-shrink-0">
                    <span className="text-xs font-bold">2</span>
                  </div>
                  <h4 className="font-medium">Find your Maps API key</h4>
                </div>
                <div className="p-4 bg-white dark:bg-gray-900">
                  <p className="text-gray-700 dark:text-gray-300">In the credentials section, find the API key used for your maps integration.</p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2 flex-shrink-0">
                    <span className="text-xs font-bold">3</span>
                  </div>
                  <h4 className="font-medium">Edit API key restrictions</h4>
                </div>
                <div className="p-4 bg-white dark:bg-gray-900">
                  <p className="text-gray-700 dark:text-gray-300 mb-3">Click on the API key and navigate to the "Application restrictions" section.</p>
                  <p className="text-gray-700 dark:text-gray-300">If "HTTP referrers" is selected, you need to add your domain to the list.</p>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2 flex-shrink-0">
                    <span className="text-xs font-bold">4</span>
                  </div>
                  <h4 className="font-medium">Add your domain</h4>
                </div>
                <div className="p-4 bg-white dark:bg-gray-900">
                  <p className="text-gray-700 dark:text-gray-300 mb-3">Add the following domain pattern to the list of allowed HTTP referrers:</p>
                  <div className="mb-3">
                    <code className="bg-gray-100 dark:bg-gray-800 p-2 rounded block font-mono text-sm overflow-x-auto">
                      https://sumanrao.databutton.app/*
                    </code>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">The wildcard (*) at the end allows access from all pages on your domain.</p>
                </div>
              </div>
              
              {/* Step 5 */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2 flex-shrink-0">
                    <span className="text-xs font-bold">5</span>
                  </div>
                  <h4 className="font-medium">Save changes and test</h4>
                </div>
                <div className="p-4 bg-white dark:bg-gray-900">
                  <p className="text-gray-700 dark:text-gray-300 mb-3">Save your changes and wait a few minutes for them to propagate.</p>
                  <p className="text-gray-700 dark:text-gray-300">Then reload your app to verify that Google Maps now loads correctly.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-medium mb-2">Additional Help</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">If you continue to experience issues after updating your API key restrictions, consider:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              <li>Verifying that you're updating the correct API key</li>
              <li>Checking if the API key has the Maps JavaScript API enabled</li>
              <li>Ensuring you've waited long enough for changes to propagate (can take 5-10 minutes)</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
