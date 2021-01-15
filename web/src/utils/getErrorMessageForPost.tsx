import { ApolloError } from "@apollo/client";
import React from "react";
import { ShowMessage } from "../components/ShowMessage";

interface getErrorMessageForPostParams {
  fetching: boolean;
  error?: ApolloError;
  data: any;
}

export const getErrorMessageForPost = ({
  fetching,
  error,
  data = { post: null },
}: getErrorMessageForPostParams) => {
  if (fetching) {
    return <ShowMessage />;
  }

  if (error) {
    return <ShowMessage message={error.message} />;
  }

  if (!data?.post) {
    return <ShowMessage message="Could not find post" />;
  }

  return null;
};
