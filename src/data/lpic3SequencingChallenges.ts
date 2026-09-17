import { SequencingChallenge } from "../types";
import { lpic3Sequencing300 } from "./lpic3Sequencing300";
import { lpic3Sequencing303 } from "./lpic3Sequencing303";
import { lpic3Sequencing305 } from "./lpic3Sequencing305";
import { lpic3Sequencing306 } from "./lpic3Sequencing306";

export const lpic3SequencingChallenges: SequencingChallenge[] = [
  ...lpic3Sequencing300,
  ...lpic3Sequencing303,
  ...lpic3Sequencing305,
  ...lpic3Sequencing306,
];

export {
  lpic3Sequencing300,
  lpic3Sequencing303,
  lpic3Sequencing305,
  lpic3Sequencing306,
};
