#!/usr/bin/env python3
import json

def generate_file(filename, challenges, var_name, title_comment):
    with open(filename, 'w', encoding='utf-8') as f:
        f.write("import { TroubleshootingChallenge } from '../types';\n\n")
        f.write(f"/**\n * {title_comment}\n */\n")
        f.write(f"export const {var_name}: TroubleshootingChallenge[] = [\n")
        
        items = []
        for c in challenges:
            opts = []
            for o in c['options']:
                opts.append(f"""      {{
        id: {json.dumps(o['id'])},
        label: {json.dumps(o['label'], ensure_ascii=False)},
        labelFr: {json.dumps(o.get('labelFr', o['label']), ensure_ascii=False)},
        isCorrect: {str(o['isCorrect']).lower()},
        explanation: {json.dumps(o['explanation'], ensure_ascii=False)},
        explanationFr: {json.dumps(o.get('explanationFr', o['explanation']), ensure_ascii=False)}
      }}""")
            opts_str = ",\n".join(opts)

            code_snippet = c['codeSnippet'].replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
            corrected_snippet = c['correctedSnippet'].replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')

            items.append(f"""  {{
    id: {json.dumps(c['id'])},
    title: {json.dumps(c['title'], ensure_ascii=False)},
    titleFr: {json.dumps(c.get('titleFr', c['title']), ensure_ascii=False)},
    certification: 'lpic-2',
    topicNumber: {c['topicNumber']},
    objectiveId: {json.dumps(c['objectiveId'])},
    category: {json.dumps(c['category'], ensure_ascii=False)},
    scenario: {json.dumps(c['scenario'], ensure_ascii=False)},
    scenarioFr: {json.dumps(c.get('scenarioFr', c['scenario']), ensure_ascii=False)},
    codeSnippet: `{code_snippet}`,
    language: {json.dumps(c.get('language', 'bash'))},
    bugDescription: {json.dumps(c['bugDescription'], ensure_ascii=False)},
    bugDescriptionFr: {json.dumps(c.get('bugDescriptionFr', c['bugDescription']), ensure_ascii=False)},
    options: [
{opts_str}
    ],
    correctedSnippet: `{corrected_snippet}`,
    fixExplanation: {json.dumps(c['fixExplanation'], ensure_ascii=False)},
    fixExplanationFr: {json.dumps(c.get('fixExplanationFr', c['fixExplanation']), ensure_ascii=False)}
  }}""")
        
        f.write(",\n".join(items))
        f.write("\n];\n")
    print(f"Generated {filename} with {len(challenges)} challenges.")

if __name__ == "__main__":
    print("Writer ready")
