import { MatchingGame } from "../types";
import { matchingGamesLpic1 } from "./matchingGamesLpic1";
import { matchingGamesLpic2 } from "./matchingGamesLpic2";
import { matchingGamesLpic3 } from "./matchingGamesLpic3";

export const matchingGames: MatchingGame[] = [
  ...matchingGamesLpic1,
  ...matchingGamesLpic2,
  ...matchingGamesLpic3,
];

export {
  matchingGamesLpic1,
  matchingGamesLpic2,
  matchingGamesLpic3,
};
