import json
from gen_seq_lpic2_201 import challenges_201
from gen_seq_lpic2_202 import challenges_202

def write_ts_file(filepath, var_name, data):
    with open(filepath, "w", encoding="utf-8") as f:
        f.write("import { SequencingChallenge } from '../types';\n\n")
        f.write(f"export const {var_name}: SequencingChallenge[] = ")
        f.write(json.dumps(data, indent=2, ensure_ascii=False))
        f.write(";\n")

# Write 201 file
write_ts_file("src/data/lpic2Sequencing201.ts", "lpic2Sequencing201", challenges_201)
print(f"Wrote {len(challenges_201)} challenges to src/data/lpic2Sequencing201.ts")

# Write 202 file
write_ts_file("src/data/lpic2Sequencing202.ts", "lpic2Sequencing202", challenges_202)
print(f"Wrote {len(challenges_202)} challenges to src/data/lpic2Sequencing202.ts")

# Write combined file
with open("src/data/lpic2SequencingChallenges.ts", "w", encoding="utf-8") as f:
    f.write("import { SequencingChallenge } from '../types';\n")
    f.write("import { lpic2Sequencing201 } from './lpic2Sequencing201';\n")
    f.write("import { lpic2Sequencing202 } from './lpic2Sequencing202';\n\n")
    f.write("export { lpic2Sequencing201, lpic2Sequencing202 };\n\n")
    f.write("export const lpic2SequencingChallenges: SequencingChallenge[] = [\n")
    f.write("  ...lpic2Sequencing201,\n")
    f.write("  ...lpic2Sequencing202\n")
    f.write("];\n")

print(f"Successfully generated all files. Total LPIC-2 sequencing challenges: {len(challenges_201) + len(challenges_202)}")
