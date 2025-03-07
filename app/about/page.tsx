'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AboutPage() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            About Our Project
          </h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-600 mb-4">
              Welcome to our Next.js project! This page demonstrates how routing works
              in Next.js 13+ using the App Router. (this project uses Next.js 14)
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <h2 className="text-xl font-semibold text-blue-700 mb-2">
                How Routing Works
              </h2>
              <p className="text-blue-600">
                In Next.js, the file system is used for routing. This page exists
                because we created <code>app/about/page.tsx</code>. The URL path
                directly corresponds to the folder structure in the app directory.
              </p>
            </div>

            <button
              onClick={() => setExpanded(!expanded)}
              className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors mb-4"
            >
              {expanded ? 'Show Less' : 'Learn More About Next.js Features'}
            </button>

            {expanded && (
              <div className="mt-4 space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Key Features:
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Server and Client Components</li>
                  <li>File-system Based Routing</li>
                  <li>Built-in CSS Support</li>
                  <li>API Routes</li>
                  <li>Automatic Code Splitting</li>
                </ul>
              </div>
            )}

            <div className="mt-8 flex space-x-4">
              <Link 
                href="/"
                className="inline-block bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Back to Home
              </Link>
              <Link 
                href="/settings"
                className="inline-block bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                Go to Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
