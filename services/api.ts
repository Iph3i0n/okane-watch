import { IsQueries } from "$types/queries";
import { IsDateObject } from "$types/utility";
import Api from "@paulpopat/api-interface";
import {
  IsArray,
  IsObject,
  IsString,
  IsNumber,
  DoNotCare,
  Optional,
  IsBoolean,
} from "@paulpopat/safe-type";
import { IsCategory } from "../types/category";
import { IsPerson } from "../types/person";
import { IsTransaction } from "../types/transaction";
import { getCookie } from "cookies-next";
import { AuthTokenKey } from "$utils/constants";
import { GetAuth } from "$utils/cookies";

const ApiClient = Api(
  {
    Transactions: {
      GetMonth: {
        method: "GET",
        url: "/api/transactions",
        parameters: { from: IsString, to: IsString },
        returns: IsArray(IsTransaction),
      },
      Add: {
        method: "POST",
        url: "/api/transactions",
        body: IsObject({
          person: IsString,
          category: IsString,
          description: IsString,
          amount: IsNumber,
          when: IsDateObject,
        }),
        returns: IsTransaction,
      },
      Update: {
        method: "PUT",
        url: "/api/transactions/:id",
        parameters: { id: IsString },
        body: IsObject({
          person: IsString,
          category: IsString,
          description: IsString,
          amount: IsNumber,
          when: IsDateObject,
        }),
        returns: IsTransaction,
      },
      Delete: {
        method: "DELETE",
        url: "/api/transactions/:id",
        parameters: { id: IsString },
        returns: DoNotCare,
      },
    },
    People: {
      GetAll: {
        method: "GET",
        url: "/api/people",
        returns: IsArray(IsPerson),
      },
      Get: {
        method: "GET",
        url: "/api/people/:id",
        parameters: { id: IsString },
        returns: IsPerson,
      },
      Add: {
        method: "POST",
        url: "/api/people",
        body: IsObject({
          name: IsString,
          password: IsString,
          is_admin: IsBoolean,
        }),
        returns: IsPerson,
      },
      Update: {
        method: "PUT",
        url: "/api/people/:id",
        parameters: { id: IsString },
        body: IsObject({
          name: IsString,
          password: IsString,
          is_admin: IsBoolean,
        }),
        returns: IsPerson,
      },
      IsAdmin: {
        method: "GET",
        url: "/api/people/:id/is-admin",
        parameters: { id: IsString },
        returns: IsObject({ is_admin: IsBoolean }),
      },
      Login: {
        method: "GET",
        url: "/api/people/:name/auth-token",
        parameters: { name: IsString, password: IsString },
        returns: IsObject({ token: IsString }),
      },
    },
    Categories: {
      GetAll: {
        method: "GET",
        url: "/api/categories",
        returns: IsArray(IsCategory),
      },
      Get: {
        method: "GET",
        url: "/api/categories/:id",
        parameters: { id: IsString },
        returns: IsCategory,
      },
      Add: {
        method: "POST",
        url: "/api/categories",
        body: IsObject({ name: IsString, budget: IsNumber }),
        returns: IsCategory,
      },
      Update: {
        method: "PUT",
        url: "/api/categories/:id",
        parameters: { id: IsString },
        body: IsObject({ name: IsString, budget: IsNumber }),
        returns: IsCategory,
      },
      Spend: {
        method: "GET",
        url: "/api/categories/:id/spend",
        parameters: { id: IsString, from: IsString, to: IsString },
        returns: IsObject({ spend: IsNumber }),
      },
    },
    Query: {
      GetAll: {
        method: "GET",
        url: "/api/queries",
        returns: IsQueries,
      },
      Run: {
        method: "GET",
        url: "/api/queries/:slug",
        parameters: {
          slug: IsString,
          from_date: Optional(IsString),
          to_date: Optional(IsString),
          person: Optional(IsString),
          category: Optional(IsString),
        },
        returns: DoNotCare,
      },
    },
    AuthCheck: {
      method: "GET",
      url: "/api/permissions",
      returns: IsArray(IsString),
    },
    UiText: {
      method: "GET",
      url: "/api/uitext/:locale",
      parameters: { locale: IsString },
      returns: DoNotCare,
    },
  },
  {
    base: process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL,
    middleware: async (v) => {
      const cookie = GetAuth();
      if (cookie) {
        return {
          ...v,
          headers: {
            ...v.headers,
            Authorization: `Bearer ${cookie}`,
          },
        };
      }

      return v;
    },
  }
);

export default ApiClient;
