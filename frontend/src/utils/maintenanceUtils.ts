export const checkServerHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch('http://54.72.59.0/health');
    return response.ok;
  } catch (err) {
    return false;
  }
};
