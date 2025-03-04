"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"

/**
 * Theme Provider Component
 * 
 * Wraps the application with next-themes provider for dark/light mode support.
 * This is a client component that handles theme switching and persistence.
 * 
 * @param props - Standard next-themes provider props
 * @param props.children - Child components to be wrapped
 * @returns Theme provider component with children
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
} 