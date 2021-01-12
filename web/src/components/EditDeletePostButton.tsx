import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { IconButton, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { useDeletePostMutation } from "../generated/graphql";

interface EditDeletePostButtonProps {
  id: number;
}

export const EditDeletePostButton: React.FC<EditDeletePostButtonProps> = ({
  id,
}) => {
  const [, deletePost] = useDeletePostMutation();

  return (
    <>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <IconButton
          as={Link}
          mr={4}
          bgColor="lightgray"
          aria-label="edit-post"
          icon={<EditIcon />}
        />
      </NextLink>
      <IconButton
        aria-label="delete-post"
        bgColor="lightgray"
        icon={<DeleteIcon />}
        onClick={() => {
          deletePost({ id });
        }}
      />
    </>
  );
};
