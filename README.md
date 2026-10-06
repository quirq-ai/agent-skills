# agent-skills

Skills that let an agent do a whole job from one prompt. Each skill is a folder under
`skills/` with a `SKILL.md` (what it does, when to use it, the steps) and whatever it needs
beside it: templates, scripts, references.

| Skill | What it does |
| --- | --- |

## Use a skill

Claude Code loads skills from `~/.claude/skills/` (every project) or `.claude/skills/` (one
project). Copy or link the skill's folder there:

```bash
git clone https://github.com/quirq-ai/agent-skills
ln -s "$PWD/agent-skills/skills/<skill>" ~/.claude/skills/<skill>
```

Then ask for the job in plain words.

## Add a skill

One folder per skill, named like its `name:` in `SKILL.md`. Keep `SKILL.md` short and move
depth into `references/`. Never commit secrets: a skill that needs an API key reads it from
the user's environment or a gitignored `.env`.
