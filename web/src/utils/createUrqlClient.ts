import { cacheExchange, Resolver, Cache } from "@urql/exchange-graphcache";
import Router from "next/router";
import {
  dedupExchange,
  Exchange,
  fetchExchange,
  gql,
  stringifyVariables,
} from "urql";
import { pipe, tap } from "wonka";
import {
  DeletePostMutationVariables,
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
  VoteMutationVariables,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import { isServerSide } from "./isServerSide";

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error) {
        if (error.message.includes("not authenticated")) {
          Router.replace("/login");
        }
      }
    })
  );
};

export const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInCache = cache.resolve(
      cache.resolveFieldByKey(entityKey, fieldKey) as string,
      "post"
    );
    info.partial = !isItInCache;
    let hasMore = true;

    const result: string[] = [];
    fieldInfos.forEach((fi) => {
      const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, "posts") as string[];
      const _hasMore = cache.resolve(key, "hasMore");

      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }

      result.push(...data);
    });

    return {
      __typename: "PaginatedPosts",
      hasMore,
      posts: result,
    };
  };
};

function invalidateAllPost(cache: Cache) {
  const allFields = cache.inspectFields("Query");
  const fieldInfos = allFields.filter((info) => info.fieldName === "posts");

  fieldInfos.forEach((fi) => {
    cache.invalidate("Query", "posts", fi.arguments || {});
  });
}

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie;
  if (isServerSide()) {
    cookie = ctx?.req?.headers?.cookie;
  }

  return {
    url: process.env.NEXT_PUBLIC_API_URL,
    fetchOptions: {
      credentials: "include" as const,
      headers: cookie ? { cookie } : undefined,
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        keys: {
          PaginatedPosts: () => null,
        },
        resolvers: {
          Query: {
            posts: cursorPagination(),
          },
        },
        updates: {
          Mutation: {
            deletePost: (_result, args, cache, _info) => {
              cache.invalidate({
                __typename: "Post",
                id: (args as DeletePostMutationVariables).id,
              });
            },
            vote: (_result, args, cache, _info) => {
              const { postId, value } = args as VoteMutationVariables;
              const data = cache.readFragment(
                gql`
                  fragment _ on Post {
                    id
                    points
                    voteStatus
                  }
                `,
                { id: postId }
              );

              if (data) {
                if (data.voteStatus === value) {
                  return;
                }

                const newPoints =
                  data.points + (!data.voteStatus ? 1 : 2) * value;
                cache.writeFragment(
                  gql`
                    fragment __ on Post {
                      points
                    }
                  `,
                  { id: postId, points: newPoints }
                );
              }
            },
            createPost: (_result, _args, cache, info) => {
              invalidateAllPost(cache);
            },
            logout: (_result, _args, cache, _info) => {
              betterUpdateQuery<LogoutMutation, MeQuery>(
                cache,
                {
                  query: MeDocument,
                },
                _result,
                () => ({ me: null })
              );
            },
            login: (_result, _args, cache, _info) => {
              betterUpdateQuery<LoginMutation, MeQuery>(
                cache,
                {
                  query: MeDocument,
                },
                _result,
                (result, query) => {
                  if (result.login.errors) {
                    return query;
                  }

                  return { me: result.login.user };
                }
              );
              invalidateAllPost(cache);
            },
            register: (_result, _args, cache, _info) => {
              betterUpdateQuery<RegisterMutation, MeQuery>(
                cache,
                {
                  query: MeDocument,
                },
                _result,
                (result, query) => {
                  if (result.register.errors) {
                    return query;
                  }

                  return { me: result.register.user };
                }
              );
            },
          },
        },
      }),
      errorExchange,
      ssrExchange,
      fetchExchange,
    ],
  };
};
