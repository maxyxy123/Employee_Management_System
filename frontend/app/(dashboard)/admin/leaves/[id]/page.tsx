import { LeaveDetails } from "@/components/ui/leaves-detail/leaves-details"

type LeaveDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function LeaveDetailPage({
  params,
}: LeaveDetailPageProps) {
  
  const { id } = await params

  return <LeaveDetails leaveId={id} />
}
