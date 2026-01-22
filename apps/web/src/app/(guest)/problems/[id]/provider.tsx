// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { createContext, useContext, useEffect, useState } from 'react'
// import { useForm } from 'react-hook-form'

// import { S3BucketFormData } from '@/types/aws-services/s3/bucket-create'

// interface ProblemDetailContextProps {
//   fieldState: any
//   setFieldState: React.Dispatch<React.SetStateAction<any>>
//   submitConfigs: () => Promise<void>
// }

// type FormControlProps = ReturnType<typeof useForm<S3BucketFormData>>

// const ProblemDetailContext = createContext<
//   FormControlProps | ProblemDetailContextProps | undefined
// >(undefined)

// interface ProblemDetailProviderProps {
//   children: React.ReactNode
// }

// const defaultValues: S3BucketFormData = {
//   general: { bucketName: '', region: 'ap-northeast-2' },
//   ownership: { aclEnabled: 'disabled' },
//   blockPublicAccess: {
//     blockAll: true,
//     blockPublicAcls: true,
//     ignorePublicAcls: true,
//     blockPublicPolicy: true,
//     restrictPublicBuckets: true,
//   },
//   versioning: { enabled: false },
//   encryption: { type: 'sse-s3' },
//   advancedSettings: { objectLockEnabled: false },
//   tags: [],
// }

// export const ProblemDetailProvider = ({
//   children,
// }: ProblemDetailProviderProps) => {
//   // const [fieldState, setFieldState] = useState(null)
//   // const [diagramState, setDiagramState] = useState(null) // for AwsDiagram
//   // const [feedback, setFeedback] = useState(null) // for FeedbackSection
//   // const createService = (service, diagram, field) => {setFieldState((prev) => {...prev,}) , setDiagramState(...prev, )}
//   // 렌더러(폼)
//   // Ec2 렌더러 필드를 작성. name 등 필드 입력 -> 생성 버튼 -> fieldState에 추가.
//   // submit 그걸 눌러야 지금까지 작성한 모든 서비스 구성이 한번에 가는거죠.
//   // useEffect(() => {
//   //   // 서비스 생성(렌더러 폼에서)
//   //   //
//   //   console.log('default value update')
//   // }, [])

//   const s3BucketCreateFormControl = useForm<S3BucketFormData>({
//     defaultValues,
//   })

//   // const submitConfigs = async () => {
//   //   // for <SubmitButton />
//   //   const feedback = await submitProblemSolution(fieldState)
//   //   setFeedback(feedback)
//   // }

//   return (
//     <ProblemDetailContext.Provider value={s3BucketCreateFormControl}>
//       {children}
//     </ProblemDetailContext.Provider>
//   )
// }

// export const useProblemDetailPage = () => {
//   const context = useContext(ProblemDetailContext)

//   if (!context) {
//     throw new Error(
//       'useProblemDetailPage must be used within a ProblemDetailProvider',
//     )
//   }

//   return context
// }

// function FormPage() {
//   const { control, config } = useContext('s3BucketCreateControl')

//   return (
//     <div>
//       <form>
//         <Controller control={control} />
//       </form>
//     </div>
//   )
// }

// function ComponentPage() {
//   const { watch } = useContext()

//   useEffect(() => {
//     const subscription = watch((value, { name }) => {
//       if (name === 'general.bucketName') {
//         setNodes((currentNodes) =>
//           currentNodes.map((node) =>
//             node.id === 's3-bucket'
//               ? {
//                   ...node,
//                   data: {
//                     ...node.data,
//                     label: value.general?.bucketName || 'S3 Bucket',
//                   },
//                 }
//               : node,
//           ),
//         )
//       }
//     })
//     return () => subscription.unsubscribe()
//   }, [watch, setNodes])
// }
