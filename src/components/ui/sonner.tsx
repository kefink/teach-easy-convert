import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

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
            "group toast group-[.toaster]:bg-primary-dark group-[.toaster]:text-text-white group-[.toaster]:border-secondary-dark group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-text-gray",
          actionButton:
            "group-[.toast]:bg-accent-gold group-[.toast]:text-primary-dark",
          cancelButton:
            "group-[.toast]:bg-secondary-dark group-[.toast]:text-text-white",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
