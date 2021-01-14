import DataLoader from "dataloader";
import { getConnection } from "typeorm";
import { Updoot } from "../entities/Updoot";

/**
 * [{postId: 3, userId: 7}]
 * @returns [{postId: 3, userId: 7, value: 1}]
 */

interface UpdootKey {
  postId: number;
  userId: number;
}
type UpdootIdsToUpdootT = Record<string, Updoot>;

export const createUpdootLoader = () =>
  new DataLoader<
    {
      postId: number;
      userId: number;
    },
    Updoot | null
  >(async (keys) => {
    const compositeKeys = keys
      .reduce((ck, k) => {
        ck += `(${k.postId},${k.userId}) `;
        return ck;
      }, "")
      .split(" ")
      .filter(Boolean)
      .join(",");

    const updoots = await getConnection().query(
      `SELECT * FROM updoot WHERE ("postId", "userId") IN (${compositeKeys});`
    );
    const getKey = (u: UpdootKey): string => `${u.userId}|${u.postId}`;
    const updootIdsToUpdoot: UpdootIdsToUpdootT = updoots.reduce(
      (updootIdsToUpdoot: UpdootIdsToUpdootT, updoot: Updoot) => {
        updootIdsToUpdoot[getKey(updoot)] = updoot;
        return updootIdsToUpdoot;
      },
      {} as UpdootIdsToUpdootT
    );
    return keys.map((k) => updootIdsToUpdoot[getKey(k)]);
  });
