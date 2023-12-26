export class GetCredentialDTO {
  user: { email: string };
  accessToken: { type: string; token: string };
}
