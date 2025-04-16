import fs from 'fs';
import path from 'path';
import child_process from 'child_process';

export function ensureCertificate(certificateName, baseFolder) {
  const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
  const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

  if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    if (
      0 !==
      child_process.spawnSync(
        'dotnet',
        ['dev-certs', 'https', '--export-path', certFilePath, '--format', 'Pem', '--no-password'],
        { stdio: 'inherit' }
      ).status
    ) {
      throw new Error('Could not create certificate.');
    }
  }

  return { certFilePath, keyFilePath };
}
