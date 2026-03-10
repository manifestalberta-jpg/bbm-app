'use client';

interface Topic {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface TopicTabsProps {
  topics: Topic[];
  selectedTopic: string;
  onSelectTopic: (topicId: string) => void;
}

export default function TopicTabs({ topics, selectedTopic, onSelectTopic }: TopicTabsProps) {
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex space-x-2 pb-2 min-w-min">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onSelectTopic(topic.id)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-smooth ${
              selectedTopic === topic.id
                ? `bg-gradient-to-r ${topic.color} text-white font-semibold`
                : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
            }`}
          >
            <span className="mr-2">{topic.icon}</span>
            {topic.name}
          </button>
        ))}
      </div>
    </div>
  );
}
