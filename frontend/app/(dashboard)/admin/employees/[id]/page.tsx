import { EmployeeDetails } from "@/components/ui/employee-details/employee-details"

type EmployeeDetailsProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EmployeeDetailsPage({
  params,
}: EmployeeDetailsProps) {
  const { id } = await params

  return <EmployeeDetails employeeId={id} />
}
