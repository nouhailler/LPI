import json
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from gen_labs_lpic1 import labs_lpic1
from gen_labs_lpic2 import labs_lpic2
from gen_labs_lpic3 import labs_lpic3

all_labs = labs_lpic1 + labs_lpic2 + labs_lpic3

print(f"Total labs loaded: {len(all_labs)}")
print(f"  LPIC-1: {len(labs_lpic1)}")
print(f"  LPIC-2: {len(labs_lpic2)}")
print(f"  LPIC-3: {len(labs_lpic3)}")

def to_ts_string(data):
    return json.dumps(data, ensure_ascii=False, indent=2)

ts_content = f"""import {{ GuidedLabScenario }} from '../types';

/**
 * 60 Scénarios Pratiques Guidés (Mini-Labs Pas à Pas avec Terminal Virtuel)
 * - 20 Mini-Labs LPIC-1 (Examens 101 et 102)
 * - 20 Mini-Labs LPIC-2 (Examens 201 et 202)
 * - 20 Mini-Labs LPIC-3 (Examens 300, 303, 305, 306)
 */

export const guidedMiniLabsLpic1: GuidedLabScenario[] = {to_ts_string(labs_lpic1)};

export const guidedMiniLabsLpic2: GuidedLabScenario[] = {to_ts_string(labs_lpic2)};

export const guidedMiniLabsLpic3: GuidedLabScenario[] = {to_ts_string(labs_lpic3)};

export const guidedLabScenarios: GuidedLabScenario[] = [
  ...guidedMiniLabsLpic1,
  ...guidedMiniLabsLpic2,
  ...guidedMiniLabsLpic3,
];
"""

output_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "guidedMiniLabsData.ts")
with open(output_path, "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Successfully generated {output_path} with {len(all_labs)} labs.")
