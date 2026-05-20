"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import cytoscape, { Core, ElementDefinition } from "cytoscape";
import coseBilkent from "cytoscape-cose-bilkent";
import {
    Activity,
    DatabaseZap,
    GitBranch,
    Loader2,
    Network,
    RefreshCcw,
    ShieldAlert,
    Zap,
} from "lucide-react";
import { toast } from "sonner";

import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

cytoscape.use(coseBilkent);

type GraphNode = {
    id: string;
    label: "Account" | "Transaction" | "Device" | "Merchant" | "Country" | string;
    title?: string;
    risk_level?: string;
    fraud_score?: number;
    amount?: number;
    status?: string;
    [key: string]: unknown;
};

type GraphEdge = {
    id: string;
    source: string;
    target: string;
    label: string;
};

type GraphResponse = {
    nodes: GraphNode[];
    edges: GraphEdge[];
};

const riskOptions = ["all", "low", "medium", "high"] as const;

export default function GraphExplorerPage() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const cyRef = useRef<Core | null>(null);

    const [graph, setGraph] = useState<GraphResponse>({ nodes: [], edges: [] });
    const [riskLevel, setRiskLevel] = useState<(typeof riskOptions)[number]>("all");
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

    const queryPath = useMemo(() => {
        const params = new URLSearchParams();
        params.set("limit", "80");

        if (riskLevel !== "all") {
            params.set("risk_level", riskLevel);
        }

        return `/graph?${params.toString()}`;
    }, [riskLevel]);

    async function loadGraph() {
        setLoading(true);

        try {
            const data = await apiFetch<GraphResponse>(queryPath);
            setGraph(data);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to load graph");
        } finally {
            setLoading(false);
        }
    }

    async function syncGraph() {
        setSyncing(true);

        try {
            const result = await apiFetch<{ message: string; synced_transactions: number }>(
                "/graph/sync",
                { method: "POST" }
            );

            toast.success(`${result.message}: ${result.synced_transactions} transactions`);
            await loadGraph();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to sync graph");
        } finally {
            setSyncing(false);
        }
    }

    useEffect(() => {
        loadGraph();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryPath]);

    useEffect(() => {
        if (!containerRef.current) return;

        const elements: ElementDefinition[] = [
            ...graph.nodes.map((node) => ({
                data: {
                    ...node,
                    id: node.id,
                    label: node.label,
                    title: node.title || node.id,
                    risk_level: node.risk_level || "low",
                },
                classes: `${node.label.toLowerCase()} ${node.risk_level || "low"}`,
            })),
            ...graph.edges.map((edge) => ({
                data: {
                    id: edge.id,
                    source: edge.source,
                    target: edge.target,
                    label: edge.label,
                },
            })),
        ];

        if (cyRef.current) {
            cyRef.current.destroy();
            cyRef.current = null;
        }

        const cy = cytoscape({
            container: containerRef.current,
            elements,
            minZoom: 0.3,
            maxZoom: 2.2,
            wheelSensitivity: 0.2,
            style: [
                {
                    selector: "node",
                    style: {
                        "background-color": "#15b8ff",
                        label: "data(title)",
                        color: "#dce7ff",
                        "font-size": 9,
                        "font-family": "JetBrains Mono, monospace",
                        "text-outline-color": "#050b18",
                        "text-outline-width": 3,
                        width: 34,
                        height: 34,
                        "border-width": 2,
                        "border-color": "rgba(255,255,255,0.35)",
                    },
                },
                {
                    selector: "node.account",
                    style: {
                        shape: "round-rectangle",
                        "background-color": "#38bdf8",
                    },
                },
                {
                    selector: "node.transaction",
                    style: {
                        shape: "diamond",
                        "background-color": "#22d3ee",
                        width: 42,
                        height: 42,
                    },
                },
                {
                    selector: "node.device",
                    style: {
                        shape: "hexagon",
                        "background-color": "#a78bfa",
                    },
                },
                {
                    selector: "node.merchant",
                    style: {
                        shape: "rectangle",
                        "background-color": "#4ade80",
                    },
                },
                {
                    selector: "node.country",
                    style: {
                        shape: "ellipse",
                        "background-color": "#facc15",
                    },
                },
                {
                    selector: "node.high",
                    style: {
                        "background-color": "#fca5a5",
                        "border-color": "#fecaca",
                        "border-width": 3,
                    },
                },
                {
                    selector: "node.medium",
                    style: {
                        "background-color": "#67e8f9",
                        "border-color": "#a5f3fc",
                    },
                },
                {
                    selector: "node.low",
                    style: {
                        "background-color": "#86efac",
                        "border-color": "#bbf7d0",
                    },
                },
                {
                    selector: "edge",
                    style: {
                        width: 1.4,
                        "line-color": "rgba(148,163,184,0.35)",
                        "target-arrow-color": "rgba(148,163,184,0.45)",
                        "target-arrow-shape": "triangle",
                        "curve-style": "bezier",
                        label: "data(label)",
                        color: "#64748b",
                        "font-size": 7,
                        "text-rotation": "autorotate",
                        "text-background-color": "#050b18",
                        "text-background-opacity": 0.8,
                        "text-background-padding": "2px",
                    },
                },
                {
                    selector: ":selected",
                    style: {
                        "border-color": "#15b8ff",
                        "border-width": 4,
                        "line-color": "#15b8ff",
                        "target-arrow-color": "#15b8ff",
                    },
                },
            ],
            layout: {
                name: "cose-bilkent",
                animate: "end",
                animationDuration: 650,
                fit: true,
                padding: 60,
                randomize: true,
            } as cytoscape.LayoutOptions,
        });

        cy.on("tap", "node", (event) => {
            setSelectedNode(event.target.data() as GraphNode);
        });

        cy.on("tap", (event) => {
            if (event.target === cy) {
                setSelectedNode(null);
            }
        });

        cyRef.current = cy;

        return () => {
            cy.destroy();
            cyRef.current = null;
        };
    }, [graph]);

    const transactionNodes = graph.nodes.filter((node) => node.label === "Transaction");
    const highRiskNodes = graph.nodes.filter((node) => node.risk_level === "high");

    return (
        <div className="space-y-8">
            <section className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
                <div>
                    <div className="mb-4 flex items-center gap-2">
                        <Badge className="rounded-sm bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/10">
                            GRAPH INTELLIGENCE
                        </Badge>
                        <span className="text-xs uppercase tracking-[0.14em] text-slate-600">
                            / Neo4j / Entity Network
                        </span>
                    </div>

                    <h1 className="text-5xl font-black tracking-tight text-slate-100">
                        GRAPH EXPLORER
                    </h1>
                    <p className="mt-3 max-w-3xl text-base leading-7 text-slate-400">
                        Visualize hidden relations between accounts, transactions, devices,
                        merchants, and countries to expose fraud networks beyond tabular rules.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button
                        onClick={loadGraph}
                        variant="outline"
                        className="rounded-sm border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                    >
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Reload
                    </Button>

                    <Button
                        onClick={syncGraph}
                        disabled={syncing}
                        className="rounded-sm bg-cyan-400 font-bold text-[#06111f] hover:bg-cyan-300"
                    >
                        {syncing ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <DatabaseZap className="mr-2 h-4 w-4" />
                        )}
                        Sync Neo4j
                    </Button>
                </div>
            </section>

            <section className="grid gap-6 md:grid-cols-3">
                <GraphMetric
                    label="Graph Nodes"
                    value={graph.nodes.length}
                    icon={<Network className="h-8 w-8 text-cyan-300" />}
                />
                <GraphMetric
                    label="Graph Edges"
                    value={graph.edges.length}
                    icon={<GitBranch className="h-8 w-8 text-emerald-300" />}
                />
                <GraphMetric
                    label="High Risk Nodes"
                    value={highRiskNodes.length}
                    icon={<ShieldAlert className="h-8 w-8 text-red-200" />}
                />
            </section>

            <section className="grid gap-8 xl:grid-cols-[1fr_340px]">
                <Card className="trust-panel overflow-hidden rounded-md border-cyan-300/10 text-slate-100">
                    <CardContent className="p-0">
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-white/[0.04] px-6 py-4">
                            <div>
                                <h2 className="font-bold uppercase tracking-[0.12em] text-slate-200">
                                    Entity Relationship Canvas
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    {transactionNodes.length} transaction vectors rendered
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {riskOptions.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => setRiskLevel(option)}
                                        className={cn(
                                            "rounded-sm border px-3 py-2 text-xs font-bold uppercase tracking-[0.1em]",
                                            riskLevel === option
                                                ? "border-cyan-300 bg-cyan-400/10 text-cyan-300"
                                                : "border-white/10 bg-[#050b18] text-slate-500 hover:text-slate-300"
                                        )}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="relative h-[650px] bg-[#050b18]">
                            {loading && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#050b18]/80 text-slate-400">
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin text-cyan-300" />
                                    Loading graph intelligence...
                                </div>
                            )}

                            {graph.nodes.length === 0 && !loading && (
                                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-slate-500">
                                    <Network className="mb-4 h-10 w-10 text-slate-600" />
                                    <p>No graph data available.</p>
                                    <p className="mt-2 text-sm">
                                        Click Sync Neo4j to build the entity network.
                                    </p>
                                </div>
                            )}

                            <div ref={containerRef} className="h-full w-full" />
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="trust-panel rounded-md border-cyan-300/10 text-slate-100">
                        <CardContent className="p-6">
                            <p className="trust-label">Legend</p>

                            <div className="mt-5 space-y-3">
                                <LegendItem color="bg-sky-400" label="Account" />
                                <LegendItem color="bg-cyan-300" label="Transaction" />
                                <LegendItem color="bg-violet-400" label="Device" />
                                <LegendItem color="bg-emerald-400" label="Merchant" />
                                <LegendItem color="bg-yellow-300" label="Country" />
                                <LegendItem color="bg-red-300" label="High Risk Entity" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="trust-panel rounded-md border-cyan-300/10 text-slate-100">
                        <CardContent className="p-6">
                            <p className="trust-label">Selected Node</p>

                            {!selectedNode ? (
                                <div className="mt-5 rounded-sm border border-white/10 bg-[#050b18] p-5 text-sm leading-6 text-slate-500">
                                    Select a node on the graph canvas to inspect metadata.
                                </div>
                            ) : (
                                <div className="mt-5 space-y-3">
                                    <NodeInfo label="Type" value={selectedNode.label} />
                                    <NodeInfo label="Title" value={String(selectedNode.title || selectedNode.id)} />
                                    <NodeInfo label="Risk" value={String(selectedNode.risk_level || "-")} />
                                    {selectedNode.fraud_score !== undefined && (
                                        <NodeInfo
                                            label="Fraud Score"
                                            value={String(selectedNode.fraud_score)}
                                        />
                                    )}
                                    {selectedNode.status !== undefined && (
                                        <NodeInfo label="Status" value={String(selectedNode.status)} />
                                    )}
                                    <NodeInfo label="Node ID" value={selectedNode.id} mono />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="trust-panel rounded-md border-cyan-300/10 text-slate-100">
                        <CardContent className="p-6">
                            <p className="trust-label">Graph Protocol</p>
                            <div className="mt-5 space-y-3 text-sm text-slate-400">
                                <ProtocolRow label="Source" value="PostgreSQL + Neo4j" />
                                <ProtocolRow label="Layout" value="COSE Bilkent" />
                                <ProtocolRow label="Mode" value="Fraud Network" />
                                <ProtocolRow label="Status" value="Active" active />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}

function GraphMetric({
    label,
    value,
    icon,
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
}) {
    return (
        <Card className="trust-panel rounded-xl border-cyan-300/10 text-slate-100">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="trust-label">{label}</p>
                        <p className="mt-4 text-4xl font-black text-cyan-300">{value}</p>
                    </div>
                    {icon}
                </div>
            </CardContent>
        </Card>
    );
}

function LegendItem({ color, label }: { color: string; label: string }) {
    return (
        <div className="flex items-center justify-between rounded-sm border border-white/10 bg-[#050b18] px-4 py-3">
            <span className="text-sm text-slate-300">{label}</span>
            <span className={cn("h-3 w-3 rounded-full", color)} />
        </div>
    );
}

function NodeInfo({
    label,
    value,
    mono,
}: {
    label: string;
    value: string;
    mono?: boolean;
}) {
    return (
        <div className="rounded-sm border border-white/10 bg-[#050b18] p-3">
            <p className="trust-label">{label}</p>
            <p className={cn("mt-2 break-words text-sm text-slate-200", mono && "trust-mono")}>
                {value}
            </p>
        </div>
    );
}

function ProtocolRow({
    label,
    value,
    active,
}: {
    label: string;
    value: string;
    active?: boolean;
}) {
    return (
        <div className="flex items-center justify-between">
            <span>{label}</span>
            <span className={cn("trust-mono", active ? "text-emerald-300" : "text-slate-500")}>
                {value}
            </span>
        </div>
    );
}