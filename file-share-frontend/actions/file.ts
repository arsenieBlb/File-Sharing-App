"use server";

import { withActionHandler } from "@/lib/api/actionHandler";
import { GlobalApiCall } from "@/lib/api/client";

const API_BASE_URL = process.env.API_BASE_URL;

export const send_file_list = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  return withActionHandler(async () => {
    const response = await GlobalApiCall({
      url: `${API_BASE_URL}/list/send?page=${page}&limit=${limit}`,
      options: {
        method: "get",
        cache: "no-store",
      },
    });

    return response;
  });
};

export const receive_file_list = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  return withActionHandler(async () => {
    const response = await GlobalApiCall({
      url: `${API_BASE_URL}/list/receive?page=${page}&limit=${limit}`,
      options: {
        method: "get",
        cache: "no-store",
      },
    });

    return response;
  });
};

export const searchEmail = async (query: string) => {
  return withActionHandler(async () => {
    const response = await GlobalApiCall({
      url: `${API_BASE_URL}/users/search-emails?query=${query}`,
      options: {
        method: "get",
        cache: "no-store",
      },
    });

    return response;
  });
};
