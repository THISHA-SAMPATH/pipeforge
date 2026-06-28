# main.py — PipeForge backend
# ─────────────────────────────────────────────────────────────────────────────
# FastAPI backend for the PipeForge pipeline analyser.
#
# Endpoint: POST /pipelines/parse
#   Receives: { nodes: [...], edges: [...] }
#   Returns:  { num_nodes: int, num_edges: int, is_dag: bool }
#
# DAG Detection:
#   We build an adjacency list from edges and run DFS.
#   If we find a back-edge (a node that is currently in our DFS stack),
#   there's a cycle → not a DAG.
# ─────────────────────────────────────────────────────────────────────────────

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any

app = FastAPI(title="PipeForge API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Request model ──
class Pipeline(BaseModel):
    nodes: list[Any]
    edges: list[Any]

# ── DAG detection ──
def is_dag(nodes: list, edges: list) -> bool:
    """
    Returns True if the graph formed by nodes+edges is a Directed Acyclic Graph.

    Algorithm: DFS with 3-color marking
      WHITE (0) = not visited
      GRAY  (1) = currently in DFS stack (being explored)
      BLACK (2) = fully explored

    If we ever encounter a GRAY node during DFS, we found a back-edge → cycle.
    """
    # Build adjacency list: { node_id: [neighbour_id, ...] }
    adj = {node["id"]: [] for node in nodes}
    for edge in edges:
        src = edge.get("source")
        tgt = edge.get("target")
        if src in adj:
            adj[src].append(tgt)

    color = {node["id"]: 0 for node in nodes}  # 0=WHITE

    def dfs(node_id: str) -> bool:
        """Returns True if a cycle is found from this node."""
        color[node_id] = 1  # GRAY — mark as in-progress
        for neighbour in adj.get(node_id, []):
            if color.get(neighbour) == 1:
                return True   # back-edge found → cycle!
            if color.get(neighbour) == 0:
                if dfs(neighbour):
                    return True
        color[node_id] = 2  # BLACK — fully explored
        return False

    for node in nodes:
        if color[node["id"]] == 0:  # not yet visited
            if dfs(node["id"]):
                return False  # cycle found → not a DAG

    return True  # no cycles → is a DAG


# ── Endpoints ──
@app.get("/")
def read_root():
    return {"status": "PipeForge API running"}

@app.post("/pipelines/parse")
def parse_pipeline(pipeline: Pipeline):
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    dag       = is_dag(pipeline.nodes, pipeline.edges)

    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag":    dag,
    }
