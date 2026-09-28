export const PLATFORM_FEE_RATE = 0.1
export const calculatePlatformSplit = (amount) =>{
    const safeAmount = Number.isFinite(amount) ? Math.max(0, Math.round(amount)) : 0
}