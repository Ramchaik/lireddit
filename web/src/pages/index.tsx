import { withUrqlClient } from "next-urql";
import { NavBar } from "../components/NavBar";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [{ data }] = usePostsQuery();

  return (
    <>
      <NavBar />
      <div>hello world</div>
      <br />
      {!data ? (
        <div>loading...</div>
      ) : (
        <ul>
          {data.posts.map((p) => (
            <li key={p.id}>{p.title}</li>
          ))}
        </ul>
      )}
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
