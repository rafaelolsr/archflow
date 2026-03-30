---
name: deploy-archflow
description: >
  Deploy the archflow skill to target projects. Syncs SKILL.md, references,
  and templates from the archflow source repo to each registered project.
  Use when you've updated archflow and need to push changes out.
---

# Deploy Archflow

Syncs the archflow skill from this repo to all registered target projects.

===================================================================
TARGETS
===================================================================

  foundry:
    /Users/rafael/Github/Upstart13/Microsoft/StarbaseSandbox/Foundry/.claude/skills/archflow/

  ontolayer:
    /Users/rafael/Github/DataGeek/ontolayer/.claude/skills/archflow/

  infra-pipeline:
    /Users/rafael/Github/InfraSight/infra-pipeline/.claude/skills/archflow/

===================================================================
WORKFLOW
===================================================================

  1. SOURCE is always: plugins/archflow/skills/archflow/ in this repo (the current working directory)

  2. For EACH target above, run:

       rsync -av --delete plugins/archflow/skills/archflow/ <target-path>

     The --delete flag removes files in the target that no longer
     exist in the source, keeping targets exactly in sync.

  3. After syncing, print a summary:

       ✓ foundry      — synced
       ✓ ontolayer     — synced
       ✓ infra-pipeline — synced

     If a target path does not exist (project moved or not cloned),
     skip it and print:

       ✗ <name> — target not found, skipped

  4. Do NOT commit or push in the target repos — just sync the files.
     The user will commit in each project when ready.

===================================================================
ADDING NEW TARGETS
===================================================================

  To register a new project, add its path to the TARGETS section above.
  The target must have a .claude/skills/ directory (create it if missing).
