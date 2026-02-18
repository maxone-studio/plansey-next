import { DefaultSession, DefaultJWT } from "next-auth";
import { DefaultAccount } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      defaultAccount: DefaultAccount | null;
      isFirstLogin: boolean;
      plannerId: number | null;
      vendorId: number | null;
      storytellerId: number | null;
    } & DefaultSession["user"];
  }

  interface User {
    defaultAccount?: DefaultAccount | null;
    isFirstLogin?: boolean;
    plannerId?: number | null;
    vendorId?: number | null;
    storytellerId?: number | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    defaultAccount?: DefaultAccount | null;
    isFirstLogin?: boolean;
    plannerId?: number | null;
    vendorId?: number | null;
    storytellerId?: number | null;
  }
}
