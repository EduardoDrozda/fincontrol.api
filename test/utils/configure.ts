import { DockerComposeEnvironment } from 'testcontainers';

jest.useFakeTimers();

export async function configureContainer() {
  const composeFilePath = '';
  const composeFile = 'docker-compose.yml';

  return new DockerComposeEnvironment(composeFilePath, composeFile);
}
