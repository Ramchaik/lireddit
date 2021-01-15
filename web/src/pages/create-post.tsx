import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { ShowMessage } from "../components/ShowMessage";
import { useCreatePostMutation, useMeQuery } from "../generated/graphql";
import { useIsAuth } from "../utils/useIsAuth";

export const CreatePost: React.FC<{}> = ({}) => {
  const { data, loading } = useMeQuery();
  const router = useRouter();
  useIsAuth();

  const [createPost] = useCreatePostMutation();

  return loading || !data?.me ? (
    <ShowMessage />
  ) : (
    <Layout varient="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          const { errors } = await createPost({ variables: { input: values } });
          if (!errors) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField label="Title" name="title" placeholder="title" />
            <Box mt={4}>
              <InputField
                textarea
                label="Body"
                name="text"
                placeholder="text..."
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              Create post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default CreatePost;
