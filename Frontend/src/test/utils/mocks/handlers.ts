import { rest } from "msw";

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

export const handlers = [
  rest.get(`${baseUrl}/code`, (_, res, ctx) => {
    return res(ctx.json("test-code"));
  }),

  rest.post(`${baseUrl}/validate`, async (req, res, ctx) => {
    const { code, email } = await req.json<any>();

    if (code === "invalid" || email === "error@mail.com")
      return res(ctx.json(false));
    if (code === "valid") return res(ctx.json(true));
    return res(ctx.status(402), ctx.json("params not found"));
  }),
];
