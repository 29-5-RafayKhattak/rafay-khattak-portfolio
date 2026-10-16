import type { Project } from "@/data/projects";

/** Confirmed laptop-store work; restaurant ordering is a service offering. */
export const whatsappProject: Project = {
  id: "whatsapp-inventory-assistant",
  slug: "whatsapp-inventory-assistant",
  index: "07",
  name: "WhatsApp Inventory Assistant",
  category: "WhatsApp Automation · Retail",
  company: "Laptop store",
  year: "2026",
  description:
    "A laptop store's inventory, connected to WhatsApp. Customers get automatic answers about products, prices and stock without waiting for a salesperson.",
  visual: "flow",
  accent: "#427462",
  tags: ["WhatsApp", "Inventory Integration", "Customer Enquiries"],
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
      "Answers from the store's inventory. Delivered automatically on WhatsApp.",
    seoDescription:
      "A laptop-store WhatsApp chatbot by Rafay Khattak, connected to inventory to answer customer questions about products, prices and available quantities.",
    wordmark: { lead: "WhatsApp", tail: "Inventory Assistant", accent: "lead" },
    heroNote: "Completed client project · Laptop retail",
    meta: [
      { label: "Business", value: "Laptop store" },
      { label: "Channel", value: "WhatsApp" },
      { label: "Role", value: "Chatbot & inventory integration" },
    ],
    disciplines: ["Business Automation", "Chatbot Integration", "Inventory Integration"],
    technologies: ["WhatsApp", "Store Inventory"],
    technicalNotes: [],
    media: [],
    technicalSummary:
      "The chatbot connects customer conversations on WhatsApp to the laptop store's inventory and uses that information to answer product, price and stock enquiries automatically.",
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
        id: "challenge", number: "01", title: "Every stock question needed a person.",
        body: "Customers ask which laptops are available, how much they cost and how many are in stock. Answering those questions manually means a salesperson has to be available and check the store's records for each enquiry.",
      },
      {
        id: "integration", number: "02", title: "Connect the conversation to the inventory.",
        body: "I integrated a WhatsApp chatbot with the laptop store's inventory. The chatbot reads the connected inventory and responds to customers with product information, prices and available quantities, without requiring a salesperson to be active in the conversation.",
        tone: "surface", figure: "architecture",
      },
      {
        id: "outcome", number: "03", title: "Customers can ask. The store can answer automatically.",
        body: "Routine inventory enquiries can be handled through the customer's WhatsApp conversation. The store's own inventory provides the information behind the answers, reducing the need for staff to look up and repeat the same details manually.",
      },
      {
        id: "your-business", number: "04", title: "The same service, built around your business.",
        body: [
          "I offer WhatsApp chatbot integrations for laptop shops, mobile stores and other retailers. Customers can ask about products, prices, availability and quantities using the inventory your business already maintains.",
          "For restaurants, I offer menu browsing, item selection and order capture through WhatsApp, so a member of staff does not need to manually handle every ordering conversation.",
          "Your inventory may live in Excel, an existing software system or another data source. The integration is scoped around how that source can be accessed and updated. Tell me what you use and what you want your customers to be able to do.",
        ],
        tone: "surface",
      },
    ],
    architecture: {
      stack: [
        { id: "question", label: "Customer on WhatsApp", note: "Product, price or stock enquiry" },
        { id: "inventory", label: "Connected store inventory", note: "Product information and available quantities" },
        { id: "answer", label: "Automatic reply", note: "An answer in the customer's conversation" },
      ],
    },
  },
};

export const whatsappServices = {
  label: "Services · WhatsApp Automation",
  headline: "Your inventory. Your menu. One WhatsApp conversation.",
  intro:
    "I build WhatsApp chatbots that connect to your business data, answer customer questions and take restaurant orders — without someone having to reply to every message.",
  offerings: [
    {
      number: "01", title: "Retail & inventory enquiries",
      description: "Let customers check products, prices, availability and quantities directly on WhatsApp. Built for laptop shops, mobile stores and other retailers.",
    },
    {
      number: "02", title: "Restaurant menus & orders",
      description: "Give customers your menu, help them select items and capture their food orders in the conversation, even when your team is busy.",
    },
    {
      number: "03", title: "Connect the tools you use",
      description: "Integrate Excel inventory, existing store software or another inventory source. I scope the connection around your system's access and update options.",
    },
  ],
  proofLabel: "Built for a laptop store",
  proof: "An inventory-connected WhatsApp chatbot that answers customer enquiries automatically.",
  cta: "Discuss your chatbot",
  enquiry: "Hi Rafay, I'd like a WhatsApp chatbot for my business.\n\nBusiness type:\nCurrent inventory software or Excel setup:\nWhat customers should be able to ask or order:\n",
  nextStep: "Tell me your business type, how you manage inventory or menus, and what you want to automate.",
} as const;
