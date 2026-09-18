import { Skill } from '../types/student';

// Blacklisted patterns and substrings from resume parsers and marketing templates
const BLACKLISTED_PATTERNS = [
  /resume/i,
  /wording/i,
  /scan/i,
  /proven to/i,
  /don't forget/i,
  /template/i,
  /http[s]?:\/\//i,
  /www\./i,
  /@/i,
  /click here/i,
  /page \d+/i,
  /curriculum vitae/i,
  /references available/i,
];

// Well-known tools & frameworks vs primary vs auxiliary
const TOOLS_AND_FRAMEWORKS = new Set([
  'git', 'github', 'gitlab', 'docker', 'kubernetes', 'aws', 'azure', 'gcp',
  'jira', 'postman', 'figma', 'vite', 'webpack', 'npm', 'yarn', 'pnpm',
  'redis', 'mongodb', 'mysql', 'postgresql', 'sqlite', 'firebase', 'supabase',
  'react', 'next.js', 'vue.js', 'angular', 'svelte', 'tailwind css', 'bootstrap',
  'sass', 'less', 'node.js', 'express', 'django', 'flask', 'spring boot'
]);

export const skillSanitizer = {
  isValidSkillName: (name: string): boolean => {
    if (!name || typeof name !== 'string') return false;
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 35) return false;

    // Check for blacklisted patterns
    for (const pattern of BLACKLISTED_PATTERNS) {
      if (pattern.test(trimmed)) {
        return false;
      }
    }

    // Must have at least one alphabet character
    if (!/[a-zA-Z]/.test(trimmed)) return false;

    return true;
  },

  sanitizeSkills: (skills: Skill[] = []): Skill[] => {
    const seen = new Set<string>();
    const cleaned: Skill[] = [];

    for (const skill of skills) {
      if (!skill || !skill.name) continue;
      const trimmed = skill.name.trim();
      const lower = trimmed.toLowerCase();

      if (seen.has(lower)) continue;
      if (!skillSanitizer.isValidSkillName(trimmed)) continue;

      seen.add(lower);
      cleaned.push({
        name: trimmed,
        level: skill.level || 'Intermediate'
      });
    }

    return cleaned;
  },

  categorizeSkills: (skills: Skill[]) => {
    const sanitized = skillSanitizer.sanitizeSkills(skills);
    const primary: Skill[] = [];
    const tools: Skill[] = [];
    const additional: Skill[] = [];

    for (const s of sanitized) {
      const lower = s.name.toLowerCase();
      if (TOOLS_AND_FRAMEWORKS.has(lower)) {
        tools.push(s);
      } else if (
        ['javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'ruby', 'php', 'html', 'css', 'sql', 'system design', 'data structures', 'algorithms'].includes(lower) ||
        s.level === 'Advanced'
      ) {
        primary.push(s);
      } else {
        additional.push(s);
      }
    }

    // Ensure primary has at least a few if empty
    if (primary.length === 0 && sanitized.length > 0) {
      return {
        primary: sanitized.slice(0, 4),
        tools: sanitized.slice(4, 8),
        additional: sanitized.slice(8)
      };
    }

    return { primary, tools, additional };
  }
};
