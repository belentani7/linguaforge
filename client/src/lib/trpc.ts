import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../../server/routers";

/** Cliente tRPC tipado contra el router real del servidor (server/routers.ts). */
export const trpc = createTRPCReact<AppRouter>();
