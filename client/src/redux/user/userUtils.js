
export function generateSuccessMessage(text, mfor) {
   return { type: 'success', text: text, for: mfor }
}
export function generateErrorMessage(text, mfor) {
   return { type: 'error', text: text, for: mfor }
}