import { exec } from "child_process";

export function execAsync(cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(stderr?.toString() || error.message);
      } else {
        resolve(stdout);
      }
    });
  });
}
