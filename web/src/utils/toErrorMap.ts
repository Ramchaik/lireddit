import { FieldError } from "../generated/graphql";

export const toErrorMap = (errors: FieldError[]) => {
  const setMap = (map: any, val: FieldError) => {
    const { field, message } = val || {};
    map[field] = message;
    return map;
  };
  const errorMap: Record<string, string> = errors.reduce(setMap, {});
  return errorMap;
};
