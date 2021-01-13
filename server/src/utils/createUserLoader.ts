import DataLoader from "dataloader";
import { User } from "../entities/User";

export const createUserLoader = () =>
  new DataLoader<number, User>(async (userIds) => {
    const users = await User.findByIds(userIds as number[]);
    const userIdToUser: Record<number, User> = users.reduce(
      (userIdToUser, user) => {
        userIdToUser[user.id] = user;
        return userIdToUser;
      },
      {} as Record<number, User>
    );
    return userIds.map((uId) => userIdToUser[uId]);
  });
