

export const checkMethod = (method: string, required: string[]) => {
    return required.filter(r => r.toUpperCase() === method.toUpperCase()).length > 0
}