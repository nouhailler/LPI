import { validateCurriculumConsistency, formatCurriculumReport } from '../src/utils/curriculumValidation';

function main() {
  const result = validateCurriculumConsistency();
  const output = formatCurriculumReport(result);
  
  if (result.isValid) {
    console.log('\x1b[32m%s\x1b[0m', output);
  } else {
    // Print in yellow warning color
    console.warn('\x1b[33m%s\x1b[0m', output);
  }

  // Do not fail build on warning, but signal loudly as requested by user
  process.exit(0);
}

main();
