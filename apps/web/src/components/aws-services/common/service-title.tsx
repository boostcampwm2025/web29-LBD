import { Button } from '@/components/ui/button'

interface ServiceTitleProps {
  title: string
  description: string
  button?: {
    isDisabled: boolean
    buttonText: string
  }
}

export const ServiceTitle = ({
  title,
  description,
  button,
}: ServiceTitleProps) => {
  return (
    <div className="space-y-1">
      <h2 className="text-[23px] font-bold">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
      {button && (
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={button.isDisabled}
            className="disabled:cursor-not-allowed"
          >
            {button.buttonText}
          </Button>
        </div>
      )}
    </div>
  )
}
