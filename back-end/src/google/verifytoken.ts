import fs from 'fs';
import jwt from 'jsonwebtoken';

export function verifyAndDeleteExpiredToken(tokenFilePath: string): void {
  // Read the token from the file
  const tokenData = fs.readFileSync(tokenFilePath, 'utf8');
  const token = JSON.parse(tokenData);

  // Verify the token and check if it has expired
  jwt.verify(token.refresh_token, token.client_secret, (err: any, decodedToken: any) => {
    if (err) {
      // Token verification failed, delete the token file
      fs.unlinkSync(tokenFilePath);
      console.log('Token has expired and has been deleted.');
    } else {
      // Token is valid and has not expired
      console.log('Token is valid and has not expired.');
      // Use the decodedToken here for further processing or access its properties
      console.log('Decoded token:', decodedToken);
    }
  });
}

// Example usage
