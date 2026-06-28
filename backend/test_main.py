# backend/test_main.py
from main import is_dag

def test_empty_pipeline():
    nodes = []
    edges = []
    assert is_dag(nodes, edges) is True
    print("Passed: Empty pipeline test")

def test_single_node():
    nodes = [{"id": "1"}]
    edges = []
    assert is_dag(nodes, edges) is True
    print("Passed: Single node test")

def test_happy_path_dag():
    nodes = [{"id": "1"}, {"id": "2"}, {"id": "3"}]
    edges = [
        {"source": "1", "target": "2"},
        {"source": "2", "target": "3"}
    ]
    assert is_dag(nodes, edges) is True
    print("Passed: Happy path DAG test")

def test_cyclic_graph():
    # Cycle A -> B -> C -> A
    nodes = [{"id": "A"}, {"id": "B"}, {"id": "C"}]
    edges = [
        {"source": "A", "target": "B"},
        {"source": "B", "target": "C"},
        {"source": "C", "target": "A"}
    ]
    assert is_dag(nodes, edges) is False
    print("Passed: Cyclic graph test (A->B->C->A)")

def test_self_loop():
    nodes = [{"id": "A"}]
    edges = [{"source": "A", "target": "A"}]
    assert is_dag(nodes, edges) is False
    print("Passed: Self loop test")

if __name__ == "__main__":
    test_empty_pipeline()
    test_single_node()
    test_happy_path_dag()
    test_cyclic_graph()
    test_self_loop()
    print("All tests completed successfully!")
