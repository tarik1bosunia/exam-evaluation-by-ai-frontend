// export const handleAuthError = (error: any) => {
//   if (error.status === 400) {
//     return {
//       message: 'Validation Error',
//       fieldErrors: error.data.errors,
//     };
//   }
//   if (error.status === 404) {
//     return {
//       message: 'Invalid Credentials',
//       fieldErrors: error.data.errors,
//     };
//   }
//   return {
//     message: 'Login Failed',
//   };
// };