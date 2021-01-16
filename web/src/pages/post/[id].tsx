import { Box, Heading } from "@chakra-ui/react";
import React from "react";
import { EditDeletePostButton } from "../../components/EditDeletePostButton";
import { Layout } from "../../components/Layout";
import { usePostQuery } from "../../generated/graphql";
import { getErrorMessageForPost } from "../../utils/getErrorMessageForPost";
import { useGetIntId } from "../../utils/useGetIntId";
import { withApollo } from "../../utils/withApollo";

interface PostProps {}

export const Post: React.FC<PostProps> = ({}) => {
  const intId = useGetIntId();
  const { data, loading, error } = usePostQuery({
    skip: intId === -1,
    variables: {
      id: intId,
    },
  });

  const errorMessage = getErrorMessageForPost({
    data,
    fetching: loading,
    error,
  });

  if (errorMessage) {
    return <Layout>{errorMessage}</Layout>;
  }

  return (
    <Layout>
      <Heading>{data?.post?.title}</Heading>
      <Box mb={4}>{data?.post?.text}</Box>
      <EditDeletePostButton
        id={data!.post!.id}
        creatorId={data!.post!.creator.id}
      />
    </Layout>
  );
};

export default withApollo({ ssr: true })(Post);
