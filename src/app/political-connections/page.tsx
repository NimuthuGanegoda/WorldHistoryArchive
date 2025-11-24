import Link from 'next/link';
import kingsData from '@/data/kings.json';

export const metadata = {
  title: 'Political Connections | Sri Lanka History',
  description: 'Political relationships, alliances, and rivalries between Sri Lankan monarchs',
};

// Extract political connections from biographies
function extractPoliticalConnections(kings: any[]) {
  const connections: any[] = [];
  
  kings.forEach(king => {
    const bio = king.biography + ' ' + king.sections.map((s: any) => s.content.join(' ')).join(' ');
    
    // Find mentions of other kings
    kings.forEach(otherKing => {
      if (king.slug === otherKing.slug) return;
      
      const otherName = otherKing.title.replace('King ', '').replace('Queen ', '');
      const lowerBio = bio.toLowerCase();
      const lowerName = otherName.toLowerCase();
      
      if (lowerBio.includes(lowerName)) {
        // Determine relationship type
        let relationship = 'mentioned';
        
        if (lowerBio.includes('father') || lowerBio.includes('son of ' + lowerName)) {
          relationship = 'family';
        } else if (lowerBio.includes('brother') || lowerBio.includes('sister')) {
          relationship = 'family';
        } else if (lowerBio.includes('defeated') || lowerBio.includes('battle') || lowerBio.includes('war')) {
          relationship = 'conflict';
        } else if (lowerBio.includes('succeeded') || lowerBio.includes('successor')) {
          relationship = 'succession';
        } else if (lowerBio.includes('alliance') || lowerBio.includes('ally')) {
          relationship = 'alliance';
        }
        
        // Extract relevant sentence
        const sentences = bio.split(/\. /);
        const relevantSentence = sentences.find(s => 
          s.toLowerCase().includes(lowerName)
        );
        
        if (relevantSentence) {
          connections.push({
            from: king,
            to: otherKing,
            relationship,
            description: relevantSentence.substring(0, 200) + (relevantSentence.length > 200 ? '...' : '')
          });
        }
      }
    });
  });
  
  return connections;
}

// Group by relationship type
function groupByRelationship(connections: any[]) {
  return {
    family: connections.filter(c => c.relationship === 'family'),
    succession: connections.filter(c => c.relationship === 'succession'),
    conflict: connections.filter(c => c.relationship === 'conflict'),
    alliance: connections.filter(c => c.relationship === 'alliance'),
    mentioned: connections.filter(c => c.relationship === 'mentioned')
  };
}

const relationshipColors: any = {
  family: 'border-green-500 bg-green-50 dark:bg-green-900/20',
  succession: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
  conflict: 'border-red-500 bg-red-50 dark:bg-red-900/20',
  alliance: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20',
  mentioned: 'border-gray-500 bg-gray-50 dark:bg-gray-800'
};

const relationshipIcons: any = {
  family: '👨‍👩‍👦',
  succession: '👑',
  conflict: '⚔️',
  alliance: '🤝',
  mentioned: '📜'
};

const relationshipLabels: any = {
  family: 'Family Relations',
  succession: 'Succession & Inheritance',
  conflict: 'Conflicts & Rivalries',
  alliance: 'Alliances & Partnerships',
  mentioned: 'Historical Mentions'
};

export default function PoliticalConnectionsPage() {
  const kings = kingsData as any[];
  const allConnections = extractPoliticalConnections(kings);
  const grouped = groupByRelationship(allConnections);

  return (
    <main className="max-w-7xl mx-auto py-6 px-5">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Political Connections</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Political relationships, family ties, alliances, and rivalries between Sri Lankan monarchs
        </p>
      </div>

      <div className="mb-8 grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(relationshipLabels).map(([key, label]) => {
          const count = (grouped as any)[key].length;
          return (
            <div key={key} className={`p-4 rounded-lg border-l-4 ${relationshipColors[key]}`}>
              <div className="text-2xl mb-1">{relationshipIcons[key]}</div>
              <div className="font-semibold">{count}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">{String(label)}</div>
            </div>
          );
        })}
      </div>

      <div className="space-y-8">
        {Object.entries(grouped).map(([type, connections]: [string, any]) => {
          if (connections.length === 0) return null;
          
          return (
            <section key={type}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-3xl">{relationshipIcons[type]}</span>
                {relationshipLabels[type]}
                <span className="text-sm font-normal text-gray-500">({connections.length})</span>
              </h2>
              
              <div className="space-y-3">
                {connections.slice(0, 50).map((conn: any, idx: number) => (
                  <div 
                    key={`${conn.from.slug}-${conn.to.slug}-${idx}`}
                    className={`p-4 rounded-lg border-l-4 ${relationshipColors[type]}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Link 
                            href={`/kings/${conn.from.slug}`}
                            className="font-bold text-[var(--accent)] hover:underline"
                          >
                            {conn.from.title}
                          </Link>
                          <span className="text-gray-400">→</span>
                          <Link 
                            href={`/kings/${conn.to.slug}`}
                            className="font-bold text-[var(--accent)] hover:underline"
                          >
                            {conn.to.title}
                          </Link>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {conn.description}
                        </p>
                        <div className="mt-2 flex gap-4 text-xs text-gray-500">
                          <span>{conn.from.reign}</span>
                          <span>•</span>
                          <span className="capitalize">{conn.from.kingdom}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded">
        <h3 className="text-lg font-bold mb-2">About Political Connections</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          This page maps the complex web of political relationships between Sri Lankan monarchs. 
          These connections include family lineages, succession disputes, military conflicts, 
          strategic alliances, and historical interactions that shaped the island&apos;s political landscape 
          over 2,300 years.
        </p>
      </div>
    </main>
  );
}
