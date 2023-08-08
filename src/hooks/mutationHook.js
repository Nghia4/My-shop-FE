import { useMutation } from '@tanstack/react-query'

export const useMutationHook = (fnc) => {
    const mutation = useMutation({
        mutationFn: fnc
    })
    return mutation
}

