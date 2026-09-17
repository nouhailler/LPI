# -*- coding: utf-8 -*-
import json
import os
import sys

from gen_match_lpic1 import matching_games_lpic1
from gen_match_lpic2 import matching_games_lpic2
from gen_match_lpic3 import matching_games_lpic3

def write_ts_file(filepath, var_name, data):
    content = 'import { MatchingGame } from "../types";\n\n'
    content += f'export const {var_name}: MatchingGame[] = '
    content += json.dumps(data, indent=2, ensure_ascii=False)
    content += ';\n'
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Wrote {len(data)} matching games to {filepath}")

def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(root, 'src', 'data')

    file1 = os.path.join(data_dir, 'matchingGamesLpic1.ts')
    file2 = os.path.join(data_dir, 'matchingGamesLpic2.ts')
    file3 = os.path.join(data_dir, 'matchingGamesLpic3.ts')
    file_agg = os.path.join(data_dir, 'matchingGames.ts')

    write_ts_file(file1, 'matchingGamesLpic1', matching_games_lpic1)
    write_ts_file(file2, 'matchingGamesLpic2', matching_games_lpic2)
    write_ts_file(file3, 'matchingGamesLpic3', matching_games_lpic3)

    agg_content = """import { MatchingGame } from "../types";
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
"""
    with open(file_agg, 'w', encoding='utf-8') as f:
        f.write(agg_content)
    print(f"Wrote aggregate matching games to {file_agg} (total: {len(matching_games_lpic1) + len(matching_games_lpic2) + len(matching_games_lpic3)})")

if __name__ == '__main__':
    main()
