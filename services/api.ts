import Api from "@paulpopat/api-interface";
import {
  IsArray,
  IsObject,
  IsString,
  IsNumber,
  DoNotCare,
} from "@paulpopat/safe-type";
import { IsCategory } from "../types/category";
import { IsPerson } from "../types/person";
import { IsTransaction } from "../types/transaction";

const ApiClient = Api(
  {
    Transactions: {
      GetMonth: {
        method: "GET",
        url: "/api/transactions",
        parameters: { month: IsString, year: IsString },
        returns: IsArray(IsTransaction),
      },
      Add: {
        method: "POST",
        url: "/api/transactions",
        body: IsObject({
          user: IsString,
          category: IsString,
          description: IsString,
          amount: IsNumber,
          when: IsObject({ day: IsNumber, month: IsNumber, year: IsNumber }),
        }),
        returns: IsTransaction,
      },
      Update: {
        method: "PUT",
        url: "/api/transactions/:id",
        parameters: { id: IsString },
        body: IsObject({
          user: IsString,
          category: IsString,
          description: IsString,
          amount: IsNumber,
          when: IsObject({ day: IsNumber, month: IsNumber, year: IsNumber }),
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
        body: IsObject({ name: IsString }),
        returns: IsPerson,
      },
      Update: {
        method: "PUT",
        url: "/api/people/:id",
        parameters: { id: IsString },
        body: IsObject({ name: IsString }),
        returns: IsPerson,
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
        parameters: { id: IsString, month: IsString, year: IsString },
        returns: IsObject({ spend: IsNumber }),
      },
    },
  },
  {
    base: process.env.NEXT_PUBLIC_SITE_URL,
    middleware: async (v) => {
      console.log(`Sending ${v.method} to ${v.url}`);
      return v;
    },
  }
);

export default ApiClient;
