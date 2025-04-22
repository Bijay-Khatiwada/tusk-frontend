export function decodeJWT(token: string): { userId: string; role: string } | null {
  try {
    const base64Payload = token.split('.')[1];
    const decoded = JSON.parse(atob(base64Payload));
    return {
      userId: decoded.userId,
      role: decoded.role,
    };
  } catch (err) {
    console.error('Failed to decode token:', err);
    return null;
  }
}
