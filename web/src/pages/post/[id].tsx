import { Heading } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { Layout } from "../../components/Layout";
import { usePostQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { getErrorMessageForPost } from "../../utils/getErrorMessageForPost";
import { useGetIntId } from "../../utils/useGetIntId";

interface PostProps {}

export const Post: React.FC<PostProps> = ({}) => {
  const intId = useGetIntId();
  const [{ data, fetching, error }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });

  const errorMessage = getErrorMessageForPost({
    data,
    fetching,
    error,
  });

  if (errorMessage) {
    return <Layout>{errorMessage}</Layout>;
  }

  return (
    <Layout>
      <Heading>{data?.post?.title}</Heading>
      {data?.post?.text}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
