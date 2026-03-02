import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { BarChart3, Users, FolderKanban, MessageSquare } from 'lucide-react';
import type { Message } from '../../types';
import { useParallelData } from '../../hooks/useOptimizedData';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    services: 0,
    projects: 0,
    team: 0,
    messages: 0,
  });

  const [messages, setMessages] = useState<Message[]>([]);
  
  // Use parallel data fetching for better performance
  const { data: parallelData, loading, error } = useParallelData([
    'services',
    'projects', 
    'team',
    'contact/messages'
  ]);
  
  useEffect(() => {
    if (parallelData && !loading) {
      const [servicesData, projectsData, teamData, messagesData] = parallelData;
      
      const newStats = {
        services: servicesData ? Object.keys(servicesData).length : 0,
        projects: projectsData ? Object.keys(projectsData).length : 0,
        team: teamData ? Object.keys(teamData).length : 0,
        messages: messagesData ? Object.keys(messagesData).length : 0,
      };
      
      setStats(newStats);
      
      // Process messages only if data exists
      if (messagesData) {
        const messagesArray = Object.entries(messagesData)
          .map(([id, data]) => ({
            id,
            ...(data as Omit<Message, 'id'>),
          }))
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 10); // Limit to 10 most recent messages
        setMessages(messagesArray);
      }
    }
    
    if (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }, [parallelData, loading, error]);

  const cards = [
    {
      title: 'Total Services',
      value: stats.services,
      icon: BarChart3,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Projects',
      value: stats.projects,
      icon: FolderKanban,
      color: 'bg-green-500',
    },
    {
      title: 'Team Members',
      value: stats.team,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'Messages',
      value: stats.messages,
      icon: MessageSquare,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Softspera</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome to the admin dashboard</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="rounded-lg bg-white p-6 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {card.title}
                    </p>
                    <p className="mt-2 text-3xl font-bold">{card.value}</p>
                  </div>
                  <div
                    className={`rounded-full ${card.color} p-3 text-white`}
                  >
                    <Icon size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Messages */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow-lg">
          <h2 className="text-xl font-bold">Recent Messages</h2>
          <div className="mt-4">
            {loading ? (
              <p className="text-center text-gray-500">Loading messages...</p>
            ) : messages.length === 0 ? (
              <p className="text-center text-gray-500">No messages yet</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {messages.map((message) => (
                  <div key={message.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{message.name}</h3>
                        <p className="text-sm text-gray-600">{message.email}</p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(message.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-2 font-medium text-gray-700">{message.subject}</p>
                    <p className="mt-1 text-gray-600">{message.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
