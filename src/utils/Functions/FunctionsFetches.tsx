export const handleResponse = (
  code: number,
  setIsAPIAvailable: (b: boolean) => void,
  errorCallback: () => void,
  successCallback: () => any
) => {
  switch (code) {
    case 500:
        setIsAPIAvailable(false);
        break;
    case 400:
        errorCallback();
        break;
    case 200:
        successCallback();
        break;
    default:
      break;
  }
};
