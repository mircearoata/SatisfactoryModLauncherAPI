import path from 'path';
import fs from 'fs';
import bindings from 'bindings';
import { downloadFile } from './utils';

const smlVersionNative = bindings('smlVersion');

export class SMLHandler {
  satisfactoryPath: string;
  constructor(satisfactoryPath: string) {
    this.satisfactoryPath = satisfactoryPath;
  }

  async getSMLVersion(): Promise<string | undefined> {
    return smlVersionNative.getSMLVersion(this.satisfactoryPath);
  }

  async installSML(version: string): Promise<void> {
    if (!await this.getSMLVersion()) {
      const smlDownloadLink = await SMLHandler.getSMLDownloadLink(version);
      await downloadFile(smlDownloadLink,
        path.join(this.satisfactoryPath, SMLHandler.getSMLRelativePath()));
    }
  }

  async uninstallSML(): Promise<void> {
    fs.unlinkSync(path.join(this.satisfactoryPath, SMLHandler.getSMLRelativePath()));
  }

  static getSMLRelativePath(): string {
    return path.join('FactoryGame', 'Binaries', 'Win64', 'xinput1_3.dll');
    // return path.join('loaders', 'UE4-SML-Win64-Shipping.dll');
    // bootstrapper?
    // can they be merged into one dll?
    // SML is the only loader and it is a proxy to the bootstrapper for the dll mods anyway
    // or Coffee Stain will build modular so it won't be needed
  }

  static async getSMLDownloadLink(version: string): Promise<string> {
    // if (semver.satisfies(version, '<2.0.0')) {
    return `https://github.com/satisfactorymodding/SatisfactoryModLoader/releases/download/${version}/xinput1_3.dll`;
    // }
    // throw new Error('Not implemented');
  }
}