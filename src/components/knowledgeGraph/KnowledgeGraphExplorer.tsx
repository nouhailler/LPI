import React, { useState, useMemo } from 'react';
import {
  Share2,
  Search,
  ArrowRight,
  Sparkles,
  BookOpen,
  Terminal,
  FileCode,
  Layers,
  ChevronRight,
  Info,
  Check,
  Copy,
  ExternalLink,
  Shield,
  HardDrive,
  Network,
  Cpu,
  Activity,
  Package,
  Server,
  Zap,
} from 'lucide-react';
import {
  knowledgeClusters,
  allKnowledgeNodes,
  allConceptRelations,
  getConceptRelations,
  getKnowledgeNode,
  KnowledgeNodeData,
  KnowledgeCluster,
  ConceptRelation,
} from '../../data/knowledgeGraphData';

interface KnowledgeGraphExplorerProps {
  isFrench: boolean;
  onOpenGlossaryInspect?: (term: string) => void;
  onOpenObjective?: (objectiveId: string) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const KnowledgeGraphExplorer: React.FC<KnowledgeGraphExplorerProps> = ({
  isFrench,
  onOpenGlossaryInspect,
  onOpenObjective,
  onNavigateToTab,
}) => {
  const [selectedClusterId, setSelectedClusterId] = useState<string>('systemd-ecosystem');
  const [activeTerm, setActiveTerm] = useState<string>('systemd');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // The active cluster
  const activeCluster = useMemo(() => {
    return knowledgeClusters.find((c) => c.id === selectedClusterId) || knowledgeClusters[0];
  }, [selectedClusterId]);

  // The active node
  const activeNode = useMemo(() => {
    return getKnowledgeNode(activeTerm) || allKnowledgeNodes['systemd'];
  }, [activeTerm]);

  // Relations for the active term
  const { outgoing, incoming, all } = useMemo(() => {
    return getConceptRelations(activeNode.term);
  }, [activeNode]);

  // Filtered nodes in active cluster or search
  const displayedNodes = useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return Object.values(allKnowledgeNodes).filter(
        (n) =>
          n.term.toLowerCase().includes(q) ||
          n.definitionFr.toLowerCase().includes(q) ||
          n.definitionEn.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q)
      );
    }
    return activeCluster.coreTerms.map((term) => getKnowledgeNode(term)).filter(Boolean) as KnowledgeNodeData[];
  }, [searchQuery, activeCluster]);

  // Filtered relations within the cluster
  const displayedRelations = useMemo(() => {
    const termSet = new Set(displayedNodes.map((n) => n.term.toLowerCase()));
    return allConceptRelations.filter(
      (r) => termSet.has(r.sourceTerm.toLowerCase()) && termSet.has(r.targetTerm.toLowerCase())
    );
  }, [displayedNodes]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 1800);
  };

  // Specific canonical chains for quick demonstration
  const exampleChains = [
    {
      titleFr: 'Chaîne Principale systemd & Dépannage',
      titleEn: 'Main systemd & Troubleshooting Chain',
      terms: ['systemd', 'systemctl', 'services', 'targets', 'boot process', 'journalctl', 'logs', 'troubleshooting'],
    },
    {
      titleFr: 'Chaîne Stockage : du Disque Brut au Montage',
      titleEn: 'Storage Chain: from Raw Disk to Mount',
      terms: ['fdisk', 'partitions', 'Physical Volumes (PV)', 'Volume Groups (VG)', 'Logical Volumes (LV)', 'mkfs', 'filesystem', 'mount', '/etc/fstab'],
    },
    {
      titleFr: 'Chaîne Réseau & Pare-Feu',
      titleEn: 'Network & Firewall Chain',
      terms: ['ip link', 'ip addr', 'ip route', '/etc/resolv.conf', 'DNS', 'ss', 'sockets (TCP/UDP)', 'firewall (iptables)', 'sshd'],
    },
  ];

  const getClusterIcon = (iconName: string) => {
    switch (iconName) {
      case 'Server':
        return <Server className="w-4 h-4" />;
      case 'HardDrive':
        return <HardDrive className="w-4 h-4" />;
      case 'Network':
        return <Network className="w-4 h-4" />;
      case 'Shield':
        return <Shield className="w-4 h-4" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4" />;
      case 'Activity':
        return <Activity className="w-4 h-4" />;
      case 'Package':
        return <Package className="w-4 h-4" />;
      default:
        return <Share2 className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Knowledge Graph Header Banner */}
      <div className="bg-gradient-to-br from-[#f8ecdb] via-[#ffffff] to-[#fffbf2] border border-[#d3c5ab] rounded-2xl p-5 md:p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#785a00] text-white text-[11px] font-extrabold uppercase tracking-wider mb-2">
              <Share2 className="w-3.5 h-3.5" />
              <span>{isFrench ? 'Relations entre connaissances' : 'Knowledge Graph'}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-[#201b11] tracking-tight">
              {isFrench ? 'Knowledge Graph Linux & Chaînes Conceptuelles' : 'Linux Knowledge Graph & Conceptual Chains'}
            </h2>
            <p className="text-xs md:text-sm text-[#4f4632] mt-1.5 leading-relaxed">
              {isFrench
                ? 'Explorez les dépendances dynamiques et passerelles logiques entre les composants Linux : du gestionnaire systemd jusqu\'au dépannage, en passant par les fichiers de configuration, les démons et les journaux système.'
                : 'Explore dynamic dependencies and logical relationships between Linux components: from systemd to troubleshooting, unit files, daemons, and system logs.'}
            </p>
          </div>

          {/* Quick Search */}
          <div className="w-full md:w-72 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-[#817660] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isFrench ? 'Rechercher un concept lié...' : 'Search connected concept...'}
                className="w-full pl-9 pr-4 py-2 text-xs bg-[#ffffff] border border-[#d3c5ab] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#785a00] text-[#201b11]"
              />
            </div>
          </div>
        </div>

        {/* Featured Canonical Chain Banner (as requested by user) */}
        <div className="mt-5 pt-4 border-t border-[#ebdcc8]/80">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#785a00] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-current" />
              {isFrench ? 'Exemple de chaîne conceptuelle directe :' : 'Direct conceptual chain example:'}
            </span>
            <span className="text-[11px] text-[#817660] hidden sm:inline">
              {isFrench ? 'Cliquez sur n\'importe quel maillon pour l\'inspecter' : 'Click any link to inspect'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5">
            {exampleChains[0].terms.map((tName, idx) => {
              const isSelected = activeTerm.toLowerCase() === tName.toLowerCase();
              return (
                <React.Fragment key={idx}>
                  <button
                    onClick={() => {
                      setActiveTerm(tName);
                      setSelectedClusterId('systemd-ecosystem');
                      setSearchQuery('');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#785a00] text-white shadow-xs ring-2 ring-[#785a00]/30'
                        : 'bg-[#ffffff] text-[#4f4632] hover:bg-[#f8ecdb] border border-[#d3c5ab]'
                    }`}
                  >
                    <span>{tName}</span>
                  </button>
                  {idx < exampleChains[0].terms.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-[#785a00] shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cluster / Domain Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {knowledgeClusters.map((cluster) => {
          const isSelected = selectedClusterId === cluster.id && !searchQuery.trim();
          return (
            <button
              key={cluster.id}
              onClick={() => {
                setSelectedClusterId(cluster.id);
                setActiveTerm(cluster.rootTerm);
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-[#785a00] text-white border-[#785a00] shadow-xs'
                  : 'bg-[#ffffff] text-[#4f4632] hover:bg-[#f8ecdb] border-[#d3c5ab]'
              }`}
            >
              {getClusterIcon(cluster.iconName)}
              <span>{isFrench ? cluster.nameFr : cluster.nameEn}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center: Interactive Nodes Grid & Relationships Matrix (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Active Cluster Description */}
          <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#201b11] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#785a00]" />
                {isFrench ? activeCluster.nameFr : activeCluster.nameEn}
              </h3>
              <p className="text-xs text-[#817660] mt-0.5">
                {isFrench ? activeCluster.descriptionFr : activeCluster.descriptionEn}
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-[#f8ecdb] text-[#785a00] shrink-0">
              {displayedNodes.length} {isFrench ? 'concepts' : 'concepts'}
            </span>
          </div>

          {/* Connected Nodes Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {displayedNodes.map((node) => {
              const isSelected = activeTerm.toLowerCase() === node.term.toLowerCase();
              const relationsCount = getConceptRelations(node.term).all.length;

              return (
                <div
                  key={node.id}
                  onClick={() => setActiveTerm(node.term)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                    isSelected
                      ? 'bg-[#fffbf0] border-2 border-[#785a00] shadow-md -translate-y-0.5'
                      : 'bg-[#ffffff] border-[#d3c5ab] hover:border-[#785a00]/60 hover:bg-[#faf5ed]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        node.type === 'command'
                          ? 'bg-[#dcfce7] text-[#047857]'
                          : node.type === 'file'
                          ? 'bg-[#fef3c7] text-[#b45309]'
                          : 'bg-[#e0e7ff] text-[#4338ca]'
                      }`}
                    >
                      {node.type === 'file'
                        ? isFrench ? 'Fichier' : 'File'
                        : node.type === 'command'
                        ? isFrench ? 'Commande' : 'Command'
                        : isFrench ? 'Concept' : 'Concept'}
                    </span>

                    <span className="text-[11px] font-bold text-[#785a00] flex items-center gap-1">
                      <Share2 className="w-3 h-3" />
                      {relationsCount} {isFrench ? 'liens' : 'links'}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-mono font-bold text-sm text-[#201b11] group-hover:text-[#785a00]">
                      {node.term}
                    </h4>
                    <p className="text-xs text-[#4f4632] line-clamp-2 mt-1 leading-relaxed">
                      {isFrench ? node.definitionFr : node.definitionEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Node Direct Relationships Table */}
          <div className="bg-[#ffffff] border border-[#d3c5ab] rounded-xl p-4 md:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#817660] flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#785a00]" />
                <span>
                  {isFrench
                    ? `Graphe de relations pour « ${activeNode.term} »`
                    : `Relationship graph for "${activeNode.term}"`}
                </span>
              </h4>
              <span className="text-xs font-bold text-[#785a00]">
                {all.length} {isFrench ? 'connexions actives' : 'active connections'}
              </span>
            </div>

            <div className="divide-y divide-[#ebdcc8]/70">
              {all.map((rel, idx) => {
                const isOut = rel.sourceTerm.toLowerCase() === activeNode.term.toLowerCase();
                const otherTerm = isOut ? rel.targetTerm : rel.sourceTerm;
                const otherNode = getKnowledgeNode(otherTerm);

                return (
                  <div
                    key={idx}
                    onClick={() => setActiveTerm(otherTerm)}
                    className="py-3 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#fffbf0] rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-md shrink-0 flex items-center gap-1 ${
                          isOut
                            ? 'bg-[#f8ecdb] text-[#785a00] border border-[#ebdcc8]'
                            : 'bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd]'
                        }`}
                      >
                        {isOut ? (
                          <>
                            <span>→</span> {isFrench ? rel.labelFr : rel.labelEn}
                          </>
                        ) : (
                          <>
                            <span>←</span> {isFrench ? rel.labelFr : rel.labelEn}
                          </>
                        )}
                      </span>

                      <span className="font-mono font-bold text-sm text-[#201b11] hover:text-[#785a00] truncate">
                        {otherTerm}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#817660] shrink-0 sm:ml-auto">
                      <span className="hidden md:inline line-clamp-1 max-w-xs text-[11px] italic">
                        {isFrench ? rel.descriptionFr : rel.descriptionEn}
                      </span>
                      <span className="text-[#785a00] font-bold flex items-center gap-1">
                        {isFrench ? 'Explorer' : 'Explore'} →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Node Deep Inspector & Action Panel (5 cols) */}
        <div className="lg:col-span-5 sticky top-4 flex flex-col gap-4">
          <div className="bg-[#ffffff] border-2 border-[#785a00]/40 rounded-2xl p-5 shadow-sm">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      activeNode.type === 'command'
                        ? 'bg-[#dcfce7] text-[#047857]'
                        : activeNode.type === 'file'
                        ? 'bg-[#fef3c7] text-[#b45309]'
                        : 'bg-[#e0e7ff] text-[#4338ca]'
                    }`}
                  >
                    {activeNode.type === 'file'
                      ? isFrench ? 'Fichier' : 'File'
                      : activeNode.type === 'command'
                      ? isFrench ? 'Commande' : 'Command'
                      : isFrench ? 'Concept' : 'Concept'}
                  </span>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#ebdcc8] text-[#4f4632]">
                    {activeNode.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold font-mono text-[#201b11]">
                  {activeNode.term}
                </h3>
              </div>

              {activeNode.objectiveId && (
                <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-[#ffc20e] text-[#6d5100]">
                  Obj {activeNode.objectiveId}
                </span>
              )}
            </div>

            {/* Definition */}
            <p className="text-sm text-[#201b11] leading-relaxed mb-4">
              {isFrench ? activeNode.definitionFr : activeNode.definitionEn}
            </p>

            {/* Syntax / Path */}
            {activeNode.syntax && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#817660]">
                    {isFrench ? 'Syntaxe / Emplacement' : 'Syntax / Location'}
                  </span>
                  <button
                    onClick={() => handleCopy(activeNode.syntax!)}
                    className="text-xs text-[#785a00] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedText === activeNode.syntax ? (
                      <>
                        <Check className="w-3 h-3 text-[#16a34a]" />
                        <span className="text-[#16a34a]">{isFrench ? 'Copié !' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>{isFrench ? 'Copier' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-[#201b11] rounded-xl p-3 font-mono text-xs text-[#ffc20e] border border-[#3b3222] overflow-x-auto">
                  <code>{activeNode.syntax}</code>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex flex-col gap-2 pt-2 border-t border-[#ebdcc8]">
              {onOpenGlossaryInspect && (
                <button
                  onClick={() => onOpenGlossaryInspect(activeNode.term)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#785a00] hover:bg-[#624900] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{isFrench ? 'Voir la fiche complète dans le Glossaire' : 'View Full Glossary Entry'}</span>
                </button>
              )}

              {onOpenObjective && activeNode.objectiveId && (
                <button
                  onClick={() => onOpenObjective(activeNode.objectiveId)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#ffffff] hover:bg-[#ebdcc8] text-[#4f4632] border border-[#d3c5ab] text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#785a00]" />
                  <span>{isFrench ? `Réviser l'objectif LPI ${activeNode.objectiveId}` : `Study LPI Objective ${activeNode.objectiveId}`}</span>
                </button>
              )}
            </div>
          </div>

          {/* Did You Know Box */}
          <div className="bg-[#f0f7ff] border border-[#bae6fd] rounded-xl p-4 text-xs text-[#0369a1] leading-relaxed flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#0284c7] shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block mb-0.5">
                {isFrench ? 'Comprendre les passerelles LPI :' : 'Understanding LPI Bridges:'}
              </strong>
              <p>
                {isFrench
                  ? 'Aux examens LPIC, une question sur un démon (ex: sshd) teste souvent conjointement son unité systemd, son fichier de config, ses règles firewall et ses logs journalctl.'
                  : 'In LPIC exams, questions regarding a daemon often test its systemd unit, config file, firewall rule, and journalctl log output together.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
