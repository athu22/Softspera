export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  image: string;
  link: string;
}

export interface Internship {
  id: string;
  title: string;
  department: string;
  description: string;
  duration: string;
  rate?: string;
  offer?: string;
  requirements: string[];
  applyLink?: string;
  active: boolean;
}

export interface InternshipEnquiry {
  id: string;
  internshipId: string;
  internshipTitle: string;
  name: string;
  email: string;
  phone: string;
  college?: string;
  message?: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  roleLevel: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface HomepageContent {
  heroTitle: string;
  tagline: string;
  heroImage: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: number;
}

const groupByLevel = (team: TeamMember[]) => {
  return {
    leadership: team.filter(m => m.roleLevel <= 2),
    leads: team.filter(m => m.roleLevel === 3),
    team: team.filter(m => m.roleLevel > 3),
  };
};

export { groupByLevel };