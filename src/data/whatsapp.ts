import type { Project } from "@/data/projects";

/** Confirmed laptop-store work; restaurant ordering is a service offering. */
export const whatsappProject: Project = {
  id: "whatsapp-inventory-assistant",
  slug: "whatsapp-inventory-assistant",
  index: "01",
  name: "WhatsApp Business Chatbots",
  category: "Business Automation · WhatsApp",
  year: "2026",
  description:
    "Custom WhatsApp chatbots for any business — connected to your information, inventory and software to answer customers and handle everyday requests automatically.",
  visual: "flow",
  accent: "#427462",
  tags: ["WhatsApp", "Business Integration", "Customer Automation"],
  palette: {
    accent: "#183d32",
    accentDeep: "#102a23",
    muted: "#719083",
    surface: "#e5ebe5",
    surfaceSoft: "#f0f3ed",
    surfaceAlt: "#e9eee8",
    warm: "#427462",
    cream: "#f0f3ed",
  },
  caseStudy: {
    statement:
      "Your business knowledge. Your workflows. Available to customers on WhatsApp.",
    seoDescription:
      "Custom WhatsApp chatbots for any business by Rafay Khattak. Automate customer enquiries, inventory checks, orders and requests with your existing tools.",
    wordmark: { lead: "WhatsApp", tail: "Business Chatbots", accent: "lead" },
    heroNote: "Custom integrations · Built around your business",
    meta: [
      { label: "For", value: "Retail, hospitality, services & more" },
      { label: "Channel", value: "WhatsApp" },
      { label: "Role", value: "Chatbot & business systems integration" },
    ],
    disciplines: ["Business Automation", "Chatbot Integration", "Inventory Integration"],
    technologies: ["WhatsApp", "Business Data & Software"],
    technicalNotes: [],
    media: [],
    technicalSummary:
      "I connect WhatsApp conversations to the information and tools a business uses: Excel files, inventory systems, menus, service details and other accessible data sources. Each integration is scoped to the business's workflow and the access its systems support.",
    repository: "Implementation details are not published in this case study.",
    publicArtifacts: "Project overview and service capabilities.",
    evidence: {
      supported:
        "Completed integration for a laptop store: inventory-connected responses to customer enquiries on WhatsApp without a salesperson replying to each message.",
      notOverstated:
        "Restaurant ordering and integrations for other businesses are services available for new projects. No sales uplift or response-time figures are claimed for this implementation.",
    },
    sections: [
      {
        id: "challenge", number: "01", title: "Your customers have questions. Your team has work to do.",
        body: "From product availability and prices to menus, opening hours and service enquiries, customers often need the same information. I build WhatsApp chatbots around your business so those conversations can move forward without someone manually answering every message.",
      },
      {
        id: "integration", number: "02", title: "A chatbot that works with your business.",
        body: "Connect the information you already maintain — Excel inventory, business software, a product catalogue, a menu or service information — to a WhatsApp chatbot. The workflow can answer questions, guide customers through choices and capture orders or requests. We define what it should handle and when your team should take over.",
        tone: "surface", figure: "architecture",
      },
      {
        id: "your-business", number: "03", title: "Any business. A workflow of its own.",
        body: [
          "For retailers and wholesalers: product enquiries, pricing, availability and quantities from connected inventory.",
          "For restaurants and food businesses: menu browsing, item selection and order capture in the conversation.",
          "For service providers and other businesses: frequently asked questions, service information, lead capture and appointment requests, tailored to how your team works.",
          "Your business does not need to fit a template. Tell me what customers ask, what you want to automate and which tools you use; I will scope the integration around that.",
        ],
      },
      {
        id: "client-example", number: "04", title: "One real example: inventory-connected retail.",
        body: "I completed a WhatsApp chatbot integration for a laptop store, connecting its inventory so customers could ask about products, prices and available quantities without waiting for a salesperson. That project is one application of the service — the chatbot and integrations can be tailored to a different business and workflow.",
        tone: "surface",
      },
    ],
    architecture: {
      stack: [
        { id: "question", label: "Customer on WhatsApp", note: "A question, order or service request" },
        { id: "inventory", label: "Your business information", note: "Software, spreadsheets, menus or service details" },
        { id: "answer", label: "A useful response or next step", note: "Tailored to your customer workflow" },
      ],
    },
  },
};
