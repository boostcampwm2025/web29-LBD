'use client'

import { ServiceForm } from './service-form'
import { ServiceTabs } from './service-tabs'

import React, { useState } from 'react'

import { type IServiceMapper } from '@/components/aws-services/utils/serviceMapper'

interface ProblemFormContentProps {
  problemData: IServiceMapper[]
}

export function ProblemFormContent({ problemData }: ProblemFormContentProps) {
  const [currTask, setCurrTask] = useState(problemData[0].serviceTask)

  const uniqueTasks = React.useMemo(() => {
    return problemData.filter(
      (item, index, self) =>
        self.findIndex(
          (t) => t.serviceTask === item.serviceTask && t.label === item.label,
        ) === index,
    )
  }, [problemData])

  const handleTaskChange = (serviceTask: IServiceMapper['serviceTask']) => {
    setCurrTask(serviceTask)
  }

  return (
    <React.Fragment>
      {uniqueTasks.length > 1 && (
        <div className="m-0 flex w-full items-end">
          <ServiceTabs
            services={uniqueTasks}
            current={currTask}
            onChange={handleTaskChange}
          />
          <div className="m-0 flex-1 border-b" />
        </div>
      )}

      <ServiceForm problemData={problemData} currentTask={currTask} />
    </React.Fragment>
  )
}
