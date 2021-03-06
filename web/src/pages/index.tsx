import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { withApollo } from "../utils/withApollo";
import NextLink from "next/link";
import React from "react";
import { EditDeletePostButton } from "../components/EditDeletePostButton";
import { Layout } from "../components/Layout";
import { ShowMessage } from "../components/ShowMessage";
import { UpdootSection } from "../components/UpdootSection";
import { usePostsQuery } from "../generated/graphql";

const Index = () => {
  const { data, error, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 15,
      cursor: null as null | string,
    },
    notifyOnNetworkStatusChange: true,
  });

  if (!loading && !data) {
    return (
      <ShowMessage
        message={`You got no posts, query failed, please refresh and retry, error: ${
          error && error.message
        }`}
      />
    );
  }

  return (
    <Layout>
      {!data && loading ? (
        <ShowMessage />
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.filter(Boolean).map((p) => (
            <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
              <UpdootSection post={p} />
              <Box flex={1}>
                <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                  <Link>
                    <Heading fontSize="xl">{p.title}</Heading>
                  </Link>
                </NextLink>
                <Text>posted by {p.creator.username}</Text>
                <Flex>
                  <Text flex={1} mt={4}>
                    {p.textSnippet}
                  </Text>
                  <Box ml="auto">
                    <EditDeletePostButton id={p.id} creatorId={p.creator.id} />
                  </Box>
                </Flex>
              </Box>
            </Flex>
          ))}
        </Stack>
      )}
      {data && data.posts.hasMore && (
        <Flex>
          <Button
            onClick={() =>
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                },
              })
            }
            isLoading={loading}
            m="auto"
            my={8}
          >
            load more
          </Button>
        </Flex>
      )}
    </Layout>
  );
};

export default withApollo({ ssr: true })(Index);
