export type LeadStatus = "new" | "contacted" | "booked" | "disqualified";
export type LeadPriority = "hot" | "warm" | "cold";

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  initials: string;
  color: string;
}

export interface Note {
  id: number;
  author: string;
  text: string;
  time: string;
}

export interface QualifiedData {
  budget: string;
  financing: string;
  timeline: string;
}

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  property: string;
  price: string;
  source: string;
  receivedAt: string;
  status: LeadStatus;
  message: string;
  avatar: string;
  priority: LeadPriority;
  assignedTo: number | null;
  bookingTime?: string;
  score: number;
  channel: string;
  qd: QualifiedData;
  notes: Note[];
  isNew?: boolean;
}

export const team: TeamMember[] = [
  { id: 1, name: "Sander Vermeulen", role: "Jij", initials: "SV", color: "#1F3D2B" },
  { id: 2, name: "Lisa Janssen", role: "Senior makelaar", initials: "LJ", color: "#1F3D2B" },
  { id: 3, name: "Pieter de Vries", role: "Makelaar", initials: "PV", color: "#2F6B45" },
  { id: 4, name: "Nadia El Amrani", role: "Makelaar", initials: "NE", color: "#8B5A2B" },
];

export const initialLeads: Lead[] = [
  {
    id: 1,
    name: "Sophie van Dijk",
    email: "sophie.vandijk@gmail.com",
    phone: "+31 6 12345678",
    property: "Prinsengracht 421, Amsterdam",
    price: "€ 875.000",
    source: "Funda",
    receivedAt: "2 min geleden",
    status: "new",
    message:
      "Goedemiddag, ik zag uw woning op Funda en ben erg enthousiast. Graag zou ik een bezichtiging willen inplannen. Ik ben doordeweeks beschikbaar na 17:00 en in het weekend flexibel.",
    avatar: "SD",
    priority: "hot",
    assignedTo: 1,
    score: 92,
    channel: "Funda-lead",
    qd: { budget: "€800k tot €950k", financing: "Pre-approval aanwezig", timeline: "Binnen 3 maanden" },
    notes: [],
  },
  {
    id: 2,
    name: "Mark de Boer",
    email: "m.deboer@outlook.com",
    phone: "+31 6 87654321",
    property: "Keizersgracht 118, Amsterdam",
    price: "€ 1.250.000",
    source: "Funda",
    receivedAt: "14 min geleden",
    status: "contacted",
    message: "Interesse in de woning. Zou graag meer info willen over de VvE bijdrage.",
    avatar: "MB",
    priority: "warm",
    assignedTo: 2,
    score: 74,
    channel: "Funda-lead",
    qd: { budget: "€1.1M tot €1.3M", financing: "In aanvraag", timeline: "3 tot 6 maanden" },
    notes: [
      { id: 1, author: "Lisa Janssen", text: "Gebeld, VvE info opgestuurd. Wil zaterdag kijken.", time: "Gisteren 14:22" },
    ],
  },
  {
    id: 3,
    name: "Aisha Yilmaz",
    email: "aisha.y@gmail.com",
    phone: "+31 6 11223344",
    property: "Vondelstraat 88, Amsterdam",
    price: "€ 695.000",
    source: "Funda",
    receivedAt: "1 uur geleden",
    status: "booked",
    message: "Hallo, ik ben geïnteresseerd in deze woning.",
    avatar: "AY",
    priority: "warm",
    assignedTo: 1,
    bookingTime: "Do 18 april 14:00",
    score: 85,
    channel: "Funda-lead",
    qd: { budget: "€650k tot €750k", financing: "Pre-approval aanwezig", timeline: "Binnen 3 maanden" },
    notes: [{ id: 1, author: "Sander Vermeulen", text: "Partner komt ook mee. Positieve eerste indruk.", time: "Vandaag 09:15" }],
  },
  {
    id: 4,
    name: "Thomas Bakker",
    email: "tbakker@ziggo.nl",
    phone: "+31 6 99887766",
    property: "Herengracht 502, Amsterdam",
    price: "€ 1.850.000",
    source: "Funda",
    receivedAt: "3 uur geleden",
    status: "booked",
    message: "Graag bezichtiging zaterdag. Cash-koper, direct beschikbaar.",
    avatar: "TB",
    priority: "hot",
    assignedTo: 3,
    bookingTime: "Za 20 april 11:00",
    score: 96,
    channel: "Funda-lead",
    qd: { budget: "€1.7M tot €2M", financing: "Contant, geen financiering", timeline: "Direct" },
    notes: [],
  },
  {
    id: 5,
    name: "Jeroen Smit",
    email: "j.smit@gmail.com",
    phone: "+31 6 44556677",
    property: "Prinsengracht 421, Amsterdam",
    price: "€ 875.000",
    source: "Funda",
    receivedAt: "5 uur geleden",
    status: "disqualified",
    message: "Gewoon even kijken uit nieuwsgierigheid.",
    avatar: "JS",
    priority: "cold",
    assignedTo: null,
    score: 18,
    channel: "Funda-lead",
    qd: { budget: "Niet opgegeven", financing: "Geen pre-approval", timeline: "Oriënterend" },
    notes: [],
  },
];

export function getMember(id: number | null): TeamMember | null {
  if (!id) return null;
  return team.find((t) => t.id === id) || null;
}
