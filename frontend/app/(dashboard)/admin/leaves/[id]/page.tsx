type LeaveDetailsProps = {
  params: Promise<{
    id: string
  }>
}

export default async function LeaveDetailPage({ params }: LeaveDetailsProps) {
  const {id} =  await params

  return <div key={id}>this is leave with id {id}</div>
}
