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

export default Api(
  {
    Transactions: {
      GetMonth: {
        method: "GET",
        url: "/transactions",
        parameters: { month: IsString, year: IsString },
        returns: IsArray(IsTransaction),
      },
      Add: {
        method: "POST",
        url: "/transactions",
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
        url: "/transactions/:id",
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
        url: "/transactions/:id",
        parameters: { id: IsString },
        returns: DoNotCare,
      },
    },
    People: {
      GetAll: {
        method: "GET",
        url: "/people",
        returns: IsArray(IsPerson),
      },
      Add: {
        method: "POST",
        url: "/people",
        body: IsObject({ name: IsString }),
        returns: IsPerson,
      },
      Update: {
        method: "PUT",
        url: "/people/:id",
        parameters: { id: IsString },
        body: IsObject({ name: IsString }),
        returns: IsPerson,
      },
    },
    Categories: {
      GetAll: {
        method: "GET",
        url: "/categories",
        returns: IsArray(IsCategory),
      },
      Add: {
        method: "POST",
        url: "/categories",
        body: IsObject({ name: IsString, budget: IsNumber }),
        returns: IsCategory,
      },
      Update: {
        method: "PUT",
        url: "/categories/:id",
        parameters: { id: IsString },
        body: IsObject({ name: IsString, budget: IsNumber }),
        returns: IsCategory,
      },
      Spend: {
        method: "GET",
        url: "/categories/:id/spend",
        parameters: { id: IsString, month: IsString, year: IsString },
        returns: IsNumber,
      },
    },
  },
  { base: "/api" }
);
