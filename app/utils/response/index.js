export const defaultResponseModel = (successful, message, data) => {
  let status = 'Failure!';

  if (successful) {
    status = 'Success!'
  }

  if (Array.isArray(data) || typeof data === 'object') {
    return {
      status: status,
      message: message,
      data:  data
    }
  } else
    return {
      status: status,
      message: message,
      data: { data }
    }
};
