export const refreshToken = async (oldToken: string): Promise<string | null> => {
  try {
    const response = await fetch('http://127.0.0.1:5001/api/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ token: oldToken }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if (response.ok && data.token) {
      return data.token;
    } else {
      console.error('Failed to refresh token:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};
