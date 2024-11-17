declare module 'starkbank-ecdsa' {
  export class PrivateKey {
    constructor();
    publicKey(): PublicKey;
    toPem(): string;
    static fromPem(pem: string): PrivateKey;
    sign(message: string, privateKey: PrivateKey): Signature;
  }

  export class PublicKey {
    toPem(): string;
    static fromPem(pem: string): PublicKey;
    verify(message: string, signature: Signature, publicKey: PublicKey): boolean;
  }

  export class Signature {
    toBase64(): string;
    static fromBase64(base64: string): Signature;
    static fromDer(der: Buffer): Signature;
  }

  export class Ecdsa {
    static sign(message: string, privateKey: PrivateKey): Signature;
    static verify(message: string, signature: Signature, publicKey: PublicKey): boolean;
  }

  export namespace utils {
    export class File {
      static read(path: string, encoding?: string): string | Buffer;
    }
  }
}
