# agent-skills

Skills that let an agent do a whole job from one prompt. Each skill is a folder under
`skills/` with a `SKILL.md` (what it does, when to use it, the steps) and whatever it needs
beside it: templates, scripts, references.

| Skill | What it does |
| --- | --- |
| [explainer-film](skills/explainer-film/SKILL.md) | A narrated 1 to 3 minute explainer film for a product, repo or feature, in the engraved-plate style of the Innernet field guide and quirq infra films |

## Use a skill

Claude Code loads skills from `~/.claude/skills/` (every project) or `.claude/skills/` (one
project). Copy or link the skill's folder there:

```bash
git clone https://github.com/quirq-ai/agent-skills
ln -s "$PWD/agent-skills/skills/explainer-film" ~/.claude/skills/explainer-film
```

Then ask for the job in plain words, for example "make an explainer film for this repo".

## Add a skill

One folder per skill, named like its `name:` in `SKILL.md`. Keep `SKILL.md` short and move
depth into `references/`. Never commit secrets: a skill that needs an API key reads it from
the user's environment or a gitignored `.env`.

## License

Apache-2.0 (`LICENSE`). Third-party material a skill uses is listed in its own `ASSETS.md`.
