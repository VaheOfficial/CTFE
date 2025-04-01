"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#0f0f0f] group-[.toaster]:text-[#e0e0e0] group-[.toaster]:border-[#1a1a1a] group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-[#a3a3a3]",
          actionButton:
            "group-[.toast]:bg-[#ff6b00] group-[.toast]:text-[#050505]",
          cancelButton:
            "group-[.toast]:bg-[#1a1a1a] group-[.toast]:text-[#a3a3a3]",
          error: 
            "group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-[#1a0a0a] group-[.toaster]:to-[#2a0a0a] group-[.toaster]:border-l-2 group-[.toaster]:border-l-[#ff3333]",
          success:
            "group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-[#0a1a0a] group-[.toaster]:to-[#0a2a0a] group-[.toaster]:border-l-2 group-[.toaster]:border-l-[#00e5c7]",
        },
        duration: 4000,
      }}
      {...props}
    />
  )
}

export { Toaster }
