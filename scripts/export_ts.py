import json
from gen_seq_lpic1 import challenges_101
from gen_seq_lpic1_102 import challenges_102

def write_ts_file(filepath, var_name, data):
    with open(filepath, "w", encoding="utf-8") as f:
        f.write("import { SequencingChallenge } from '../types';\n\n")
        f.write(f"export const {var_name}: SequencingChallenge[] = ")
        f.write(json.dumps(data, indent=2, ensure_ascii=False))
        f.write(";\n")

# Write 101 file
write_ts_file("src/data/lpic1Sequencing101.ts", "lpic1Sequencing101", challenges_101)
print(f"Wrote {len(challenges_101)} challenges to src/data/lpic1Sequencing101.ts")

# Write 102 file
write_ts_file("src/data/lpic1Sequencing102.ts", "lpic1Sequencing102", challenges_102)
print(f"Wrote {len(challenges_102)} challenges to src/data/lpic1Sequencing102.ts")

# Write combined file
with open("src/data/lpic1SequencingChallenges.ts", "w", encoding="utf-8") as f:
    f.write("import { SequencingChallenge } from '../types';\n")
    f.write("import { lpic1Sequencing101 } from './lpic1Sequencing101';\n")
    f.write("import { lpic1Sequencing102 } from './lpic1Sequencing102';\n\n")
    f.write("export { lpic1Sequencing101, lpic1Sequencing102 };\n\n")
    f.write("export const lpic1SequencingChallenges: SequencingChallenge[] = [\n")
    f.write("  ...lpic1Sequencing101,\n")
    f.write("  ...lpic1Sequencing102\n")
    f.write("];\n")

print(f"Successfully generated all files. Total LPIC-1 sequencing challenges: {len(challenges_101) + len(challenges_102)}")
