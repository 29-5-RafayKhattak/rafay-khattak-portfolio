import type { Field } from "payload";

import {
  labelValueRows,
  labelledGroups,
  layerRows,
  statusRows,
  stringList,
} from "@/payload/fields/shapes";

/** Background treatments a section can sit on. Mirrors SectionTone. */
const TONES = ["paper", "surface", "soft", "alt", "sage", "deep"] as const;

/**
 * The figure that accompanies a section. A key rather than a component, so the
 * data layer stays free of JSX and two projects can share a figure while
 * supplying different content to it.
 */
const FIGURES = [
  "relation",
  "architecture",
  "stack",
  "infrastructure",
  "domain",
  "techniques",
  "responsibility",
  "disclosure",
  "status",
  "phases",
  "research-architecture",
  "metrics",
  "capabilities",
  "planned",
  "process-topology",
  "aggregation",
  "limits",
  "growth",
  "proof",
  "tradeoff",
  "gap",
] as const;

const asOptions = (values: readonly string[]) =>
  values.map((value) => ({ label: value, value }));

/**
 * -----------------------------------------------------------------------------
 * CASE STUDY
 * -----------------------------------------------------------------------------
 * Every figure a case study can carry is optional, and a section only renders
 * one if the matching data exists. That is what lets six projects with quite
 * different shapes share one page implementation: the micromouse has phases and
 * metrics, the tick pipeline has a process topology and an aggregation, and
 * neither needs the other's fields to be present.
 *
 * The claim-discipline fields — `evidence`, `limits`, `status`, `disclosure` —
 * are first-class rather than prose, so what a project has not proven stays
 * structural and cannot be quietly dropped by an edit to a paragraph.
 * -----------------------------------------------------------------------------
 */
export const caseStudyField: Field = {
  name: "caseStudy",
  type: "group",
  admin: {
    description:
      "Present only on projects with a published case study. A project without one still appears in the homepage sequence.",
  },
  fields: [
    { name: "hasCaseStudy", type: "checkbox", defaultValue: false, admin: { description: "Unticked: no /work page is generated." } },
    { name: "statement", type: "textarea" },
    { name: "seoDescription", type: "textarea" },
    { name: "heroNote", type: "text", admin: { description: "Terms shown opposite the index." } },

    {
      name: "wordmark",
      type: "group",
      admin: { description: "Splits the title so one half takes the project accent." },
      fields: [
        { name: "lead", type: "text" },
        { name: "tail", type: "text" },
        {
          name: "accent",
          type: "select",
          options: asOptions(["lead", "tail"]),
        },
      ],
    },

    labelValueRows("meta", "Hero metadata column."),
    labelValueRows("highlights", "Hard facts set under the hero lede."),

    stringList("disciplines", "Shown on the hero axis."),
    stringList("covers", "Which disciplines this project genuinely touches. Empty lights all of them."),
    stringList("technologies", "Hero stack pills."),

    { name: "technicalSummary", type: "textarea" },
    { name: "repository", type: "text", admin: { description: "Human label — Public or Private." } },
    {
      name: "repositoryUrl",
      type: "text",
      admin: {
        description:
          "PUBLIC repositories only. A private one must not carry a link: GitHub answers it with a 404 for anyone without access.",
      },
    },
    { name: "publicArtifacts", type: "textarea" },

    {
      name: "evidence",
      type: "group",
      fields: [
        { name: "supported", type: "textarea" },
        { name: "notOverstated", type: "textarea" },
      ],
    },

    {
      name: "sections",
      type: "array",
      admin: { description: "The numbered body of the case study, in order." },
      fields: [
        { name: "sectionId", type: "text", required: true, admin: { description: "Anchor id." } },
        { name: "number", type: "text", required: true },
        { name: "title", type: "text", required: true },
        { name: "tone", type: "select", defaultValue: "paper", options: asOptions(TONES) },
        { name: "figure", type: "select", options: asOptions(FIGURES) },
        stringList("body", "One entry per paragraph.", true),
      ],
    },

    stringList("techniques", "Editorial keywords for the interaction layer."),
    stringList("contributors", "Everyone who worked on it. Not optional on a shared project."),
    {
      name: "credits",
      type: "array",
      admin: { description: "Named people and roles, where a flat list is not enough." },
      fields: [
        { name: "name", type: "text", required: true },
        { name: "role", type: "text" },
      ],
    },

    statusRows("status", "Current state. Unticked rows render as outstanding."),
    statusRows("planned", "A direction that is planned rather than delivered."),

    {
      name: "responsibility",
      type: "group",
      fields: [
        stringList("stages"),
        { name: "caveat", type: "text" },
      ],
    },

    {
      name: "disclosure",
      type: "group",
      fields: [stringList("canShow"), stringList("withheld")],
    },

    labelledGroups("technicalNotes", "Grouped stack notes shown under the body."),

    {
      name: "architecture",
      type: "group",
      admin: { description: "The request path. Heads are parallel entry points." },
      fields: [
        layerRows("heads"),
        layerRows("stack"),
        layerRows("aside", "Services beside the path rather than in it."),
      ],
    },

    {
      name: "infrastructure",
      type: "group",
      admin: { description: "A second, independent flow — deployment or teardown." },
      fields: [layerRows("stack")],
    },

    {
      name: "domain",
      type: "group",
      admin: { description: "Entity graph. Coordinates are in the figure's own 900×560 space." },
      fields: [
        {
          name: "nodes",
          type: "array",
          fields: [
            { name: "nodeId", type: "text", required: true },
            { name: "label", type: "text", required: true },
            { name: "stage", type: "number", required: true, admin: { description: "Scroll step at which it appears." } },
            { name: "x", type: "number", required: true },
            { name: "y", type: "number", required: true },
          ],
        },
        {
          name: "edges",
          type: "array",
          fields: [
            { name: "from", type: "text", required: true },
            { name: "to", type: "text", required: true },
          ],
        },
      ],
    },

    {
      name: "growth",
      type: "array",
      admin: { description: "Ordered stages of how it grew." },
      fields: [
        { name: "number", type: "text", required: true },
        { name: "label", type: "text", required: true },
        { name: "note", type: "textarea", required: true },
      ],
    },

    {
      name: "tradeoff",
      type: "group",
      admin: { description: "Both columns optional — a section may be carried by the words alone." },
      fields: [
        {
          name: "left",
          type: "group",
          fields: [{ name: "title", type: "text" }, stringList("items")],
        },
        {
          name: "right",
          type: "group",
          fields: [{ name: "title", type: "text" }, stringList("items")],
        },
        stringList("words", "Editorial words that carry the section visually."),
      ],
    },

    {
      name: "phases",
      type: "array",
      admin: {
        description:
          "Phases of work. `complete` is the point of this field: a list that renders planned work identically to delivered work reads as a finished project.",
      },
      fields: [
        { name: "number", type: "text", required: true },
        { name: "label", type: "text", required: true },
        { name: "complete", type: "checkbox", defaultValue: false },
        stringList("items"),
      ],
    },

    {
      name: "packages",
      type: "array",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "note", type: "text" },
      ],
    },

    {
      name: "dataFlows",
      type: "array",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "carries", type: "text", required: true },
        { name: "topic", type: "text", required: true },
        { name: "to", type: "text", required: true },
      ],
    },

    labelledGroups("metrics", "Measures the work is designed to capture — targets, not results."),
    labelledGroups("tooling", "Tooling that exists, described by what it can produce."),

    {
      name: "capabilities",
      type: "group",
      admin: { description: "What the system does for the people using it, grouped." },
      fields: [labelledGroups("groups"), { name: "note", type: "textarea" }],
    },

    {
      name: "topology",
      type: "group",
      admin: { description: "A run of processes and the primitives between them." },
      fields: [
        {
          name: "steps",
          type: "array",
          fields: [
            { name: "stepId", type: "text", required: true },
            { name: "label", type: "text", required: true },
            { name: "kind", type: "text", required: true, admin: { description: "Process, IPC, Threads, Memory, Output." } },
          ],
        },
        {
          name: "support",
          type: "array",
          fields: [
            { name: "label", type: "text", required: true },
            { name: "note", type: "text" },
          ],
        },
      ],
    },

    stringList("primitives", "Low-level primitives, set large."),

    {
      name: "aggregation",
      type: "group",
      admin: { description: "A grouping transformation, named at label level with no invented values." },
      fields: [
        { name: "source", type: "text" },
        { name: "groupBy", type: "text" },
        stringList("measures"),
        { name: "output", type: "text" },
        {
          name: "note",
          type: "group",
          fields: [
            { name: "title", type: "text" },
            { name: "body", type: "textarea" },
            { name: "formula", type: "text" },
          ],
        },
      ],
    },

    {
      name: "limits",
      type: "group",
      admin: { description: "What is verified and what is not." },
      fields: [stringList("verified"), stringList("notVerified")],
    },

    stringList("nextProof", "Steps that would raise confidence — none of them taken yet."),

    {
      name: "gap",
      type: "group",
      admin: { description: "A gap stated plainly rather than designed around." },
      fields: [
        { name: "label", type: "text" },
        { name: "subject", type: "text" },
        { name: "status", type: "text" },
        { name: "next", type: "text" },
      ],
    },

    {
      name: "proof",
      type: "group",
      admin: { description: "Concrete support, plus the chain a single test or path actually walks." },
      fields: [
        stringList("points"),
        stringList("chain", "Stage names only — never values, thresholds or results."),
        { name: "note", type: "textarea" },
      ],
    },

    {
      name: "accessModel",
      type: "group",
      admin: { description: "Concept level only — no permission matrices or route structures." },
      fields: [
        { name: "title", type: "text" },
        stringList("items"),
        { name: "note", type: "textarea" },
      ],
    },

    {
      name: "media",
      type: "array",
      admin: {
        description:
          "Approved screenshots, resolved from the media library. The page renders no media section at all while this is empty.",
      },
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true },
        { name: "caption", type: "text", admin: { description: "Overrides the asset's own caption." } },
      ],
    },
  ],
};
