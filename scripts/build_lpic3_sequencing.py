# -*- coding: utf-8 -*-
import json
import os
from gen_seq_lpic3_300 import challenges_300
from gen_seq_lpic3_303 import challenges_303
from gen_seq_lpic3_305 import challenges_305
from gen_seq_lpic3_306 import challenges_306

def generate_ts(challenges, var_name):
    code = 'import { SequencingChallenge } from "../types";\n\n'
    code += f'export const {var_name}: SequencingChallenge[] = '
    code += json.dumps(challenges, indent=2, ensure_ascii=False)
    code += ';\n'
    return code

# Write files
base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src', 'data'))

with open(os.path.join(base_dir, 'lpic3Sequencing300.ts'), 'w', encoding='utf-8') as f:
    f.write(generate_ts(challenges_300, 'lpic3Sequencing300'))

with open(os.path.join(base_dir, 'lpic3Sequencing303.ts'), 'w', encoding='utf-8') as f:
    f.write(generate_ts(challenges_303, 'lpic3Sequencing303'))

with open(os.path.join(base_dir, 'lpic3Sequencing305.ts'), 'w', encoding='utf-8') as f:
    f.write(generate_ts(challenges_305, 'lpic3Sequencing305'))

with open(os.path.join(base_dir, 'lpic3Sequencing306.ts'), 'w', encoding='utf-8') as f:
    f.write(generate_ts(challenges_306, 'lpic3Sequencing306'))

# Combined file
combined_ts = '''import { SequencingChallenge } from "../types";
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
'''

with open(os.path.join(base_dir, 'lpic3SequencingChallenges.ts'), 'w', encoding='utf-8') as f:
    f.write(combined_ts)

print("Successfully generated all 40 LPIC-3 sequencing challenges files!")
