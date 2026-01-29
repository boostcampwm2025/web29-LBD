import { IServiceMapper } from '@/components/aws-services/utils/serviceMapper'
import { cn } from '@/lib/utils'

export const ServiceTabs = ({
  services,
  current,
  onChange,
}: {
  services: IServiceMapper[]
  current: IServiceMapper['serviceName']
  onChange: (name: IServiceMapper['serviceName']) => void
}) => {
  return (
    <div className="mb-0 flex w-full items-center justify-between">
      {services.map((service, idx) => (
        <span
          key={service.serviceName + idx}
          className={cn(
            'w-full cursor-pointer rounded-t-lg border py-1 text-center text-base font-semibold select-none',
            current === service.serviceName
              ? 'bg-background border-b-0'
              : 'bg-muted border-b',
          )}
          onClick={() => onChange(service.serviceName)}
        >
          {service.serviceName}
        </span>
      ))}
    </div>
  )
}
