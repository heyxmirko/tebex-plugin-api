export class TebexError extends Error {
  override readonly name = "TebexError";

  readonly status: number;
  readonly code: number | undefined;
  readonly method: string;
  readonly path: string;
  readonly body: unknown;

  constructor(init: {
    message: string;
    status: number;
    code: number | undefined;
    method: string;
    path: string;
    body: unknown;
  }) {
    super(init.message);
    this.status = init.status;
    this.code = init.code;
    this.method = init.method;
    this.path = init.path;
    this.body = init.body;
  }
}
