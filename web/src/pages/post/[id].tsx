import { Heading } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { Layout } from "../../components/Layout";
import { ShowMessage } from "../../components/ShowMessage";
import { usePostQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";

interface PostProps {}

export const Post: React.FC<PostProps> = ({}) => {
  const router = useRouter();
  const id = router.query.id;
  const intId = typeof id === "string" ? parseInt(id) : -1;

  const [{ data, fetching, error }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });

  if (fetching) {
    return (
      <Layout>
        <ShowMessage />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ShowMessage message={error.message} />
      </Layout>
    );
  }

  if (!data?.post) {
    return (
      <Layout>
        <ShowMessage message="Could not find post" />
      </Layout>
    );
  }

  return (
    <Layout>
      <Heading>{data?.post?.title}</Heading>
      {data?.post?.text}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
