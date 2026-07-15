import { useMutation ,useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "@/api/auth";
import { NewProfileInputType } from "@/schema/auth.schema";

export const UseUpdateUserProfile = (employeeId :string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn : (newProfileInput : NewProfileInputType) => {
            return updateUserProfile(newProfileInput)
        },
        onSettled : async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey : ["auth", "me"],
                }),
                queryClient.invalidateQueries({
                    queryKey : ["employee", `id:${employeeId}`],
                })
                
            ])
        }

    })
}