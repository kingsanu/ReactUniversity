"use client";

import { useState, useCallback, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
  type NodeTypes,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Save,
  Search,
  BookOpen,
  Plus,
  Loader2,
  Info,
  Trash2,
  Network,
} from "lucide-react";
import { toast } from "sonner";
import { useCourseSequenceDetail, useUpdateCourseSequence } from "@/hooks/useCourseSequenceQueries";
import { useSchoolCourses } from "@/hooks/useCurriculumQueries";
import type { CourseSequenceNode, CourseSequenceEdge, SchoolCourse } from "@/types/curriculum";

// ============================================
// Custom Node Component
// ============================================

type CourseNodeData = {
  courseId: string;
  courseCode: string;
  courseName: string;
  credits: number;
  gradeLevel: number;
  semester: string;
  status: "required" | "elective" | "recommended";
  onDelete?: (id: string) => void;
};

const statusColors = {
  required: "bg-red-100 text-red-700 border-red-200",
  elective: "bg-blue-100 text-blue-700 border-blue-200",
  recommended: "bg-green-100 text-green-700 border-green-200",
};

function CourseNode({ id, data }: { id: string; data: CourseNodeData }) {
  return (
    <div className="bg-white border-2 border-teal-200 rounded-xl shadow-lg min-w-[180px] max-w-[220px] group hover:border-teal-400 transition-colors">
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-t-xl px-3 py-2 border-b border-teal-100 flex items-center justify-between">
        <span className="text-xs font-bold text-teal-700 truncate">{data.courseCode}</span>
        <button
          onClick={() => data.onDelete?.(id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 ml-1"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
      <div className="px-3 py-2 space-y-1.5">
        <p className="text-xs font-semibold text-gray-800 leading-tight line-clamp-2">{data.courseName}</p>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400">Grade {data.gradeLevel} · {data.credits} cr</span>
        </div>
        <Badge className={`text-[10px] px-1.5 py-0.5 border ${statusColors[data.status]}`}>
          {data.status}
        </Badge>
      </div>
    </div>
  );
}

const nodeTypes: NodeTypes = {
  courseNode: CourseNode as any,
};

// ============================================
// Main Builder Page
// ============================================

export default function CourseSequenceBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const sequenceId = params.id as string;

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [sequenceName, setSequenceName] = useState("");
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [initialized, setInitialized] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const { data: detail, isLoading: detailLoading } = useCourseSequenceDetail(sequenceId);
  const { data: coursesData } = useSchoolCourses({ limit: 200, search: search || undefined });
  const updateSequence = useUpdateCourseSequence();

  // Initialize nodes/edges from saved data
  if (detail && !initialized) {
    setSequenceName(detail.name);
    if (detail.nodes?.length) {
      setNodes(
        detail.nodes.map((n: CourseSequenceNode) => ({
          id: n.id,
          type: "courseNode",
          position: n.position,
          data: { ...n.data },
        }))
      );
    }
    if (detail.edges?.length) {
      setEdges(
        detail.edges.map((e: CourseSequenceEdge) => ({
          id: e.id,
          source: e.source,
          target: e.target,
          type: e.type ?? "smoothstep",
          animated: e.animated ?? true,
          style: { stroke: "#0d9488", strokeWidth: 2 },
        }))
      );
    }
    setInitialized(true);
  }

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: "smoothstep",
            animated: true,
            style: { stroke: "#0d9488", strokeWidth: 2 },
          },
          eds
        )
      ),
    []
  );

  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
  }, []);

  // Drag a course from the sidebar panel onto the canvas
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const courseJson = event.dataTransfer.getData("application/reactflow");
      if (!courseJson) return;

      const course: SchoolCourse = JSON.parse(courseJson);
      const wrapper = reactFlowWrapper.current;
      if (!wrapper) return;

      const rect = wrapper.getBoundingClientRect();
      const position = {
        x: event.clientX - rect.left - 100,
        y: event.clientY - rect.top - 50,
      };

      const newNode: Node = {
        id: `node-${course.id}-${Date.now()}`,
        type: "courseNode",
        position,
        data: {
          courseId: course.id,
          courseCode: course.code,
          courseName: course.name,
          credits: course.credits,
          gradeLevel: course.gradeLevels?.[0] ?? 9,
          semester: "Fall",
          status: "elective",
          onDelete: handleDeleteNode,
        },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [handleDeleteNode]
  );

  const handleSave = () => {
    if (!sequenceName.trim()) { toast.error("Please enter a sequence name"); return; }

    const seqNodes: CourseSequenceNode[] = nodes.map((n) => ({
      id: n.id,
      type: n.type ?? "courseNode",
      data: n.data as CourseSequenceNode["data"],
      position: n.position,
    }));
    const seqEdges: CourseSequenceEdge[] = edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      type: e.type ?? "smoothstep",
      animated: (e.animated as boolean | undefined) ?? true,
    }));

    updateSequence.mutate(
      {
        id: sequenceId,
        payload: {
          name: sequenceName,
          description: detail?.description,
          nodes: seqNodes,
          edges: seqEdges,
          columns: detail?.columns ?? [],
        },
      },
      {
        onSuccess: () => toast.success("Sequence saved"),
        onError: () => toast.error("Failed to save sequence"),
      }
    );
  };

  const courses = (coursesData?.data ?? []).filter(
    (c) => !gradeFilter || c.gradeLevels?.includes(parseInt(gradeFilter))
  );

  if (detailLoading) {
    return (
      <div className="flex flex-col h-screen p-6 space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
        {/* Top Bar */}
        <div className="flex items-center gap-4 px-6 py-3 bg-white border-b shadow-sm z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/school-admin/course-sequences")}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <Network className="h-5 w-5 text-teal-600" />
          <Input
            value={sequenceName}
            onChange={(e) => setSequenceName(e.target.value)}
            className="h-9 w-64 font-semibold"
            placeholder="Sequence name..."
          />
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              title="Drag courses from the left panel onto the canvas. Connect two courses by dragging from the handle (dot on the edge of a node) to another node to create a prerequisite link."
            >
              <Info className="h-4 w-4 text-gray-400" />
            </Button>
            <Button
              onClick={handleSave}
              disabled={updateSequence.isPending}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white"
            >
              {updateSequence.isPending ? (
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-1.5" />
              )}
              Save
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Course Panel */}
          <aside className="w-72 bg-white border-r flex flex-col shadow-lg overflow-hidden">
            <div className="p-4 border-b space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-teal-600" />
                Course Catalog
              </h3>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <Input
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-8 text-sm"
                />
              </div>
              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="All Grade Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Grades</SelectItem>
                  {[9, 10, 11, 12].map((g) => (
                    <SelectItem key={g} value={String(g)}>Grade {g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <p className="text-[10px] text-gray-400 text-center py-2 bg-gray-50 border-b">
              Drag a course onto the canvas
            </p>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {courses.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-8">No courses found</p>
              )}
              {courses.map((course) => (
                <div
                  key={course.id}
                  draggable
                  onDragStart={(e: React.DragEvent) => {
                    e.dataTransfer.setData("application/reactflow", JSON.stringify(course));
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  className="cursor-grab active:cursor-grabbing bg-white border border-teal-100 rounded-lg p-2.5 hover:border-teal-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-teal-700">{course.code}</p>
                      <p className="text-xs text-gray-700 truncate font-medium">{course.name}</p>
                      <p className="text-[10px] text-gray-400">
                        {course.credits} cr · Gr {course.gradeLevels?.join(",")}
                      </p>
                    </div>
                    <Plus className="h-3 w-3 text-gray-300 group-hover:text-teal-500 shrink-0 mt-0.5" />
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="p-3 border-t bg-gray-50 space-y-1.5">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Node Status</p>
              {(["required", "elective", "recommended"] as const).map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <Badge className={`text-[10px] px-1.5 py-0 border ${statusColors[s]}`}>{s}</Badge>
                </div>
              ))}
            </div>
          </aside>

          {/* React Flow Canvas */}
          <div ref={reactFlowWrapper} className="flex-1 relative">
            <ReactFlow
              nodes={nodes.map((n) => ({
                ...n,
                data: { ...n.data, onDelete: handleDeleteNode },
              }))}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.3 }}
              className="bg-gray-50"
              defaultEdgeOptions={{
                type: "smoothstep",
                animated: true,
                style: { stroke: "#0d9488", strokeWidth: 2 },
              }}
            >
              <Background color="#e5e7eb" gap={20} size={1.5} />
              <Controls className="shadow-lg" />
              <MiniMap
                nodeColor={() => "#0d9488"}
                maskColor="rgba(0,0,0,0.05)"
                className="shadow-lg rounded-lg overflow-hidden"
              />
              <Panel position="top-right">
                <Card className="border-0 shadow-lg text-xs bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-3 space-y-1">
                    <p className="font-semibold text-gray-700">Canvas</p>
                    <p className="text-gray-500">{nodes.length} courses · {edges.length} prerequisites</p>
                  </CardContent>
                </Card>
              </Panel>

              {nodes.length === 0 && (
                <Panel position="top-center">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg px-6 py-4 text-center border border-dashed border-teal-200"
                  >
                    <Network className="h-8 w-8 text-teal-300 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">Drag courses from the panel to start building</p>
                    <p className="text-xs text-gray-400 mt-1">Connect nodes to define prerequisite relationships</p>
                  </motion.div>
                </Panel>
              )}
            </ReactFlow>
          </div>
        </div>
    </div>
  );
}
