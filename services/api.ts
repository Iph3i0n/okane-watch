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
import { IsCategory, IsSummaryCategory } from "../types/category";
import { IsPerson, IsUser } from "../types/person";
import { IsCompleteTransaction } from "../types/transaction";
import { GetAuth } from "$utils/cookies";

const ApiClient = Api(
  {
    Transactions: {
      GetList: {
        method: "GET",
        url: "/api/transactions",
        parameters: {
          from: IsString,
          to: IsString,
          person: Optional(IsString),
          category: Optional(IsString),
          skip: IsString,
          take: IsString,
        },
        returns: IsObject({
          total: IsNumber,
          data: IsArray(IsCompleteTransaction),
        }),
      },
      Add: {
        method: "POST",
        url: "/api/transactions",
        body: IsObject({
          category: IsString,
          description: IsString,
          amount: IsNumber,
          when: IsDateObject,
        }),
        returns: IsCompleteTransaction,
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
        returns: IsCompleteTransaction,
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
      GetOptions: {
        method: "GET",
        url: "/api/categories/options",
        returns: IsArray(IsCategory),
      },
      GetOverview: {
        method: "GET",
        url: "/api/categories/overview",
        parameters: { from: IsString, to: IsString },
        returns: IsArray(IsSummaryCategory),
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
      url: "/api/current-user",
      returns: IsUser,
    },
    UiText: {
      method: "GET",
      url: "/api/uitext/:locale",
      parameters: { locale: IsString },
      returns: IsObject({
        actual: IsString,
        data: DoNotCare,
      }),
    },
  },
  {
    base: process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL,
    on_request: async (v) => {
      try {
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
      } catch (err) {
        console.error(err);
        return v;
      }

      return v;
    },
    on_error: (err, url) => {
      return err;
    },
  }
);

export default ApiClient;
